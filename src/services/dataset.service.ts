import api from "@/lib/axios";

export const getDatasets = async () => {
  const response = await api.get("/datasets");
  return response.data;
};

export const deleteDataset = async (id: string) => {
  const response = await api.delete(`/datasets/${id}`);
  return response.data;
};