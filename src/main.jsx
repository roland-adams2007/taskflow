import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "./context/Alert/AlertContext.jsx";
import App from "./App.jsx";
import { CookiesProvider } from "react-cookie";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
      <AlertProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertProvider>
    </CookiesProvider>
  </StrictMode>,
);
