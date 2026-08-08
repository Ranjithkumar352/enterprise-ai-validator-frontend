import api from "@/lib/axios";

export const getAnalytics = async () => {
  const res = await api.get("/analytics");

  return res.data;
};