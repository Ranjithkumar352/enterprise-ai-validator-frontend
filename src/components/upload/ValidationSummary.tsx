interface Props {
  validation: any;
}

export default function ValidationSummary({
  validation,
}: Props) {
  if (!validation) return null;

  return (
    <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Validation Result
      </h2>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-gray-500">
            Data Quality Score
          </p>

          <h1 className="text-5xl font-bold text-green-600">
            {validation.score}%
          </h1>
        </div>

        <div className="text-right">
          <p>Total Issues</p>

          <h2 className="text-3xl font-bold text-red-500">
            {validation.issues.length}
          </h2>
        </div>
      </div>
    </div>
  );
}