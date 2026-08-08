"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";
import { cleanDataset } from "@/services/cleaning.service";

interface Dataset {
  _id: string;
  originalName: string;
  totalRows: number;
  totalColumns: number;
  validationScore?: number;
  validationIssues?: any[];
}

export default function CleaningPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const [selectedDataset, setSelectedDataset] =
    useState<Dataset | null>(null);

  const [cleanedRows, setCleanedRows] =
    useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [cleaning, setCleaning] = useState(false);

  const [summary, setSummary] =
    useState<any>(null);

  const [options, setOptions] = useState({
    removeDuplicates: true,
    replaceMissing: true,
    deleteInvalidRecords: false,
    standardizeCategories: true,
    normalizeData: false,
  });

  // =====================================
  // LOAD DATASETS
  // =====================================

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);

      const res = await api.get("/datasets");

      setDatasets(
        res.data.datasets || []
      );
    } catch (error) {
      console.error(
        "Failed to load datasets:",
        error
      );

      toast.error(
        "Failed to load datasets"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // SELECT DATASET
  // =====================================

  const handleDatasetChange = (
    datasetId: string
  ) => {
    if (!datasetId) {
      setSelectedDataset(null);
      setCleanedRows([]);
      setSummary(null);
      return;
    }

    const dataset =
      datasets.find(
        (item) =>
          item._id === datasetId
      );

    if (!dataset) {
      toast.error(
        "Dataset not found"
      );

      return;
    }

    setSelectedDataset(dataset);

    // Clear previous cleaning result
    setCleanedRows([]);
    setSummary(null);
  };

  // =====================================
  // TOGGLE OPTION
  // =====================================

  const toggleOption = (
    key: keyof typeof options
  ) => {
    setOptions((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  // =====================================
  // CLEAN DATASET
  // =====================================

  const handleClean = async () => {
    if (!selectedDataset) {
      toast.error(
        "Please select a dataset first"
      );

      return;
    }

    try {
      setCleaning(true);

      /*
       * We intentionally send an empty rows array.
       *
       * The backend will automatically read
       * the original CSV/XLSX file from:
       *
       * server/uploads/
       */

      const res = await cleanDataset(
        selectedDataset._id,
        [],
        selectedDataset.validationIssues ||
          [],
        options
      );

      if (
        !res?.result?.cleanedData
      ) {
        throw new Error(
          "No cleaned dataset returned"
        );
      }

      setCleanedRows(
        res.result.cleanedData
      );

      setSummary(
        res.result.summary
      );

      toast.success(
        "Dataset cleaned successfully"
      );
    } catch (error: any) {
      console.error(
        "Cleaning error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Cleaning failed"
      );
    } finally {
      setCleaning(false);
    }
  };

  // =====================================
  // DOWNLOAD CLEAN CSV
  // =====================================

  const downloadCSV = () => {
    if (!cleanedRows.length) {
      toast.error(
        "No cleaned dataset available"
      );

      return;
    }

    const columns = Object.keys(
      cleanedRows[0]
    );

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
      ...cleanedRows.map((row) =>
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
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement("a");

    link.href = url;

    const originalName =
      selectedDataset?.originalName ||
      "dataset.csv";

    const cleanName =
      originalName.replace(
        /\.[^/.]+$/,
        ""
      );

    link.download =
      `${cleanName}-cleaned.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    toast.success(
      "Clean CSV downloaded successfully"
    );
  };

  return (
    <div className="space-y-8">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div>
        <div className="flex items-center gap-3">

          <div className="rounded-lg bg-blue-100 p-3">
            <Sparkles className="h-6 w-6 text-blue-600" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Data Cleaning
            </h1>

            <p className="mt-1 text-gray-500">
              Clean and prepare your dataset
              before downloading it.
            </p>
          </div>

        </div>
      </div>

      {/* ================================= */}
      {/* DATASET SELECTOR */}
      {/* ================================= */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-semibold">
          Select Dataset
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading datasets...
          </p>
        ) : (
          <select
            value={
              selectedDataset?._id || ""
            }
            onChange={(event) =>
              handleDatasetChange(
                event.target.value
              )
            }
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">
              Select a dataset
            </option>

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

      {/* ================================= */}
      {/* SELECTED DATASET INFO */}
      {/* ================================= */}

      {selectedDataset && (
        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              File
            </p>

            <p className="mt-1 font-semibold">
              {selectedDataset.originalName}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Records
            </p>

            <p className="mt-1 text-2xl font-bold">
              {selectedDataset.totalRows}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Columns
            </p>

            <p className="mt-1 text-2xl font-bold">
              {selectedDataset.totalColumns}
            </p>
          </div>

        </div>
      )}

      {/* ================================= */}
      {/* CLEANING OPTIONS */}
      {/* ================================= */}

      {selectedDataset && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold">
            Cleaning Options
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Remove Duplicates */}
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-gray-50">

              <input
                type="checkbox"
                checked={
                  options.removeDuplicates
                }
                onChange={() =>
                  toggleOption(
                    "removeDuplicates"
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Remove Duplicates
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Remove identical rows from
                  the dataset.
                </p>
              </div>

            </label>

            {/* Replace Missing */}
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-gray-50">

              <input
                type="checkbox"
                checked={
                  options.replaceMissing
                }
                onChange={() =>
                  toggleOption(
                    "replaceMissing"
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Replace Missing Values
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Replace empty values using
                  calculated values.
                </p>
              </div>

            </label>

            {/* Delete Invalid */}
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-gray-50">

              <input
                type="checkbox"
                checked={
                  options.deleteInvalidRecords
                }
                onChange={() =>
                  toggleOption(
                    "deleteInvalidRecords"
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Delete Invalid Records
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Remove rows containing
                  validation errors.
                </p>
              </div>

            </label>

            {/* Standardize Categories */}
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-gray-50">

              <input
                type="checkbox"
                checked={
                  options.standardizeCategories
                }
                onChange={() =>
                  toggleOption(
                    "standardizeCategories"
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Standardize Categories
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Normalize inconsistent
                  category formatting.
                </p>
              </div>

            </label>

            {/* Normalize Data */}
            <label className="flex cursor-pointer gap-3 rounded-lg border p-4 hover:bg-gray-50">

              <input
                type="checkbox"
                checked={
                  options.normalizeData
                }
                onChange={() =>
                  toggleOption(
                    "normalizeData"
                  )
                }
                className="mt-1 h-4 w-4"
              />

              <div>
                <p className="font-medium">
                  Normalize Data
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Create normalized values for
                  numeric columns.
                </p>
              </div>

            </label>

          </div>

          {/* Clean Button */}
          <button
            onClick={handleClean}
            disabled={cleaning}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cleaning
              ? "Cleaning Dataset..."
              : "Clean Dataset"}
          </button>

        </div>
      )}

      {/* ================================= */}
      {/* CLEANING SUMMARY */}
      {/* ================================= */}

      {summary && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center gap-2">

            <CheckCircle2 className="h-5 w-5 text-green-600" />

            <h2 className="text-lg font-semibold">
              Cleaning Summary
            </h2>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Duplicates Removed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {summary.duplicatesRemoved ??
                  0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Missing Values Replaced
              </p>

              <p className="mt-1 text-2xl font-bold">
                {summary.missingValuesReplaced ??
                  0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Invalid Records Removed
              </p>

              <p className="mt-1 text-2xl font-bold">
                {summary.invalidRecordsRemoved ??
                  0}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Categories Standardized
              </p>

              <p className="mt-1 text-2xl font-bold">
                {summary.categoriesStandardized ??
                  0}
              </p>
            </div>

          </div>

          {summary.normalizedColumns
            ?.length > 0 && (
            <div className="mt-5 rounded-lg bg-blue-50 p-4">

              <p className="font-medium text-blue-800">
                Normalized Columns
              </p>

              <p className="mt-1 text-sm text-blue-700">
                {summary.normalizedColumns.join(
                  ", "
                )}
              </p>

            </div>
          )}

        </div>
      )}

      {/* ================================= */}
      {/* CLEANED DATASET PREVIEW */}
      {/* ================================= */}

      {cleanedRows.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>
              <h2 className="text-lg font-semibold">
                Cleaned Dataset Preview
              </h2>

              <p className="text-sm text-gray-500">
                Review the cleaned data before
                downloading.
              </p>
            </div>

            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700"
            >
              <Download size={18} />

              Download Clean CSV
            </button>

          </div>

          <div className="overflow-x-auto rounded-lg border">

            <table className="min-w-full text-sm">

              <thead className="bg-gray-100">

                <tr>
                  {Object.keys(
                    cleanedRows[0]
                  ).map(
                    (column) => (
                      <th
                        key={column}
                        className="whitespace-nowrap px-4 py-3 text-left font-semibold"
                      >
                        {column}
                      </th>
                    )
                  )}
                </tr>

              </thead>

              <tbody>

                {cleanedRows
                  .slice(0, 20)
                  .map(
                    (
                      row,
                      rowIndex
                    ) => (
                      <tr
                        key={rowIndex}
                        className="border-t hover:bg-gray-50"
                      >
                        {Object.keys(
                          cleanedRows[0]
                        ).map(
                          (column) => (
                            <td
                              key={column}
                              className="whitespace-nowrap px-4 py-3"
                            >
                              {String(
                                row[column] ??
                                  ""
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}

              </tbody>

            </table>

          </div>

          <p className="mt-3 text-sm text-gray-500">
            Showing up to 20 cleaned rows.
            Total cleaned rows:{" "}
            {cleanedRows.length}
          </p>

        </div>
      )}

    </div>
  );
}