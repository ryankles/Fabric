import { useEffect, useState } from "react";
import AnnouncementsRemindersPage from "./pages/AnnouncementsRemindersPage";
import MaterialsListPage from "./pages/MaterialsListPage";
import CalendarPage from "./pages/CalendarPage";
import GradesPage from "./pages/GradesPage";

const API_BASE_URL = "http://localhost:8000";

function getStoredToken() {
  return (
    window.localStorage.getItem("fabricToken") ||
    window.localStorage.getItem("token") ||
    ""
  );
}

function MyApp() {
  const [activePage, setActivePage] = useState("announcements");
  // We'll have to replace this with data from actual auth
  const [user, setUser] = useState({
    name: "Demo Student",
    role: "student"
  });
  const view = user.role === "teacher" ? "teacher" : "student";

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      return;
    }

    async function loadUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          return;
        }

        const currentUser = await response.json();
        setUser(currentUser);
      } catch {
        // Keep the demo student view if the backend is not running yet.
      }
    }

    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-primary">Fabric</h1>
            <p className="text-sm text-muted-foreground">
              {user.name} · {view === "teacher" ? "Teacher" : "Student"}
            </p>
          </div>

          <nav className="flex flex-wrap gap-1">
            <button
              className={
                activePage === "announcements"
                  ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                  : "rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              type="button"
              onClick={() => setActivePage("announcements")}
            >
              Announcements
            </button>
            <button
              className={
                activePage === "materials"
                  ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                  : "rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              type="button"
              onClick={() => setActivePage("materials")}
            >
              Materials
            </button>
            <button
              className={
                activePage === "calendar"
                  ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                  : "rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              type="button"
              onClick={() => setActivePage("calendar")}
            >
              Calendar
            </button>
            <button
              className={
                activePage === "grades"
                  ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                  : "rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              type="button"
              onClick={() => setActivePage("grades")}
            >
              Grades
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {activePage === "announcements" && (
          <AnnouncementsRemindersPage view={view} />
        )}
        {activePage === "materials" && <MaterialsListPage view={view} />}
        {activePage === "calendar" && <CalendarPage view={view} />}
        {activePage === "grades" && <GradesPage view={view} />}
      </main>
    </div>
  );
}

export default MyApp;
