import { useEffect, useState } from "react";

export const ALL_COURSES_OPTION = {
  _id: "all",
  title: "All Classes"
};

export function getItemCourseTitle(item) {
  return item.course?.title || item.courseTitle || "Class";
}

export function formatDate(value) {
  if (!value) return "";

  const datePart = String(value).slice(0, 10);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
    ? new Date(`${datePart}T00:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

export function useCourses(apiBaseUrl) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    fetch(`${apiBaseUrl}/api/courses`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((items) => {
        if (isCurrent) {
          setCourses(items);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setCourses([]);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [apiBaseUrl]);

  const courseOptions = [ALL_COURSES_OPTION, ...courses];

  return { courses, courseOptions };
}
