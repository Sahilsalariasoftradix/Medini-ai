export enum EnOnboardingStatus {
  STATUS_0 = 0,
  STATUS_1 = 1,
  STATUS_2 = 2,
}

export enum EnVerifiedStatus {
  UNVERIFIED = 0,
  VERIFIED = 1,
}
export enum EnFirebaseCollections {
  USERS = "users",
  COUNTERS = "counters",
  REASONS = "reasons",
  APPOINTMENTS = "appointments",
  CONTACTS = "contacts",
}
export enum EnAppointmentOptions {
  APPOINTMENT_1 = "15",
  APPOINTMENT_2 = "30",
  APPOINTMENT_3 = "45",
}
export enum EnTimeRangeOptions {
  RANGE_WEEK = "week",
  RANGE_MONTH = "month",
}
export enum EnCountryOptions {
  COUNTRY_1 = "country1",
  COUNTRY_2 = "country2",
  COUNTRY_3 = "country3",
}

export enum EnCityOptions {
  CITY_1 = "City1",
  CITY_2 = "City2",
  CITY_3 = "City3",
}

export enum EnUserBookingsOptions {
  MANUAL = 0,
  AUTO = 1,
}

export enum EnCallPurpose {
  CANCEL = 0,
  BOOK = 1,
  RESCHEDULE = 2,
  REQUESTINFO = 3,
}
export enum EnBookings {
  Available = 0,
  Active = 1,
  Cancel = 2,
  Unconfirmed = 3,
  Edit = 4,
  Booked = 5,
  AddAppointment = 6,
  ClearAppointment = 7,
}
export enum EnBookingStatus {
  Available = "available",
  Active = "active",
  Cancelled = "cancelled",
}

export enum EStaticID {
  ID = 1,
  ID2 = 2,
}
export enum EnCancelAppointment {
  DoctorSick = "Doctor is sick",
  PatientSick = "Patient is sick",
  Emergency = "Emergency",
  PersonalReason = "Personal reasons",
  DoubleBooked = "Double booked",
  TravelIssues = "Travel issues",
  ClinicClosed = "Clinic is closed",
  NoShow = "Patient did not show up",
}
export enum EnAvailability {
  WEEK = "week",
  MONTH = "month",
  DAY = "day",
}
export enum EnSocialLogin {
  GOOGLE = "google",
  APPLE = "apple.com",
}
export enum EnCallPurposeOptions {
  CANCEL = "Cancel Appointment",
  BOOK = "Book Appointment",
  RESCHEDULE = "Reschedule Appointment",
  REQUESTINFO = "Request Info",
  INFORMPATIENT = "Inform Patient",
}
export enum EnCallPurposeOptionsValues {
  CANCEL = "CANCEL_APPOINTMENT",
  BOOK = "BOOK_APPOINTMENT",
  RESCHEDULE = "RESCHEDULE_APPOINTMENT",
  REQUESTINFO = "REQUEST_INFO",
  INFORMPATIENT = "INFORM_PATIENT",
}
export enum EnShowPurposeUI {
  SCHEDULED = "Scheduled",
  FAILED = "Failed",
  CANCELLED = "Cancel",
  UNCONFIRMED = "Unconfirmed",
  EDIT = "Edit",
  BOOKED = "Booked",
  ADD_APPOINTMENT = "Add Appointment",
  CLEAR_APPOINTMENT = "Clear Appointment",
  RESCHEDULED = "Reschedule",
  REQUESTINFO = "Request Info",
}
export enum EnUserCreationStatus {
  SUCCESS = "User created successfully",
  FAILED = "User creation failed",
}
export enum EnStepProgress {
  TOTAL_STEPS = 4,
}
export enum EnBookingType {
  IN_PERSON = "in-person",
  PHONE = "phone",
  BOTH = "both",
}
export enum EnBookingDuration {
  DURATION_15 = "15",
  DURATION_30 = "30",
  DURATION_45 = "45",
  DURATION_60 = "60",
}
export enum EnGetCallHistory {
  COMPLETED = "completed",
  PENDING = "pending",
 
}
