import React from "react";
import ReactDOM from "react-dom/client";
import { VisibilityProvider } from "./providers/VisibilityProvider";
import App from "./App";
import "./index.css";
import AppContextProvider from "./context/AppContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <VisibilityProvider>
        <App />
      </VisibilityProvider>
    </AppContextProvider>
  </React.StrictMode>
);
