import { apiClient } from "../config";

export const createBadgeWithCSV = async (formValues: any, file: any) => {
  const formData = new FormData();

  // Add fields
  formData.append("name", formValues.name);
  formData.append("icon", formValues.icon);
  formData.append("is_locked", formValues.is_locked); // true/false
  formData.append("unlock_condition", formValues.unlock_condition);
  formData.append("type", formValues.type);
  formData.append("category", formValues.category);
  formData.append("AppCategory", formValues.AppCategory);
  formData.append("condition_type", formValues.condition_type);

  // Add file
  formData.append("csvFile", file); // file should be a File object

  const response = await apiClient.post(`/create-badge-with-csv`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllSubCategoriesWithBadges = async () => {
  const response = await apiClient.get(`/getAllSubCategoriesWithBadges`);
  return response.data;
};

export const updateBadge = async (id: any, is_locked: any) => {
  const response = await apiClient.patch(`/updatebadge/${id}`, {
    is_locked,
  });
  return response.data;
};

export const deleteBadge = async (id: any) => {
  const response = await apiClient.delete(`/badge/${id}`);
  return response.data;
};
