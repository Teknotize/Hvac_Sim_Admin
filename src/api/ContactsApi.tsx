import { apiClient } from "../config";

export const deleteContactUserById = async (id: any) => {
  const response = await apiClient.delete(`/admin/delete-user/${id}`);
  return response.data;
};
