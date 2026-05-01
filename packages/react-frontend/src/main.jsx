import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./MyApp";

const root = ReactDOMClient.createRoot(
  document.getElementById("root")
);
root.render(<MyApp />);
