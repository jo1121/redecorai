import UploadRoomImage from './UploadRoomImage';
import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
import "./index.css";
import { Button } from "@/components/ui/button";
import PageWrapper from "./components/PageWrapper";
import Layout from "./components/Layout"; // ✅ Import layout with video

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

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <header className="bg-white/90 shadow-md sticky top-0 z-50 px-4 py-3 flex justify-between items-center backdrop-blur-md">
        <div className="text-lg md:text-xl font-semibold text-blue-600">
          ReDécorAI
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Signup</Link>
          </Button>
          <button
            className="focus:outline-none p-2 rounded hover:bg-gray-100"
            onClick={() => setMenuOpen(true)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeMenu}
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-sm">Menu</span>
              <button
                onClick={closeMenu}
                className="text-gray-600 hover:text-black"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col px-4 py-2 text-sm">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                Settings
              </Link>
              <Link
                to="/faq"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                FAQ
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                About Us
              </Link>
              <button className="py-2 text-left hover:text-blue-600">
                Logout
              </button>
              <hr className="my-2" />
              <Link
                to="/login"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={closeMenu}
                className="py-2 hover:text-blue-600"
              >
                Signup
              </Link>
            </nav>
          </div>
        </>
      )}

      <main className="flex-grow">
        {isHome ? (
          <Outlet />
        ) : (
          <PageWrapper>
            <Outlet />
          </PageWrapper>
        )}
      </main>

      <footer className="bg-gray-100/80 text-center py-4 text-xs text-gray-700 backdrop-blur-md">
        © 2025 ReDécorAI. All rights reserved.
      </footer>
    </div>
  );
}

// ✅ Router definition using Layout with background video
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <AppLayout />
      </Layout>
    ),
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
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
