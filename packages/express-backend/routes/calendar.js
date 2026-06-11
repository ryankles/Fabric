import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Assignment from "../models/Assignment.js";
import Announcement from "../models/Announcement.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("role");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  let courses = [];

  if (user.role === "teacher") {
    courses = await Course.find({ teacherId: req.userId }).select(
      "_id title code term"
    );
  } else {
    const enrollments = await Enrollment.find({
      userId: req.userId,
      role: "student"
    }).select("courseId");

    courses = await Course.find({
      _id: { $in: enrollments.map((enrollment) => enrollment.courseId) }
    }).select("_id title code term");
  }

  const courseIds = courses.map((course) => course._id);

  const [assignments, announcements] = await Promise.all([
    Assignment.find({
      courseId: { $in: courseIds }
    })
      .populate("courseId", "title code")
      .sort({ dueDate: 1 }),
    Announcement.find({
      courseId: { $in: courseIds }
    })
      .populate("courseId", "title code")
      .sort({ publishAt: 1 })
  ]);

  const events = [
    ...assignments.map((assignment) => ({
      id: `assignment-${assignment._id}`,
      type: "assignment",
      date: assignment.dueDate,
      title: assignment.title,
      description: assignment.description || "",
      courseId: assignment.courseId?._id,
      courseTitle: assignment.courseId?.title || "Class",
      courseCode: assignment.courseId?.code || "",
      meta: {
        pointsPossible: assignment.pointsPossible,
        assignmentType: assignment.type
      }
    })),
    ...announcements.map((announcement) => ({
      id: `announcement-${announcement._id}`,
      type: "announcement",
      date: announcement.publishAt,
      title: announcement.title,
      description: announcement.body || "",
      courseId: announcement.courseId?._id,
      courseTitle: announcement.courseId?.title || "Class",
      courseCode: announcement.courseId?.code || "",
      meta: {
        announcementType: announcement.type
      }
    }))
  ].sort((left, right) => new Date(left.date) - new Date(right.date));

  res.json({
    courses,
    events
  });
});

export default router;
