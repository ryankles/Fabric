import { useState, useEffect } from "react";
import {
  getItemCourseTitle,
  useCourses
} from "../hooks/useCourses";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

function filterMaterials(
  materials,
  selectedCourse,
  selectedType
) {
  return materials.filter((material) => {
    const matchesCourse =
      selectedCourse === "all" ||
      String(material.courseId) === selectedCourse;
    const matchesType =
      selectedType === "all" || material.type === selectedType;
    return matchesCourse && matchesType;
  });
}

function filterAssignments(assignments, selectedCourse) {
  return assignments.filter((assignment) => {
    return (
      selectedCourse === "all" ||
      String(assignment.courseId) === selectedCourse
    );
  });
}

function filterButtonClass(isSelected) {
  return isSelected
    ? "rounded-lg bg-primary px-3 py-1 text-primary-foreground"
    : "rounded-lg bg-muted px-3 py-1 text-muted-foreground hover:bg-accent hover:text-foreground";
}

function typeBadgeClass(type) {
  if (type === "link") {
    return "rounded-full bg-[#dfe8f0] px-2 py-1 text-xs font-medium capitalize text-[#526e8e]";
  }
  if (type === "text") {
    return "rounded-full bg-[#e4eadb] px-2 py-1 text-xs font-medium capitalize text-[#617344]";
  }
  return "rounded-full bg-[#f5dfdf] px-2 py-1 text-xs font-medium capitalize text-[#9a5358]";
}

