"use client";

import type { TooltipProps } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

const MaterialTooltip: React.FC<TooltipProps> = ({ ...props }) => {
  return (
    <Tooltip {...props as any} />
  );
};

export default MaterialTooltip;
