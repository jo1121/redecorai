import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white">
      {/* Remove container restrictions — let pages be full-width */}
      {children}
    </div>
  );
}
