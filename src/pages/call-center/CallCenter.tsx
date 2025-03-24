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
import PrintIcon from "../../assets/icons/printer.svg";
import CancelIcon from "../../assets/icons/cancel-table.svg";
import DeleteIcon from "../../assets/icons/delete-tr.svg";
import SortIcon from "../../assets/icons/arrows-down-up.svg";
import { visuallyHidden } from "@mui/utils";
import CommonTextField from "../../components/common/CommonTextField";
import searchIcon from "../../assets/icons/Search.svg";
import CommonButton from "../../components/common/CommonButton";
import add from "../../assets/icons/add-icn.svg";
import filter from "../../assets/icons/Filter.svg";
import { useEffect, useMemo, useState } from "react";
import { RoundCheckbox } from "../../components/common/RoundCheckbox";
import { Chip, Pagination, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { overRideSvgColor } from "../../utils/filters";
import CommonDialog from "../../components/common/CommonDialog";
import { ICall, IFilm, IGetContacts } from "../../utils/Interfaces";
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
  EnCallPurposeOptions,
  EnCallPurposeOptionsValues,
} from "../../utils/enums";
import { useAuth } from "../../store/AuthContext";
import CommonSnackbar from "../../components/common/CommonSnackbar";
import { createCall, getCompanyUniqueNumber } from "../../api/userApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomSwitch from "../../components/common/CustomSwitch";

