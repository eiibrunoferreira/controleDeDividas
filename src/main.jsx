import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DebtProvider } from "./context/DebtProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DebtProvider>
      <App />
    </DebtProvider>
  </React.StrictMode>
);

// Remove splash screen quando tudo carregar
/*window.addEventListener("load", () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    splash.classList.add("fade-out");
    setTimeout(() => splash.remove(), 500);
  }
});*/