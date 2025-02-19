import { Dispatch, SetStateAction } from "react";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface UserFormValues {
  email: string;
  password: string;
  displayName: string;
}

//*  Step form
export interface IUserDetails {
  reasonForUsing: string;
  reasonForUsingStep: string;
  calendarName: string;
  collaborators: string[]; // For invited collaborators
  companyDetails: ICompanyDetails;
  handleBookings: number | null;
  [key: string]: any; // For dynamic fields if needed
}
export interface ICompanyDetails {
  company_name: string;
  address_line_one: string;
  address_line_two: string;
  city: string;
  country: string;
  in_person_appointments: boolean;
  max_appointment_time: number;
}
export interface IStepFormContextType {
  currentStep: number;
  userDetails: IUserDetails;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateUserDetails: (updates: Partial<IUserDetails>) => void;
  resetForm: () => void;
  setCompanyId: Dispatch<SetStateAction<number | null>>;
  companyId: number | null;
  companyNumber: string;
  setCompanyNumber: Dispatch<SetStateAction<string>>;
}

export interface IHeaderProps {
  isMobile: boolean;
  open: boolean;
  toggleDrawer: () => void;
  pageName: string;
}
export interface INewContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
export interface IFilm {
  title: string;
  year: number;
}

export interface IAvailability {
  day_of_week: string;
  phone_start_time: string;
  phone_end_time: string;
  in_person_start_time: string;
  in_person_end_time: string;
  break_start_time: string;
  break_end_time: string;
}

export interface IAvailabilityRequest {
  user_id: number;
  availabilities: IAvailability[];
}
