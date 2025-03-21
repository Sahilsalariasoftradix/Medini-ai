import { useState } from "react";
import { useAvailability } from "../store/AvailabilityContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useAuth } from "../store/AuthContext";
import { IAvailabilityPayload } from "../utils/Interfaces";
import dayjs from "dayjs";
import {
  postAvailabilitySpecific,
  postUnAvailabilitySpecific,
} from "../api/userApi";
import { AvailabilityFormData, availabilitySchema } from "../utils/common";

export const useEditAvailability = () => {
  const { availabilities } = useAvailability();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshAvailability } = useAvailability();
  const [clearAvailabilityModal, setClearAvailabilityModal] = useState(false);
  const { userDetails } = useAuth();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });
  const availabilityForm = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      isAvailable: false,
      phone: { from: "", to: "" },
      in_person: { from: "", to: "" },
      break: { from: "", to: "" },
    },
  });

  const onSubmit = () => {
    setOpenModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditAvailability = (date: any) => {
    // Handle date properly when it's in YYYY-MM-DD format
    const formattedDate =
      typeof date === "string" && date.includes("-")
        ? date
        : typeof date === "object" && date.dateString
        ? date.dateString
        : dayjs().set("date", date).format("YYYY-MM-DD");

    const selectedAvailability = availabilities.find(
      //@ts-ignore
      (avail) => avail.date === formattedDate
    );

    // First set the modal to open
    setIsAvailabilityModalOpen(true);

    // Then reset the form with a slight delay to ensure the modal is rendered
    setTimeout(() => {
      availabilityForm.reset({
        isAvailable: true,
        in_person: {
          from: selectedAvailability?.in_person_start_time
            ? selectedAvailability.in_person_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.in_person_end_time
            ? selectedAvailability.in_person_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
        phone: {
          from: selectedAvailability?.phone_start_time
            ? selectedAvailability.phone_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.phone_end_time
            ? selectedAvailability.phone_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
        break: {
          from: selectedAvailability?.break_start_time
            ? selectedAvailability.break_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.break_end_time
            ? selectedAvailability.break_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
      });
    }, 0);
  };
  const handleClearAvailability = async (date: any) => {
    setLoading(true);
    try {
      // Handle date properly when it's in YYYY-MM-DD format
      const formattedDate =
        typeof date === "string" && date.includes("-")
          ? date
          : typeof date === "object" && date.dateString
          ? date.dateString
          : dayjs().set("date", date).format("YYYY-MM-DD");

      const selectedAvailability = availabilities.find(
        //@ts-ignore
        (avail) => avail.date === formattedDate
      );

      await postUnAvailabilitySpecific({
        user_id: userDetails?.user_id,
        date: formattedDate,
        phone_start_time: selectedAvailability?.phone_start_time,
        phone_end_time: selectedAvailability?.phone_end_time,
        in_person_start_time: selectedAvailability?.in_person_start_time,
        in_person_end_time: selectedAvailability?.in_person_end_time,
      });

      setSnackbar({
        open: true,
        message: "Availability cleared successfully",
        severity: "success",
      });
      await refreshAvailability();
    } catch (error) {
      console.log(error, "error");
      setSnackbar({
        open: true,
        message: "Failed to clear availability",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setClearAvailabilityModal(false);
    }
  };
  // Closing snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prevSnackbar) => ({
      ...prevSnackbar,
      open: false,
    }));
  };
  const handleAvailabilitySubmit = async (
    data: AvailabilityFormData,
    date: any
  ) => {
    setLoading(true);

    try {
      // Error validation setup
      let hasError = false;
      let errorMessage = "";

      // Validate at least one booking type has times set
      const hasPhoneTimes = data.phone?.from && data.phone?.to;
      const hasInPersonTimes = data.in_person?.from && data.in_person?.to;

      if (!hasPhoneTimes && !hasInPersonTimes) {
        hasError = true;
        errorMessage = "Please set times for at least one booking type";
      }

      // Convert string times to Day.js objects
      const phoneStart = hasPhoneTimes ? dayjs(data.phone.from, "HH:mm") : null;
      const phoneEnd = hasPhoneTimes ? dayjs(data.phone.to, "HH:mm") : null;
      const inPersonStart = hasInPersonTimes
        ? dayjs(data.in_person.from, "HH:mm")
        : null;
      const inPersonEnd = hasInPersonTimes
        ? dayjs(data.in_person.to, "HH:mm")
        : null;
      const breakStart = data.break?.from
        ? dayjs(data.break.from, "HH:mm")
        : null;
      const breakEnd = data.break?.to ? dayjs(data.break.to, "HH:mm") : null;

      // Function to check time overlap
      const isOverlap = (
        start1: dayjs.Dayjs | null,
        end1: dayjs.Dayjs | null,
        start2: dayjs.Dayjs | null,
        end2: dayjs.Dayjs | null
      ) => {
        if (!start1 || !end1 || !start2 || !end2) return false;
        return start1.isBefore(end2) && start2.isBefore(end1);
      };

      // Check for invalid time ranges
      if (phoneStart && phoneEnd && phoneStart.isAfter(phoneEnd)) {
        hasError = true;
        errorMessage = "Phone start time cannot be after end time";
      } else if (
        inPersonStart &&
        inPersonEnd &&
        inPersonStart.isAfter(inPersonEnd)
      ) {
        hasError = true;
        errorMessage = "In-person start time cannot be after end time";
      } else if (breakStart && breakEnd && breakStart.isAfter(breakEnd)) {
        hasError = true;
        errorMessage = "Break start time cannot be after end time";
      } else if (
        phoneStart &&
        phoneEnd &&
        inPersonStart &&
        inPersonEnd &&
        isOverlap(phoneStart, phoneEnd, inPersonStart, inPersonEnd)
      ) {
        hasError = true;
        errorMessage = "Phone and In-person times cannot overlap";
      }

      // // Check if break times overlap with either phone or in-person
      // if (!hasError && breakStart && breakEnd) {
      //   if (phoneStart && phoneEnd && isOverlap(phoneStart, phoneEnd, breakStart, breakEnd)) {
      //     hasError = true;
      //     errorMessage = "Break times cannot overlap with Phone times";
      //   } else if (inPersonStart && inPersonEnd && isOverlap(inPersonStart, inPersonEnd, breakStart, breakEnd)) {
      //     hasError = true;
      //     errorMessage = "Break times cannot overlap with In-person times";
      //   }
      // }

      // If there is an error, show it and stop submission
      if (hasError) {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        setLoading(false);
        return;
      }

      // Handle date properly when it's in YYYY-MM-DD format
      const formattedDate =
        typeof date === "string" && date.includes("-")
          ? date
          : typeof date === "object" && date.dateString
          ? date.dateString
          : dayjs().set("date", date).format("YYYY-MM-DD");

      // Only proceed if validation passes
      const payload: IAvailabilityPayload = {
        user_id: userDetails?.user_id,
        date: formattedDate,
        phone_start_time: data.phone?.from ? `${data.phone.from}:00` : null,
        phone_end_time: data.phone?.to ? `${data.phone.to}:00` : null,
        in_person_start_time: data.in_person?.from
          ? `${data.in_person.from}:00`
          : null,
        in_person_end_time: data.in_person?.to
          ? `${data.in_person.to}:00`
          : null,
        break_start_time: data.break?.from ? `${data.break.from}:00` : null,
        break_end_time: data.break?.to ? `${data.break.to}:00` : null,
      };
      //@ts-ignore
      const response = await postAvailabilitySpecific(payload);

      await refreshAvailability();

      setSnackbar({
        open: true,
        message: response?.message || "Availability updated successfully",
        severity: "success",
      });
      setIsAvailabilityModalOpen(false);
    } catch (error) {
      console.error("Error setting availability:", error);
      setSnackbar({
        open: true,
        message: "Failed to set availability. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    anchorEl,
    open,
    openModal,
    isAvailabilityModalOpen,
    loading,
    refreshAvailability,
    setIsAvailabilityModalOpen,
    setClearAvailabilityModal,
    setLoading,
    setSnackbar,
    handleAvailabilitySubmit,
    handleClearAvailability,
    handleEditAvailability,
    handleClick,
    handleClose,
    availabilityForm,
    snackbar,
    handleSnackbarClose,
    setOpenModal,
    clearAvailabilityModal,
    onSubmit,
  };
};
