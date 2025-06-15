import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UploadRoomImage from "./UploadRoomImage";
import App from "./App"; // keep App if needed for home
import "./index.css";

// Step 1: Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/upload",
    element: <UploadRoomImage />
  }
]);

// Step 2: Use RouterProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

