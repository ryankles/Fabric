import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Table from "./Table";
import Form from "./Form";
import Login from "./Login";

const API_PREFIX = "http://localhost:8000";

function MyApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [items, setItems] = useState([]);

  // On mount, try fetching items to see if we have a valid cookie
  useEffect(() => {
    fetchItems();
  }, []);

  // --- API calls (credentials: "include" sends the cookie automatically) ---
  function fetchItems() {
    fetch(`${API_PREFIX}/api/items`, {
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
      .catch((error) =>
        console.error("Fetch items error:", error)
      );
  }

  function addItem(person) {
    fetch(`${API_PREFIX}/api/items`, {
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
      .catch((error) =>
        console.error("Add item error:", error)
      );
  }

  function removeItem(index) {
    const item = items[index];
    fetch(`${API_PREFIX}/api/items/${item._id}`, {
      method: "DELETE",
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 204) {
          setItems(items.filter((_, i) => i !== index));
        }
      })
      .catch((error) =>
        console.error("Delete item error:", error)
      );
  }

  // --- Auth actions ---
  function loginUser(creds) {
    fetch(`${API_PREFIX}/auth/signin`, {
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
          setMessage(
            "Login failed. Check your email and password."
          );
        }
      })
      .catch((error) => setMessage(`Login error: ${error}`));
  }

  function signupUser(creds) {
    fetch(`${API_PREFIX}/auth/signup`, {
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
    fetch(`${API_PREFIX}/auth/logout`, {
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
        {isLoggedIn && (
          <header>
            <button onClick={logout}>Log Out</button>
          </header>
        )}

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
                <>
                  <Form handleSubmit={addItem} />
                  <Table
                    charData={items}
                    removeChar={removeItem}
                  />
                </>
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
