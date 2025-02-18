import { ICompanyDetails } from "../utils/Interfaces";
import apiClient from "./apiClient";

export const postCompanyDetails = async (companyData: ICompanyDetails) => {
  try {
    const response = await apiClient.post("company", companyData);
    return response.data;
  } catch (error) {
    console.error("Error posting company details:", error);
    throw error;
  }
};
export const getCompanyUniqueNumber = async (uid: number) => {
  try {
    const response = await apiClient.get(`company/phone/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error getting company details:", error);
    throw error;
  }
};