function MaterialCard({ material, onDelete }) {
  return (
    <article className="rounded-lg bg-muted p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={typeBadgeClass(material.type)}>
          {material.type}
        </span>
        <span className="text-sm text-muted-foreground">
          {getItemCourseTitle(material)}
        </span>
      </div>

      <h3>{material.title}</h3>
      <p className="mt-1 text-muted-foreground">
        {material.description}
      </p>

      {material.type === "link" && material.url ? (
        <a
          className="mt-3 block break-words text-primary"
          href={material.url}>
          {material.url}
        </a>
      ) : null}

      {material.type !== "link" && material.content ? (
        <p className="mt-3 rounded-lg bg-card px-3 py-2 text-sm text-muted-foreground">
          {material.content}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Added {material.createdAt?.slice(0, 10)} by{" "}
          {material.createdByName || "Teacher"}
        </span>
        {onDelete ? (
          <button
            className="text-destructive hover:underline"
            type="button"
            onClick={() => onDelete(material._id)}>
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}

function StudentMaterialsView() {
  const { courses, courseOptions } = useCourses(API_BASE_URL);
  const [materials, setMaterials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/materials`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setMaterials)
      .catch(() => {});
  }, []);

  const visibleMaterials = filterMaterials(
    materials,
    selectedCourse,
    selectedType
  );

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
          <h2>Course Materials</h2>
          <select
            className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }>
            <option value="all">All types</option>
            <option value="link">Links</option>
            <option value="text">Text</option>
            <option value="file">Files</option>
          </select>
        </div>

        {courses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No enrolled courses yet.
          </p>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          {visibleMaterials.map((material) => (
            <MaterialCard
              key={material._id}
              material={material}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherMaterialsView() {
  const { courses, courseOptions } = useCourses(API_BASE_URL);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    type: "link",
    url: "",
    content: ""
  });
  const [assignmentForm, setAssignmentForm] = useState({
    courseId: "",
    title: "",
    description: "",
    dueDate: "",
    pointsPossible: "100",
    type: "homework"
  });
  const [assignmentMessage, setAssignmentMessage] =
    useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/materials`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setMaterials)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/assignments`, {
      credentials: "include"
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setAssignments)
      .catch(() => {});
  }, []);

  const visibleMaterials = filterMaterials(
    materials,
    selectedCourse,
    "all"
  );
  const visibleAssignments = filterAssignments(
    assignments,
    selectedCourse
  );
  const selectedFormCourseId =
    form.courseId || courses[0]?._id || "";
  const selectedAssignmentCourseId =
    assignmentForm.courseId || courses[0]?._id || "";
  const courseTitleById = courses.reduce(
    (accumulator, course) => {
      accumulator[String(course._id)] = course.title;
      return accumulator;
    },
    {}
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function addMaterial(event) {
    event.preventDefault();
    if (!selectedFormCourseId || !form.title.trim()) return;

    const payload = {
      courseId: selectedFormCourseId,
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      url: form.url.trim(),
      content: form.content.trim()
    };

    fetch(`${API_BASE_URL}/api/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created) {
          setMaterials((prev) => [created, ...prev]);
          setForm({
            ...form,
            title: "",
            description: "",
            url: "",
            content: ""
          });
        }
      })
      .catch(() => {});
  }

  function handleAssignmentChange(event) {
    const { name, value } = event.target;
    setAssignmentForm({ ...assignmentForm, [name]: value });
  }

  function addAssignment(event) {
    event.preventDefault();
    if (
      !selectedAssignmentCourseId ||
      !assignmentForm.title.trim()
    )
      return;

    setAssignmentMessage("");

    const payload = {
      courseId: selectedAssignmentCourseId,
      title: assignmentForm.title.trim(),
      description: assignmentForm.description.trim(),
      dueDate: assignmentForm.dueDate,
      pointsPossible: Number(assignmentForm.pointsPossible),
      type: assignmentForm.type
    };

    fetch(`${API_BASE_URL}/api/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((created) => {
        if (created) {
          setAssignments((prev) => [created, ...prev]);
          setAssignmentForm({
            ...assignmentForm,
            title: "",
            description: "",
            dueDate: "",
            pointsPossible: "100"
          });
          setAssignmentMessage("Assignment added.");
        }
      })
      .catch(() => {});
  }

  function deleteMaterial(id) {
    fetch(`${API_BASE_URL}/api/materials/${id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 204) {
          setMaterials((prev) =>
            prev.filter((m) => m._id !== id)
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
          <h2 className="mb-6">Course Materials</h2>
          {courses.length === 0 ? (
            <p className="mb-4 text-sm text-muted-foreground">
              Create a course before adding materials.
            </p>
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            {visibleMaterials.map((material) => (
              <MaterialCard
                key={material._id}
                material={material}
                onDelete={deleteMaterial}
              />
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <form
            className="rounded-lg border border-border bg-card p-6"
            onSubmit={addMaterial}>
            <h2 className="mb-4">Add Material</h2>

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
                <option value="link">Link</option>
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
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

            <label className="mb-3 block">
              <span className="mb-1 block">Description</span>
              <textarea
                className="min-h-20 w-full rounded-lg border border-border bg-input-background px-3 py-2"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block">URL</span>
              <input
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                type="url"
                name="url"
                value={form.url}
                onChange={handleChange}
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block">
                Content or File Name
              </span>
              <textarea
                className="min-h-24 w-full rounded-lg border border-border bg-input-background px-3 py-2"
                name="content"
                value={form.content}
                onChange={handleChange}
              />
            </label>

            <button
              className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              disabled={courses.length === 0}
              type="submit">
              Add Material
            </button>
          </form>

          <form
            className="rounded-lg border border-border bg-card p-6"
            onSubmit={addAssignment}>
            <h2 className="mb-4">Add Assignment</h2>

            <label className="mb-3 block">
              <span className="mb-1 block">Class</span>
              <select
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                name="courseId"
                value={selectedAssignmentCourseId}
                onChange={handleAssignmentChange}>
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
                value={assignmentForm.type}
                onChange={handleAssignmentChange}>
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="project">Project</option>
                <option value="lab">Lab</option>
              </select>
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block">Title</span>
              <input
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                type="text"
                name="title"
                value={assignmentForm.title}
                onChange={handleAssignmentChange}
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block">Description</span>
              <textarea
                className="min-h-20 w-full rounded-lg border border-border bg-input-background px-3 py-2"
                name="description"
                value={assignmentForm.description}
                onChange={handleAssignmentChange}
              />
            </label>

            <label className="mb-3 block">
              <span className="mb-1 block">Due Date</span>
              <input
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                type="date"
                name="dueDate"
                value={assignmentForm.dueDate}
                onChange={handleAssignmentChange}
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1 block">
                Points Possible
              </span>
              <input
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2"
                type="number"
                min="1"
                step="1"
                name="pointsPossible"
                value={assignmentForm.pointsPossible}
                onChange={handleAssignmentChange}
              />
            </label>

            <button
              className="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              disabled={courses.length === 0}
              type="submit">
              Add Assignment
            </button>

            {assignmentMessage ? (
              <p className="mt-3 text-sm text-muted-foreground">
                {assignmentMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>

      <section className="rounded-lg border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2>Course Assignments</h2>
          <span className="text-sm text-muted-foreground">
            {visibleAssignments.length} total
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {visibleAssignments.map((assignment) => (
            <article
              key={assignment._id}
              className="rounded-lg bg-muted p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p>{assignment.title}</p>
                <span className="rounded-full bg-card px-2 py-1 text-xs font-medium capitalize text-muted-foreground">
                  {assignment.type}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {courseTitleById[String(assignment.courseId)] ||
                  "Class"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Due {assignment.dueDate?.slice(0, 10)} ·{" "}
                {assignment.pointsPossible} points
              </p>
              {assignment.description ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {assignment.description}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MaterialsListPage({ view }) {
  if (view === "teacher") {
    return <TeacherMaterialsView />;
  }
  return <StudentMaterialsView />;
}

export default MaterialsListPage;
