import { useState } from "react";

// to be replaced with data from the backend
const courses = [
  { id: "all", title: "All Classes" },
  { id: "algebra", title: "Algebra II" },
  { id: "geometry", title: "Geometry" },
  { id: "physics", title: "Physics" },
  { id: "history", title: "History" }
];

// to be replaced with data from the backend
const startingMaterials = [
  {
    id: "material-1",
    courseId: "algebra",
    courseTitle: "Algebra II",
    title: "Chapter 5 Notes",
    description: "Quadratic equations and graphing notes.",
    type: "file",
    url: "",
    content: "chapter-5-notes.pdf",
    createdBy: "Ms. Williams",
    createdAt: "2026-05-15"
  },
  {
    id: "material-2",
    courseId: "physics",
    courseTitle: "Physics",
    title: "Motion Simulation",
    description:
      "Practice interpreting velocity and acceleration graphs.",
    type: "link",
    url: "https://example.com/motion-simulation",
    content: "",
    createdBy: "Dr. Chen",
    createdAt: "2026-05-18"
  },
  {
    id: "material-3",
    courseId: "history",
    courseTitle: "History",
    title: "Industrial Revolution Reading",
    description: "Primary source reading packet.",
    type: "text",
    url: "",
    content:
      "Read pages 4-12 and answer the two discussion questions.",
    createdBy: "Ms. Davis",
    createdAt: "2026-05-20"
  },
  {
    id: "material-4",
    courseId: "geometry",
    courseTitle: "Geometry",
    title: "Proof Practice",
    description: "Extra practice for two-column proofs.",
    type: "file",
    url: "",
    content: "proof-practice.docx",
    createdBy: "Ms. Williams",
    createdAt: "2026-05-21"
  }
];

function getCourseTitle(courseId) {
  const course = courses.find((item) => item.id === courseId);
  return course ? course.title : "Class";
}

function filterMaterials(
  materials,
  selectedCourse,
  selectedType
) {
  return materials.filter((material) => {
    const matchesCourse =
      selectedCourse === "all" ||
      material.courseId === selectedCourse;
    const matchesType =
      selectedType === "all" || material.type === selectedType;

    return matchesCourse && matchesType;
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
          {material.courseTitle}
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
          Added {material.createdAt} by {material.createdBy}
        </span>
        {onDelete ? (
          <button
            className="text-destructive hover:underline"
            type="button"
            onClick={() => onDelete(material.id)}>
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}

function StudentMaterialsView() {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const visibleMaterials = filterMaterials(
    startingMaterials,
    selectedCourse,
    selectedType
  );

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

        <div className="grid gap-3 md:grid-cols-2">
          {visibleMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherMaterialsView() {
  const [materials, setMaterials] = useState(startingMaterials);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [form, setForm] = useState({
    courseId: "algebra",
    title: "",
    description: "",
    type: "link",
    url: "",
    content: ""
  });
  const visibleMaterials = filterMaterials(
    materials,
    selectedCourse,
    "all"
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function addMaterial(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const material = {
      id: "material-" + Date.now(),
      courseId: form.courseId,
      courseTitle: getCourseTitle(form.courseId),
      title: form.title.trim(),
      description: form.description.trim(),
      type: form.type,
      url: form.url.trim(),
      content: form.content.trim(),
      createdBy: "You",
      createdAt: new Date().toISOString().slice(0, 10)
    };

    setMaterials([material, ...materials]);
    setForm({
      courseId: form.courseId,
      title: "",
      description: "",
      type: "link",
      url: "",
      content: ""
    });
  }

  function deleteMaterial(id) {
    setMaterials(
      materials.filter((material) => material.id !== id)
    );
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
          <h2 className="mb-6">Course Materials</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onDelete={deleteMaterial}
              />
            ))}
          </div>
        </section>

        <form
          className="rounded-lg border border-border bg-card p-6"
          onSubmit={addMaterial}>
          <h2 className="mb-4">Add Material</h2>

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
            type="submit">
            Add Material
          </button>
        </form>
      </div>
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
