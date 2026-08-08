
"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-xl font-semibold">
          Welcome, {user?.name}
        </h2>

        <p className="text-sm text-gray-500">
          Enterprise AI CSV Validation Platform
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}