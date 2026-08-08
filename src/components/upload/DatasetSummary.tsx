interface Props {
  dataset: any;
}

export default function DatasetSummary({
  dataset,
}: Props) {
  if (!dataset) return null;

  return (
    <div className="mt-8 grid gap-6 md:grid-cols-4">
      <SummaryCard
        title="Rows"
        value={dataset.totalRows}
      />

      <SummaryCard
        title="Columns"
        value={dataset.totalColumns}
      />

      <SummaryCard
        title="File Type"
        value={dataset.fileType}
      />

      <SummaryCard
        title="Size"
        value={`${(
          dataset.fileSize / 1024
        ).toFixed(2)} KB`}
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        {value}
      </h2>
    </div>
  );
}