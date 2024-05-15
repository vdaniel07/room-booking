// import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ColorContextProvider } from "./providers/colorModeProvider.jsx";
import { SnackBarProvider } from "./providers/snackBarProvider.jsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline } from "@mui/material";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ColorContextProvider>
    <BrowserRouter>
      <SnackBarProvider>
        <CssBaseline />
        <App />
      </SnackBarProvider>
    </BrowserRouter>
  </ColorContextProvider>,
  // </React.StrictMode>,
);
