import {
  IAvailabilityRequest,
  IAvailabilitySpecific,
  IBooking,
  ICall,
  ICompanyDetails,
  IGetAvailability,
  IUpdateBooking,
  IUser,
  TGetBooking,
} from "../utils/Interfaces";
import apiClient from "./apiClient";

// Company details posting API
export const postCompanyDetails = async (companyData: ICompanyDetails) => {
  try {
    const response = await apiClient.post("company", companyData);
    return response.data;
  } catch (error) {
    console.error("Error posting company details:", error);
    throw error;
  }
};
// Posting the availability in general API
export const postAvailabilityGeneral = async (
  availabilityData: IAvailabilityRequest
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "availability/general",
      availabilityData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting availability data:", error);
    throw error;
  }
};
// Changing the availability in specific dates API
export const postAvailabilitySpecific = async (
  availabilityData: IAvailabilitySpecific
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "availability/specific",
      availabilityData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting specific availability data:", error);
    throw error;
  }
};
// Changing the unavailability in specific dates API
export const postUnAvailabilitySpecific = async (
  availabilityData: IAvailabilitySpecific
): Promise<any> => {
  try {
    const response = await apiClient.post(
      "unavailability/specific",
      availabilityData
    );
    return response.data;
  } catch (error) {
    console.error("Error posting unavailability data:", error);
    throw error;
  }
};
// Getting the company unique number API
export const getCompanyUniqueNumber = async (uid: number) => {
  try {
    const response = await apiClient.get(`company/phone/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Error getting company details:", error);
    throw error;
  }
};
// Getting the availabilities API
export const getAvailability = async (data: IGetAvailability) => {
  try {
    const resp = await apiClient.get(
      `availability?user_id=${data.user_id}&date=${data.date}&view=${data.range}`
    );
    return resp.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Getting the bookings API
export const getBookings = async (bookings: TGetBooking) => {
  try {
    const resp = await apiClient.get(
      `bookings?user_id=${bookings.user_id}&date=${bookings.date}&range=${bookings.range}`
    );
    return resp.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
// Updating a booking API
export const updateBooking = async (booking: IUpdateBooking) => {
  try {
    const resp = await apiClient.post(`bookings/update`, booking);
    return resp.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.error || "Booking update failed.");
  }
};
// Creating a booking API
export const createBooking = async (booking: IBooking) => {
  try {
    const resp = await apiClient.post(`booking`, booking);
    return resp.data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.error || "Booking creation failed.");
  }
};
// Cancelling the booking API
export const cancelBooking = async (bookingID: number) => {
  try {
    const bookingId = {
      booking_id: bookingID,
    };
    const resp = await apiClient.post("bookings/cancel", bookingId);
    return resp.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Creating the new user API
export const createUser = async (userData: IUser) => {
  try {
    const response = await apiClient.post("users/create", userData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.response?.data?.error || "User creation failed.");
  }
};

// Company details posting API
export const createCall = async (callData: ICall) => {
  try {
    const response = await apiClient.post("outbound-call-grok", callData);
    return response.data;
  } catch (error) {
    console.error("Error posting company details:", error);
    throw error;
  }
};
