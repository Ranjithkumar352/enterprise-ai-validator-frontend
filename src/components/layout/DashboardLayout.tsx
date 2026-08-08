"use client";

import { useState } from "react";
import {
  Menu,
  X,
} from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================= */}

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:block">
        <Sidebar />
      </aside>

      {/* ================================= */}
      {/* MOBILE OVERLAY */}
      {/* ================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* ================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[280px] max-w-[85vw]
          transform bg-white shadow-xl
          transition-transform duration-300
          lg:hidden
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Mobile Sidebar Header */}

        <div className="flex h-16 items-center justify-between border-b px-4">

          <span className="font-semibold text-gray-900">
            Menu
          </span>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        <div className="h-[calc(100%-4rem)] overflow-y-auto">

          <Sidebar
            onNavigate={() =>
              setSidebarOpen(false)
            }
          />

        </div>

      </aside>

      {/* ================================= */}
      {/* MAIN AREA */}
      {/* ================================= */}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">

        {/* ================================= */}
        {/* MOBILE TOP BAR */}
        {/* ================================= */}

        <div className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-4 lg:hidden">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          <div className="ml-3 min-w-0">

            <p className="truncate text-base font-bold text-gray-900">
              Enterprise AI Validator
            </p>

            <p className="hidden text-xs text-gray-500 sm:block">
              Data Quality Platform
            </p>

          </div>

        </div>

        {/* ================================= */}
        {/* DESKTOP NAVBAR */}
        {/* ================================= */}

        <div className="hidden lg:block">
          <Navbar />
        </div>

        {/* ================================= */}
        {/* PAGE CONTENT */}
        {/* ================================= */}

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">

          <div className="mx-auto w-full max-w-[1600px]">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
}