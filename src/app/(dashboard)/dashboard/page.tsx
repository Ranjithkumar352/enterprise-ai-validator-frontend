"use client";

import { useEffect, useState } from "react";

import {
  Upload,
  ShieldCheck,
  BrainCircuit,
  FileText,
} from "lucide-react";

import { getDashboardStats } from "@/services/dashboard.service";

import StatCard from "@/components/dashboard/StatCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await getDashboardStats();
    setStats(res.stats);
  };

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard Overview
        </h1>

        <p className="text-gray-500">
          Monitor datasets and validation reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Uploads"
          value={stats.totalUploads}
          description="Uploaded datasets"
          icon={Upload}
        />

        <StatCard
          title="Rows"
          value={stats.totalRows}
          description="Rows processed"
          icon={ShieldCheck}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          description="Completed validations"
          icon={BrainCircuit}
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          description="Pending validations"
          icon={FileText}
        />
      </div>

      <QuickActions />

      <RecentActivity />
    </div>
  );
}