import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Login";

import AnnouncementsRemindersPage from "./pages/AnnouncementsRemindersPage";
import MaterialsListPage from "./pages/MaterialsListPage";
import CalendarPage from "./pages/CalendarPage";
import GradesPage from "./pages/GradesPage";
import HomePage from "./pages/HomePage";

const API_BASE_URL = "http://localhost:8000";
/*
function getStoredToken() {
  return (
    window.localStorage.getItem("fabricToken") ||
    window.localStorage.getItem("token") ||
    ""
  );
}
*/
function Dashboard({ user, logout }) {
  const [activePage, setActivePage] = useState("home");
  
  const view = user.role === "teacher" ? "teacher" : "student";

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
                activePage === "home"
                  ? "rounded-lg bg-primary px-4 py-2 text-primary-foreground"
                  : "rounded-lg px-4 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              }
              type="button"
              onClick={() => setActivePage("home")}
            >
              Home
            </button>
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
            <button onClick={logout}>Log Out</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {activePage === "home" && <HomePage view={view} />}
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
        


function MyApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);
  //const [user, setUser] = useState([]);


  // On mount, try fetching items to see if we have a valid cookie
  useEffect(() => {
    fetchItems();
  }, []);

  // --- API calls (credentials: "include" sends the cookie automatically) ---
  function fetchItems() {
    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 401) {
          setIsLoggedIn(false);
          return undefined;
        }
        return res.status === 200 ? res.json() : undefined;
      })
      .then((json) => {
        if (json) {
          setItems(json);
          setIsLoggedIn(true);
        }
      })
      .catch((error) => console.error("Fetch items error:", error));
  }
/*
  function addItem(person) {
    fetch(`${API_BASE_URL}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: person.name })
    })
      .then((res) => {
        if (res.status === 201) return res.json();
        return undefined;
      })
      .then((json) => {
        if (json) setItems([...items, json]);
      })
      .catch((error) => console.error("Add item error:", error));
  }

  function removeItem(index) {
    const item = items[index];
    fetch(`${API_BASE_URL}/api/items/${item._id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 204) {
          setItems(items.filter((_, i) => i !== index));
        }
      })
      .catch((error) => console.error("Delete item error:", error));
  }
*/
  // --- Auth actions ---
  function loginUser(creds) {
    fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(creds)
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
          setMessage("");
          fetchItems();
        } else {
          setMessage("Login failed. Check your email and password.");
        }
      })
      .catch((error) => setMessage(`Login error: ${error}`));
  }

  function signupUser(creds) {
    fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(creds)
    })
      .then((res) => {
        if (res.status === 201) {
          setIsLoggedIn(true);
          setMessage("");
          fetchItems();
        } else if (res.status === 409) {
          setMessage("That email is already in use.");
        } else {
          setMessage("Signup failed. Please try again.");
        }
      })
      .catch((error) => setMessage(`Signup error: ${error}`));
  }

	
  function logout() {
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        setIsLoggedIn(false);
        setItems([]);
        setMessage("");
      })
      .catch((error) => console.error("Logout error:", error));
  }

  return (
    <BrowserRouter>
      <div className="container">

        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login
                  handleSubmit={loginUser}
                  buttonLabel="Log In"
                  message={message}
                  toggleText="Don't have an account?"
                  toggleLink="/signup"
                  toggleLabel="Sign Up"
                />
              )
            }
          />
          <Route
            path="/signup"
            element={
              isLoggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login
                  handleSubmit={signupUser}
                  buttonLabel="Sign Up"
                  message={message}
                  toggleText="Already have an account?"
                  toggleLink="/login"
                  toggleLabel="Log In"
                />
              )
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
              <Dashboard user={items} logout={logout} />
               ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default MyApp;
