import { apiClient } from "../config";

export const getDistributors = async () => {
  try {
    const response = await apiClient.get("/admin/get-distributors");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch distributors:", error);
    throw error;
  }
};

export const toggleDistributorStatus = async (id: string) => {
  return apiClient.patch(`/admin/toggle-distributor-status/${id}`);
};

export const deleteDistributor = async (id: string) => {
  try {
    const response = await apiClient.delete(`/admin/distributors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete distributor:", error);
    throw error;
  }
};

export const addDistributor = async (data: {
  distributorName: string;
  state: string;
  salesperson1?: string;
  salesperson2?: string;
  salesperson3?: string;
  Status?: string;
}) => {
  try {
    const response = await apiClient.post("/admin/add-distributor", data);
    return response.data;
  } catch (error) {
    console.error("Failed to add distributor:", error);
    throw error;
  }
};

export const updateDistributor = async (id: string, updatedData: any) => {
  try {
    const response = await apiClient.put(`/admin/distributors/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update distributor:", error);
    throw error;
  }
};

