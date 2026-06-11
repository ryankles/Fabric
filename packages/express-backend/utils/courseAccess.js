import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";

export async function getAccessibleCourseIds(userId) {
  const user = await User.findById(userId).select("_id role").lean();

  if (!user) {
    return [];
  }

  if (user.role === "teacher") {
    const courses = await Course.find({ teacherId: user._id })
      .select("_id")
      .lean();

    return courses.map((course) => String(course._id));
  }

  const enrollments = await Enrollment.find({ userId: user._id })
    .select("courseId")
    .lean();

  return enrollments.map((enrollment) => String(enrollment.courseId));
}

export async function listCoursesForUser(userId) {
  const courseIds = await getAccessibleCourseIds(userId);

  return Course.find({ _id: { $in: courseIds } })
    .populate("teacherId", "name email")
    .sort({ title: 1 })
    .lean();
}

export async function canAccessCourse(userId, courseId) {
  const courseIds = await getAccessibleCourseIds(userId);
  return courseIds.includes(String(courseId));
}
