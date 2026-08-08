"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Brain,
  Database,
  Lightbulb,
} from "lucide-react";

import { toast } from "sonner";

import UploadDropzone from "@/components/upload/UploadDropzone";
import UploadProgress from "@/components/upload/UploadProgress";
import DatasetSummary from "@/components/upload/DatasetSummary";
import ValidationSummary from "@/components/upload/ValidationSummary";
import PreviewTable from "@/components/upload/PreviewTable";
import ValidationIssuesTable from "@/components/upload/ValidationIssuesTable";

import { uploadDataset } from "@/services/upload.service";

export default function UploadPage() {
  const [progress, setProgress] =
    useState(0);

  const [dataset, setDataset] =
    useState<any>(null);

  const [preview, setPreview] =
    useState<any[]>([]);

  const [validation, setValidation] =
    useState<any>(null);

  const [insights, setInsights] =
    useState<any>(null);

  const handleUpload = async (
    file: File
  ) => {
    try {
      setProgress(0);

      // Clear previous results
      setDataset(null);
      setPreview([]);
      setValidation(null);
      setInsights(null);

      const res =
        await uploadDataset(
          file,
          setProgress
        );

      // Dataset information
      setDataset(
        res.dataset
      );

      // Preview
      setPreview(
        res.preview || []
      );

      // Validation
      setValidation(
        res.validation || null
      );

      // AI Data Insights
      setInsights(
        res.insights || null
      );

      toast.success(
        "Dataset Uploaded Successfully"
      );
    } catch (error: any) {
      console.error(
        "Upload error:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Upload Failed"
      );

      setProgress(0);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">

      {/* ================================= */}
      {/* PAGE HEADER */}
      {/* ================================= */}

      <div>

        <h1 className="text-2xl font-bold sm:text-3xl">
          Upload Dataset
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Upload CSV or Excel files for AI
          validation and data quality
          analysis.
        </p>

      </div>

      {/* ================================= */}
      {/* UPLOAD AREA */}
      {/* ================================= */}

      <div className="w-full">

        <UploadDropzone
          onFileSelect={
            handleUpload
          }
        />

      </div>

      {/* ================================= */}
      {/* UPLOAD PROGRESS */}
      {/* ================================= */}

      {progress > 0 &&
        progress < 100 && (
          <div className="w-full">
            <UploadProgress
              progress={progress}
            />
          </div>
        )}

      {/* ================================= */}
      {/* DATASET SUMMARY */}
      {/* ================================= */}

      {dataset && (
        <div className="w-full overflow-hidden">
          <DatasetSummary
            dataset={dataset}
          />
        </div>
      )}

      {/* ================================= */}
      {/* VALIDATION SUMMARY */}
      {/* ================================= */}

      {validation && (
        <div className="w-full overflow-hidden">
          <ValidationSummary
            validation={validation}
          />
        </div>
      )}

      {/* ================================= */}
      {/* AI DATA INSIGHTS */}
      {/* ================================= */}

      {insights && (
        <div className="w-full space-y-5 sm:space-y-6">

          {/* Header */}

          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

            <div className="flex items-start gap-3 sm:items-center sm:gap-4">

              <div className="shrink-0 rounded-lg bg-purple-100 p-2.5 sm:p-3">
                <Brain className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
              </div>

              <div className="min-w-0">

                <h2 className="text-lg font-bold sm:text-xl">
                  AI Data Insights
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Automated analysis of your
                  dataset quality
                </p>

              </div>

            </div>

          </div>

          {/* Dataset Quality */}

          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">

              <Database className="h-5 w-5 shrink-0 text-purple-600" />

              <h3 className="text-base font-semibold sm:text-lg">
                Dataset Quality
              </h3>

            </div>

            <p className="mt-3 break-words text-xl font-bold sm:text-2xl">
              {insights.quality}
            </p>

            {insights.summary && (
              <p className="mt-3 break-words text-sm leading-7 text-gray-600 sm:text-base">
                {insights.summary}
              </p>
            )}

          </div>

          {/* Missing Data */}

          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">

              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />

              <h3 className="text-base font-semibold sm:text-lg">
                Missing Data
              </h3>

            </div>

            <p className="mt-3 break-words text-sm leading-7 text-gray-600 sm:text-base">
              {insights.missingData ||
                "No missing data information available."}
            </p>

          </div>

          {/* Potential Risks */}

          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">

              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />

              <h3 className="text-base font-semibold sm:text-lg">
                Potential Risks
              </h3>

            </div>

            {insights.risks?.length >
            0 ? (
              <ul className="mt-4 space-y-2">

                {insights.risks.map(
                  (
                    risk: string,
                    index: number
                  ) => (
                    <li
                      key={index}
                      className="break-words rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-700"
                    >
                      • {risk}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No major risks detected.
              </p>
            )}

          </div>

          {/* Recommended Improvements */}

          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">

            <div className="flex items-center gap-2">

              <Lightbulb className="h-5 w-5 shrink-0 text-blue-600" />

              <h3 className="text-base font-semibold sm:text-lg">
                Recommended Improvements
              </h3>

            </div>

            {insights.recommendations
              ?.length > 0 ? (
              <ul className="mt-4 space-y-2">

                {insights.recommendations.map(
                  (
                    recommendation: string,
                    index: number
                  ) => (
                    <li
                      key={index}
                      className="break-words rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-700"
                    >
                      • {recommendation}
                    </li>
                  )
                )}

              </ul>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No recommendations at this time.
              </p>
            )}

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* PREVIEW */}
      {/* ================================= */}

      {preview.length > 0 && (
        <div className="w-full overflow-hidden">

          <PreviewTable
            data={preview}
          />

        </div>
      )}

      {/* ================================= */}
      {/* VALIDATION ISSUES */}
      {/* ================================= */}

      {validation && (
        <div className="w-full overflow-hidden">

          <ValidationIssuesTable
            issues={
              validation.issues ||
              []
            }
          />

        </div>
      )}

    </div>
  );
}