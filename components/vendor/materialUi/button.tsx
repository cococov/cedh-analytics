"use client";

import type { ButtonProps } from '@mui/material';
import Button from '@mui/material/Button';

const MaterialArrowRightAltIcon: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button {...props as any} />
  );
};

export default MaterialArrowRightAltIcon;
