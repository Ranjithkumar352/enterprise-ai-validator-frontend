"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function UploadDropzone({
  onFileSelect,
}: Props) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          [".xlsx"],
      },
    });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mx-auto mb-4 h-14 w-14 text-blue-600" />

      <h2 className="text-xl font-semibold">
        Drag & Drop CSV/XLSX File
      </h2>

      <p className="mt-2 text-gray-500">
        or click here to browse
      </p>
    </div>
  );
}