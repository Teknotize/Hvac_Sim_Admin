import { apiClient } from "../config";
import { InquiryChartResponse, ProductInquiryChartResponse } from "../utils/types";

// ✅ Dashboard summary
export const getsActiveUser = async () => {
  try {
    const response = await apiClient.get("/admin/dashboard-summary");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data");
    throw error;
  }
};

// ✅ Weekly inquiries API
export const getWeeklyInquiries = async (): Promise<InquiryChartResponse> => {
  try {
    const response = await apiClient.get("/admin/inquiry-summary");
    return response.data.data; // because your response shape is { success: true, data: {...} }
  } catch (error) {
    console.error("Failed to fetch weekly inquiries");
    throw error;
  }
};

export const getWeeklyProductInquiries = async (): Promise<ProductInquiryChartResponse> => {
  try {
    const response = await apiClient.get("/admin/product-inquiries-bar");
    return response.data.data; // shape: { currentMonth: [...], lastMonth: [...] }
  } catch (error) {
    console.error("Failed to fetch product inquiries by product name");
    throw error;
  }
};

export const getUserActivitySummary = async () => {
  try {
    const response = await apiClient.get("/admin/user-activity-summary");
    return response.data.data; // Because your response shape is { success: true, data: {...} }
  } catch (error) {
    console.error("Failed to fetch user activity summary");
    throw error;
  }
};