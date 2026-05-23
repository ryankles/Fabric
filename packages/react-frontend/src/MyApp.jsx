import { useState } from "react";
import AnnouncementsRemindersPage from "./pages/AnnouncementsRemindersPage";
import MaterialsListPage from "./pages/MaterialsListPage";

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = window.atob(base64);

    return JSON.parse(json);
  } catch {
    return {};
  }
}

function getViewFromJwt() {
  const token =
    window.localStorage.getItem("fabricToken") ||
    window.localStorage.getItem("token") ||
    "";
  const payload = decodeJwtPayload(token);
  const role = payload.role || payload.userRole || payload.user?.role;

  return role === "teacher" ? "teacher" : "student";
}

function MyApp() {
  const [activePage, setActivePage] = useState("announcements");
  const [view] = useState(getViewFromJwt);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
            <h1 className="text-primary">Fabric</h1>
            <p className="text-sm text-muted-foreground">
              {view === "teacher" ? "Teacher" : "Student"} dashboard
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
        </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {activePage === "announcements" ? (
          <AnnouncementsRemindersPage view={view} />
        ) : (
          <MaterialsListPage view={view} />
        )}
      </main>
    </div>
  );
}

export default MyApp;
