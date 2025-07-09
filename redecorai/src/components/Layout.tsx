// src/components/Layout.tsx
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full text-white">
      {/* now transparent—your global body background will show */}
      {children}
    </div>
  );
}
