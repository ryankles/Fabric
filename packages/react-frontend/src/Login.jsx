import { useState } from "react";
import { Link } from "react-router-dom";

function Login({ handleSubmit, buttonLabel, message, toggleText, toggleLink, toggleLabel, isSignup }) {
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds({ ...creds, [name]: value });
  }

  function submitForm(e) {
    e.preventDefault();
    handleSubmit(creds);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-primary text-2xl font-semibold mb-1">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSignup
              ? "Sign up to access your classes and grades"
              : "Sign in to view your grades, classes, and assignments"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={submitForm}>
          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm text-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={creds.name}
                  onChange={handleChange}
                  placeholder="Alex Johnson"
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm text-foreground mb-1">
                  Role
                </label>
                <select
                  name="role"
                  id="role"
                  value={creds.role}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={creds.email}
              onChange={handleChange}
              placeholder="you@school.edu"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-foreground mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={creds.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-destructive text-center">{message}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2.5 text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            {buttonLabel}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {toggleText}{" "}
          <Link to={toggleLink} className="text-primary font-medium hover:underline">
            {toggleLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
