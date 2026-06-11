import express from "express";
import Grade from "../models/Grade.js";
import { requireAuth } from "../middleware/requireAuth.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

const router = express.Router();

function toLetterGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

router.get("/", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).select("role");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role === "teacher") {
    const courses = await Course.find({
      teacherId: req.userId
    }).select("_id title code");

    const courseIds = courses.map((course) => course._id);

    const [grades, enrollments] = await Promise.all([
      Grade.find({
        courseId: { $in: courseIds }
      }),
      Enrollment.find({
        courseId: { $in: courseIds },
        role: "student"
      })
    ]);

    const studentCountByCourseId = enrollments.reduce(
      (accumulator, enrollment) => {
        const key = String(enrollment.courseId);
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      },
      {}
    );

    const gradeBuckets = grades.reduce((accumulator, grade) => {
      const key = String(grade.courseId);

      if (!accumulator[key]) {
        accumulator[key] = {
          scoreTotal: 0,
          pointsTotal: 0,
          gradedCount: 0
        };
      }

      accumulator[key].scoreTotal += grade.score;
      accumulator[key].pointsTotal += grade.pointsPossible;
      accumulator[key].gradedCount += 1;
      return accumulator;
    }, {});

    return res.json({
      classes: courses.map((course) => {
        const bucket = gradeBuckets[String(course._id)] || {
          scoreTotal: 0,
          pointsTotal: 0,
          gradedCount: 0
        };
        const averagePercentage =
          bucket.pointsTotal > 0
            ? Math.round(
                (bucket.scoreTotal / bucket.pointsTotal) * 100
              )
            : 0;

        return {
          _id: course._id,
          title: course.title,
          code: course.code,
          students:
            studentCountByCourseId[String(course._id)] || 0,
          gradedItems: bucket.gradedCount,
          avgPercentage: averagePercentage,
          avgGrade: toLetterGrade(averagePercentage)
        };
      })
    });
  }

  const grades = await Grade.find({
    studentId: req.userId
  })
    .populate("courseId", "title code teacherId")
    .populate("assignmentId", "title dueDate")
    .populate({
      path: "courseId",
      populate: {
        path: "teacherId",
        select: "name"
      }
    })
    .sort({ updatedAt: -1 });

  res.json({
    grades: grades.map((grade) => {
      const percentage = Math.round(
        (grade.score / grade.pointsPossible) * 100
      );

      return {
        _id: grade._id,
        score: grade.score,
        pointsPossible: grade.pointsPossible,
        percentage,
        letterGrade: toLetterGrade(percentage),
        feedback: grade.feedback,
        updatedAt: grade.updatedAt,
        assignment: grade.assignmentId
          ? {
              _id: grade.assignmentId._id,
              title: grade.assignmentId.title,
              dueDate: grade.assignmentId.dueDate
            }
          : null,
        course: grade.courseId
          ? {
              _id: grade.courseId._id,
              title: grade.courseId.title,
              code: grade.courseId.code
            }
          : null,
        teacher: grade.courseId?.teacherId?.name || ""
      };
    })
  });
});

router.get("/my", requireAuth, async (req, res) => {
  const grades = await Grade.find({
    studentId: req.userId
  });

  res.json(grades);
});

router.post("/", requireAuth, async (req, res) => {
  const teacher = await User.findById(req.userId).select("role");
  const {
    assignmentId,
    courseId,
    studentId,
    score,
    pointsPossible,
    feedback
  } = req.body;

  if (!teacher) {
    return res.status(404).json({ error: "User not found" });
  }

  if (teacher.role !== "teacher") {
    return res
      .status(403)
      .json({ error: "Only teachers can create grades" });
  }

  const course = await Course.findById(courseId).select("teacherId");

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (String(course.teacherId) !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const enrollment = await Enrollment.findOne({
    courseId,
    userId: studentId,
    role: "student"
  });

  if (!enrollment) {
    return res
      .status(400)
      .json({ error: "Student is not enrolled in this course" });
  }

  const grade = await Grade.findOneAndUpdate(
    {
      assignmentId,
      courseId,
      studentId
    },
    {
      assignmentId,
      courseId,
      studentId,
      score,
      pointsPossible,
      feedback,
      gradedBy: req.userId
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  res.status(201).json(grade);
});

router.patch("/:id", requireAuth, async (req, res) => {
  const grade = await Grade.findById(req.params.id);

  if (!grade) {
    return res.status(404).json({ error: "Grade not found" });
  }

  const course = await Course.findById(grade.courseId).select(
    "teacherId"
  );

  if (String(course?.teacherId) !== req.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const updated = await Grade.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      gradedBy: req.userId
    },
    { new: true }
  );

  res.json(updated);
});

//module.exports = router;
export default router;
