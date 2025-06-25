import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Layout from "./components/Layout";
import AppLayout from "./App";
import Home from "./routes/home";
import Scan from "./routes/scan";
import Marketplace from "./routes/marketplace";
import Inventory from "./routes/inventory";
import Profile from "./routes/profile";
import Suggestions from "./routes/suggestions";
import Login from "./routes/login";
import Signup from "./routes/signup";
import About from "./routes/about";
import Dashboard from "./routes/Dashboard";
import Tutorial from "./routes/Tutorial";
import ScanResult from "./routes/ScanResult";

const RootLayout = () => (
  <Layout>
    <AppLayout />
  </Layout>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 🔄 Wrapped JSX component
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
      { path: "dashboard", element: <Dashboard /> },
      { path: "tutorial", element: <Tutorial /> },
      { path: "scan-result", element: <ScanResult /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);