import { EnBookings } from "../utils/enums";

export type TimeSlot = {
  time: string;
  status: EnBookings;
};

export interface DaySchedule {
  day: string;
  date: number;
  fullDate: string;
  availability: {
    isAvailable: boolean;
    slots: {
      time: string;
      status: EnBookings;
      isDisabled?: boolean;
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
