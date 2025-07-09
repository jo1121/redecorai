import { Link, useLocation } from "react-router-dom";

export default function MobileNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Scan", path: "/scan", icon: "📷" },
    { name: "Inventory", path: "/inventory", icon: "📦" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-white border-t shadow-inner sm:hidden">
      <div className="flex justify-around items-center h-14 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center ${
              isActive(item.path)
                ? "text-blue-600 font-semibold"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
