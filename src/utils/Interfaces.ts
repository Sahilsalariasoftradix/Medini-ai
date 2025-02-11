

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
  companyDetails: {
    businessName: string;
    address: string;
    apartmentSuite: string;
    city: string;
    country: string;
    appointment: boolean;
    maxAppointmentTime: string;
  };
  handleBookings: number | null;
  [key: string]: any; // For dynamic fields if needed
}

export interface IStepFormContextType {
  currentStep: number;
  userDetails: IUserDetails;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  updateUserDetails: (updates: Partial<IUserDetails>) => void;
  resetForm: () => void;
}

export interface IHeaderProps {
  isMobile: boolean;
  open: boolean;
  toggleDrawer: () => void;
  pageName: string;
}
