"use client";

import { useEffect, useState } from "react";
import {
  Download,
  FileText,
  Database,
  CheckCircle2,
  AlertTriangle,
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

export default function ReportsPage() {
  const [datasets, setDatasets] =
    useState<Dataset[]>([]);

  const [selectedDataset, setSelectedDataset] =
    useState<Dataset | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [downloadingPDF, setDownloadingPDF] =
    useState(false);

  const [downloadingCSV, setDownloadingCSV] =
    useState(false);

  // =====================================
  // Load datasets
  // =====================================

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);

      const res =
        await api.get("/datasets");

      const list =
        res.data.datasets || [];

      setDatasets(list);

      if (list.length > 0) {
        setSelectedDataset(list[0]);
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load datasets"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // PDF REPORT
  // =====================================

  const downloadPDF = async () => {
    if (!selectedDataset) {
      toast.error(
        "Please select a dataset"
      );

      return;
    }

    try {
      setDownloadingPDF(true);

      const token =
        document.cookie
          .split("; ")
          .find((row) =>
            row.startsWith("token=")
          )
          ?.split("=")[1];

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reports/${selectedDataset._id}/pdf`,
          {
            method: "GET",
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
          "Failed to generate PDF"
        );
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `${selectedDataset.originalName.replace(
          /\.[^/.]+$/,
          ""
        )}-validation-report.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success(
        "Validation PDF downloaded"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to download PDF report"
      );
    } finally {
      setDownloadingPDF(false);
    }
  };

  // =====================================
  // CLEAN CSV
  // =====================================

  const downloadCleanCSV = async () => {
    if (!selectedDataset) {
      toast.error(
        "Please select a dataset"
      );

      return;
    }

    try {
      setDownloadingCSV(true);

      const response =
        await api.post(
          "/cleaning",
          {
            datasetId:
              selectedDataset._id,

            rows: [],

            issues:
              selectedDataset.validationIssues ||
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
        response.data?.result
          ?.cleanedData || [];

      if (!cleaned.length) {
        throw new Error(
          "No cleaned data available"
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
        `${selectedDataset.originalName.replace(
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
          "Failed to download clean CSV"
      );
    } finally {
      setDownloadingCSV(false);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">
          Loading reports...
        </p>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Reports
        </h1>

        <p className="mt-1 text-gray-500">
          Generate validation reports and
          download cleaned datasets.
        </p>
      </div>

      {/* Dataset Selector */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-semibold">
          Select Dataset
        </h2>

        {datasets.length === 0 ? (
          <p className="text-gray-500">
            No datasets available.
          </p>
        ) : (
          <select
            value={
              selectedDataset?._id || ""
            }
            onChange={(event) => {
              const dataset =
                datasets.find(
                  (item) =>
                    item._id ===
                    event.target.value
                );

              setSelectedDataset(
                dataset || null
              );
            }}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
        )}
      </div>

      {selectedDataset && (
        <>
          {/* Dataset Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-600" />

                <p className="text-sm text-gray-500">
                  Total Rows
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {selectedDataset.totalRows}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-purple-600" />

                <p className="text-sm text-gray-500">
                  Columns
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {selectedDataset.totalColumns}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />

                <p className="text-sm text-gray-500">
                  Validation Score
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {selectedDataset.validationScore ??
                  0}
                %
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />

                <p className="text-sm text-gray-500">
                  Issues
                </p>
              </div>

              <p className="mt-3 text-2xl font-bold">
                {
                  selectedDataset
                    .validationIssues
                    ?.length
                }
              </p>
            </div>

          </div>

          {/* Reports */}
          <div className="grid gap-6 md:grid-cols-2">

            {/* PDF */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-red-100 p-3">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    Validation Report
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Download a PDF containing
                    validation results, errors,
                    warnings and recommendations.
                  </p>

                  <button
                    onClick={downloadPDF}
                    disabled={
                      downloadingPDF
                    }
                    className="mt-5 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Download size={18} />

                    {downloadingPDF
                      ? "Generating PDF..."
                      : "Download Validation PDF"}
                  </button>
                </div>

              </div>

            </div>

            {/* CSV */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">

              <div className="flex items-start gap-4">

                <div className="rounded-lg bg-green-100 p-3">
                  <Database className="h-6 w-6 text-green-600" />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    Clean Dataset
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Apply the default cleaning
                    operations and download
                    the cleaned CSV.
                  </p>

                  <button
                    onClick={
                      downloadCleanCSV
                    }
                    disabled={
                      downloadingCSV
                    }
                    className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Download size={18} />

                    {downloadingCSV
                      ? "Preparing CSV..."
                      : "Download Clean CSV"}
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Summary */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Validation Summary
            </h2>

            <div className="mt-4 rounded-lg bg-gray-50 p-5">

              <p className="text-gray-700">
                <strong>
                  {selectedDataset.originalName}
                </strong>{" "}
                contains{" "}
                <strong>
                  {selectedDataset.totalRows}
                </strong>{" "}
                rows and{" "}
                <strong>
                  {selectedDataset.totalColumns}
                </strong>{" "}
                columns.
              </p>

              <p className="mt-2 text-gray-700">
                The current validation score is{" "}
                <strong>
                  {selectedDataset.validationScore ??
                    0}
                  %
                </strong>
                .
              </p>

              <p className="mt-2 text-gray-700">
                A total of{" "}
                <strong>
                  {
                    selectedDataset
                      .validationIssues
                      ?.length
                  }
                </strong>{" "}
                validation issue(s) were
                detected.
              </p>

            </div>

          </div>
        </>
      )}

    </div>
  );
}