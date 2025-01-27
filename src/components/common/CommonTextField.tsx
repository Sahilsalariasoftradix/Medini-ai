import React from 'react';
import { TextField, FormHelperText, TextFieldProps } from '@mui/material';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CommonTextFieldProps extends Omit<TextFieldProps, 'name'> {
  register?: UseFormRegisterReturn; // Optional register prop
  errorMessage?: string; // Error message for validation
}

const CommonTextField: React.FC<CommonTextFieldProps> = ({
  register,
  errorMessage,
  ...props
}) => {
  return (
    <div>
      <TextField 
        fullWidth 
        {...(register ?? {})} // Safely spread register if it exists
        error={!!errorMessage} 
        {...props} 
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
