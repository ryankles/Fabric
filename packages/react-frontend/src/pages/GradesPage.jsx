import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

function toLetterGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

function loadTeacherCourses(
  apiBaseUrl,
  setTeacherCourses,
  setSelectedCourseId,
  setMessage
) {
  fetch(`${apiBaseUrl}/api/courses`, {
    credentials: "include"
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Failed to load courses");
      }

      return res.json();
    })
    .then((courses) => {
      setTeacherCourses(courses);

      setSelectedCourseId(
        (current) => current || courses[0]?._id || ""
      );
    })
    .catch((err) => {
      console.error(err);
      setMessage(err.message);
    });
}

function loadTeacherGradebook(
  apiBaseUrl,
  courseId,
  setTeacherGradebook,
  setGradeForm,
  setMessage
) {
  if (!courseId) {
    return;
  }

  fetch(`${apiBaseUrl}/api/grades?courseId=${courseId}`, {
    credentials: "include"
  })
    .then(async (res) => {
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          json.error || "Failed to load class gradebook"
        );
      }

      return res.json();
    })
    .then((json) => {
      setTeacherGradebook(json);
      setGradeForm({
        assignmentId: json.assignments[0]?._id || "",
        studentId:
          json.roster[0]?.userId?._id ||
          json.roster[0]?.userId ||
          "",
        score: "",
        pointsPossible:
          json.assignments[0]?.pointsPossible?.toString() || "",
        feedback: ""
      });
    })
    .catch((err) => {
      console.error(err);
      setMessage(err.message);
    });
}

