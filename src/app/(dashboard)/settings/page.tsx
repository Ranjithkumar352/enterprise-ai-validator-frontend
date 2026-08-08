"use client";

import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  const [notifications, setNotifications] =
    useState(true);

  const [emailReports, setEmailReports] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const handleSave = () => {
    toast.success(
      "Settings saved successfully"
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Manage your account and application
          preferences.
        </p>
      </div>

      {/* ================================= */}
      {/* PROFILE */}
      {/* ================================= */}

      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-blue-100 p-3">
            <User className="h-5 w-5 text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Profile
            </h2>

            <p className="text-sm text-gray-500">
              Your account information
            </p>
          </div>

        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-sm outline-none"
            />
          </div>

        </div>

      </section>

      {/* ================================= */}
      {/* NOTIFICATIONS */}
      {/* ================================= */}

      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-yellow-100 p-3">
            <Bell className="h-5 w-5 text-yellow-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Notifications
            </h2>

            <p className="text-sm text-gray-500">
              Manage notification preferences
            </p>
          </div>

        </div>

        <div className="mt-6 space-y-5">

          <SettingToggle
            title="Application Notifications"
            description="Receive notifications about dataset validation and processing."
            checked={notifications}
            onChange={() =>
              setNotifications(
                !notifications
              )
            }
          />

          <SettingToggle
            title="Validation Reports"
            description="Receive notifications when validation reports are ready."
            checked={emailReports}
            onChange={() =>
              setEmailReports(
                !emailReports
              )
            }
          />

        </div>

      </section>

      {/* ================================= */}
      {/* APPEARANCE */}
      {/* ================================= */}

      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-purple-100 p-3">
            <Palette className="h-5 w-5 text-purple-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Appearance
            </h2>

            <p className="text-sm text-gray-500">
              Customize your application
              appearance.
            </p>
          </div>

        </div>

        <div className="mt-6">

          <SettingToggle
            title="Dark Mode"
            description="Use a darker interface for the application."
            checked={darkMode}
            onChange={() =>
              setDarkMode(!darkMode)
            }
          />

        </div>

      </section>

      {/* ================================= */}
      {/* SECURITY */}
      {/* ================================= */}

      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-green-100 p-3">
            <Shield className="h-5 w-5 text-green-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Security
            </h2>

            <p className="text-sm text-gray-500">
              Your account security information.
            </p>
          </div>

        </div>

        <div className="mt-6 rounded-lg bg-gray-50 p-4">

          <p className="text-sm font-medium">
            Authentication
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Your account is protected using
            JWT authentication.
          </p>

        </div>

      </section>

      {/* ================================= */}
      {/* ACTIONS */}
      {/* ================================= */}

      <div className="flex flex-col gap-3 sm:flex-row">

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          <Save size={18} />

          Save Settings
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-700 hover:bg-red-100"
        >
          <LogOut size={18} />

          Logout
        </button>

      </div>

    </div>
  );
}

/* ================================= */
/* TOGGLE COMPONENT */
/* ================================= */

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">

      <div className="min-w-0">
        <p className="font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-gray-300"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}