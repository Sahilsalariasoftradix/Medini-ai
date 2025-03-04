import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { TimeSlot } from "../../types/calendar";

interface TimeGridProps {
  slots: TimeSlot[];
  isTimeLabelsOnly?: boolean;
  isWeekend?: boolean;
  hideTimeLabels?: boolean;
}

export function TimeGrid({
  slots,
  isTimeLabelsOnly,
  isWeekend,
  hideTimeLabels,
}: TimeGridProps) {
  return (
    <Paper elevation={0} className={`h-full ${isWeekend ? "bg-slate-50" : ""}`}>
      <Grid container direction="column" spacing={1}>
        {slots.map((slot, index) => (
          <Grid key={index} className="flex items-center p-1">
            {(!hideTimeLabels || isTimeLabelsOnly) && (
              <Typography variant="caption" className="w-12 text-gray-500">
                {slot.time}
              </Typography>
            )}
            {!isTimeLabelsOnly && (
              <>icosn</>
              /* <StatusIcon status={slot.status} fontSize="small" /> */
            )}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
