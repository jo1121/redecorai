import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      {!isHome && (
        <Link
          to="/"
          className="text-blue-600 text-sm hover:underline mb-4 block"
        >
          ← Back to Home
        </Link>
      )}
      {children}
    </div>
  );
}
