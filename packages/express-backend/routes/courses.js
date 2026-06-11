import express from "express";
import Course from "../models/Course.js";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("role");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "teacher") {
    const courses = await Course.find({
      teacherId: req.userId
    }).sort({ createdAt: -1 });

    const studentCounts = await Enrollment.aggregate([
      {
        $match: {
          courseId: {
            $in: courses.map((course) => course._id)
          },
          role: "student"
        }
      },
      {
        $group: {
          _id: "$courseId",
          count: { $sum: 1 }
        }
      }
    ]);

    const countByCourseId = new Map(
      studentCounts.map((item) => [String(item._id), item.count])
    );

    return res.json(
      courses.map((course) => ({
        ...course.toObject(),
        studentCount:
          countByCourseId.get(String(course._id)) || 0
      }))
    );
  }

  const enrollments = await Enrollment.find({
    userId: req.userId,
    role: "student"
  }).select("courseId");

  const courses = await Course.find({
    _id: { $in: enrollments.map((enrollment) => enrollment.courseId) }
  }).sort({ title: 1 });
  res.json(courses);
});

router.get("/:id", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("role");
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res
      .status(404)
      .json({ message: "Course not found" });
  }

  const isTeacher = String(course.teacherId) === req.userId;
  const enrollment = await Enrollment.findOne({
    userId: req.userId,
    courseId: course._id
  });

  if (!isTeacher && !enrollment) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json(course);
});

router.post("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("role");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only teachers can create courses" });
  }

  const course = await Course.create({
    ...req.body,
    teacherId: req.userId
  });

  await Enrollment.create({
    userId: req.userId,
    courseId: course._id,
    role: "teacher"
  });

  res.status(201).json(course);
});

router.put("/:id", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (String(course.teacherId) !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const updated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (String(course.teacherId) !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await Course.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

//module.exports = router;
export default router;
