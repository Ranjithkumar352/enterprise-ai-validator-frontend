"use client";

import { useEffect, useState } from "react";

import { getValidations } from "@/services/validation.service";

export default function ValidationPage() {

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getValidations();
    setItems(res.validations);
  };

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold">
          Validation Results
        </h1>

        <p className="text-gray-500">
          Review all validated datasets.
        </p>

      </div>

      <div className="overflow-hidden rounded-xl border bg-white">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left">
                Dataset
              </th>

              <th className="px-4 py-3 text-left">
                Score
              </th>

              <th className="px-4 py-3 text-left">
                Issues
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-left">
                Uploaded
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item) => (

              <tr
                key={item._id}
                className="border-t"
              >

                <td className="px-4 py-3">
                  {item.originalName}
                </td>

                <td className="px-4 py-3 font-semibold text-green-600">
                  {item.validationScore}%
                </td>

                <td className="px-4 py-3">
                  {item.validationIssues.length}
                </td>

                <td className="px-4 py-3">

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      item.validationStatus ===
                      "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.validationStatus}
                  </span>

                </td>

                <td className="px-4 py-3">
                  {new Date(
                    item.createdAt
                  ).toLocaleDateString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}