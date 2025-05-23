import { apiClient } from "../config";

export const updateProfile = async (formData: any) => {
  const response = await apiClient.patch(
    `/admin/update-profile-pic`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
