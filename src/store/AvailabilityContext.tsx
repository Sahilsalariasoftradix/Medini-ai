import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { DaySchedule } from "../types/calendar";
import { EnAvailability, EnBookings, EStaticID } from "../utils/enums";
import dayjs from "dayjs";
import { getAvailability } from "../api/userApi";


interface AvailabilityContextType {
  days: DaySchedule[];
  dateRange: [Date | null, Date | null];
  setDays: any;
  setDateRange: (range: [Date | null, Date | null]) => void;
  updateSlotStatus: (
    dayIndex: number,
    slotIndex: number,
    newStatus: EnBookings
  ) => void;
  toggleDayAvailability: (dayIndex: number) => void;
  generateDaysFromRange: (startDate: Date | null, endDate: Date | null) => void;
  handleNextWeek: () => void;
  handlePreviousWeek: () => void;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(
  undefined
);

// Add interface for API response
interface DayAvailability {
  date: string;
  phone_start_time: string | null;
  phone_end_time: string | null;
  in_person_start_time: string | null;
  in_person_end_time: string | null;
}

const generateTimeSlots = (dayAvailability?: DayAvailability) => {
  const slots = [];
  
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper function to convert minutes back to time string
  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  if (!dayAvailability || 
      (!dayAvailability.phone_start_time && !dayAvailability.in_person_start_time)) {
    // Generate disabled slots for the entire day
    for (let hour = 7; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
          status: EnBookings.Available,
          isDisabled: true
        });
      }
    }
    return slots;
  }

  // Get earliest start time and latest end time
  const startTimes = [
    dayAvailability.phone_start_time,
    dayAvailability.in_person_start_time
  ].filter(time => time !== null) as string[];
  
  const endTimes = [
    dayAvailability.phone_end_time,
    dayAvailability.in_person_end_time
  ].filter(time => time !== null) as string[];

  if (startTimes.length === 0 || endTimes.length === 0) {
    return generateTimeSlots(); // Return all slots as unavailable
  }

  // Convert times to minutes for comparison
  const startMinutes = startTimes.map(time => timeToMinutes(time.slice(0, 5)));
  const endMinutes = endTimes.map(time => timeToMinutes(time.slice(0, 5)));

  // Get earliest start and latest end
  const earliestStartMinutes = Math.min(...startMinutes);
  const latestEndMinutes = Math.max(...endMinutes);

  // Generate slots for the entire day
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const currentTimeMinutes = hour * 60 + minute;
      const currentTime = minutesToTime(currentTimeMinutes);
      
      const isWithinAvailability = 
        currentTimeMinutes >= earliestStartMinutes && 
        currentTimeMinutes <= latestEndMinutes;

      // For the last slot, check if there's enough time until the end
      const hasEnoughTimeUntilEnd = 
        currentTimeMinutes + 15 <= latestEndMinutes;

      slots.push({
        time: currentTime,
        status: EnBookings.Available,
        isDisabled: !isWithinAvailability || !hasEnoughTimeUntilEnd
      });
    }
  }

  return slots;
};

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [days, setDays] = useState<DaySchedule[]>([]);
  console.log(days,'days')
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>([]);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const fetchInitialAvailability = useCallback(async () => {
    try {
      const response = await getAvailability({
        user_id: EStaticID.ID,
        date: dayjs().format("YYYY-MM-DD"),
        range: EnAvailability.WEEK,
      });
      
      const availability = response.availability;
      setAvailabilities(availability);

      if (availability.length > 0) {
        const firstDate = dayjs(availability[0].date).toDate();
        const lastDate = dayjs(availability[availability.length - 1].date).toDate();
        setDateRange([firstDate, lastDate]);
      }
    } catch (error) {
      console.error("Error fetching initial availability:", error);
    }
    setIsInitialFetch(false);
  }, []);

  const fetchAvailability = useCallback(async () => {
    if (isInitialFetch || !dateRange[0]) return;
    
    try {
      const response = await getAvailability({
        user_id: EStaticID.ID,
        date: dayjs(dateRange[0]).format("YYYY-MM-DD"),
        range: EnAvailability.WEEK,
      });
      setAvailabilities(response.availability);
      generateDaysFromRange(dateRange[0], dateRange[1]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [dateRange, isInitialFetch]);

  useEffect(() => {
    fetchInitialAvailability();
  }, [fetchInitialAvailability]);

  useEffect(() => {
    if (!isInitialFetch && dateRange[0] && dateRange[1]) {
      fetchAvailability();
    }
  }, [dateRange, fetchAvailability, isInitialFetch]);

  const handlePreviousWeek = useCallback(() => {
    if (!dateRange[0] || !dateRange[1]) return;
    
    setDateRange([
      dayjs(dateRange[0]).subtract(7, "day").toDate(),
      dayjs(dateRange[1]).subtract(7, "day").toDate(),
    ]);
  }, [dateRange]);

  const handleNextWeek = useCallback(() => {
    if (!dateRange[0] || !dateRange[1]) return;
    
    setDateRange([
      dayjs(dateRange[0]).add(7, "day").toDate(),
      dayjs(dateRange[1]).add(7, "day").toDate(),
    ]);
  }, [dateRange]);

  const generateDaysFromRange = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    if (!startDate || !endDate) return;

    const newDays: DaySchedule[] = [];
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    // First, get all dates from the API data
    const apiDates = availabilities.map(a => a.date);

    while (currentDate.isSameOrBefore(end)) {
      const formattedDate = currentDate.format("YYYY-MM-DD");
      const dayAvailability = availabilities.find(
        (a) => a.date === formattedDate
      );

      // Check if this date exists in API data
      const isApiDate = apiDates.includes(formattedDate);

      // Only consider it available if the date is in API data and has availability
      const hasAvailability = isApiDate && dayAvailability && (
        dayAvailability.phone_start_time !== null ||
        dayAvailability.in_person_start_time !== null
      );

      newDays.push({
        day: currentDate.format("ddd"),
        date: currentDate.date(),
        fullDate: formattedDate, // Add full date for comparison
        availability: {
          isAvailable: Boolean(hasAvailability), // Fix the boolean type issue
          slots: generateTimeSlots(dayAvailability),
        },
      });
      currentDate = currentDate.add(1, "day");
    }

    // Sort days according to API data order if needed
    const sortedDays = newDays.sort((a, b) => {
      const aIndex = apiDates.indexOf(a.fullDate);
      const bIndex = apiDates.indexOf(b.fullDate);
      return aIndex - bIndex;
    });

    setDays(sortedDays);
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
        setDays,
        handleNextWeek,
        handlePreviousWeek
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
