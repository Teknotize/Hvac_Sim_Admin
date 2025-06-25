import { apiClient } from "../config";

export const deleteContactUserById = async (id: any) => {
  const response = await apiClient.delete(`/admin/delete-user/${id}`);
  return response.data;
};
export const updateSubscriptionLevel = async (id: any) => {
  const response = await apiClient.put(
    `/contact/crmuser/togglesubscriptionlevel/${id}`
  );
  return response.data;
};

export const unsubscribeContactUserById = async (id: any) => {
  return apiClient.put(`/admin/unsubscribe-contact/${id}`);
};