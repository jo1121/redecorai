import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Update user state on route change
  useEffect(() => {
    const stored = localStorage.getItem("user");
    try {
      setUser(stored ? JSON.parse(stored) : null);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    closeMenu();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <header className="bg-white/90 shadow-md sticky top-0 z-50 px-4 py-3 flex justify-between items-center backdrop-blur-md">
        {/* Clickable logo */}
        <Link to="/" className="text-lg md:text-xl font-semibold text-blue-600">
          ReDécorAI
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              <span className="text-gray-800">
                Welcome, {user.username || "User"}
              </span>
              <Button variant="solid" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Signup</Link>
              </Button>
            </>
          )}

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
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={closeMenu} className="text-gray-600">
                ✕
              </button>
            </div>
            <nav className="flex flex-col px-4 py-2 text-sm space-y-2">
              <Link to="/" onClick={closeMenu} className="hover:text-blue-600">
                Home
              </Link>
              <Link
                to="/profile"
                onClick={closeMenu}
                className="hover:text-blue-600"
              >
                Settings
              </Link>
              <Link
                to="/faq"
                onClick={closeMenu}
                className="hover:text-blue-600"
              >
                FAQ
              </Link>
              <Link
                to="/about"
                onClick={closeMenu}
                className="hover:text-blue-600"
              >
                About Us
              </Link>
              {user ? (
                <button
                  onClick={() => handleLogout()}
                  className="text-left hover:text-blue-600"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="hover:text-blue-600"
                  >
                    Signup
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-100/80 text-center py-4 text-xs text-gray-700 backdrop-blur-md">
        © 2025 ReDécorAI. All rights reserved.
      </footer>
    </div>
  );
}
