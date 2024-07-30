import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// Add your GA key here
// import ReactGA from "react-ga4";
// ReactGA.initialize("");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
