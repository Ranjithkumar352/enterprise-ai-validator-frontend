"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Upload,
  ShieldCheck,
  BarChart3,
  FileText,
  History,
  Settings,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Upload Dataset",
    href: "/upload",
    icon: Upload,
  },
  {
    title: "Validation",
    href: "/validation",
    icon: ShieldCheck,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full min-h-screen flex-col bg-white">

      {/* Logo / Brand */}

      <div className="flex min-h-16 items-center border-b px-5">

        <div className="min-w-0">

          <h1 className="truncate text-lg font-bold text-gray-900">
            Enterprise AI Validator
          </h1>

          <p className="mt-0.5 text-xs text-gray-500">
            Data Quality Platform
          </p>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex w-full items-center gap-3
                rounded-lg px-4 py-3
                text-sm font-medium
                transition-colors
                ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-slate-100 hover:text-gray-900"
                }
              `}
            >
              <Icon
                size={20}
                className="shrink-0"
              />

              <span className="truncate">
                {item.title}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* Footer */}

      <div className="border-t p-4">

        <p className="text-center text-xs text-gray-400">
          AI Data Validator
        </p>

      </div>

    </div>
  );
}