interface Data {
  id: number;
  contact: string;
  patientId: string;
  date: string;
  callPurpose: string;
  length: string;
  details: string;
  status?: "Cancel" | "Book" | "Reschedule" | "Request Info";
}
export const rows = [
  createData(
    1,
    "Wiltz, K",
    "Patient123219",
    "January 05, 2025",
    "Cancel",
    "30 min",
    "Please give patient a pharmac...",
    "Follow-up"
  ),
  createData(
    2,
    "Johnson, P",
    "Patient123219",
    "January 02, 2025",
    "Book",
    "15 min",
    "Broken ickle sorcerer",
    "Follow-up"
  ),
  createData(
    3,
    "Hussein, M",
    "Patient123219",
    "January 01, 2025",
    "Reschedule",
    "45 min",
    "Biting vulture-hat mewing phials with",
    "Follow-up"
  ),
  createData(
    4,
    "Gonzalez, L",
    "Patient123220",
    "January 06, 2025",
    "Book",
    "30 min",
    "Chronic back pain issues",
    "Follow-up"
  ),
  createData(
    5,
    "Smith, J",
    "Patient123221",
    "January 07, 2025",
    "Cancel",
    "25 min",
    "Heartburn and indigestion",
    "Follow-up"
  ),
  createData(
    6,
    "Martinez, R",
    "Patient123222",
    "January 08, 2025",
    "Request Info",
    "40 min",
    "Migraine headache symptoms",
    "Follow-up"
  ),
  createData(
    7,
    "Lee, S",
    "Patient123223",
    "January 09, 2025",
    "Request Info",
    "20 min",
    "Anxiety and stress management",
    "Follow-up"
  ),
  createData(
    8,
    "Taylor, D",
    "Patient123224",
    "January 10, 2025",
    "Request Info",
    "15 min",
    "Allergic reaction to pollen",
    "Follow-up"
  ),
  createData(
    9,
    "Brown, C",
    "Patient123225",
    "January 11, 2025",
    "Request Info",
    "35 min",
    "Severe coughing fits",
    "Follow-up"
  ),
  createData(
    10,
    "Kim, H",
    "Patient123226",
    "January 12, 2025",
    "Book",
    "25 min",
    "Routine physical checkup",
    "Follow-up"
  ),
  createData(
    11,
    "Davis, N",
    "Patient123227",
    "January 13, 2025",
    "Cancel",
    "30 min",
    "Knee injury after sports",
    "Follow-up"
  ),
  createData(
    12,
    "White, A",
    "Patient123228",
    "January 14, 2025",
    "Reschedule",
    "40 min",
    "Skin rash and irritation",
    "Follow-up"
  ),
  createData(
    13,
    "Evans, M",
    "Patient123229",
    "January 15, 2025",
    "Book",
    "20 min",
    "Ear infection treatment",
    "Follow-up"
  ),
  createData(
    14,
    "Wilson, B",
    "Patient123230",
    "January 16, 2025",
    "Cancel",
    "30 min",
    "Blood pressure monitoring",
    "Follow-up"
  ),
  createData(
    15,
    "Moore, T",
    "Patient123231",
    "January 17, 2025",
    "Reschedule",
    "45 min",
    "Flu-like symptoms",
    "Follow-up"
  ),
  createData(
    16,
    "Taylor, J",
    "Patient123232",
    "January 18, 2025",
    "Book",
    "15 min",
    "Pregnancy test consultation",
    "Follow-up"
  ),
  createData(
    17,
    "Martin, C",
    "Patient123233",
    "January 19, 2025",
    "Cancel",
    "30 min",
    "Back pain after lifting heavy",
    "Follow-up"
  ),
  createData(
    18,
    "Hernandez, G",
    "Patient123234",
    "January 20, 2025",
    "Reschedule",
    "35 min",
    "Sore throat and cough",
    "Follow-up"
  ),
  createData(
    19,
    "Lee, K",
    "Patient123235",
    "January 21, 2025",
    "Book",
    "25 min",
    "Childhood vaccination",
    "Follow-up"
  ),
  createData(
    20,
    "King, W",
    "Patient123236",
    "January 22, 2025",
    "Cancel",
    "40 min",
    "Tiredness and fatigue",
    "Follow-up"
  ),
  createData(
    21,
    "Graham, R",
    "Patient123237",
    "January 23, 2025",
    "Reschedule",
    "15 min",
    "Chronic headache issues",
    "Follow-up"
  ),
  createData(
    22,
    "Green, J",
    "Patient123238",
    "January 24, 2025",
    "Book",
    "30 min",
    "Diabetes management",
    "Follow-up"
  ),
  createData(
    23,
    "Adams, F",
    "Patient123239",
    "January 25, 2025",
    "Cancel",
    "25 min",
    "Seasonal allergies",
    "Follow-up"
  ),
  createData(
    24,
    "Scott, V",
    "Patient123240",
    "January 26, 2025",
    "Reschedule",
    "35 min",
    "Chest pain and pressure",
    "Follow-up"
  ),
  createData(
    25,
    "Nelson, E",
    "Patient123241",
    "January 27, 2025",
    "Book",
    "20 min",
    "Sprained ankle recovery",
    "Follow-up"
  ),
  createData(
    26,
    "Carter, D",
    "Patient123242",
    "January 28, 2025",
    "Cancel",
    "15 min",
    "Abdominal cramps",
    "Follow-up"
  ),
  createData(
    27,
    "Morris, P",
    "Patient123243",
    "January 29, 2025",
    "Reschedule",
    "45 min",
    "Infection after surgery",
    "Follow-up"
  ),
  createData(
    28,
    "Baker, J",
    "Patient123244",
    "January 30, 2025",
    "Book",
    "40 min",
    "Routine physical exam",
    "Follow-up"
  ),
  createData(
    29,
    "Perez, A",
    "Patient123245",
    "February 01, 2025",
    "Cancel",
    "30 min",
    "Severe nausea",
    "Follow-up"
  ),
  createData(
    30,
    "Harris, T",
    "Patient123246",
    "February 02, 2025",
    "Reschedule",
    "25 min",
    "Urinary tract infection",
    "Follow-up"
  ),
  createData(
    31,
    "Martin, D",
    "Patient123247",
    "February 03, 2025",
    "Book",
    "20 min",
    "Headache and dizziness",
    "Follow-up"
  ),
  createData(
    32,
    "Clark, B",
    "Patient123248",
    "February 04, 2025",
    "Cancel",
    "35 min",
    "Earache and blocked ear",
    "Follow-up"
  ),
  createData(
    33,
    "Rodriguez, P",
    "Patient123249",
    "February 05, 2025",
    "Reschedule",
    "45 min",
    "Knee pain from injury",
    "Follow-up"
  ),
  createData(
    34,
    "Lewis, J",
    "Patient123250",
    "February 06, 2025",
    "Book",
    "30 min",
    "Cold and cough symptoms",
    "Follow-up"
  ),
  createData(
    35,
    "Young, T",
    "Patient123251",
    "February 07, 2025",
    "Cancel",
    "15 min",
    "Food poisoning",
    "Follow-up"
  ),
  createData(
    36,
    "Walker, K",
    "Patient123252",
    "February 08, 2025",
    "Reschedule",
    "40 min",
    "Numbness in hands",
    "Follow-up"
  ),
  createData(
    37,
    "Allen, R",
    "Patient123253",
    "February 09, 2025",
    "Book",
    "30 min",
    "Chronic fatigue syndrome",
    "Follow-up"
  ),
  createData(
    38,
    "Hill, F",
    "Patient123254",
    "February 10, 2025",
    "Cancel",
    "45 min",
    "Asthma flare-up",
    "Follow-up"
  ),
  createData(
    39,
    "Collins, S",
    "Patient123255",
    "February 11, 2025",
    "Reschedule",
    "25 min",
    "Sinus congestion",
    "Follow-up"
  ),
  createData(
    40,
    "Gonzalez, T",
    "Patient123256",
    "February 12, 2025",
    "Book",
    "20 min",
    "High cholesterol consultation",
    "Follow-up"
  ),
  createData(
    41,
    "Anderson, M",
    "Patient123257",
    "February 13, 2025",
    "Cancel",
    "35 min",
    "Stomach cramps",
    "Follow-up"
  ),
  createData(
    42,
    "Harris, K",
    "Patient123258",
    "February 14, 2025",
    "Reschedule",
    "40 min",
    "Muscle spasms in back",
    "Follow-up"
  ),
  createData(
    43,
    "Mitchell, E",
    "Patient123259",
    "February 15, 2025",
    "Book",
    "25 min",
    "Skin rash and blisters",
    "Follow-up"
  ),
  createData(
    44,
    "Perez, N",
    "Patient123260",
    "February 16, 2025",
    "Cancel",
    "30 min",
    "Severe abdominal pain",
    "Follow-up"
  ),
  createData(
    45,
    "Roberts, L",
    "Patient123261",
    "February 17, 2025",
    "Reschedule",
    "15 min",
    "Dizzy spells",
    "Follow-up"
  ),
  createData(
    46,
    "Jackson, F",
    "Patient123262",
    "February 18, 2025",
    "Book",
    "20 min",
    "Fever and chills",
    "Follow-up"
  ),
  createData(
    47,
    "Taylor, M",
    "Patient123263",
    "February 19, 2025",
    "Cancel",
    "25 min",
    "Cold and cough",
    "Follow-up"
  ),
  createData(
    48,
    "Lopez, R",
    "Patient123264",
    "February 20, 2025",
    "Reschedule",
    "35 min",
    "Severe headaches",
    "Follow-up"
  ),
  createData(
    49,
    "King, L",
    "Patient123265",
    "February 21, 2025",
    "Book",
    "40 min",
    "Blood sugar regulation",
    "Follow-up"
  ),
  createData(
    50,
    "Nguyen, P",
    "Patient123266",
    "February 22, 2025",
    "Cancel",
    "30 min",
    "Upper back pain",
    "Follow-up"
  ),
];
function createData(
  id: number,
  contact: string,
  patientId: string,
  date: string,
  status: Data["status"],
  length: string,
  details: string,
  callPurpose: string
): Data {
  return {
    id,
    contact,
    patientId,
    date,
    status,
    length,
    details,
    callPurpose,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

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

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  sortable: boolean; // Add this property
}

const headCells: readonly HeadCell[] = [
  {
    id: "contact",
    numeric: false,
    disablePadding: true,
    label: "Contact",
    sortable: true, // Add this property
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    sortable: true, // Add this property
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Call Purpose",
    sortable: true, // Add this property
  },
  {
    id: "length",
    numeric: false,
    disablePadding: false,
    label: "Length",
    sortable: true, // Add this property
  },
  {
    id: "details",
    numeric: false,
    disablePadding: false,
    label: "Details",
    sortable: true, // Add this property
  },
  {
    id: "actions" as keyof Data,
    numeric: false,
    disablePadding: false,
    label: "Actions",
    sortable: false, // Add this property
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
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

const ActionMenu = ({ row }: { row: Data }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent row selection when clicking menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent row selection when clicking menu items
    setAnchorEl(null);
  };

  const handleAction =
    (action: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      switch (action) {
        case "edit":
          console.log("Edit", row);
          break;
        case "print":
          console.log("Print", row);
          break;
        case "cancel":
          console.log("Cancel", row);
          break;
        case "delete":
          console.log("Delete", row);
          break;
      }
      handleClose(event);
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
        <MenuItem onClick={handleAction("print")} sx={{ gap: 1 }}>
          <img src={PrintIcon} alt="" />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            {" "}
            Print
          </Typography>
        </MenuItem>
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
});

type AddCallSchema = z.infer<typeof addCallSchema>;

const callPurposeOptions = [
  {
    label: EnCallPurposeOptions.REQUESTINFO,
    value: EnCallPurposeOptionsValues.REQUESTINFO,
  },
  { label: EnCallPurposeOptions.BOOK, value: EnCallPurposeOptionsValues.BOOK },
  {
    label: EnCallPurposeOptions.CANCEL,
    value: EnCallPurposeOptionsValues.CANCEL,
  },
  {
    label: EnCallPurposeOptions.RESCHEDULE,
    value: EnCallPurposeOptionsValues.RESCHEDULE,
  },
  {
    label: EnCallPurposeOptions.INFORMPATIENT,
    value: EnCallPurposeOptionsValues.INFORMPATIENT,
  },
];
const CallCenter = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("contact");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openAddCallDetails, setOpenAddCallDetails] = useState(false);
  const [contacts, setContacts] = useState<IGetContacts>([]);
  // Search contact inputs
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [openAddContact, setOpenAddContact] = useState(false);
  const [companyPhone, setCompanyPhone] = useState("");
  //@ts-ignore
  const [isEditing, setIsEditing] = useState(false);
  //@ts-ignore
  const [options, setOptions] = useState<readonly IFilm[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });
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
      appointmentId: "",
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
    const contactList = await getContactsByUserId(userDetails?.user_id);
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
  const totalPages = Math.ceil(rows.length / rowsPerPage);

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
      const newSelected = rows.map((n) => n.id);
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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...rows]
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  const onSubmit = async (data: AddCallSchema) => {
    const callData: ICall = {
      user_id: userDetails?.user_id,
      to: data.contact.phone,
      from: companyPhone,
      agenda: data.callPurpose,
      customer_name: data.contact.title,
    };
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
        break;
      case EnCallPurposeOptionsValues.RESCHEDULE:
        callData.reschedule_appointment_reason = data.appointmentReason;
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
        break;
    }
    setLoading({ ...loading, data: true });
    try {
      const response = await createCall(callData);
      if (response && response.success) {
        setOpenAddCallDetails(false);
        reset();
        setSnackbar({
          open: true,
          message: "Call created successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Unable to create call record",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Unable to create call record",
        severity: "error",
      });
    } finally {
      setLoading({ ...loading, data: false });
    }
  };

  const [pendingCalls, setPendingCalls] = useState(false);

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
          sx={{ maxWidth: "300px", "& .MuiInputBase-input": { py: "11px" } }}
        />
        <Box display={"flex"} alignItems={"center"} gap={2} minWidth={"300px"}>
          <Typography variant="bodyMediumMedium" color="grey.600" mr={2.5}>
            Pending Calls
          </Typography>
          <CustomSwitch
            name="pendingCalls"
            checked={pendingCalls}
            onChange={(e) => setPendingCalls(e.target.checked)}
          />
          <Typography variant="bodyMediumMedium" color="grey.600">
            Completed Calls
          </Typography>
          {/* <CustomSwitch name="completedCalls" /> */}
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
            onClick={() => {
              setOpenAddCallDetails(true);
              setSelectedContact(null);
            }}
            sx={{ py: "11px", px: "20px" }}
          />
          <CommonButton
            variant="outlined"
            startIcon={<img src={filter} alt="filter" />}
            text="Filters"
            sx={{ py: "11px", px: "20px" }}
          />
        </Box>
      </Box>
      <Box sx={{ width: "100%" }} mt={4}>
        <Paper sx={{ width: "100%", mb: 2, boxShadow: "none", p: 0 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
          <TableContainer sx={{ height: "calc(100vh - 300px)" }}>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
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
                            row.status === "Cancel"
                              ? "error"
                              : row.status === "Book"
                              ? "success"
                              : row.status === "Reschedule"
                              ? "warning"
                              : row.status === "Request Info"
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
                        <ActionMenu row={row} />
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
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
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
        </Paper>
      </Box>
      <CommonDialog
        open={openAddCallDetails}
        onClose={() => {
          setOpenAddCallDetails(false);
          reset();
          // setIsEditing(false);
        }}
        confirmButtonType="primary"
        title={"Call Details"}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        // loading={loading.data}
        // disabled={loading.data}
      >
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
              setSelectedContact={setSelectedContact}
              options={contactOptions}
              loading={loading.input}
              placeholder="Search contacts..."
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
          Details
        </Typography>

        <CustomSelect
          name="callPurpose"
          control={control}
          errors={errors}
          options={callPurposeOptions}
          placeholder="Call Purpose"
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
            />
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
