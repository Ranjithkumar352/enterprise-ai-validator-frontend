interface Props {
  data: any[];
}

export default function PreviewTable({
  data,
}: Props) {
  if (!data.length) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-t"
            >
              {headers.map((header) => (
                <td
                  key={header}
                  className="px-4 py-3"
                >
                  {String(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}