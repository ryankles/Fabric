import express from "express";
import mongoose from "mongoose";
import Announcement from "../models/Announcement.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  canAccessCourse,
  getAccessibleCourseIds
} from "../utils/courseAccess.js";

const router = express.Router();

router.use(requireAuth);

function serializeAnnouncement(announcement) {
  const value = announcement.toObject();
  const course = value.courseId;
  const createdBy = value.createdBy;

  return {
    ...value,
    courseId: String(course?._id ?? course),
    course: course?._id ? course : null,
    courseTitle: course?.title ?? "Class",
    createdBy: String(createdBy?._id ?? createdBy),
    createdByName: createdBy?.name ?? ""
  };
}

router.get("/", async (req, res) => {
  try {
    const courseIds = await getAccessibleCourseIds(req.userId);
    const query = { courseId: { $in: courseIds } };

    if (req.query.courseId) {
      if (!mongoose.isValidObjectId(req.query.courseId)) {
        return res.status(400).json({ error: "Invalid courseId" });
      }

      if (!courseIds.includes(String(req.query.courseId))) {
        return res.json([]);
      }

      query.courseId = req.query.courseId;
    }

    const announcements = await Announcement.find(query)
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email")
      .sort({
        publishAt: -1
      });

    res.json(announcements.map(serializeAnnouncement));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch announcements" });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const courseIds = await getAccessibleCourseIds(req.userId);
    const announcements = await Announcement.find({
      courseId: { $in: courseIds }
    })
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email")
      .sort({ publishAt: -1 })
      .limit(5);

    res.json(announcements.map(serializeAnnouncement));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch recent announcements" });
  }
});

router.post("/", async (req, res) => {
  const { courseId, title, body, type, publishAt } = req.body;

  if (!courseId || !title || !body || !publishAt) {
    return res.status(400).json({
      error:
        "courseId, title, body, and publishAt are required"
    });
  }

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: "Invalid courseId" });
  }

  const publishDate = new Date(publishAt);

  if (Number.isNaN(publishDate.getTime())) {
    return res.status(400).json({ error: "Invalid publishAt" });
  }

  try {
    const hasAccess = await canAccessCourse(req.userId, courseId);

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const announcement = await Announcement.create({
      courseId,
      title: title.trim(),
      body: body.trim(),
      type,
      publishAt: publishDate,
      createdBy: req.userId
    });

    const created = await Announcement.findById(announcement._id)
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email");

    res.status(201).json(serializeAnnouncement(created));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to create announcement" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const courseIds = await getAccessibleCourseIds(req.userId);
    const result = await Announcement.deleteOne({
      _id: req.params.id,
      courseId: { $in: courseIds },
      createdBy: req.userId
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Announcement not found" });
    }

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
