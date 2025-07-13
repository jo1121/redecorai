// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout"; // your video-background layout
import AppLayout from "./App"; // header/sidebar + <Outlet/>
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./routes/home";
import Scan from "./routes/scan";
import Marketplace from "./routes/marketplace";
import Inventory from "./routes/inventory";
import Profile from "./routes/profile";
import Suggestions from "./routes/suggestions";
import Login from "./routes/login";
import Signup from "./routes/signup";
import About from "./routes/about";
import Tutorial from "./routes/Tutorial";
import ScanResult from "./routes/ScanResult";

// Pull your client ID from environment
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.error(
    "❌ Missing VITE_GOOGLE_CLIENT_ID in .env.local – " +
      "be sure to restart your dev server after adding it!"
  );
}

// Wrap AppLayout in your global Layout
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
      { path: "marketplace", element: <Marketplace /> },
      { path: "inventory", element: <Inventory /> },
      { path: "profile", element: <Profile /> },
      { path: "suggestions", element: <Suggestions /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "about", element: <About /> },
      { path: "tutorial", element: <Tutorial /> },
      { path: "scan-result", element: <ScanResult /> },
      // Dashboard route removed!
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={googleClientId!}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
