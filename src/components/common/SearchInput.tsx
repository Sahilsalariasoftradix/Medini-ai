import React from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import searchIcon from "../../assets/icons/search-Input.svg";
import { ISearchInputProps } from "../../utils/Interfaces";

export default function SearchInput({
  options,
  loading = false,
  onOpen,
  onClose,
  open,
  placeholder = "Search...",
  onChange,
  error,
  disabled,
  value,
  defaultValue,
  getOptionLabel = (option) => option.title,
  isEditing,
  setSelectedContact,
}: ISearchInputProps) {
  // console.log(error);
  return (
    <>
      <Autocomplete
        open={open}
        onOpen={onOpen}
        sx={{
          "& .MuiInputBase-root": {
            border:
              error || (isEditing && value === null)
                ? "1px solid #FF0000"
                : "1px solid #E2E8F0",
          },
        }}
        onClose={onClose}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={getOptionLabel}
        options={options}
        loading={loading}
        onChange={(_, value) => onChange?.(value)}
        //@ts-ignore
        onInputChange={(event, newInputValue, reason) => {
          // console.log(newInputValue,'lll')
          if (reason === "clear") {
            setSelectedContact?.(null);
            return;
          }
        }}
        disabled={disabled}
        value={value}
        defaultValue={isEditing ? defaultValue : value}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              placeholder={placeholder}
              disabled={disabled}
              fullWidth
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment sx={{ pl: 2 }} position="start">
                      <img src={searchIcon} alt="search" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <React.Fragment>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                },
              }}
            />
            {error && (
              <FormHelperText sx={{ marginLeft: "14px", marginRight: "14px" }}>
                Please select a contact
              </FormHelperText>
            )}
            {/* {isEditing && value === null && (
              <FormHelperText sx={{ marginLeft: "14px", marginRight: "14px" }}>
                {"Please select a contact"}
              </FormHelperText>
            )} */}
          </>
        )}
      />
    </>
  );
}
