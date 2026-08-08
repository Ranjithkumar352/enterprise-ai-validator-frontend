"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Search,
  Database,
  AlertTriangle,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

interface Dataset {
  _id: string;
  originalName: string;
  totalRows: number;
  totalColumns: number;
  validationScore?: number;
  validationStatus?: string;
  validationIssues?: any[];
  createdAt: string;
}

export default function HistoryPage() {
  const [datasets, setDatasets] =
    useState<Dataset[]>([]);

  const [filteredDatasets, setFilteredDatasets] =
    useState<Dataset[]>([]);

  const [search, setSearch] =
    useState("");

  // NEW: Status filter
  const [statusFilter, setStatusFilter] =
    useState("all");

  // NEW: Date filter
  const [dateFilter, setDateFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  // =====================================
  // LOAD HISTORY
  // =====================================

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res =
        await api.get("/datasets");

      const data =
        res.data.datasets || [];

      setDatasets(data);
      setFilteredDatasets(data);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // =====================================
  // SEARCH + FILTERS
  // =====================================

  useEffect(() => {
    let result = [...datasets];

    // Filename search
    if (search.trim()) {
      const value =
        search.toLowerCase().trim();

      result = result.filter(
        (dataset) =>
          dataset.originalName
            .toLowerCase()
            .includes(value)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (dataset) =>
          dataset.validationStatus ===
          statusFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();

      result = result.filter(
        (dataset) => {
          const uploadDate =
            new Date(
              dataset.createdAt
            );

          if (
            dateFilter === "today"
          ) {
            return (
              uploadDate.toDateString() ===
              now.toDateString()
            );
          }

          if (
            dateFilter === "7days"
          ) {
            const sevenDaysAgo =
              new Date();

            sevenDaysAgo.setDate(
              now.getDate() - 7
            );

            return (
              uploadDate >=
              sevenDaysAgo
            );
          }

          if (
            dateFilter === "30days"
          ) {
            const thirtyDaysAgo =
              new Date();

            thirtyDaysAgo.setDate(
              now.getDate() - 30
            );

            return (
              uploadDate >=
              thirtyDaysAgo
            );
          }

          return true;
        }
      );
    }

    setFilteredDatasets(result);
  }, [
    search,
    statusFilter,
    dateFilter,
    datasets,
  ]);

  // =====================================
  // CLEAR FILTERS
  // =====================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    dateFilter !== "all";

  // =====================================
  // PDF DOWNLOAD
  // =====================================

  const downloadPDF = async (
    dataset: Dataset
  ) => {
    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("token=")
          )
          ?.split("=")[1];

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${dataset._id}/pdf`,
          {
            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},
          }
        );

      if (!response.ok) {
        throw new Error(
          "PDF generation failed"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${dataset.originalName.replace(
          /\.[^/.]+$/,
          ""
        )}-validation-report.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        "Validation report downloaded"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to download report"
      );
    }
  };

  // =====================================
  // CLEAN CSV DOWNLOAD
  // =====================================

  const downloadCleanCSV = async (
    dataset: Dataset
  ) => {
    try {
      const res =
        await api.post(
          "/cleaning",
          {
            datasetId:
              dataset._id,

            rows: [],

            issues:
              dataset.validationIssues ||
              [],

            options: {
              removeDuplicates: true,
              replaceMissing: true,
              deleteInvalidRecords: true,
              standardizeCategories: true,
              normalizeData: false,
            },
          }
        );

      const cleaned =
        res.data?.result
          ?.cleanedData || [];

      if (!cleaned.length) {
        throw new Error(
          "No cleaned data returned"
        );
      }

      const columns =
        Object.keys(cleaned[0]);

      const escapeCSV = (
        value: any
      ) => {
        const text = String(
          value ?? ""
        );

        return `"${text.replace(
          /"/g,
          '""'
        )}"`;
      };

      const csvContent = [
        columns.join(","),
        ...cleaned.map((row: any) =>
          columns
            .map((column) =>
              escapeCSV(
                row[column]
              )
            )
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${dataset.originalName.replace(
          /\.[^/.]+$/,
          ""
        )}-cleaned.csv`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        "Clean dataset downloaded"
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to download clean dataset"
      );
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Upload History
        </h1>

        <p className="mt-1 text-gray-500">
          View your previous datasets,
          validation results and reports.
        </p>
      </div>

      {/* ================================= */}
      {/* SEARCH + FILTERS */}
      {/* ================================= */}

      <div className="rounded-xl border bg-white p-4 shadow-sm">

        <div className="grid gap-4 md:grid-cols-4">

          {/* Filename Search */}

          <div className="relative md:col-span-2">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search by filename..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Status Filter */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>
          </select>

          {/* Date Filter */}

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value
              )
            }
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              All Dates
            </option>

            <option value="today">
              Today
            </option>

            <option value="7days">
              Last 7 Days
            </option>

            <option value="30days">
              Last 30 Days
            </option>
          </select>

        </div>

        {/* Filter Actions */}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredDatasets.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {datasets.length}
            </span>{" "}
            datasets
          </p>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-gray-500">
            Loading history...
          </p>
        </div>
      )}

      {/* ================================= */}
      {/* EMPTY */}
      {/* ================================= */}

      {!loading &&
        filteredDatasets.length ===
          0 && (
          <div className="rounded-xl border bg-white p-10 text-center">

            <Database className="mx-auto h-12 w-12 text-gray-400" />

            <h2 className="mt-4 text-lg font-semibold">
              No datasets found
            </h2>

            <p className="mt-1 text-gray-500">
              Try changing your search or
              filters.
            </p>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}

          </div>
        )}

      {/* ================================= */}
      {/* HISTORY TABLE */}
      {/* ================================= */}

      {!loading &&
        filteredDatasets.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="min-w-[900px] w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Filename
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Upload Time
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Score
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Errors
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold">
                      Reports
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredDatasets.map(
                    (dataset) => {

                      const errorCount =
                        dataset.validationIssues?.filter(
                          (issue: any) =>
                            issue.severity ===
                            "error"
                        ).length || 0;

                      return (
                        <tr
                          key={dataset._id}
                          className="border-t hover:bg-gray-50"
                        >

                          {/* Filename */}

                          <td className="px-5 py-4">

                            <div className="font-medium">
                              {dataset.originalName}
                            </div>

                            <div className="text-xs text-gray-500">
                              {dataset.totalRows} rows
                              {" · "}
                              {dataset.totalColumns} columns
                            </div>

                          </td>

                          {/* Upload Time */}

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {new Date(
                              dataset.createdAt
                            ).toLocaleString()}
                          </td>

                          {/* Score */}

                          <td className="px-5 py-4">

                            <span className="font-semibold">
                              {dataset.validationScore ??
                                0}
                              %
                            </span>

                          </td>

                          {/* Errors */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-2">

                              <AlertTriangle
                                size={16}
                                className="text-red-500"
                              />

                              <span>
                                {errorCount}
                              </span>

                            </div>

                          </td>

                          {/* Status */}

                          <td className="px-5 py-4">

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                dataset.validationStatus ===
                                "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {
                                dataset.validationStatus
                              }
                            </span>

                          </td>

                          {/* REPORT ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex flex-wrap gap-2">

                              <button
                                onClick={() =>
                                  downloadPDF(
                                    dataset
                                  )
                                }
                                className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                              >
                                <FileText
                                  size={15}
                                />

                                PDF
                              </button>

                              <button
                                onClick={() =>
                                  downloadCleanCSV(
                                    dataset
                                  )
                                }
                                className="flex items-center gap-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-100"
                              >
                                <Download
                                  size={15}
                                />

                                Clean CSV
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}