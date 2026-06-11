import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

function GradesPage({ view }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  const studentGrades = data?.grades || [];
  const teacherClasses = data?.classes || [];

  return (
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
  );
}

export default GradesPage;
