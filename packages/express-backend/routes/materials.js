import express from "express";
import mongoose from "mongoose";
import Material from "../models/Material.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  canAccessCourse,
  getAccessibleCourseIds
} from "../utils/courseAccess.js";

const router = express.Router();

router.use(requireAuth);

function serializeMaterial(material) {
  const value = material.toObject();
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

    const materials = await Material.find(query)
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email")
      .sort({
        createdAt: -1
      });

    res.json(materials.map(serializeMaterial));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch materials" });
  }
});

router.get("/course/:courseId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.courseId)) {
      return res.status(400).json({ error: "Invalid courseId" });
    }

    const hasAccess = await canAccessCourse(
      req.userId,
      req.params.courseId
    );

    if (!hasAccess) {
      return res.json([]);
    }

    const materials = await Material.find({
      courseId: req.params.courseId
    })
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(materials.map(serializeMaterial));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to fetch materials" });
  }
});

router.post("/", async (req, res) => {
  const { courseId, title, description, type, url, content } = req.body;

  if (!courseId || !title) {
    return res.status(400).json({
      error: "courseId and title are required"
    });
  }

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: "Invalid courseId" });
  }

  try {
    const hasAccess = await canAccessCourse(req.userId, courseId);

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const material = await Material.create({
      courseId,
      title: title.trim(),
      description: description?.trim() ?? "",
      type,
      url: url?.trim() ?? "",
      content: content?.trim() ?? "",
      createdBy: req.userId
    });

    const created = await Material.findById(material._id)
      .populate("courseId", "title code term description")
      .populate("createdBy", "name email");

    res.status(201).json(serializeMaterial(created));
  } catch {
    res
      .status(500)
      .json({ error: "Failed to create material" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const courseIds = await getAccessibleCourseIds(req.userId);
    const result = await Material.deleteOne({
      _id: req.params.id,
      courseId: { $in: courseIds },
      createdBy: req.userId
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ error: "Material not found" });
    }

    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

export default router;
