import api from "@/lib/axios";

export interface CleaningOptions {
  removeDuplicates: boolean;
  replaceMissing: boolean;
  deleteInvalidRecords: boolean;
  standardizeCategories: boolean;
  normalizeData: boolean;
}

export const cleanDataset = async (
  datasetId: string,
  rows: any[],
  issues: any[],
  options: CleaningOptions
) => {
  const res = await api.post("/cleaning", {
    datasetId,
    rows,
    issues,
    options,
  });

  return res.data;
};