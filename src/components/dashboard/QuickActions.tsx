import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/upload"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Upload Dataset
        </Link>

        <Link
          href="/reports"
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Reports
        </Link>

        <Link
          href="/analytics"
          className="rounded-lg border px-5 py-3 hover:bg-gray-100"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}