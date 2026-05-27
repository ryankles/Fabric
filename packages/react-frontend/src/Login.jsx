import React, { useState } from "react";

function Login(props) {
  const [creds, setCreds] = useState({
    email: "",
    password: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setCreds({ ...creds, [name]: value });
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ email: "", password: "" });
  }

  return (
    <div className="login-container">
      <h2>{props.buttonLabel || "Log In"}</h2>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={creds.email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={creds.password}
          onChange={handleChange}
        />
        <input
          type="button"
          value={props.buttonLabel || "Log In"}
          onClick={submitForm}
        />
      </form>
      {props.message && <p className="auth-message">{props.message}</p>}
      <p className="auth-toggle">
        {props.toggleText}{" "}
        <a href={props.toggleLink}>{props.toggleLabel}</a>
      </p>
    </div>
  );
}

export default Login;
