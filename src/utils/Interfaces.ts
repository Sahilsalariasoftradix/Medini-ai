import dayjs, { Dayjs } from "dayjs";
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
export interface ISlotBookingFormProps {
  control: any;
  errors: any;
  openContactSearch: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  options: readonly IFilm[];
  loading: { input: boolean };
  shouldDisableDate: (date: Dayjs) => boolean;
  selectedDate: dayjs.Dayjs;
}

export interface IAvailabilityRequest {
  user_id: number;
  availabilities: IAvailability[];
}
export interface IAvailabilitySpecific {
  user_id: number;
  date: string,
  phone_start_time: string,
  phone_end_time: string,
  in_person_start_time: string,
  in_person_end_time: string
}
export interface IAvailabilityPayload {
  user_id: number;
  date: string;
  phone_start_time: string;
  phone_end_time: string;
  in_person_start_time: string;
  in_person_end_time: string;
  break_start_time?:string;
  break_end_time?:string;
}
export interface IDayAvailability {
  date: string;
  phone_start_time: string | null;
  phone_end_time: string | null;
  in_person_start_time: string | null;
  in_person_end_time: string | null;
}
export interface IDayHeaderProps {
  day: string;
  date: number;
  onEditAvailability: () => void;
  onClearDay: () => void;
  isAvailable: boolean;
  isToday: boolean;
}
export interface ISchedule {
  day_of_week: string;
  phone_start_time: string;
  phone_end_time: string;
  in_person_start_time: string;
  in_person_end_time: string;
  break_start_time: string;
  break_end_time: string;
}
export interface ISelectedCell {
  dayIndex: number;
  type: "phone" | "in_person" | "break";
  isStart: boolean;
}
export interface IScheduleType {
  icon: string;
  bgColor: string;
}

export interface IGetAvailability {
  user_id: number;
  date: string;
  range: "week" | "month" | "day";
}
// Interface for GetAvailability extends from IGetRangeData
export type TGetBooking = IGetAvailability;
export interface IContact {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  user_id?:string
}

export interface IBooking {
  user_id?:number
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  start_time:string;
  end_time:string;
  details:string;
  date:string;
}
export interface IBookingResponse {
  booking_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  date: string;
  start_time: string;
  end_time: string;
  details: string;
  user_id: number;
  status: string;
}
export interface IAppointment {
  id: string;
  startTime: string;
  status: string;
  length: string;
  parentId?: string;
}


export type IGetContacts = IContact[];
