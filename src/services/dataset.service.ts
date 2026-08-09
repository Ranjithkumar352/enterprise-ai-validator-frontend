import api from "@/lib/axios";

// =====================================
// Get All Datasets
// =====================================

export const getDatasets = async () => {
  const response =
    await api.get("/datasets");

  return response.data;
};

// =====================================
// Get Single Dataset
// =====================================

export const getDataset = async (
  id: string
) => {
  const response =
    await api.get(
      `/datasets/${id}`
    );

  return response.data;
};

// =====================================
// Download CSV
// =====================================

export const downloadDatasetCSV =
  async (
    id: string
  ) => {
    const response =
      await api.get(
        `/datasets/${id}/csv`,
        {
          responseType: "blob",
        }
      );

    const blob =
      new Blob(
        [response.data],
        {
          type:
            "text/csv;charset=utf-8",
        }
      );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "dataset.csv";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.URL.revokeObjectURL(
      url
    );
  };

// =====================================
// Delete Dataset
// =====================================

export const deleteDataset = async (
  id: string
) => {
  const response =
    await api.delete(
      `/datasets/${id}`
    );

  return response.data;
};