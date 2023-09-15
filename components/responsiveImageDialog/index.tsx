"use client";

import React, { Dispatch, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import TournamentInfoContext from '../../contexts/tournamentInfoStore';

type ImageDialogPayload = { isOpen: boolean; image?: string, label?: string };

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: Dispatch<ImageDialogPayload>;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));


const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose as () => void}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function ResponsiveImageDialog() {
  const { imageDialogPayload, toggleImageDialog, isFullScreen, isPortrait } = useContext(TournamentInfoContext);

  return (
    <div>
      <BootstrapDialog
        fullScreen={isFullScreen}
        open={imageDialogPayload.isOpen}
        onClose={toggleImageDialog}
        aria-labelledby="responsive-dialog-title"
        maxWidth="md"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={toggleImageDialog}>
          {imageDialogPayload.label}
        </BootstrapDialogTitle >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={imageDialogPayload.image || "/images/fblthp.jpg"}
            alt={imageDialogPayload.label || 'image'}
            layout="fixed"
            height={isFullScreen ? (isPortrait ? 448 : 224) : 448}
            width={isFullScreen ? (isPortrait ? 800 : 400) : 800}
            quality={100}
          />
        </DialogContent>
      </BootstrapDialog>
    </div >
  );
};
