import api from "@/lib/axios";

export const getReports = async () => {
  const res = await api.get("/datasets/reports");
  return res.data;
};