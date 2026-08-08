import api from "@/lib/axios";

export const getValidations = async () => {
  const res = await api.get(
    "/datasets/validations"
  );

  return res.data;
};