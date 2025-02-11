import { EnBookings } from "../utils/enums";

export type TimeSlot = {
  time: string;
  status: EnBookings;
};

export type DaySchedule = {
  date: number;
  day: string;
  slots: TimeSlot[];
  availability: DayAvailability;
};

export type DayAvailability = {
  isAvailable: boolean;
  slots: TimeSlot[];
}

export type StatusCounts = {
  active: number;
  cancelled: number;
  unconfirmed: number;
  available: number;
};
