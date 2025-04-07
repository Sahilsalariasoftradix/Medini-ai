// import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
// import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "../../assets/icons/dots-vertical.svg";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "../../assets/icons/edit-table.svg";
// import PrintIcon from "../../assets/icons/printer.svg";
import CancelIcon from "../../assets/icons/cancel-table.svg";
import DeleteIcon from "../../assets/icons/delete-tr.svg";
import SortIcon from "../../assets/icons/arrows-down-up.svg";
import { visuallyHidden } from "@mui/utils";
import CommonTextField from "../../components/common/CommonTextField";
import searchIcon from "../../assets/icons/Search.svg";
import CommonButton from "../../components/common/CommonButton";
import add from "../../assets/icons/add-icn.svg";
import { useEffect, useMemo, useState } from "react";
import { RoundCheckbox } from "../../components/common/RoundCheckbox";
import {
  ButtonGroup,
  Chip,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { overRideSvgColor } from "../../utils/filters";
import CommonDialog from "../../components/common/CommonDialog";
import {
  Data,
  EnhancedTableProps,
  IBooking,
  ICall,
  ICallHistory,
  IContact,
  IFilm,
  IGetBookingsByUser,
  IGetContacts,
  Order,
} from "../../utils/Interfaces";
import { getContactsByUserId } from "../../firebase/AuthService";
import { Controller, useForm } from "react-hook-form";
import SearchInput from "../../components/common/SearchInput";
import { sleep } from "../../components/Booking/availability-calendar";
import { topFilms } from "../../utils/staticText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import addIcon from "../../assets/icons/add-icn.svg";
import AddContact from "../../components/Booking/Form/AddContact";
import CustomSelect from "../../components/common/CustomSelect";

import {
  EnCallPurposeOptionsValues,
  EnGetCallHistory,
} from "../../utils/enums";
import { useAuth } from "../../store/AuthContext";
import CommonSnackbar from "../../components/common/CommonSnackbar";
import {
  createCall,
  deleteCall,
  getBookingsByUser,
  getCallHistoryData,
  getCompanyUniqueNumber,
} from "../../api/userApi";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { callPurposeOptions, headCells } from "../../utils/common";
import { calenderIcon } from "../../components/Booking/Form/SlotBookingForm";
import { EnShowPurposeUI } from "../../utils/enums";
import { CircularProgress } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow sx={{ borderTop: "1px solid #EDF2F7" }}>
        <TableCell
          sx={{ borderBottom: "1px solid #EDF2F7" }}
          padding="checkbox"
        >
          <RoundCheckbox
            label=""
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ borderBottom: "1px solid #EDF2F7" }}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable === false ? (
              <Typography variant="bodyMediumExtraBold">
                {headCell.label}
              </Typography>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof Data)}
                IconComponent={() => (
                  <img
                    src={SortIcon}
                    alt="sort"
                    style={{
                      marginLeft: "4px",
                      opacity: orderBy === headCell.id ? 1 : 0.2,
                      transform:
                        orderBy === headCell.id && order === "desc"
                          ? "rotate(180deg)"
                          : "none",
                      transition: "transform 200ms",
                    }}
                  />
                )}
              >
                <Typography variant="bodyMediumExtraBold">
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
// interface EnhancedTableToolbarProps {
//   numSelected: number;
// }
// function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
//   const { numSelected } = props;
//   return (
//     <Toolbar
//       sx={[
//         {
//           pl: { sm: 2 },
//           pr: { xs: 1, sm: 1 },
//         },
//         numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(
//               theme.palette.primary.main,
//               theme.palette.action.activatedOpacity
//             ),
//         },
//       ]}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: "1 1 100%" }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: "1 1 100%" }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Nutrition
//         </Typography>
//       )}
//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>del</IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>filter</IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// }

