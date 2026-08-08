interface ValidationIssue {
  type: string;
  row: number;
  column: string;
  message: string;
}

interface Props {
  issues: ValidationIssue[];
}

export default function ValidationIssuesTable({
  issues,
}: Props) {
  if (!issues) return null;

  return (
    <div className="mt-8 rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <h2 className="text-xl font-semibold">
          Validation Issues
        </h2>
      </div>

      {issues.length === 0 ? (
        <div className="p-10 text-center">
          <div className="text-6xl">✅</div>

          <h3 className="mt-4 text-2xl font-bold text-green-600">
            No Issues Found
          </h3>

          <p className="mt-2 text-gray-500">
            Your dataset passed all validation checks.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Row</th>
                <th className="px-4 py-3 text-left">Column</th>
                <th className="px-4 py-3 text-left">Message</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                      High
                    </span>
                  </td>

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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}