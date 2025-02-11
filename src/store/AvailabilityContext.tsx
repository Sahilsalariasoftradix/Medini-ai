import { createContext, useContext, useState, ReactNode } from "react";
import { DaySchedule } from "../types/calendar";
import { EnBookings } from "../utils/enums";
import dayjs from "dayjs";

interface AvailabilityContextType {
  days: DaySchedule[];
  dateRange: [Date | null, Date | null];
  setDateRange: (range: [Date | null, Date | null]) => void;
  updateSlotStatus: (
    dayIndex: number,
    slotIndex: number,
    newStatus: EnBookings
  ) => void;
  toggleDayAvailability: (dayIndex: number) => void;
  generateDaysFromRange: (startDate: Date | null, endDate: Date | null) => void;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(
  undefined
);

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`,
        status: EnBookings.Available,
      });
    }
  }
  return slots;
};

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    dayjs().add(6, "day").toDate(),
  ]);
  const [days, setDays] = useState<DaySchedule[]>([]);

  const generateDaysFromRange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate || !endDate) return;

    const newDays: DaySchedule[] = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isSameOrBefore(end)) {
      const dayOfWeek = currentDate.day();
      const isAvailable = dayOfWeek !== 0 && dayOfWeek !== 6;

      newDays.push({
        day: currentDate.format("ddd"),
        date: currentDate.date(),
        availability: {
          isAvailable,
          slots: generateTimeSlots(),
        },
      });
      currentDate = currentDate.add(1, "day");
    }

    setDays(newDays);
  };

  const updateSlotStatus = (
    dayIndex: number,
    slotIndex: number,
    newStatus: EnBookings
  ) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      newDays[dayIndex].availability.slots[slotIndex].status = newStatus;
      return newDays;
    });
  };

  const toggleDayAvailability = (dayIndex: number) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      newDays[dayIndex].availability.isAvailable =
        !newDays[dayIndex].availability.isAvailable;
      return newDays;
    });
  };

  return (
    <AvailabilityContext.Provider
      value={{
        days,
        dateRange,
        setDateRange,
        updateSlotStatus,
        toggleDayAvailability,
        generateDaysFromRange,
      }}
    >
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error(
      "useAvailability must be used within an AvailabilityProvider"
    );
  }
  return context;
}
