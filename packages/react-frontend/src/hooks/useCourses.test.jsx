import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  ALL_COURSES_OPTION,
  formatDate,
  getItemCourseTitle,
  useCourses
} from "./useCourses.js";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useCourses helpers", () => {
  test("returns the course title from nested course data", () => {
    expect(
      getItemCourseTitle({
        course: { title: "Algebra II" }
      })
    ).toBe("Algebra II");
  });

  test("falls back to courseTitle and then Class", () => {
    expect(getItemCourseTitle({ courseTitle: "Physics" })).toBe(
      "Physics"
    );
    expect(getItemCourseTitle({})).toBe("Class");
  });

  test("formats YYYY-MM-DD dates safely", () => {
    expect(formatDate("2026-06-10")).toBe(
      new Date("2026-06-10T00:00:00").toLocaleDateString()
    );
  });

  test("returns the original value when the date is invalid", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  test("returns an empty string for empty values", () => {
    expect(formatDate("")).toBe("");
  });
});

describe("useCourses", () => {
  test("loads courses and prepends the All Classes option", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { _id: "course-1", title: "Chemistry" }
        ]
      })
    );

    const { result } = renderHook(() =>
      useCourses("http://localhost:8000")
    );

    await waitFor(() => {
      expect(result.current.courses).toEqual([
        { _id: "course-1", title: "Chemistry" }
      ]);
    });

    expect(result.current.courseOptions).toEqual([
      ALL_COURSES_OPTION,
      { _id: "course-1", title: "Chemistry" }
    ]);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/courses",
      { credentials: "include" }
    );
  });

  test("falls back to an empty list when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("boom"))
    );

    const { result } = renderHook(() =>
      useCourses("http://localhost:8000")
    );

    await waitFor(() => {
      expect(result.current.courses).toEqual([]);
    });

    expect(result.current.courseOptions).toEqual([
      ALL_COURSES_OPTION
    ]);
  });
});
