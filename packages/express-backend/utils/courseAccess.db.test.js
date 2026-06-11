import { beforeEach, describe, expect, test } from "@jest/globals";
import "../test/setupDb.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import User from "../models/User.js";
import {
  canAccessCourse,
  getAccessibleCourseIds,
  listCoursesForUser
} from "./courseAccess.js";

// Real-DB version of the courseAccess data layer: no model mocking, every
// query runs against an in-memory Mongo so the actual Mongoose plumbing
// (lean, select, populate, $in) is exercised.

let teacher;
let student;
let bio;
let chem;

beforeEach(async () => {
  teacher = await User.create({
    name: "Teach",
    email: "teach@example.com",
    passwordHash: "hash",
    role: "teacher"
  });
  student = await User.create({
    name: "Stu",
    email: "stu@example.com",
    passwordHash: "hash",
    role: "student"
  });

  bio = await Course.create({
    title: "Biology",
    code: "BIO101",
    term: "Fall",
    teacherId: teacher._id
  });
  chem = await Course.create({
    title: "Chemistry",
    code: "CHEM101",
    term: "Fall",
    teacherId: teacher._id
  });
});

describe("getAccessibleCourseIds", () => {
  test("returns courses the teacher owns", async () => {
    const ids = await getAccessibleCourseIds(teacher._id);

    expect(ids).toHaveLength(2);
    expect(ids).toEqual(
      expect.arrayContaining([String(bio._id), String(chem._id)])
    );
  });

  test("returns only courses the student is enrolled in", async () => {
    await Enrollment.create({
      userId: student._id,
      courseId: chem._id
    });

    const ids = await getAccessibleCourseIds(student._id);

    expect(ids).toEqual([String(chem._id)]);
  });

  test("returns an empty array for an unknown user", async () => {
    const ids = await getAccessibleCourseIds(student._id);
    expect(ids).toEqual([]);
  });
});

describe("listCoursesForUser", () => {
  test("returns the teacher's courses sorted by title with teacher populated", async () => {
    const courses = await listCoursesForUser(teacher._id);

    expect(courses.map((course) => course.title)).toEqual([
      "Biology",
      "Chemistry"
    ]);
    // teacherId was populated to the name/email projection.
    expect(courses[0].teacherId).toMatchObject({
      name: "Teach",
      email: "teach@example.com"
    });
  });

  test("returns an empty list for a student with no enrollments", async () => {
    const courses = await listCoursesForUser(student._id);
    expect(courses).toEqual([]);
  });
});

describe("canAccessCourse", () => {
  test("is true for an enrolled course and false otherwise", async () => {
    await Enrollment.create({
      userId: student._id,
      courseId: bio._id
    });

    expect(await canAccessCourse(student._id, bio._id)).toBe(true);
    expect(await canAccessCourse(student._id, chem._id)).toBe(false);
  });
});
