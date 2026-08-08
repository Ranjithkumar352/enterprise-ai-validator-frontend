import api from "@/lib/axios";

export const uploadDataset = async (
  file: File,
  onUploadProgress?: (progress: number) => void
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },

    onUploadProgress: (event) => {
      if (!event.total) return;

      const percent = Math.round(
        (event.loaded * 100) / event.total
      );

      onUploadProgress?.(percent);
    },
  });

  return response.data;
};