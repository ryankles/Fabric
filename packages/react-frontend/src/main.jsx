import React from "react";
import ReactDOMClient from "react-dom/client";
import MyApp from "./MyApp" // file's extension converted to js regardless by Vite
import Table from "./Table"
import "./main.css";

// create the actual container
const container = document.getElementById("root");

// create a root
const root = ReactDOMClient.createRoot(container);

// Initial render
root.render(<MyApp />);