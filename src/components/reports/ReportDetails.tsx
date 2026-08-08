"use client";

interface ReportDetailsProps {
  report: any;
  onClose: () => void;
}

export default function ReportDetails({
  report,
  onClose,
}: ReportDetailsProps) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">
              Validation Report
            </h2>

            <p className="text-sm text-gray-500">
              {report.originalName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border px-3 py-2 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Rows
            </p>

            <p className="text-2xl font-bold">
              {report.totalRows}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Columns
            </p>

            <p className="text-2xl font-bold">
              {report.totalColumns}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Score
            </p>

            <p className="text-2xl font-bold text-green-600">
              {report.validationScore}%
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Issues
            </p>

            <p className="text-2xl font-bold text-red-600">
              {report.validationIssues?.length || 0}
            </p>
          </div>
        </div>

        <div className="p-6 pt-0">
          <h3 className="mb-4 text-lg font-semibold">
            Validation Issues
          </h3>

          {!report.validationIssues?.length ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-lg font-semibold text-green-600">
                No validation issues found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                This dataset passed all available validation checks.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Type
                    </th>

                    <th className="px-4 py-3 text-left">
                      Row
                    </th>

                    <th className="px-4 py-3 text-left">
                      Column
                    </th>

                    <th className="px-4 py-3 text-left">
                      Message
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.validationIssues.map(
                    (issue: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t"
                      >
                        <td className="px-4 py-3">
                          {issue.type}
                        </td>

                        <td className="px-4 py-3">
                          {issue.row}
                        </td>

                        <td className="px-4 py-3">
                          {issue.column}
                        </td>

                        <td className="px-4 py-3">
                          {issue.message}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}