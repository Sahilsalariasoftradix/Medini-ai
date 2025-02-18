import { EnAppointmentOptions, EnCityOptions, EnCountryOptions } from "./enums";

export const APPOINTMENT_OPTIONS = [
  { value: EnAppointmentOptions.APPOINTMENT_1, label: '15' },
  { value: EnAppointmentOptions.APPOINTMENT_2, label: '30' },
  { value: EnAppointmentOptions.APPOINTMENT_3, label: '45' },
];

export const COUNTRY_OPTIONS = [
  { value: EnCountryOptions.COUNTRY_1, label: "country 1" },
  { value: EnCountryOptions.COUNTRY_2, label: "country 2" },
  { value: EnCountryOptions.COUNTRY_3, label: "country 3" },
];

export const CITY_OPTIONS = [
  { value: EnCityOptions.CITY_1, label: "city 1" },
  { value: EnCityOptions.CITY_2, label: "city 2" },
  { value: EnCityOptions.CITY_3, label: "city 3" },
];
