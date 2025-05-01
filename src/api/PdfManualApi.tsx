import { apiClient } from "../config";

export const getPdfManuals = async () => {
  const response = await apiClient.get(`/pdfManuals/get-pdf-manuals`);
  return response.data;
};
