"use client";

import { createContext, useReducer } from 'react';
/* Vendor */
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useLoadScript } from '@react-google-maps/api';
/* Own */
import type { ImageDialogState, ImageDialogPayload } from '../app/tournaments/[id]/info/TournamentInfo';

/**
 * Default Values
 */
const DEFAULT_VALUES = {
  imageDialogPayload: { isOpen: false, image: '', label: '' } as ImageDialogState,
  isSmallScreen: false,
  isFullScreen: false,
  isPortrait: false,
  isMapLoaded: false,
  toggleImageDialog: (_imageDialogPayload: ImageDialogPayload) => { },
};

/**
 * App Context.
 */
const TournamentInfoContext = createContext(DEFAULT_VALUES);

/**
 * tournamentInfo Provider
 */
export function TournamentInfoProvider({
  children,
}: {
  children: React.ReactNode,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isFullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isPortrait = useMediaQuery('(min-width:600px)');
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });
  const [imageDialogPayload, toggleImageDialog] = useReducer<React.Reducer<ImageDialogState, ImageDialogPayload>>(
    (state, action) => ({ image: action.image ?? '', label: action.label ?? '', isOpen: !state.isOpen }),
    { isOpen: false, image: '', label: '' }
  );

  return (
    <TournamentInfoContext.Provider
      value={{
        isMapLoaded: isLoaded,
        imageDialogPayload,
        isSmallScreen,
        isFullScreen,
        isPortrait,
        toggleImageDialog,
      }}
    >
      {children}
    </TournamentInfoContext.Provider>
  );
};

export default TournamentInfoContext;
