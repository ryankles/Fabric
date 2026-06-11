import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

export function HomePage({ view, user: currentUser }) {
  const [dashboard, setDashboard] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [classroomMessage, setClassroomMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "",
    code: "",
    term: "",
    description: ""
  });
  const [enrollmentForm, setEnrollmentForm] = useState({
    courseId: "",
    studentEmail: ""
  });

  function loadDashboard() {
    fetch(`${API_BASE_URL}/api/dashboard`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        return res.json();
      })
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }

  function loadCourses() {
    fetch(`${API_BASE_URL}/api/courses`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load courses");
        }

        return res.json();
      })
      .then((data) => {
        setCourses(data);
        setEnrollmentForm((current) => ({
          ...current,
          courseId: data.some(
            (course) => course._id === current.courseId
          )
            ? current.courseId
            : data[0]?._id || ""
        }));
      })
      .catch((err) => {
        console.error(err);
        setClassroomMessage(err.message);
      });
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (view === "teacher") {
      loadCourses();
    }
  }, [view]);

  function handleCourseFormChange(event) {
    const { name, value } = event.target;

    setCourseForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleEnrollmentFormChange(event) {
    const { name, value } = event.target;

    setEnrollmentForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleCreateCourse(event) {
    event.preventDefault();
    setSubmitting(true);
    setClassroomMessage("");

    fetch(`${API_BASE_URL}/api/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(courseForm)
    })
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.error ||
              json.message ||
              "Failed to create classroom"
          );
        }

        setCourseForm({
          title: "",
          code: "",
          term: "",
          description: ""
        });
        setClassroomMessage("Classroom created.");
        loadDashboard();
        loadCourses();
      })
      .catch((err) => {
        console.error(err);
        setClassroomMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function handleAddStudent(event) {
    event.preventDefault();
    setSubmitting(true);
    setClassroomMessage("");

    fetch(`${API_BASE_URL}/api/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(enrollmentForm)
    })
      .then(async (res) => {
        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.error ||
              json.message ||
              "Failed to add student"
          );
        }

        setEnrollmentForm((current) => ({
          ...current,
          studentEmail: ""
        }));
        setClassroomMessage("Student added to classroom.");
        loadDashboard();
        loadCourses();
      })
      .catch((err) => {
        console.error(err);
        setClassroomMessage(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const user = dashboard?.user || currentUser || {};
  const displayName = user.name || "User";
  const role = user.role || view;
  const assignmentCount =
    dashboard?.upcomingAssignmentCount ??
    dashboard?.assignments?.length ??
    0;
  const announcementCount =
    dashboard?.recentAnnouncementCount ??
    dashboard?.announcements?.length ??
    0;
  const gpa =
    typeof dashboard?.gpa === "number"
      ? dashboard.gpa.toFixed(2)
      : "0.00";

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome back, {displayName}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {view === "student" ? (
            <>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Courses
                </p>
                <p className="text-xl font-semibold">
                  {dashboard?.classCount ?? 0}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  GPA
                </p>
                <p className="text-xl font-semibold">{gpa}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Upcoming Assignments
                </p>
                <p className="text-xl font-semibold">
                  {assignmentCount}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Role
                </p>
                <p className="text-xl font-semibold capitalize">
                  {role}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Courses
                </p>
                <p className="text-xl font-semibold">
                  {dashboard?.classCount ?? 0}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Students
                </p>
                <p className="text-xl font-semibold">
                  {dashboard?.studentCount ?? 0}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Announcements
                </p>
                <p className="text-xl font-semibold">
                  {announcementCount}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Role
                </p>
                <p className="text-xl font-semibold capitalize">
                  {role}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {view === "student" && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4">
            Upcoming Assignments
          </h3>

          {dashboard?.assignments?.length ? (
            <div className="space-y-3">
              {dashboard.assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className="border-b border-border pb-3">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      {assignment.title}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        assignment.dueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {assignment.courseId?.code}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {assignment.pointsPossible} points
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No upcoming assignments.
            </p>
          )}
        </div>
      )}

      {view === "teacher" && (
        <>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-xl font-semibold mb-4">
              Recent Announcements
            </h3>

            {dashboard?.announcements?.length ? (
              <div className="space-y-3">
                {dashboard.announcements.map((announcement) => (
                  <div
                    key={announcement._id}
                    className="border-b border-border pb-3">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        {announcement.title}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          announcement.publishAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {announcement.courseTitle ||
                        announcement.courseId?.code}
                    </p>

                    <p className="text-sm mt-2">
                      {announcement.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No announcements.
              </p>
            )}
          </div>

          <div className="bg-card rounded-lg p-6 border border-border space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Your Classrooms
              </h3>

              {courses.length ? (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="rounded-lg bg-muted p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p>{course.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.code} · {course.term}
                          </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {course.studentCount || 0} students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No classrooms yet.
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <form
                onSubmit={handleCreateCourse}
                className="space-y-3 rounded-lg bg-muted p-4">
                <h4>Create Classroom</h4>
                <input
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="title"
                  placeholder="Class title"
                  value={courseForm.title}
                  onChange={handleCourseFormChange}
                  required
                />
                <input
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="code"
                  placeholder="Class code"
                  value={courseForm.code}
                  onChange={handleCourseFormChange}
                  required
                />
                <input
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="term"
                  placeholder="Term"
                  value={courseForm.term}
                  onChange={handleCourseFormChange}
                  required
                />
                <textarea
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="description"
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={handleCourseFormChange}
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60">
                  Create
                </button>
              </form>

              <form
                onSubmit={handleAddStudent}
                className="space-y-3 rounded-lg bg-muted p-4">
                <h4>Add Student</h4>
                <select
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="courseId"
                  value={enrollmentForm.courseId}
                  onChange={handleEnrollmentFormChange}
                  required>
                  <option value="">Select classroom</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <input
                  className="w-full rounded-lg border border-border bg-card px-3 py-2"
                  name="studentEmail"
                  type="email"
                  placeholder="Student email"
                  value={enrollmentForm.studentEmail}
                  onChange={handleEnrollmentFormChange}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !courses.length}
                  className="rounded-lg bg-primary px-4 py-2 text-primary-foreground disabled:opacity-60">
                  Add Student
                </button>
              </form>
            </div>

            {classroomMessage && (
              <p className="text-sm text-muted-foreground">
                {classroomMessage}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
