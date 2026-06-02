import { useState } from "react";

const courses = [
  { id: "all", title: "All Classes" },
  { id: "algebra", title: "Algebra II" },
  { id: "geometry", title: "Geometry" },
  { id: "physics", title: "Physics" },
  { id: "history", title: "History" }
];

const studentUpdates = [
  {
    id: "update-1",
    courseId: "algebra",
    courseTitle: "Algebra II",
    title: "Complete Chapter 5 homework",
    body: "Problems 1-18 are due before class.",
    type: "reminder",
    publishAt: "2026-05-23"
  },
  {
    id: "update-2",
    courseId: "physics",
    courseTitle: "Physics",
    title: "Lab report reminder",
    body: "The motion lab report should include your graph and conclusion.",
    type: "reminder",
    publishAt: "2026-05-25"
  },
  {
    id: "update-3",
    courseId: "history",
    courseTitle: "History",
    title: "Seminar moved to Room 215",
    body: "Bring your Industrial Revolution notes for group discussion.",
    type: "announcement",
    publishAt: "2026-05-26"
  },
  {
    id: "update-4",
    courseId: "geometry",
    courseTitle: "Geometry",
    title: "Quiz review packet",
    body: "The review packet is posted in materials.",
    type: "announcement",
    publishAt: "2026-05-22"
  }
];

const teacherStartingUpdates = [
  {
    id: "teacher-update-1",
    courseId: "algebra",
    courseTitle: "Algebra II",
    title: "Quiz moved to Friday",
    body: "We will spend Thursday reviewing chapter 5.",
    type: "announcement",
    publishAt: "2026-05-22"
  },
  {
    id: "teacher-update-2",
    courseId: "geometry",
    courseTitle: "Geometry",
    title: "Grade proof drafts",
    body: "Check period 3 proof drafts before Monday.",
    type: "reminder",
    publishAt: "2026-05-24"
  }
];

function getCourseTitle(courseId) {
  const course = courses.find((item) => item.id === courseId);
  return course ? course.title : "Class";
}

function filterItems(items, selectedCourse, selectedType) {
  return items.filter((item) => {
    const matchesCourse =
      selectedCourse === "all" ||
      item.courseId === selectedCourse;
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
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [completedIds, setCompletedIds] = useState([
    "update-2"
  ]);
  const visibleUpdates = filterItems(
    studentUpdates,
    selectedCourse,
    selectedType
  );

  function toggleComplete(id) {
    if (completedIds.includes(id)) {
      setCompletedIds(
        completedIds.filter((itemId) => itemId !== id)
      );
    } else {
      setCompletedIds([...completedIds, id]);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3">Filter by Class</h4>
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              className={filterButtonClass(
                selectedCourse === course.id
              )}
              key={course.id}
              type="button"
              onClick={() => setSelectedCourse(course.id)}>
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

        <div className="space-y-2">
          {visibleUpdates.map((update) => {
            const isComplete = completedIds.includes(update.id);

            return (
              <article
                className={
                  isComplete
                    ? "flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                    : "flex items-start gap-3 rounded-lg bg-muted p-4"
                }
                key={update.id}>
                {update.type === "reminder" ? (
                  <input
                    className="mt-1 h-5 w-5 shrink-0 accent-primary"
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => toggleComplete(update.id)}
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
                      {update.courseTitle}
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
                    Date: {update.publishAt}
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
  const [updates, setUpdates] = useState(
    teacherStartingUpdates
  );
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [form, setForm] = useState({
    courseId: "algebra",
    title: "",
    body: "",
    type: "announcement",
    publishAt: "2026-05-22"
  });
  const visibleUpdates = filterItems(
    updates,
    selectedCourse,
    "all"
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function submitUpdate(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      return;
    }

    const update = {
      id: "teacher-update-" + Date.now(),
      courseId: form.courseId,
      courseTitle: getCourseTitle(form.courseId),
      title: form.title.trim(),
      body: form.body.trim(),
      type: form.type,
      publishAt: form.publishAt
    };

    setUpdates([update, ...updates]);
    setForm({
      courseId: form.courseId,
      title: "",
      body: "",
      type: "announcement",
      publishAt: form.publishAt
    });
  }

  function deleteUpdate(id) {
    setUpdates(updates.filter((update) => update.id !== id));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-card p-4">
        <h4 className="mb-3">Filter by Class</h4>
        <div className="flex flex-wrap gap-2">
          {courses.map((course) => (
            <button
              className={filterButtonClass(
                selectedCourse === course.id
              )}
              key={course.id}
              type="button"
              onClick={() => setSelectedCourse(course.id)}>
              {course.title}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-6">Posted Updates</h2>
          <div className="space-y-3">
            {visibleUpdates.map((update) => (
              <article
                className="rounded-lg bg-muted p-4"
                key={update.id}>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={typeBadgeClass(update.type)}>
                    {update.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {update.courseTitle}
                  </span>
                </div>
                <h3>{update.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {update.body}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>Publish: {update.publishAt}</span>
                  <button
                    className="text-destructive hover:underline"
                    type="button"
                    onClick={() => deleteUpdate(update.id)}>
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
              value={form.courseId}
              onChange={handleChange}>
              {courses
                .filter((course) => course.id !== "all")
                .map((course) => (
                  <option key={course.id} value={course.id}>
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
