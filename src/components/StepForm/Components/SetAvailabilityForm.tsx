import { Box, Divider, Typography } from "@mui/material";
import { availabilityIcons } from "../../../utils/Icons";
import CommonDialog from "../../common/CommonDialog";
import CustomSwitch from "../../common/CustomSwitch";
import AvailabilityTimePicker from "./AvailabilityTimePicker";
import { RoundCheckbox } from "../../common/RoundCheckbox";
import CommonSnackbar from "../../common/CommonSnackbar";
import {
  dayDataMapping,
  displayDays,
  formatDays,
  getDaysData,
} from "../../../utils/common";
import { useState } from "react";

const SetAvailabilityForm = ({
  availabilityForm,
  handleAvailabilitySubmit,
  available,
  setAvailable,
  repeat,
  setRepeat,
  checkedDays,
  handleCheckboxChange,
  handleDayClick,
  formatTimeSlot,
  weeklyAvailability,
  dayMapping,
  isAvailabilityModalOpen,
  setIsAvailabilityModalOpen,
  loading,
  snackbar,
  handleSnackbarClose,
}: {
  availabilityForm: any;
  handleAvailabilitySubmit: any;
  available: boolean;
  setAvailable: any;
  repeat: boolean;
  setRepeat: any;
  checkedDays: string[];
  handleCheckboxChange: any;
  handleDayClick: any;
  formatTimeSlot: any;
  weeklyAvailability: any;
  dayMapping: any;
  isAvailabilityModalOpen: boolean;
  setIsAvailabilityModalOpen: any;
  loading: boolean;
  snackbar: any;
  handleSnackbarClose: any;
}) => {
  const [backupAvailability, setBackupAvailability] = useState({});

  return (
    <Box sx={{ mt: 2, display: "flex", width: "100%", gap: 0 }}>
      <Box width={"50px"}>
        {displayDays.map((item, index) => (
          <Box
            key={index}
            sx={{
              borderLeft: index !== 0 ? "1px solid #E2E8F0" : "",
              borderTop: index === 1 ? "1px solid #E2E8F0" : "",
              borderBottom: index === 7 ? "1px solid #E2E8F0" : "",
              borderTopLeftRadius: index === 1 ? "16px" : "",
              borderBottomLeftRadius: index === 7 ? "16px" : "",
            }}
          >
            <Typography
              sx={{
                fontSize: "14px",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                lineHeight: "21px",
                color: "#1A202C",
              }}
            >
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", width: "100%" }}>
        {[
          {
            icon: availabilityIcons.phone,
            name: "Phone Only",
            bgColor: "grey.200",
            type: "phone",
          },
          {
            icon: availabilityIcons.in_person,
            name: "In Person or Phone",
            bgColor: "primary.light4",
            type: "in_person",
          },
          {
            icon: availabilityIcons.break,
            name: "Break",
            bgColor: "#DFF1E6",
            type: "break",
          },
        ].map((item, itemIndex) => (
          <div key={itemIndex} style={{ width: "100%" }}>
            <Box
              sx={{
                border: "1px solid #E2E8F0",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                backgroundColor: item.bgColor,
                height: "50px",
                textAlign: "center",
                gap: 1,
              }}
            >
              <img
                src={item.icon}
                alt={item.name}
                height={"18px"}
                width={"18px"}
                style={{ marginTop: "5px" }}
              />
              <Typography color="grey.600" variant="bodyXSmallRegular">
                {item.name}
              </Typography>
            </Box>

            {dayDataMapping.map((day, index) => (
              <Box
                key={day + index}
                sx={{
                  borderLeft: "1px solid #0000001A",
                  borderRight: "1px solid #0000001A",
                  borderEndEndRadius:
                    itemIndex === 2 && index === 6 ? "16px" : "",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event bubbling
                  handleDayClick(day, item.type);
                }}
              >
                <Typography
                  sx={{
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: index === 6 ? "1px solid #E2E8F0" : "",
                    borderEndEndRadius:
                      itemIndex === 2 && index === 6 ? "16px" : "",
                  }}
                  variant="bodySmallMedium"
                >
                  {(() => {
                    const slot =
                      itemIndex === 0
                        ? weeklyAvailability[dayMapping[day]]?.phone
                        : itemIndex === 1
                          ? weeklyAvailability[dayMapping[day]]?.in_person
                          : weeklyAvailability[dayMapping[day]]?.break;

                    return formatTimeSlot(slot) === "Unavailable" ? (
                      <Box
                        bgcolor={"primary.light4"}
                        color={"grey.600"}
                        sx={{
                          width: "80%",
                          height: "80%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50px",
                        }}
                      >
                        Unavailable
                      </Box>
                    ) : (
                      formatTimeSlot(slot)
                    );
                  })()}
                </Typography>
              </Box>
            ))}
          </div>
        ))}
      </Box>
      <CommonDialog
        open={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
        title={`Add Availability for ${formatDays(checkedDays)[0] ?? ""} `}
        cancelText="Cancel"
        confirmText={available ? "Mark Available" : "Mark Unavailable"}
        onConfirm={availabilityForm.handleSubmit(handleAvailabilitySubmit)}
        loading={loading}
        disabled={loading}
        confirmButtonType={available ? "primary" : "error"}
      >
        <Divider sx={{ my: 2 }} />
        <Box
          display={"flex"}
          gap={1}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="bodyMediumExtraBold">
            Mark as available
          </Typography>
          <CustomSwitch
            name="available"
            checked={available}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setAvailable(isChecked);

              if (!isChecked) {
                // Save current values before resetting
                setBackupAvailability(availabilityForm.getValues());
                availabilityForm.reset({
                  phone: { from: "", to: "" },
                  in_person: { from: "", to: "" },
                  break: { from: "", to: "" },
                });
              } else {
                // Restore previous values when toggled back on
                availabilityForm.reset(backupAvailability);
              }
            }}
          />
        </Box>

        {available && (
          <Box sx={{ mt: 2 }}>
            {["in_person", "phone", "break"].map((key) => (
              <Box key={key} mt={3}>
                <Box display="flex" gap={1} alignItems="center">
                  <Box
                    component="img"
                    sx={{ height: 21, width: 21 }}
                    //@ts-ignore
                    alt={availabilityIcons[key]}
                    //@ts-ignore
                    src={availabilityIcons[key]}
                  />
                  <Typography variant="bodyMediumExtraBold">
                    {key === "in_person"
                      ? "In Person"
                      : key === "phone"
                        ? "Calls Only"
                        : "Break"}
                  </Typography>
                </Box>
                <Box display="flex" mt={1} gap={3}>
                  <AvailabilityTimePicker
                    availabilityForm={availabilityForm}
                    autoFocus={key === "in_person"}
                    label="From"
                    name={`${key}.from`}
                  />
                  <AvailabilityTimePicker
                    availabilityForm={availabilityForm}
                    // autoFocus={key === "in_person"}
                    label="To"
                    name={`${key}.to`}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box
          display={"flex"}
          my={2}
          justifyContent={"space-between"}
          gap={1}
          alignItems={"center"}
        >
          <Typography variant="bodyMediumExtraBold">Repeat</Typography>
          <CustomSwitch
            name="repeat"
            checked={repeat}
            onChange={(e) => setRepeat(e.target.checked)}
          />
        </Box>
        {repeat && (
          <Box
            display={"flex"}
            sx={{
              p: 2,
              border: "1px solid #E6E6E6",
              borderRadius: "16px",
              overflowX: "auto",
            }}
            alignItems={"center"}
          >
            {dayDataMapping.map((day, index) => (
              <RoundCheckbox
                labelMargin={"8px"}
                labelPlacement="top"
                key={index}
                activeLabel={
                  checkedDays.includes(day) ? getDaysData[index] : undefined
                }
                label={getDaysData[index]}
                checked={checkedDays.includes(day)}
                onChange={() => {
                  if (day === checkedDays[0] && checkedDays.includes(day)) {
                    return;
                  }
                  handleCheckboxChange(day);
                }}
                disabled={day === checkedDays[0] && checkedDays.includes(day)}
              />
            ))}
          </Box>
        )}

        <CommonSnackbar
          open={snackbar.open}
          onClose={handleSnackbarClose}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </CommonDialog>
    </Box>
  );
};

export default SetAvailabilityForm;
