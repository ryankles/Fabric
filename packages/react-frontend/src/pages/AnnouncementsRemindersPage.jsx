import { useState, useEffect } from "react";
import {
  formatDate,
  getItemCourseTitle,
  useCourses
} from "../hooks/useCourses";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

function filterItems(items, selectedCourse, selectedType) {
  return items.filter((item) => {
    const matchesCourse =
      selectedCourse === "all" ||
      String(item.courseId) === selectedCourse;
    const matchesType =
      selectedType === "all" || item.type === selectedType;
    return matchesCourse && matchesType;
  });
}

function filterButtonClass(isSelected) {
  return isSelected
    ? "rounded-lg bg-primary px-3 py-1 text-primary-foreground"
    : "rounded-lg bg-muted px-3 py-1 text-muted-foreground hover:bg-accent hover:text-foreground";
}

function typeBadgeClass(type) {
  return type === "reminder"
    ? "rounded-full bg-[#f5dfdf] px-2 py-1 text-xs font-medium capitalize text-[#9a5358]"
    : "rounded-full bg-[#dfe8f0] px-2 py-1 text-xs font-medium capitalize text-[#526e8e]";
}

function StudentAnnouncementsView() {
  const { courses, courseOptions } = useCourses(API_BASE_URL);
  const [updates, setUpdates] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/announcements`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setUpdates)
      .catch(() => {});
  }, []);

  const visibleUpdates = filterItems(
    updates,
    selectedCourse,
    selectedType
  );

  function toggleComplete(id) {
    setCompletedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3">Filter by Class</h4>
        <div className="flex flex-wrap gap-2">
          {courseOptions.map((course) => (
            <button
              className={filterButtonClass(
                selectedCourse === course._id
              )}
              key={course._id}
              type="button"
              onClick={() => setSelectedCourse(course._id)}>
              {course.title}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2>Reminders & Announcements</h2>
          <select
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }>
            <option value="all">All types</option>
            <option value="reminder">Reminders</option>
            <option value="announcement">Announcements</option>
          </select>
        </div>

        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No enrolled courses yet.
          </p>
        ) : null}

        <div className="space-y-2">
          {visibleUpdates.map((update) => {
            const isComplete = completedIds.includes(
              update._id
            );
            return (
              <article
                className={
                  isComplete
                    ? "flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                    : "flex items-start gap-3 rounded-lg bg-muted p-4"
                }
                key={update._id}>
                {update.type === "reminder" ? (
                  <input
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleComplete(update._id)}
                    aria-label="Toggle reminder"
                  />
                ) : (
                  <div className="mt-1 h-5 w-5 shrink-0 rounded-full bg-primary/20" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span
                      className={typeBadgeClass(update.type)}>
                      {update.type}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getItemCourseTitle(update)}
                    </span>
                  </div>
                  <p
                    className={
                      isComplete
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }>
                    {update.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {update.body}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Date: {formatDate(update.publishAt)}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function TeacherAnnouncementsView() {
  const { courses, courseOptions } = useCourses(API_BASE_URL);
  const [updates, setUpdates] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    body: "",
    type: "announcement",
    publishAt: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/announcements`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setUpdates)
      .catch(() => {});
  }, []);

  const visibleUpdates = filterItems(
    updates,
    selectedCourse,
    "all"
  );
  const selectedFormCourseId =
    form.courseId || courses[0]?._id || "";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function submitUpdate(event) {
    event.preventDefault();
    if (
      !selectedFormCourseId ||
      !form.title.trim() ||
      !form.body.trim()
    )
      return;

    const payload = {
      courseId: selectedFormCourseId,
      title: form.title.trim(),
      body: form.body.trim(),
      type: form.type,
      publishAt: form.publishAt
    };

    fetch(`${API_BASE_URL}/api/announcements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created) {
          setUpdates((prev) => [created, ...prev]);
          setForm({ ...form, title: "", body: "" });
        }
      })
      .catch(() => {});
  }

  function deleteUpdate(id) {
    fetch(`${API_BASE_URL}/api/announcements/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 204) {
          setUpdates((prev) =>
            prev.filter((u) => u._id !== id)
          );
        }
      })
      .catch(() => {});
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3">Filter by Class</h4>
        <div className="flex flex-wrap gap-2">
          {courseOptions.map((course) => (
            <button
              className={filterButtonClass(
                selectedCourse === course._id
              )}
              key={course._id}
              type="button"
              onClick={() => setSelectedCourse(course._id)}>
              {course.title}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6">Posted Updates</h2>
          {courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Create a course before posting announcements or reminders.
            </p>
          ) : null}
          <div className="space-y-3">
            {visibleUpdates.map((update) => (
              <article
                className="rounded-lg bg-muted p-4"
                key={update._id}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={typeBadgeClass(update.type)}>
                    {update.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getItemCourseTitle(update)}
                  </span>
                </div>
                <h3>{update.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {update.body}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>
                    Publish: {formatDate(update.publishAt)}
                  </span>
                  <button
                    className="text-destructive hover:underline"
                    type="button"
                    onClick={() => deleteUpdate(update._id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <form
          className="rounded-lg border border-border bg-card p-6"
          onSubmit={submitUpdate}>
          <h2 className="mb-4">Create Update</h2>

          <label className="mb-3 block">
            <span className="mb-1 block">Class</span>
            <select
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
              name="courseId"
              value={selectedFormCourseId}
              onChange={handleChange}>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block">Type</span>
            <select
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
              name="type"
              value={form.type}
              onChange={handleChange}>
              <option value="announcement">Announcement</option>
              <option value="reminder">Reminder</option>
            </select>
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block">Publish Date</span>
            <input
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
              type="date"
              name="publishAt"
              value={form.publishAt}
              onChange={handleChange}
            />
          </label>

          <label className="mb-3 block">
            <span className="mb-1 block">Title</span>
            <input
              className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
            />
          </label>

          <label className="mb-4 block">
            <span className="mb-1 block">Message</span>
            <textarea
              className="min-h-28 w-full rounded-lg border border-border bg-input-background px-3 py-2"
              name="body"
              value={form.body}
              onChange={handleChange}
            />
          </label>

          <button
            className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            disabled={courses.length === 0}
            type="submit">
            Post Update
          </button>
        </form>
      </div>
    </div>
  );
}

function AnnouncementsRemindersPage({ view }) {
  if (view === "teacher") {
    return <TeacherAnnouncementsView />;
  }
  return <StudentAnnouncementsView />;
}

export default AnnouncementsRemindersPage;
