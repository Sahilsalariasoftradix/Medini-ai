import React from 'react';
import { TextField, FormHelperText, TextFieldProps, InputAdornment } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CommonTextFieldProps extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegisterReturn; // Optional register prop
  errorMessage?: string; // Error message for validation
  startIcon?: React.ReactNode; // Accepts an icon component
}

const CommonTextField: React.FC<CommonTextFieldProps> = ({
  register,
  errorMessage,
  startIcon,
  ...props
}) => {
  return (
    <div>
      <TextField 
        fullWidth 
        {...(register ?? {})} // Safely spread register if it exists
        error={!!errorMessage} 
        {...props} 
        slotProps={{
          input: {
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : null,
          },
        }}
      />
      {errorMessage && (
        <FormHelperText error>
          {errorMessage}
        </FormHelperText>
      )}
    </div>
  );
};

export default CommonTextField;
