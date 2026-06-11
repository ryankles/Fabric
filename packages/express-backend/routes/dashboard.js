import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Assignment from "../models/Assignment.js";
import Announcement from "../models/Announcement.js";
import Grade from "../models/Grade.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { calculateGpa } from "../utils/grades.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "teacher") {
    const courses = await Course.find({
      teacherId: userId
    });

    const courseIds = courses.map((c) => c._id);

    const studentCount = await Enrollment.countDocuments({
      courseId: { $in: courseIds },
      role: "student"
    });
    const announcements = await Announcement.find({
      courseId: { $in: courseIds.map(String) }
    })
      .sort({ publishAt: -1 })
      .limit(10);

    return res.json({
      user,
      classCount: courses.length,
      studentCount,
      recentAnnouncementCount: announcements.length,
      announcements
    });
  }

  const enrollments = await Enrollment.find({
    userId,
    role: "student"
  });

  const courseIds = enrollments.map((e) => e.courseId);

  const grades = await Grade.find({
    studentId: userId
  });

  const assignments = await Assignment.find({
    courseId: { $in: courseIds },
    dueDate: { $gte: new Date() }
  })
    .populate("courseId", "title code")
    .sort({ dueDate: 1 })
    .limit(10);

  const gpa = calculateGpa(grades);

  res.json({
    user,
    classCount: enrollments.length,
    gpa,
    upcomingAssignmentCount: assignments.length,
    assignments
  });
});

//module.exports = router;
export default router;
