import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Unable to find root element");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);