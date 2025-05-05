import { apiClient } from "../config";

export const getPdfManuals = async () => {
  const response = await apiClient.get(`/pdfManuals/get-pdf-manuals`);
  return response.data;
};

export const addPdfManuals = async (formData: any) => {
  const response = await apiClient.post(
    `/pdfManuals/add-pdf-manuals`,
    formData
  );
  return response.data;
};

export const deletePdfManuals = async (id: string) => {
  const response = await apiClient.delete(
    `/pdfManuals/delete-pdf-manuals/${id}`
  );
  return response.data;
};

export const updatePdfManualStatus = async (id: string, status: boolean) => {
  const response = await apiClient.patch(
    `/pdfManuals/update-pdf-manuals/${id}`,
    { status }
  );
  return response.data;
};

export const updatePdfManual = async (id: string, formData: any) => {
  const response = await apiClient.put(
    `/pdfManuals/update-pdf-manuals-form/${id}`,
    formData
  );
  return response.data;
};
