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
  REASONS = "reasons",
  APPOINTMENTS = "Appointments",
}
export enum EnAppointmentOptions {
  APPOINTMENT_1 = "appointment1",
  APPOINTMENT_2 = "appointment2",
  APPOINTMENT_3 = "appointment3",
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
  Cancelled = 2,
  Unconfirmed = 3,
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
