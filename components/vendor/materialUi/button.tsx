"use client";

import type { ButtonProps } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const MaterialArrowRightAltIcon: React.FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button {...props as any} />
  );
};

export default MaterialArrowRightAltIcon;
