import {
  IAvailabilityRequest,
  IAvailabilitySpecific,
  IBooking,
  IBookingIds,
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

export const clearBooking = async (bookingIds: IBookingIds) => {
  try {
    const response = await apiClient.post(`bookings/clear`, bookingIds);
    return response.data;
  } catch (error: any) {
    console.error("Error clearing booking:", error);
    throw new Error(error.response?.data?.error || "Booking clearing failed.");
  }
};

// Getting the bookings by user API
export const getBookingsByUser = async (
  userId: number,
  phoneNumber: string
) => {
  try {
    const response = await apiClient.get(
      `bookings/user?user_id=${userId}&phone=${phoneNumber}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting bookings by user:", error);
    throw error;
  }
};

export const getCallHistoryData = async (
  userId: number, 
  status: string,
  offset: number = 0,
  limit: number = 10,
  search: string = ""
) => {
  try {
    const response = await apiClient.get(
      `call-history?user_id=${userId}&status=${status}&offset=${offset}&limit=${limit}${search ? `&search=${search}` : ''}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting call history:", error);
    throw error;
  }
};
export const deleteCall = async (callId: number) => {
  try {
    const response = await apiClient.delete(`outbound-call-grok`, {
      data: {
        call_id: callId,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error deleting call:", error);
    throw error;
  }
};
export const getCompanyDetails = async (page = 1) => {
  try {
    const response = await apiClient.get(`company/users?page=${page}&limit=20`);
    return response.data;
  } catch (error) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};

export const sendVerificationCode = async (
  phoneNumber: string,
  customerName: string
) => {
  try {
    const response = await apiClient.post(`customer/send-verification-code`, {
      phoneNumber: phoneNumber,
      customerName: customerName,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

export const verifyVerificationCode = async (
  phoneNumber: string,
  verificationCode: string
) => {
  try {
    const response = await apiClient.post(`customer/verify-code`, {
      phoneNumber: phoneNumber,
      code: verificationCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying verification code:", error);
    throw error;
  }
};
export const getCustomerBookings = async (
  companyId: number,
  phoneNumber: string
) => {
  try {
    const response = await apiClient.get(
      `bookings/customer?phone=${phoneNumber}&company_id=${companyId}`
    );
    return response.data.bookings;
  } catch (error) {
    console.error("Error getting customer bookings:", error);
    throw error;
  }
};
