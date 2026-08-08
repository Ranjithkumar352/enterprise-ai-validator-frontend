import api from "@/lib/axios";

export const getAnalytics = async (
  datasetId: string
) => {
  const res = await api.get(
    `/analytics/${datasetId}`
  );

  return res.data;
};