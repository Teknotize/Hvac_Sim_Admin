import { apiClient } from "../config";

export const getHomeHeaderData = async () => {
  const response = await apiClient.get(`/cms/get-all-homeheader`);
  return response.data;
};

export const updateHomeHeaderData = async (homeHeaderData: any) => {
  const response = await apiClient.post(
    `/cms/update-homeheader`,
    homeHeaderData
  );
  return response.data;
};

export const getWhatsNew = async () => {
  const response = await apiClient.get(`/cms/get-all-whatsnew`);
  return response.data.data;
};
export const updateWhatsNewData = async (whatsNewData: any) => {
  const response = await apiClient.post(`/cms/update-whatsnew`, whatsNewData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
