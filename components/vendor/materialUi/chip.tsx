"use client";

import type { ChipProps } from '@mui/material';
import Chip from '@mui/material/Chip';

const MaterialChip: React.FC<ChipProps> = ({ ...props }) => {
  return (
    <Chip {...props as any} />
  );
};

export default MaterialChip;
