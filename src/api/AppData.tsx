import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const createBadgeWithCSV = async (formValues, file) => {
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

  const response = await axios.post(
    `${BASE_URL}/api/create-badge-with-csv`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getAllSubCategoriesWithBadges = async () => {
  const response = await axios.get(
    `${BASE_URL}/api/getAllSubCategoriesWithBadges`
  );
  return response.data;
};

export const updateBadge = async (id: any, is_locked: any) => {
  const response = await axios.patch(`${BASE_URL}/api/updatebadge/${id}`, {
    is_locked,
  });
  return response.data;
};

export const deleteBadge = async (id: any) => {
  const response = await axios.delete(`${BASE_URL}/api/badge/${id}`);
  return response.data;
};