const ActionMenu = ({
  row,
  onCallDeleted,
  onCallEdit,
}: {
  row: Data;
  onCallDeleted: () => void;
  onCallEdit: (callData: Data) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [shallDelete, setShallDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent row selection when clicking menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent row selection when clicking menu items
    setAnchorEl(null);
  };

  const handleAction =
    (action: string) => async (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      switch (action) {
        case "edit":
          onCallEdit(row);
          break;
        case "print":
          console.log("Print", row);
          break;
        case "cancel":
          console.log("Cancel", row);
          break;
        case "delete":
          setShallDelete(true);
          // await deleteCall(row.id);
          console.log("Delete", row.id);
          break;
      }
      handleClose(event);
    };
  const handleRowDelete = async () => {
    setLoading(true);
    try {
      await deleteCall(row.id);
      setShallDelete(false);
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Call deleted successfully",
        severity: "success",
      });
      onCallDeleted(); // Call the callback to refresh the table data
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: "Failed to delete call",
        severity: "error",
      });
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          border: open ? "" : "1px solid #E2E8F0",
          borderRadius: "8px",
          background: open ? "#358FF7" : "transparent",
        }}
      >
        <img
          src={MoreVertIcon}
          style={{
            filter: open ? overRideSvgColor.white : "",
          }}
          alt="more"
        />
      </IconButton>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        sx={{
          "& .MuiPaper-root": {
            border: "1px solid #E2E8F0",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
            borderRadius: "16px",
            minWidth: "160px",
            p: 0,
          },
        }}
      >
        <MenuItem onClick={handleAction("edit")} sx={{ gap: 1 }}>
          <img src={EditIcon} alt="" />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            {" "}
            Edit
          </Typography>
        </MenuItem>
        {/* <MenuItem onClick={handleAction("print")} sx={{ gap: 1 }}>
          <img src={PrintIcon} alt="" />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            {" "}
            Print
          </Typography>
        </MenuItem> */}
        <MenuItem onClick={handleAction("cancel")} sx={{ gap: 1 }}>
          <img src={CancelIcon} alt="" />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            {" "}
            Cancel
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleAction("delete")} sx={{ gap: 1 }}>
          <img src={DeleteIcon} alt="" />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            {" "}
            Delete
          </Typography>
        </MenuItem>
      </Menu>
      <CommonDialog
        open={shallDelete}
        onClose={() => setShallDelete(false)}
        title="Delete Call"
        confirmButtonType="error"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
        disabled={loading}
        onConfirm={handleRowDelete}
      >
        <Typography variant="bodyLargeMedium" color="grey.600">
          Are you sure you want to delete this call?
        </Typography>
      </CommonDialog>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
      />
    </>
  );
};

// Update the schema to include the new fields
const addCallSchema = z.object({
  contact: z
    .object({
      title: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string(),
    })
    .required(),
  callPurpose: z
    .string({ message: "Call Purpose is required" })
    .min(1, { message: "Call Purpose is required" }),
  appointmentReason: z
    .string({ message: "Reason is required" })
    .min(1, { message: "Reason is required" }),
  inPersonOnly: z.boolean().optional(),
  bookingStartDate: z.string().optional(),
  bookingEndDate: z.string().optional(),
  appointmentLength: z.string().optional(),
  appointmentId: z.string().optional(),
  is_scheduled_call: z.boolean().optional(),
  scheduledCallTime: z
    .string({ message: "Scheduled Call Time is required" })
    .min(1, { message: "Scheduled Call Time is required" }),
});

type AddCallSchema = z.infer<typeof addCallSchema>;

