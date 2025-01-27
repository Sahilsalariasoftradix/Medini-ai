import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

// Define prop types for the component
interface CommonLinkProps extends Omit<MuiLinkProps, 'component' | 'to'> {
  to: RouterLinkProps['to']; // Specify `to` as a required prop
}

const CommonLink: React.FC<CommonLinkProps> = ({ to, children, sx, ...props }) => {
  return (
    <MuiLink
      component={RouterLink}
      to={to}
      sx={{
        textDecoration: 'none',
        // color: 'secondary.main', // Default styling
        ...sx, // Allow overriding styles
      }}
      {...props}
    >
      {children}
    </MuiLink>
  );
};

export default CommonLink;
