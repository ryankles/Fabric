import { jest } from "@jest/globals";

const findById = jest.fn();
const findCourses = jest.fn();
const findEnrollments = jest.fn();

await jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById
  }
}));

await jest.unstable_mockModule("../models/Course.js", () => ({
  default: {
    find: findCourses
  }
}));

await jest.unstable_mockModule("../models/Enrollment.js", () => ({
  default: {
    find: findEnrollments
  }
}));

const {
  getAccessibleCourseIds,
  listCoursesForUser,
  canAccessCourse
} = await import("./courseAccess.js");

function createSelectChain(result) {
  return {
    select: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(result)
    })
  };
}

function createPopulateChain(result) {
  return {
    populate: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(result)
      })
    })
  };
}

describe("courseAccess", () => {
  beforeEach(() => {
    findById.mockReset();
    findCourses.mockReset();
    findEnrollments.mockReset();
  });

  test("returns teacher-owned course ids for teachers", async () => {
    findById.mockReturnValue(
      createSelectChain({ _id: "teacher-1", role: "teacher" })
    );
    findCourses.mockReturnValue(
      createSelectChain([{ _id: "course-1" }, { _id: "course-2" }])
    );

    await expect(
      getAccessibleCourseIds("teacher-1")
    ).resolves.toEqual(["course-1", "course-2"]);
  });

  test("returns enrolled course ids for students", async () => {
    findById.mockReturnValue(
      createSelectChain({ _id: "student-1", role: "student" })
    );
    findEnrollments.mockReturnValue(
      createSelectChain([
        { courseId: "course-3" },
        { courseId: "course-4" }
      ])
    );

    await expect(
      getAccessibleCourseIds("student-1")
    ).resolves.toEqual(["course-3", "course-4"]);
  });

  test("returns empty course ids when the user does not exist", async () => {
    findById.mockReturnValue(createSelectChain(null));

    await expect(
      getAccessibleCourseIds("missing-user")
    ).resolves.toEqual([]);
  });

  test("lists courses for the current user", async () => {
    findById.mockReturnValue(
      createSelectChain({ _id: "teacher-1", role: "teacher" })
    );
    findCourses
      .mockReturnValueOnce(createSelectChain([{ _id: "course-1" }]))
      .mockReturnValueOnce(
        createPopulateChain([{ _id: "course-1", title: "Biology" }])
      );

    await expect(listCoursesForUser("teacher-1")).resolves.toEqual([
      { _id: "course-1", title: "Biology" }
    ]);
  });

  test("checks course access membership", async () => {
    findById.mockReturnValue(
      createSelectChain({ _id: "student-1", role: "student" })
    );
    findEnrollments.mockReturnValue(
      createSelectChain([{ courseId: "course-9" }])
    );

    await expect(
      canAccessCourse("student-1", "course-9")
    ).resolves.toBe(true);
    await expect(
      canAccessCourse("student-1", "course-10")
    ).resolves.toBe(false);
  });
});
