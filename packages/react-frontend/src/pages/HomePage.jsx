import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HomePage({ view }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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
  }, []);

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

  const user = dashboard.user;

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome back, {user.name}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {view === "student" ? (
            <>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Courses
                </p>
                <p className="text-xl font-semibold">
                  {dashboard.classCount}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  GPA
                </p>
                <p className="text-xl font-semibold">
                  {dashboard.gpa?.toFixed(2) ?? "0.00"}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Upcoming Assignments
                </p>
                <p className="text-xl font-semibold">
                  {dashboard.upcomingAssignmentCount ?? 0}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Role
                </p>
                <p className="text-xl font-semibold capitalize">
                  {user.role}
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
                  {dashboard.classCount}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Students
                </p>
                <p className="text-xl font-semibold">
                  {dashboard.studentCount}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Announcements
                </p>
                <p className="text-xl font-semibold">
                  {dashboard.recentAnnouncementCount ?? 0}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Role
                </p>
                <p className="text-xl font-semibold capitalize">
                  {user.role}
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

          {dashboard.assignments?.length ? (
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
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-xl font-semibold mb-4">
            Recent Announcements
          </h3>

          {dashboard.announcements?.length ? (
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
                    {announcement.courseId?.code}
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
      )}
    </div>
  );
}