function GradesPage({ view }) {
  const [summary, setSummary] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [teacherGradebook, setTeacherGradebook] = useState({
    course: null,
    roster: [],
    assignments: [],
    grades: []
  });
  const [gradeForm, setGradeForm] = useState({
    assignmentId: "",
    studentId: "",
    score: "",
    pointsPossible: "",
    feedback: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function loadSummary() {
    fetch(`${API_BASE_URL}/api/grades`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load grades");
        }

        return res.json();
      })
      .then((json) => {
        setSummary(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadSummary();
  }, []);

  useEffect(() => {
    if (view === "teacher") {
      loadTeacherCourses(
        API_BASE_URL,
        setTeacherCourses,
        setSelectedCourseId,
        setMessage
      );
    }
  }, [view]);

  useEffect(() => {
    if (view === "teacher" && selectedCourseId) {
      loadTeacherGradebook(
        API_BASE_URL,
        selectedCourseId,
        setTeacherGradebook,
        setGradeForm,
        setMessage
      );
    }
  }, [view, selectedCourseId]);

  function handleGradeFormChange(event) {
    const { name, value } = event.target;

    setGradeForm((current) => {
      if (name === "assignmentId") {
        const selectedAssignment =
          teacherGradebook.assignments.find(
            (assignment) => assignment._id === value
          );

        return {
          ...current,
          assignmentId: value,
          pointsPossible:
            selectedAssignment?.pointsPossible?.toString() || ""
        };
      }

      return {
        ...current,
        [name]: value
      };
    });
  }

  function handleGradeSubmit(event) {
    event.preventDefault();

    if (
      !selectedCourseId ||
      !gradeForm.assignmentId ||
      !gradeForm.studentId
    ) {
      return;
    }

    setMessage("");

    fetch(`${API_BASE_URL}/api/grades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        courseId: selectedCourseId,
        assignmentId: gradeForm.assignmentId,
        studentId: gradeForm.studentId,
        score: Number(gradeForm.score),
        pointsPossible: Number(gradeForm.pointsPossible),
        feedback: gradeForm.feedback
      })
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            json.error || json.message || "Failed to save grade"
          );
        }

        setMessage("Grade saved.");
        setGradeForm((current) => ({
          ...current,
          score: "",
          feedback: ""
        }));
        loadSummary();
        loadTeacherGradebook(
          API_BASE_URL,
          selectedCourseId,
          setTeacherGradebook,
          setGradeForm,
          setMessage
        );
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p>Loading grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const studentGrades = summary?.grades || [];
  const teacherClasses = summary?.classes || [];
  const selectedClass = teacherGradebook.course;
  const teacherGradebookLoaded =
    selectedCourseId &&
    selectedClass &&
    String(selectedClass._id) === String(selectedCourseId);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6">
          {view === "student" ? "My Grades" : "Class Averages"}
        </h2>

        <div className="space-y-3">
          {view === "student" ? (
            studentGrades.length ? (
              studentGrades.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between rounded-lg bg-muted p-4">
                  <div className="flex-1">
                    <p>{item.course?.title || "Class"}</p>
                    <p className="text-muted-foreground">
                      {item.assignment?.title || "Assignment"}
                    </p>
                    <p className="text-muted-foreground">
                      {item.teacher}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-muted-foreground">
                      {item.percentage}%
                    </span>
                    <span className="min-w-[3rem] rounded-md bg-card px-3 py-1 text-center">
                      {item.letterGrade}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No grades have been posted yet.
              </p>
            )
          ) : teacherClasses.length ? (
            teacherClasses.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="flex-1">
                  <p>{item.title}</p>
                  <p className="text-muted-foreground">
                    {item.students} students
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground">
                    {item.avgPercentage}%
                  </span>
                  <span className="min-w-[3rem] rounded-md bg-card px-3 py-1 text-center">
                    {item.avgGrade}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">
              No classroom grade data yet.
            </p>
          )}
        </div>
      </div>

      {view === "teacher" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">
                  Teacher Gradebook
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add or update grades for a selected class.
                </p>
              </div>

              <select
                className="rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                value={selectedCourseId}
                onChange={(event) =>
                  setSelectedCourseId(event.target.value)
                }>
                {teacherCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {teacherCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No classes yet.
              </p>
            ) : null}
          </div>

          {selectedClass ? (
            <>
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4>{selectedClass.title} roster</h4>
                    <button
                      className="rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                      type="button"
                      onClick={() =>
                        loadTeacherGradebook(
                          API_BASE_URL,
                          selectedCourseId,
                          setTeacherGradebook,
                          setGradeForm,
                          setMessage
                        )
                      }>
                      Refresh roster
                    </button>
                  </div>

                  {!teacherGradebookLoaded ? (
                    <p className="text-sm text-muted-foreground">
                      Loading class data...
                    </p>
                  ) : teacherGradebook.roster.length ? (
                    <div className="space-y-2">
                      {teacherGradebook.roster.map(
                        (student) => {
                          const studentGrade =
                            teacherGradebook.grades.find(
                              (grade) =>
                                String(grade.studentId) ===
                                String(
                                  student.userId?._id ||
                                    student.userId
                                )
                            );

                          return (
                            <div
                              key={student._id}
                              className="rounded-lg bg-muted p-3">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p>{student.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {student.email}
                                  </p>
                                </div>
                                <span className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">
                                  {studentGrade
                                    ? `${studentGrade.percentage}%`
                                    : "No grade"}
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No students enrolled in this class yet.
                    </p>
                  )}
                </div>

                <form
                  onSubmit={handleGradeSubmit}
                  className="space-y-4 rounded-lg border border-border bg-card p-6">
                  <h4>Add / Update Grade</h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Assignment
                      </span>
                      <select
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                        name="assignmentId"
                        value={gradeForm.assignmentId}
                        onChange={handleGradeFormChange}
                        required>
                        <option value="">
                          Select assignment
                        </option>
                        {teacherGradebook.assignments.map(
                          (assignment) => (
                            <option
                              key={assignment._id}
                              value={assignment._id}>
                              {assignment.title}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Student
                      </span>
                      <select
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                        name="studentId"
                        value={gradeForm.studentId}
                        onChange={handleGradeFormChange}
                        required>
                        <option value="">Select student</option>
                        {teacherGradebook.roster.map(
                          (student) => (
                            <option
                              key={student._id}
                              value={
                                student.userId?._id ||
                                student.userId
                              }>
                              {student.name}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Score
                      </span>
                      <input
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                        name="score"
                        type="number"
                        min="0"
                        step="0.01"
                        value={gradeForm.score}
                        onChange={handleGradeFormChange}
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm text-muted-foreground">
                        Points Possible
                      </span>
                      <input
                        className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                        name="pointsPossible"
                        type="number"
                        min="1"
                        step="0.01"
                        value={gradeForm.pointsPossible}
                        onChange={handleGradeFormChange}
                        required
                      />
                    </label>
                  </div>

                  <label className="space-y-2 block">
                    <span className="text-sm text-muted-foreground">
                      Feedback
                    </span>
                    <textarea
                      className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-foreground"
                      name="feedback"
                      rows={3}
                      value={gradeForm.feedback}
                      onChange={handleGradeFormChange}
                      placeholder="Optional feedback for the student"
                    />
                  </label>

                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-opacity hover:opacity-90">
                    Save Grade
                  </button>

                  {message && (
                    <p className="text-sm text-muted-foreground">
                      {message}
                    </p>
                  )}
                </form>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h4 className="mb-4">Existing Grades</h4>

                {!teacherGradebookLoaded ? (
                  <p className="text-sm text-muted-foreground">
                    Loading grades...
                  </p>
                ) : teacherGradebook.grades.length ? (
                  <div className="space-y-3">
                    {teacherGradebook.grades.map((grade) => (
                      <div
                        key={grade._id}
                        className="flex flex-col gap-3 rounded-lg bg-muted p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <p>{grade.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {grade.assignmentTitle ||
                              "Assignment"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-card px-3 py-1 text-sm text-muted-foreground">
                            {grade.score}/{grade.pointsPossible}
                          </span>
                          <span className="min-w-[3rem] rounded-md bg-card px-3 py-1 text-center">
                            {toLetterGrade(grade.percentage)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No grades recorded for this class yet.
                  </p>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default GradesPage;