const CallCenter = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("contact");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openAddCallDetails, setOpenAddCallDetails] = useState(false);
  const [contacts, setContacts] = useState<IGetContacts>([]);
  // Search contact inputs
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [selectedContact, setSelectedContact] = useState<IContact | null>(null);

  const [openAddContact, setOpenAddContact] = useState(false);
  const [companyPhone, setCompanyPhone] = useState("");
  //@ts-ignore
  const [isEditing, setIsEditing] = useState(false);
  //@ts-ignore
  const [options, setOptions] = useState<readonly IFilm[]>([]);
  const [getBookingByUser, setGetBookingByUser] = useState<IGetBookingsByUser>({
    bookings: [],
  });
  const [getCallHistory, setGetCallHistory] = useState<ICallHistory[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [currentEditingCall, setCurrentEditingCall] = useState<Data | null>(
    null
  );
  const [callHistoryStatus, setCallHistoryStatus] = useState<EnGetCallHistory>(
    EnGetCallHistory.PENDING
  );
  const [searchCalls, setSearchCalls] = useState("");
  const debouncedSearchValue = useDebounce(searchCalls, 300);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    watch,
  } = useForm<AddCallSchema>({
    resolver: zodResolver(addCallSchema),
    defaultValues: {
      contact: {},
      callPurpose: "",
      appointmentReason: "",
      appointmentId:
        getBookingByUser?.bookings?.[0]?.booking_id?.toString() || "",
      inPersonOnly: false,
      bookingStartDate: "",
      bookingEndDate: "",
      appointmentLength: "15",
    },
  });

  const [loading, setLoading] = useState({
    input: false,
    data: false,
    options: false,
  });
  const contactOptions = contacts.map((contact) => ({
    title: `${contact.firstName} ${contact.lastName}`,
    key: `${contact.firstName}-${contact.lastName}-${contact.phone}`,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  }));

  const callPurpose = watch("callPurpose");

  const handleClose = () => {
    setOpenContactSearch(false);
    setOptions([]);
  };
  const { userDetails } = useAuth();

  const fetchContacts = async () => {
    const contactList = userDetails?.user_id
      ? await getContactsByUserId(userDetails?.user_id)
      : [];
    setContacts(contactList);
  };

  const fetchCompanyPhone = async () => {
    const companyPhone = await getCompanyUniqueNumber(userDetails?.company_id);
    setCompanyPhone(companyPhone?.phoneNumber);
  };

  useEffect(() => {
    fetchContacts();
    fetchCompanyPhone();
  }, []);
  const refreshCallHistory = async () => {
    setTableLoading(true);
    try {
      const callHistory = await getCallHistoryData(
        userDetails?.user_id,
        callHistoryStatus ? callHistoryStatus : ""
      );
      setGetCallHistory(callHistory);
    } catch (error) {
      console.error("Error fetching call history:", error);
    } finally {
      setTableLoading(false);
    }
  };
  useEffect(() => {
    // Get the current contact value from the form
    const currentValue = control._formValues?.contact;
    if (currentValue && Object.keys(currentValue).length > 0) {
      setSelectedContact(currentValue);
    } else {
      setSelectedContact(null);
    }
  }, [control._formValues?.contact]);
  const handleOpen = () => {
    setOpenContactSearch(true);
    (async () => {
      setLoading({ ...loading, input: true });
      await sleep(1000); // For demo purposes.
      setLoading({ ...loading, input: false });

      setOptions([...topFilms]);
    })();
  };
  // Add this calculation for total pages
  const totalPages = Math.ceil(getCallHistory.length / rowsPerPage);

  const handleRequestSort = (
    //@ts-ignore
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = getCallHistory.map((_, index) => index); // Use index as ID
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  //@ts-ignore
  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    // For MUI Pagination, pages start from 1
    // For TablePagination, pages start from 0
    const adjustedPage = event?.type === "click" ? newPage - 1 : newPage;
    setPage(adjustedPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(parseInt(event.target.value.toString(), 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - getCallHistory.length)
      : 0;

  const visibleRows = useMemo(() => {
    //@ts-ignore
    const formattedRows = getCallHistory.map((call, index) => {
      let status;
      // if (call.call_failed) {
      //   status = EnShowPurposeUI.FAILED;
      // } else
      {
        switch (call.call_purpose) {
          case "BOOK":
          case "BOOK_APPOINTMENT":
            status = EnShowPurposeUI.BOOKED;
            break;
          case "CANCEL":
          case "CANCEL_APPOINTMENT":
            status = EnShowPurposeUI.CANCELLED;
            break;
          case "REQUEST_INFO":
            status = EnShowPurposeUI.REQUESTINFO;
            break;
          case "RESCHEDULE_APPOINTMENT":
            status = EnShowPurposeUI.RESCHEDULED;
            break;
          default:
            status = EnShowPurposeUI.SCHEDULED;
        }
      }

      return {
        id: call.id,
        contact: call.caller,
        patientId: `${call.to_phone}`,
        date: dayjs(
          call.scheduled_time ? call.scheduled_time : call.time
        ).format("DD/MM/YYYY"),
        status: status,
        length: call.payload?.appointment_length
          ? call.payload.appointment_length + " mins"
          : "--",
        details: call.payload?.call_reason ? call.payload.call_reason : "--",
      };
    });

    return (
      formattedRows
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    );
  }, [order, orderBy, page, rowsPerPage, getCallHistory]);
  // console.log(selectedContact);

  useEffect(() => {
    (async () => {
      setTableLoading(true);
      try {
        if (selectedContact) {
          const bookings = await getBookingsByUser(
            userDetails?.user_id,
            selectedContact?.phone
          );
          setGetBookingByUser(bookings);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setTableLoading(false);
      }
    })();
  }, [selectedContact]);

  useEffect(() => {
    (async () => {
      setTableLoading(true);
      try {
        const callHistory = await getCallHistoryData(
          userDetails?.user_id,
          callHistoryStatus ? callHistoryStatus : ""
        );
        setGetCallHistory(callHistory);
      } catch (error) {
        console.error("Error fetching call history:", error);
      } finally {
        setTableLoading(false);
      }
    })();
  }, [callHistoryStatus]);

  // Add a function to handle editing a call
  const handleEditCall = (callData: Data) => {
    setCurrentEditingCall(callData);

    const callToEdit = getCallHistory.find((call) => call.id === callData.id);

    if (!callToEdit) return;

    const contactInfo = contacts.find(
      (contact) =>
        `${contact.firstName} ${contact.lastName}` === callToEdit.caller
    ) || {
      firstName: "",
      lastName: "",
      phone: callToEdit.to_phone,
      email: "",
    };

    const baseData = {
      contact: {
        title: `${contactInfo.firstName} ${contactInfo.lastName}`,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: contactInfo.phone || "",
      },
      callPurpose: callToEdit.call_purpose || "",
      //@ts-ignore
      appointmentReason: callToEdit.payload?.call_reason || "",
      scheduledCallTime:
        callToEdit.scheduled_time || dayjs().format("YYYY-MM-DD HH:mm:ss"),
      appointmentLength: callToEdit.payload?.appointment_length
        ? callToEdit.payload.appointment_length.toString()
        : "",
      bookingStartDate: callToEdit.payload?.book_from_date || "",
      bookingEndDate: callToEdit.payload?.book_till_date || "",
      inPersonOnly: callToEdit.payload?.is_in_person || false,
      appointmentId: callToEdit.payload?.appointment_id
        ? callToEdit.payload.appointment_id.toString()
        : "",
    };

    let purposeOverrides = {};

    switch (callToEdit.call_purpose) {
      case EnCallPurposeOptionsValues.RESCHEDULE:
        purposeOverrides = {
          callPurpose: EnCallPurposeOptionsValues.RESCHEDULE,
          appointmentReason:
            callToEdit.payload?.reschedule_appointment_reason || "",
          inPersonOnly: callToEdit.payload?.reschedule_is_in_person || false,
          bookingStartDate: callToEdit.payload?.reschedule_book_from_date || "",
          bookingEndDate: callToEdit.payload?.reschedule_book_till_date || "",
          appointmentId:
            callToEdit.payload?.reschedule_booking_id?.toString() || "",
          appointmentLength:
            callToEdit.payload?.reschedule_appointment_length?.toString() || "",
        };
        break;
      case EnCallPurposeOptionsValues.CANCEL:
        purposeOverrides = {
          callPurpose: EnCallPurposeOptionsValues.CANCEL,
          appointmentId: callToEdit.payload?.booking_id_to_cancel || "",
        };
        break;
    }

    reset({
      ...baseData,
      ...purposeOverrides,
    });

    setOpenAddCallDetails(true);
  };

  const onSubmit = async (data: AddCallSchema) => {
    const callData: ICall = {
      user_id: userDetails?.user_id,
      to: data.contact.phone,
      from: companyPhone,
      agenda: data.callPurpose,
      customer_name: data.contact.title,
      is_scheduled_call: true,
      scheduled_call_time: dayjs(data.scheduledCallTime.split("T")[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    };

    // If editing an existing call, include the call_id
    if (currentEditingCall) {
      callData.call_id = currentEditingCall.id;
    }

    clearErrors("bookingStartDate");
    clearErrors("bookingEndDate");
    clearErrors("appointmentLength");
    let error = false;

    if (
      [
        EnCallPurposeOptionsValues.BOOK,
        EnCallPurposeOptionsValues.RESCHEDULE,
      ].includes(data.callPurpose as EnCallPurposeOptionsValues)
    ) {
      if (!(data.bookingStartDate && data.bookingStartDate.length > 0)) {
        error = true;
        setError("bookingStartDate", {
          type: "required",
          message: "From date is required",
        });
      }
      if (!(data.bookingEndDate && data.bookingEndDate.length > 0)) {
        error = true;
        setError("bookingEndDate", {
          type: "required",
          message: "Not Later Than date is required",
        });
      }
      if (
        data.bookingStartDate &&
        data.bookingEndDate &&
        new Date(data.bookingStartDate) > new Date(data.bookingEndDate)
      ) {
        error = true;
        setError("bookingEndDate", {
          type: "required",
          message: "Not Later Than date should be greater than From date",
        });
      }
      if (!(data.appointmentLength && data.appointmentLength.length > 0)) {
        error = true;
        setError("appointmentLength", {
          type: "required",
          message: "Length is required",
        });
      }
    }

    if (
      [
        EnCallPurposeOptionsValues.CANCEL,
        EnCallPurposeOptionsValues.RESCHEDULE,
      ].includes(data.callPurpose as EnCallPurposeOptionsValues)
    ) {
      if (!(data.appointmentId && data.appointmentId.length > 0)) {
        error = true;
        setError("appointmentId", {
          type: "required",
          message: "Appointment ID is required",
        });
      }
    }

    if (error) {
      return;
    }

    switch (data.callPurpose) {
      case EnCallPurposeOptionsValues.REQUESTINFO:
        callData.call_reason = data.appointmentReason;
        break;
      case EnCallPurposeOptionsValues.BOOK:
        callData.appointment_reason = data.appointmentReason;
        callData.call_reason = data.appointmentReason;
        callData.is_in_person = data.inPersonOnly;
        callData.book_from_date = data.bookingStartDate;
        callData.book_till_date = data.bookingEndDate;
        callData.appointment_length = data.appointmentLength
          ? parseInt(data.appointmentLength)
          : undefined;
        break;
      case EnCallPurposeOptionsValues.CANCEL:
        callData.booking_id_to_cancel = data.appointmentId
          ? parseInt(data.appointmentId)
          : undefined;
        callData.reason_for_cancellation = data.appointmentReason;
        callData.call_reason = data.appointmentReason;
        break;
      case EnCallPurposeOptionsValues.RESCHEDULE:
        callData.reschedule_appointment_reason = data.appointmentReason;
        callData.call_reason = data.appointmentReason;
        callData.reschedule_is_in_person = data.inPersonOnly;
        callData.reschedule_book_from_date = data.bookingStartDate;
        callData.reschedule_book_till_date = data.bookingEndDate;
        callData.reschedule_booking_id = data.appointmentId
          ? parseInt(data.appointmentId)
          : undefined;
        callData.reschedule_appointment_length = data.appointmentLength
          ? parseInt(data.appointmentLength)
          : undefined;
        break;
      case EnCallPurposeOptionsValues.INFORMPATIENT:
        callData.info_to_patient = data.appointmentReason;
        callData.call_reason = data.appointmentReason;
        break;
    }
    setLoading({ ...loading, data: true });
    try {
      const response = await createCall(callData);
      if (response && response.success) {
        setOpenAddCallDetails(false);
        reset();
        setCurrentEditingCall(null); // Reset the editing state
        setSnackbar({
          open: true,
          message: currentEditingCall
            ? "Call updated successfully"
            : "Call created successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: currentEditingCall
            ? "Unable to update call record"
            : "Unable to create call record",
          severity: "error",
        });
      }
      refreshCallHistory();
    } catch (error) {
      setSnackbar({
        open: true,
        message: currentEditingCall
          ? "Unable to update call record"
          : "Unable to create call record",
        severity: "error",
      });
    } finally {
      setLoading({ ...loading, data: false });
    }
  };

  const handleOpenNewCall = () => {
    setOpenAddCallDetails(true);
    setSelectedContact(null);
    setCurrentEditingCall(null); // Ensure we reset the editing state
    // Reset the form with default values
    reset({
      contact: {},
      callPurpose: "",
      appointmentReason: "",
      appointmentId:
        getBookingByUser?.bookings?.[0]?.booking_id?.toString() || "",
      inPersonOnly: false,
      bookingStartDate: "",
      bookingEndDate: "",
      appointmentLength: "15",
      scheduledCallTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  return (
    <Box sx={{ px: "12px" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <CommonTextField
            startIcon={<img src={searchIcon} alt="down" />}
            placeholder="Search Calls"
            value={debouncedSearchValue}
            onChange={(e) => setSearchCalls(e.target.value)}
            sx={{ maxWidth: "300px", "& .MuiInputBase-input": { py: "11px" } }}
          />

          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            minWidth={"300px"}
          >
            <ButtonGroup
              variant="contained"
              aria-label="Basic button group"
              sx={{
                borderRadius: "50px",
                boxShadow: "none",
                backgroundColor: "grey.50",
                padding: "8px",
                "& .MuiButtonGroup-firstButton": {
                  border:
                    callHistoryStatus === EnGetCallHistory.PENDING
                      ? "none"
                      : "1px solid #E2E8F0",
                },
              }}
            >
              <CommonButton
                text="Pending Calls"
                onClick={() => setCallHistoryStatus(EnGetCallHistory.PENDING)}
                sx={{
                  borderRadius: "50px",
                  maxHeight: "40px",
                }}
                variant={
                  callHistoryStatus === EnGetCallHistory.PENDING
                    ? "contained"
                    : "outlined"
                }
              />
              <CommonButton
                variant={
                  callHistoryStatus === EnGetCallHistory.COMPLETED
                    ? "contained"
                    : "outlined"
                }
                sx={{
                  borderRadius: "50px",
                  maxHeight: "40px",
                }}
                text="Completed Calls"
                onClick={() => setCallHistoryStatus(EnGetCallHistory.COMPLETED)}
              />
            </ButtonGroup>
          </Box>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          <CommonButton
            variant="contained"
            startIcon={<img src={add} alt="add" />}
            text="Add New Call"
            onClick={handleOpenNewCall}
            sx={{ py: "11px", px: "20px" }}
          />
          {/* <CommonButton
            variant="outlined"
            startIcon={<img src={filter} alt="filter" />}
            text="Filters"
            sx={{ py: "11px", px: "20px" }}
          /> */}
        </Box>
      </Box>
      <Box sx={{ width: "100%" }} mt={3}>
        <Paper sx={{ width: "100%", mb: 2, boxShadow: "none", p: 0 }}>
          {tableLoading ? (
            <Box
              sx={{
                height: "calc(100vh - 300px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="bodyMediumMedium" mt={2} color="grey.600">
                  Loading call history...
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ height: "calc(100vh - 300px)" }}>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={getCallHistory.length}
                  />
                  {getCallHistory.length > 0 ? (
                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const isItemSelected = selected.includes(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{
                              cursor: "pointer",
                              "& td": { borderColor: "#EDF2F7" },
                            }}
                          >
                            <TableCell padding="checkbox">
                              <RoundCheckbox
                                label=""
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              // component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              <Typography variant="bodyMediumExtraBold">
                                {" "}
                                {row.contact}
                              </Typography>
                              <Typography
                                mt={1}
                                color="grey.600"
                                variant="bodyXSmallMedium"
                              >
                                {" "}
                                {row.patientId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="bodyMediumMedium">
                                {row.date}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                sx={{ fontWeight: 500, p: 0 }}
                                label={row.status}
                                color={
                                  row.status === EnShowPurposeUI.CANCELLED
                                    ? "error"
                                    : row.status === EnShowPurposeUI.BOOKED
                                    ? "success"
                                    : row.status === EnShowPurposeUI.RESCHEDULED
                                    ? "error"
                                    : row.status === EnShowPurposeUI.FAILED
                                    ? "error"
                                    : row.status === EnShowPurposeUI.SCHEDULED
                                    ? "success"
                                    : row.status === EnShowPurposeUI.REQUESTINFO
                                    ? "warning"
                                    : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography variant="bodyMediumMedium">
                                {row.length}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {" "}
                              <Typography variant="bodyMediumMedium">
                                {row.details}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <ActionMenu
                                row={row}
                                onCallDeleted={refreshCallHistory}
                                onCallEdit={handleEditCall}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {emptyRows > 0 && (
                        <TableRow>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell
                          sx={{
                            height: "calc(100vh - 360px)",
                            textAlign: "center",
                          }}
                          colSpan={100}
                        >
                          <Typography variant="bodyLargeExtraBold" my={2}>
                            No calls found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="bodyMediumMedium" color="grey.600">
                    Show result:
                  </Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={handleChangeRowsPerPage}
                    size="small"
                    sx={{
                      minWidth: "70px",
                      height: "36px",
                      "& .MuiSelect-select": {
                        py: "6px",
                      },
                    }}
                  >
                    {/* <MenuItem value={5}>5</MenuItem> */}
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </Box>
                {/* <TablePagination
                  rowsPerPageOptions={[5, 7, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage="Show result:"
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}

                <Pagination
                  variant="outlined"
                  shape="rounded"
                  count={totalPages}
                  page={page + 1} // MUI Pagination uses 1-based index
                  onChange={(e, page) => handleChangePage(e as any, page)}
                  color="primary"
                  sx={{
                    "& .MuiPaginationItem-previousNext": {
                      border: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                        border: "none",
                      },
                    },
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>
      <CommonDialog
        open={openAddCallDetails}
        onClose={() => {
          setOpenAddCallDetails(false);
          reset();
          setCurrentEditingCall(null); // Reset the editing state when closing
        }}
        confirmButtonType="primary"
        title={currentEditingCall ? "Edit Call" : "Add New Call"}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        loading={loading.data}
        disabled={loading.data}
      >
        <Typography variant="bodyMediumExtraBold" my={2}>
          Person to Call
        </Typography>
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <SearchInput
              {...field}
              open={openContactSearch}
              // key={selectedContact}
              onOpen={handleOpen}
              onClose={handleClose}
              //@ts-ignore
              setSelectedContact={setSelectedContact}
              options={contactOptions}
              loading={loading.input}
              placeholder="Search for a contact..."
              error={!!errors.contact}
              helperText={errors.contact?.phone?.message}
              // disabled={isEditing}
              value={selectedContact}
              defaultValue={selectedContact}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
            />
          )}
        />
        {!isEditing && (
          <Box display="flex" justifyContent="end" mt={2}>
            <CommonButton
              sx={{ width: "50%", float: "right" }}
              text="Add new contact"
              onClick={() => setOpenAddContact(true)}
              startIcon={<img src={addIcon} alt="" />}
            />
          </Box>
        )}

        <Typography variant="bodyMediumExtraBold" my={2}>
          Call Purpose
        </Typography>

        <CustomSelect
          name="callPurpose"
          control={control}
          errors={errors}
          options={callPurposeOptions}
          placeholder="Select Reason"
        />
        <Typography variant="bodyMediumExtraBold" my={2}>
          Scheduled Date & Time
        </Typography>
        <Controller
          name="scheduledCallTime"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
                ampm={false}
                {...field}
                sx={{ width: "100%" }}
                value={value ? dayjs(value) : null}
                onChange={(newValue) => {
                  onChange(
                    newValue ? newValue.format("YYYY-MM-DD HH:mm:ss") : null
                  );
                }}
                slotProps={{
                  textField: {
                    placeholder: "Select Date & Time",
                    error: !!errors.scheduledCallTime,
                    helperText: errors.scheduledCallTime?.message,
                    onKeyDown: (e) => {
                      if (e.key === "Backspace" && value) {
                        e.preventDefault();
                        onChange(null);
                      }
                    },
                  },
                }}
                slots={{ openPickerIcon: calenderIcon }}
              />
            </LocalizationProvider>
          )}
        />

        {/* Appointment ID field */}
        {[
          EnCallPurposeOptionsValues.CANCEL,
          EnCallPurposeOptionsValues.RESCHEDULE,
        ].includes(callPurpose as EnCallPurposeOptionsValues) && (
          <Box mt={2}>
            <Typography variant="bodySmallMedium" color="grey.600" mb={1}>
              Appointment to{" "}
              {callPurpose === EnCallPurposeOptionsValues.RESCHEDULE
                ? "reschedule"
                : "cancel"}
            </Typography>
            <Controller
              name="appointmentId"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  select
                  fullWidth
                  error={!!errors.appointmentId}
                  helperText={errors.appointmentId?.message}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)} // Ensure onChange is properly set
                  placeholder="Select Appointment"
                >
                  {getBookingByUser?.bookings?.map((booking: IBooking) => (
                    <MenuItem
                      key={booking?.booking_id?.toString()}
                      value={booking?.booking_id?.toString()}
                    >
                      {dayjs(booking?.date).format("DD-MM-YYYY")} {" ,"}
                      {booking.start_time}
                    </MenuItem>
                  ))}
                </CommonTextField>
              )}
            />

            {/* <Controller
              name="appointmentId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={1}
                  placeholder="Enter Appointment ID"
                  error={!!errors.appointmentId}
                  helperText={errors.appointmentId?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              )}
            /> */}
          </Box>
        )}

        {/* Add Reason for appointment field */}
        <Box mt={2}>
          <Typography variant="bodySmallMedium" color="grey.600" mb={1}>
            Reason for{" "}
            {callPurpose === EnCallPurposeOptionsValues.BOOK
              ? "appointment"
              : callPurpose === EnCallPurposeOptionsValues.RESCHEDULE
              ? "reschedule"
              : callPurpose === EnCallPurposeOptionsValues.CANCEL
              ? "cancellation"
              : "call"}
          </Typography>

          <Controller
            name="appointmentReason"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                rows={4}
                placeholder="Enter reason for the appointment. If not provided the AI will say the doctor didn't specify"
                error={!!errors.appointmentReason}
                helperText={errors.appointmentReason?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            )}
          />
        </Box>

        {[
          EnCallPurposeOptionsValues.BOOK,
          EnCallPurposeOptionsValues.RESCHEDULE,
        ].includes(callPurpose as EnCallPurposeOptionsValues) && (
          <>
            {/* Add In Person Only toggle */}
            <Box mt={2}>
              <Typography variant="bodyMediumMedium" mb={1}>
                In Person Only?
              </Typography>
              <Box display="flex" gap={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Controller
                    name="inPersonOnly"
                    control={control}
                    render={({ field }) => (
                      <RoundCheckbox
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        label=""
                      />
                    )}
                  />
                  <Typography variant="bodyMediumMedium">Yes</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Controller
                    name="inPersonOnly"
                    control={control}
                    render={({ field }) => (
                      <RoundCheckbox
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        label=""
                      />
                    )}
                  />
                  <Typography variant="bodyMediumMedium">No</Typography>
                </Box>
              </Box>
            </Box>

            {/* Add Book Between section */}
            <Typography variant="bodyMediumMedium" mt={3} mb={1}>
              Book Between
            </Typography>

            {/* From date */}
            <Box mt={2}>
              <Typography variant="bodySmallMedium" color="grey.600" mb={1}>
                From
              </Typography>
              <Controller
                name="bookingStartDate"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      sx={{
                        width: "100%",
                      }}
                      value={value ? dayjs(value) : null}
                      onChange={(newValue) => {
                        onChange(
                          newValue ? newValue.format("YYYY-MM-DD") : null
                        );
                      }}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          error: !!errors.bookingStartDate,
                          helperText: errors.bookingStartDate?.message,
                        },
                      }}
                      slots={{ openPickerIcon: calenderIcon }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            {/* Not Later Than */}
            <Box mt={2}>
              <Typography variant="bodySmallMedium" color="grey.600" mb={1}>
                Not Later Than
              </Typography>
              <Controller
                name="bookingEndDate"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      sx={{
                        width: "100%",
                      }}
                      minDate={dayjs()}
                      value={value ? dayjs(value) : null}
                      onChange={(newValue) => {
                        onChange(
                          newValue ? newValue.format("YYYY-MM-DD") : null
                        );
                      }}
                      slotProps={{
                        textField: {
                          error: !!errors.bookingEndDate,
                          helperText: errors.bookingEndDate?.message,
                        },
                      }}
                      slots={{ openPickerIcon: calenderIcon }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>

            {/* Appointment Length */}
            <Box mt={2}>
              <Typography
                variant="bodySmallMedium"
                color="grey.600"
                mb={1}
                display="flex"
                alignItems="center"
                gap={1}
              >
                Length
                <Box
                  component="span"
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    border: "1px solid #E2E8F0",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                    color: "grey.500",
                  }}
                >
                  i
                </Box>
              </Typography>
              <CustomSelect
                name="appointmentLength"
                control={control}
                errors={errors}
                options={[
                  { label: "15 minutes", value: "15" },
                  { label: "30 minutes", value: "30" },
                  { label: "45 minutes", value: "45" },
                  { label: "1 hour", value: "60" },
                  { label: "1 hour 15 minutes", value: "75" },
                  { label: "1 hour 30 minutes", value: "90" },
                  { label: "1 hour 45 minutes", value: "105" },
                  { label: "2 hours", value: "120" },
                ]}
              />
            </Box>
          </>
        )}

        {!isEditing && (
          <AddContact
            fetchContacts={fetchContacts}
            openDialog={openAddContact}
            setOpenDialog={setOpenAddContact}
          />
        )}
      </CommonDialog>

      <CommonSnackbar
        open={snackbar.open}
        onClose={() =>
          setSnackbar({ message: "", severity: "error", open: false })
        }
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default CallCenter;
