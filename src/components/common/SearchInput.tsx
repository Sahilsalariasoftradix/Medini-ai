import React, { useState } from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import searchIcon from "../../assets/icons/search-Input.svg";

interface Option {
  title: string;
  year?: number;
  [key: string]: any;
}

interface SearchInputProps {
  options: readonly Option[];
  loading?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  open?: boolean;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  error?: boolean;
  helperText?: string;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export default function SearchInput({
  options,
  loading = false,
  onOpen,
  onClose,
  open,
  placeholder = "Search...",
  onChange,
  error,
  helperText,
}: SearchInputProps) {
  return (
    <>
      <Autocomplete  
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.title}
        options={options}
        loading={loading}
        onChange={(_, value) => onChange?.(value)}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              placeholder={placeholder}
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
            {error && <FormHelperText>{helperText}</FormHelperText>}
          </>
        )}
      />
    </>
  );
}
