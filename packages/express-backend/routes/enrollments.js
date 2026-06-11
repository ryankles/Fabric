import express from "express";
import Enrollment from "../models/Enrollment.js";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { courseId } = req.query;
  let enrollments;

  if (courseId) {
    const course = await Course.findById(courseId).select("teacherId");

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (String(course.teacherId) !== req.userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    enrollments = await Enrollment.find({
      courseId,
      role: "student"
    }).populate("userId", "name email role");
  } else {
    enrollments = await Enrollment.find({
      userId: req.userId
    });
  }

  res.json(enrollments);
});

router.get("/my", requireAuth, async (req, res) => {
  const enrollments = await Enrollment.find({
    userId: req.userId
  });

  res.json(enrollments);
});

router.post("/", requireAuth, async (req, res) => {
  const { courseId, userId, studentEmail } = req.body;
  const teacher = await User.findById(req.userId).select("role");

  if (!teacher) {
    return res.status(404).json({ error: "User not found" });
  }

  if (teacher.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only teachers can add students" });
  }

  const course = await Course.findById(courseId).select("teacherId");

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (String(course.teacherId) !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const student = userId
    ? await User.findById(userId)
    : await User.findOne({ email: studentEmail });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  if (student.role !== "student") {
    return res
      .status(400)
      .json({ error: "Only student accounts can be enrolled" });
  }

  const enrollment = await Enrollment.findOneAndUpdate(
    {
      userId: student._id,
      courseId
    },
    {
      userId: student._id,
      courseId,
      role: "student"
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  ).populate("userId", "name email role");

  res.status(201).json(enrollment);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    return res.status(404).json({ error: "Enrollment not found" });
  }

  const course = await Course.findById(enrollment.courseId).select(
    "teacherId"
  );

  if (
    String(enrollment.userId) !== req.userId &&
    String(course?.teacherId) !== req.userId
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await Enrollment.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//module.exports = router;
export default router;
