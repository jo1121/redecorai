// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout"; // your video background wrapper
import AppLayout from "./App"; // the file above, with <Outlet/>
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./routes/home";
import Scan from "./routes/scan";
import ScanResult from "./routes/ScanResult"; // <-- import it!
import Marketplace from "./routes/marketplace";
import Inventory from "./routes/inventory";
import Profile from "./routes/profile";
import Suggestions from "./routes/suggestions";
import Login from "./routes/login";
import Signup from "./routes/signup";
import About from "./routes/about";
import Tutorial from "./routes/Tutorial";

// Wrap your header/layout in your global Layout:
const RootLayout = () => (
  <Layout>
    <AppLayout />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "scan", element: <Scan /> },
      { path: "scanresult", element: <ScanResult /> }, // <-- correct route
      { path: "marketplace", element: <Marketplace /> },
      { path: "inventory", element: <Inventory /> },
      { path: "profile", element: <Profile /> },
      { path: "suggestions", element: <Suggestions /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "about", element: <About /> },
      { path: "tutorial", element: <Tutorial /> },
      // optional catch-all 404:
      {
        path: "*",
        element: (
          <div className="p-10 text-center">
            <h1 className="text-3xl font-bold">404 – Page Not Found</h1>
            <button onClick={() => window.location.replace("/")}>
              Go Home
            </button>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
