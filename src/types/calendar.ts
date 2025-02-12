import { EnBookings } from "../utils/enums";

export type TimeSlot = {
  time: string;
  status: EnBookings;
};

export interface DaySchedule {
  day: string;
  date: number;
  availability: {
    isAvailable: boolean;
    slots: {
      time: string;
      status: EnBookings;
    }[];
  };
  appointments?: {
    id: string;
    startTime: string;
    endTime: string;
    length: string;
    status: string;
  }[];
}

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
