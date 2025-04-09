import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { DaySchedule } from "../types/calendar";
import { EnAvailability, EnBookings } from "../utils/enums";
import dayjs from "dayjs";
import { getAvailability, getBookings } from "../api/userApi";
import { IDayAvailability } from "../utils/Interfaces";
import { useAuth } from "./AuthContext";

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
  refreshAvailability: () => Promise<void>;
  availabilities: any;
  fetchInitialAvailability: () => Promise<void>;
  // appointmentId:string | null;
  // setAppointmentId:Dispatch<SetStateAction<string | null>>;
}

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(
  undefined
);

// Add interface for API response

const generateTimeSlots = (dayAvailability?: IDayAvailability) => {
  const slots = [];

  const timeToMinutes = (time: string | null): number => {
    if (!time) return 0;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // If no availability data or both types are not available
  if (
    !dayAvailability ||
    (!dayAvailability.phone_start_time && !dayAvailability.in_person_start_time)
  ) {
    // Generate slots for 24 hours as disabled
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          status: EnBookings.Available,
          isDisabled: true,
        });
      }
    }
    return slots;
  }

  // Get valid time ranges
  const phoneRange =
    dayAvailability.phone_start_time && dayAvailability.phone_start_time !== ""
      ? {
          start: timeToMinutes(dayAvailability.phone_start_time),
          end: timeToMinutes(dayAvailability.phone_end_time),
        }
      : null;

  const inPersonRange =
    dayAvailability.in_person_start_time &&
    dayAvailability.in_person_start_time !== ""
      ? {
          start: timeToMinutes(dayAvailability.in_person_start_time),
          end: timeToMinutes(dayAvailability.in_person_end_time),
        }
      : null;

  // Get break time range
  const breakRange =
    dayAvailability.break_start_time && dayAvailability.break_start_time !== ""
      ? {
          start: timeToMinutes(dayAvailability.break_start_time),
          end: timeToMinutes(dayAvailability.break_end_time),
        }
      : null;

  // If no valid ranges, return all slots as unavailable
  if (!phoneRange && !inPersonRange) {
    return generateTimeSlots();
  }

  // Get earliest start and latest end times
  const earliestStart = Math.min(
    ...([phoneRange?.start, inPersonRange?.start].filter(
      (time) => time !== undefined
    ) as number[])
  );
  const latestEnd = Math.max(
    ...([phoneRange?.end, inPersonRange?.end].filter(
      (time) => time !== undefined
    ) as number[])
  );

  // Calculate start and end hours
  const startHour = Math.floor(earliestStart / 60);
  const endHour = Math.ceil(latestEnd / 60);

  // Generate slots only for the available time range
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const currentTimeMinutes = hour * 60 + minute;

      // Skip if we're past the end time
      if (currentTimeMinutes > latestEnd) continue;

      const currentTime = minutesToTime(currentTimeMinutes);

      // Check if this slot is within any available time range
      const isWithinPhoneAvailability = phoneRange
        ? currentTimeMinutes >= phoneRange.start &&
          currentTimeMinutes <= phoneRange.end - 15
        : false;

      const isWithinInPersonAvailability = inPersonRange
        ? currentTimeMinutes >= inPersonRange.start &&
          currentTimeMinutes <= inPersonRange.end - 15
        : false;

      // Check if this slot is within break time
      const isWithinBreak = breakRange
        ? currentTimeMinutes >= breakRange.start &&
          currentTimeMinutes < breakRange.end
        : false;

      const isWithinAvailability =
        isWithinPhoneAvailability || isWithinInPersonAvailability;

      // For the last slot, check if there's enough time until the end
      const hasEnoughTimeUntilEnd = currentTimeMinutes + 15 <= latestEnd;

      slots.push({
        time: currentTime,
        status: EnBookings.Available,
        isDisabled:
          !isWithinAvailability || !hasEnoughTimeUntilEnd || isWithinBreak,
      });
    }
  }

  return slots;
};

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [days, setDays] = useState<DaySchedule[]>([]);
  const [availabilities, setAvailabilities] = useState<IDayAvailability[]>([]);
  const [isInitialFetch, setIsInitialFetch] = useState(true);
  // const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const { userDetails } = useAuth();
  const fetchAvailabilityData = useCallback(
    async (date: Date) => {
   
      if (!userDetails?.user_id) {
        console.log("No user ID available for availability fetch");
        return [];
      }

      try {
        const response = await getAvailability({
          user_id: userDetails.user_id,
          date: dayjs(date).format("YYYY-MM-DD"),
          range: EnAvailability.WEEK,
        });
        setAvailabilities(response.availability);
        return response.availability;
      } catch (error) {
        console.error("Error fetching availability:", error);
        return [];
      }
    },
    [userDetails?.user_id]
  );

  const generateDaysFromRange = useCallback(
    (
      startDate: Date | null,
      endDate: Date | null,
      availabilityData: IDayAvailability[]
    ) => {
      if (!startDate || !endDate) return;

      const newDays: DaySchedule[] = [];
      let currentDate = dayjs(startDate);
      const end = dayjs(endDate);

      // First, get all dates from the API data
      const apiDates = availabilityData.map((a) => a.date);

      while (currentDate.isSameOrBefore(end)) {
        const formattedDate = currentDate.format("YYYY-MM-DD");
        const dayAvailability = availabilityData.find(
          (a) => a.date === formattedDate
        );

        const isApiDate = apiDates.includes(formattedDate);
        const hasAvailability =
          isApiDate &&
          dayAvailability &&
          (dayAvailability.phone_start_time !== null ||
            dayAvailability.in_person_start_time !== null);

        newDays.push({
          day: currentDate.format("ddd"),
          date: currentDate.date(),
          fullDate: formattedDate,
          availability: {
            isAvailable: Boolean(hasAvailability),
            slots: generateTimeSlots(dayAvailability),
          },
        });
        currentDate = currentDate.add(1, "day");
      }

      const sortedDays = newDays.sort((a, b) => {
        const aIndex = apiDates.indexOf(a.fullDate);
        const bIndex = apiDates.indexOf(b.fullDate);
        return aIndex - bIndex;
      });

      setDays(sortedDays);
    },
    []
  );
  const fetchInitialBookings = useCallback(async () => {
    if (!userDetails?.user_id) {
      console.log("Waiting for user details before fetching bookings");
      return;
    }

    try {
      const bookings = await getBookings({
        user_id: userDetails.user_id,
        date: dayjs().format("YYYY-MM-DD"),
        range: EnAvailability.WEEK,
      });
      console.log(bookings)
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  }, [userDetails?.user_id]);
  useEffect(() => {
    if (userDetails?.user_id) {
      fetchInitialBookings();
    }
  }, [fetchInitialBookings, userDetails?.user_id]);

  const fetchInitialAvailability = useCallback(async () => {
    if (!userDetails?.user_id) {
      console.log("Waiting for user details before fetching availability");
      return;
    }

    try {
      const availability = await fetchAvailabilityData(new Date());

      if (availability.length > 0) {
        const firstDate = dayjs(availability[0].date).toDate();
        const lastDate = dayjs(
          availability[availability.length - 1].date
        ).toDate();
        setDateRange([firstDate, lastDate]);
        generateDaysFromRange(firstDate, lastDate, availability);
      }
    } catch (error) {
      console.error("Error fetching initial availability:", error);
    }
    setIsInitialFetch(false);
  }, [fetchAvailabilityData, generateDaysFromRange, userDetails?.user_id]);

  const refreshAvailability = useCallback(async () => {
    if (!dateRange[0]) return;

    try {
      const availability = await fetchAvailabilityData(dateRange[0]);
      if (dateRange[0] && dateRange[1]) {
        generateDaysFromRange(dateRange[0], dateRange[1], availability);
      }
    } catch (error) {
      console.error("Error refreshing availability:", error);
    }
  }, [dateRange, fetchAvailabilityData, generateDaysFromRange]);

  useEffect(() => {
    if (userDetails?.user_id) {
      fetchInitialAvailability();
    }
  }, [fetchInitialAvailability, userDetails?.user_id]);

  useEffect(() => {
    if (!isInitialFetch && dateRange[0] && dateRange[1]) {
      refreshAvailability();
    }
  }, [dateRange, refreshAvailability, isInitialFetch]);

  const handlePreviousWeek = () => {
    if (!dateRange[0] || !dateRange[1]) return;

    setDateRange([
      dayjs(dateRange[0]).subtract(7, "day").toDate(),
      dayjs(dateRange[1]).subtract(7, "day").toDate(),
    ]);
  };

  const handleNextWeek = () => {
    if (!dateRange[0] || !dateRange[1]) return;

    setDateRange([
      dayjs(dateRange[0]).add(7, "day").toDate(),
      dayjs(dateRange[1]).add(7, "day").toDate(),
    ]);
  };

  const updateSlotStatus = (
    dayIndex: number,
    slotIndex: number,
    newStatus: EnBookings
  ) => {
    setDays((prevDays) => {
      const newDays = [...prevDays];
      if (newDays[dayIndex]?.availability?.slots?.[slotIndex]) {
        newDays[dayIndex].availability.slots[slotIndex].status = newStatus;
      }
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
        generateDaysFromRange: (start, end) =>
          generateDaysFromRange(start, end, availabilities),
        setDays,
        handleNextWeek,
        handlePreviousWeek,
        refreshAvailability,
        availabilities,
        fetchInitialAvailability,
        // setAppointmentId,
        // appointmentId
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
