"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Database,
  FileWarning,
  Rows3,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

interface Analytics {
  totalRows: number;
  totalColumns: number;
  validRows: number;
  invalidRows: number;
  duplicateCount: number;
  missingValues: number;
  emptyColumns: number;
  errorCount: number;
  warningCount: number;
  dataQualityScore: number;

  errorDistribution: {
    name: string;
    value: number;
  }[];

  categoryDistribution: {
    name: string;
    value: number;
  }[];

  columnCompleteness: {
    name: string;
    value: number;
  }[];

  trend: {
    date: string;
    name: string;
    score: number;
    rows: number;
  }[];
}

interface Dataset {
  _id: string;
  originalName: string;
}

export default function AnalyticsPage() {
  const [datasets, setDatasets] =
    useState<Dataset[]>([]);

  const [selectedDataset, setSelectedDataset] =
    useState("");

  const [analytics, setAnalytics] =
    useState<Analytics | null>(null);

  const [loading, setLoading] =
    useState(false);

  // =====================================
  // Load datasets
  // =====================================

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const res =
        await api.get("/datasets");

      setDatasets(
        res.data.datasets || []
      );

      if (
        res.data.datasets?.length > 0
      ) {
        setSelectedDataset(
          res.data.datasets[0]._id
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load datasets"
      );
    }
  };

  // =====================================
  // Load analytics
  // =====================================

  useEffect(() => {
    if (!selectedDataset) {
      return;
    }

    loadAnalytics(
      selectedDataset
    );
  }, [selectedDataset]);

  const loadAnalytics = async (
    datasetId: string
  ) => {
    try {
      setLoading(true);

      const res =
        await api.get(
          `/analytics/${datasetId}`
        );

      setAnalytics(
        res.data.analytics
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Empty state
  // =====================================

  if (!analytics && !loading) {
    return (
      <div className="space-y-8">

        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="mt-1 text-gray-500">
            Analyze dataset quality and
            validation performance.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <Database className="mx-auto h-12 w-12 text-gray-400" />

          <h2 className="mt-4 text-xl font-semibold">
            No Dataset Selected
          </h2>

          <p className="mt-2 text-gray-500">
            Upload a dataset first to view
            analytics.
          </p>
        </div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  // =====================================
  // Pie chart values
  // =====================================

  const totalQuality =
    analytics.validRows +
    analytics.invalidRows;

  const validPercentage =
    totalQuality > 0
      ? Math.round(
          (analytics.validRows /
            totalQuality) *
            100
        )
      : 0;

  const invalidPercentage =
    100 - validPercentage;

  // =====================================
  // Maximum values
  // =====================================

  const maxError =
    Math.max(
      ...analytics.errorDistribution.map(
        (item) => item.value
      ),
      1
    );

  const maxCategory =
    Math.max(
      ...analytics.categoryDistribution.map(
        (item) => item.value
      ),
      1
    );

  return (
    <div className="space-y-8">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Analytics Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Dataset quality, validation and
            data distribution analytics.
          </p>
        </div>

        <select
          value={selectedDataset}
          onChange={(event) =>
            setSelectedDataset(
              event.target.value
            )
          }
          className="rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        >
          {datasets.map(
            (dataset) => (
              <option
                key={dataset._id}
                value={dataset._id}
              >
                {dataset.originalName}
              </option>
            )
          )}
        </select>

      </div>

      {/* ================================= */}
      {/* METRIC CARDS */}
      {/* ================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard
          title="Total Rows"
          value={analytics.totalRows}
          icon={
            <Rows3 className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Valid Rows"
          value={analytics.validRows}
          icon={
            <CheckCircle2 className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Invalid Rows"
          value={analytics.invalidRows}
          icon={
            <FileWarning className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Data Quality"
          value={`${analytics.dataQualityScore}%`}
          icon={
            <ShieldCheck className="h-6 w-6" />
          }
        />

      </div>

      {/* ================================= */}
      {/* SECONDARY METRICS */}
      {/* ================================= */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard
          title="Duplicates"
          value={
            analytics.duplicateCount
          }
          icon={
            <Database className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Missing Values"
          value={
            analytics.missingValues
          }
          icon={
            <AlertTriangle className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Errors"
          value={
            analytics.errorCount
          }
          icon={
            <FileWarning className="h-6 w-6" />
          }
        />

        <MetricCard
          title="Warnings"
          value={
            analytics.warningCount
          }
          icon={
            <AlertTriangle className="h-6 w-6" />
          }
        />

      </div>

      {/* ================================= */}
      {/* QUALITY PIE */}
      {/* ================================= */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Data Quality Distribution
          </h2>

          <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">

            <div
              className="relative h-48 w-48 rounded-full"
              style={{
                background: `conic-gradient(
                  #2563eb 0% ${validPercentage}%,
                  #ef4444 ${validPercentage}% 100%
                )`,
              }}
            >
              <div className="absolute inset-8 flex items-center justify-center rounded-full bg-white">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {analytics.dataQualityScore}%
                  </p>

                  <p className="text-xs text-gray-500">
                    Quality
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-600" />

                  <span className="text-sm">
                    Valid Rows
                  </span>
                </div>

                <p className="ml-5 font-semibold">
                  {analytics.validRows} (
                  {validPercentage}%)
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500" />

                  <span className="text-sm">
                    Invalid Rows
                  </span>
                </div>

                <p className="ml-5 font-semibold">
                  {analytics.invalidRows} (
                  {invalidPercentage}%)
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ================================= */}
        {/* ERROR DISTRIBUTION */}
        {/* ================================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold">
            Error Distribution
          </h2>

          <div className="mt-6 space-y-4">

            {analytics.errorDistribution
              .length === 0 ? (
              <p className="text-gray-500">
                No validation issues detected.
              </p>
            ) : (
              analytics.errorDistribution.map(
                (item) => (
                  <div
                    key={item.name}
                  >
                    <div className="mb-1 flex justify-between text-sm">
                      <span>
                        {item.name}
                      </span>

                      <span className="font-semibold">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-red-500"
                        style={{
                          width: `${
                            (item.value /
                              maxError) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )
            )}

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* CATEGORY BAR CHART */}
      {/* ================================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />

          <h2 className="text-lg font-semibold">
            Category Distribution
          </h2>
        </div>

        {analytics.categoryDistribution
          .length === 0 ? (
          <p className="mt-6 text-gray-500">
            No category data detected.
          </p>
        ) : (
          <div className="mt-6 space-y-5">

            {analytics.categoryDistribution.map(
              (item) => (
                <div
                  key={item.name}
                >
                  <div className="mb-1 flex justify-between text-sm">
                    <span>
                      {item.name}
                    </span>

                    <span className="font-semibold">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-5 overflow-hidden rounded bg-gray-100">
                    <div
                      className="h-full rounded bg-blue-600"
                      style={{
                        width: `${
                          (item.value /
                            maxCategory) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>

      {/* ================================= */}
      {/* COLUMN COMPLETENESS */}
      {/* ================================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold">
          Column Completeness
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">

          {analytics.columnCompleteness.map(
            (column) => (
              <div
                key={column.name}
              >

                <div className="mb-2 flex justify-between text-sm">

                  <span className="font-medium">
                    {column.name}
                  </span>

                  <span>
                    {column.value}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${column.value}%`,
                    }}
                  />

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* ================================= */}
      {/* TREND GRAPH */}
      {/* ================================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold">
          Data Quality Trend
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quality score across uploaded datasets.
        </p>

        {analytics.trend.length < 2 ? (
          <div className="mt-8 rounded-lg bg-gray-50 p-8 text-center text-gray-500">
            Upload more datasets to see the
            quality trend.
          </div>
        ) : (
          <div className="mt-8 space-y-4">

            {analytics.trend.map(
              (item, index) => (
                <div
                  key={`${item.name}-${index}`}
                >

                  <div className="mb-1 flex justify-between text-sm">

                    <span>
                      {item.name}
                    </span>

                    <span className="font-semibold">
                      {item.score}%
                    </span>

                  </div>

                  <div className="h-4 overflow-hidden rounded-full bg-gray-100">

                    <div
                      className="h-full rounded-full bg-purple-600"
                      style={{
                        width: `${item.score}%`,
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================
// METRIC CARD
// =====================================

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>
        </div>

        <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
          {icon}
        </div>

      </div>

    </div>
  );
}