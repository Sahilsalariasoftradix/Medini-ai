import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { StatusCounts } from "../../types/calendar";
import available from "../../assets/icons/available.svg";
import cancel from "../../assets/icons/cancelled.svg";
import active from "../../assets/icons/active.svg";
import unconfirmed from "../../assets/icons/unconfirmed.svg";

interface StatusTotalsProps {
  counts: StatusCounts;
}

const statusItems = [
  { label: "active", icon: active, color: "#E5F0E2" },
  { label: "cancelled", icon: cancel, color: "#F0E3E2" },
  { label: "unconfirmed", icon: unconfirmed, color: "#FFF8D0" },
  { label: "available", icon: available, color: "#F7FAFC" },
];

function StatusItem({
  label,
  icon,
  count,
  color,
}: {
  label: string;
  icon: string;
  count: number;
  color: string;
}) {

  return (
    <Grid size={6} display={"flex"} gap={1} alignItems={"center"}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          backgroundColor: color,
          borderRadius: "20px",
          height: "27px",
          width: "20px",
          padding: color === "transparent" ? "0" : "2px",
        }}
      >
        <img src={icon} alt={label} />
      </Box>
      <Typography variant="caption" className="ml-1">
        x{count}
      </Typography>
    </Grid>
  );
}

export function StatusTotals({ counts }: StatusTotalsProps) {
  return (
    <Paper sx={{ boxShadow: "none" }} elevation={0} className="p-4 mt-4">
      <Grid container spacing={2}>
        {statusItems.map((item) => (
          <StatusItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            count={counts[item.label as keyof StatusCounts]}
            color={item.color}
          />
        ))}
      </Grid>
    </Paper>
  );
}
