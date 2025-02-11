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
import { useMemo, useState } from "react";
import { RoundCheckbox } from "../../components/common/RoundCheckbox";
import { Chip, Pagination, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { overRideSvgColor } from "../../utils/filters";

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

const CallCenter = () => {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Data>("contact");
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // Add this calculation for total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleRequestSort = (
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
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ px: "12px" }}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <CommonTextField
          startIcon={<img src={searchIcon} alt="down" />}
          placeholder="Search Calls"
          sx={{ maxWidth: "300px", "& .MuiInputBase-input": { py: "11px" } }}
        />
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
    </Box>
  );
};

export default CallCenter;
