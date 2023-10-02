"use client";

import type { TooltipProps } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

const MaterialTooltip: React.FC<TooltipProps> = ({ ...props }) => {
  return (
    <Tooltip {...props as any} />
  );
};

export default MaterialTooltip;
