"use client";

import { useContext } from 'react';
import Image from 'next/image';
/* Vendor */
import { GoogleMap, Marker, OverlayView } from '@react-google-maps/api';
import { CircularProgress } from "@nextui-org/react";
/* Own */
import TournamentInfoContext from '@/contexts/tournamentInfoStore';

export default function GoogleMapWithLoadingAndPreviewImages({
  placeCoords,
  placeName,
  mapClassName,
  placePhotos,
  placePhotosClassName,
  placePhotoClassName,
  basePathImages,
}: {
  placeCoords: { lat: number, lng: number },
  placeName: string,
  mapClassName?: string,
  placePhotos?: { image: string, label: string }[],
  placePhotosClassName?: string,
  placePhotoClassName?: string,
  basePathImages?: string,
}) {
  const { isMapLoaded, isSmallScreen, isPortrait, toggleImageDialog } = useContext(TournamentInfoContext);

  return (
    <>
      {
        isMapLoaded ? (
          <GoogleMap zoom={12} center={placeCoords} mapContainerClassName={mapClassName} >
            <Marker key="marker_pointer" position={placeCoords} visible={true} />
            <OverlayView
              key='marker_overview'
              position={placeCoords}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <div
                style={{
                  background: `#203254`,
                  padding: `7px 12px`,
                  fontSize: '11px',
                  color: `white`,
                  borderRadius: '4px',
                }}
              >
                {placeName}
              </div>
            </OverlayView>
          </GoogleMap>
        ) : <CircularProgress size="lg" color="secondary" aria-label="Loading..." />
      }
      {!!placePhotos && (
        <span className={placePhotosClassName}>
          {placePhotos.map(({ image, label }, i) => (
            <span key={`span-place-photos-${i}`} className={placePhotoClassName} onClick={() => toggleImageDialog({ image: `${basePathImages}/${image}`, label: label })} >
              <Image
                key={`image-place-photos-${i}`}
                src={`${basePathImages}/${image}`}
                alt={`place-photo-${i}`}
                height={isSmallScreen ? (isPortrait ? 140.6 : 224) : 112}
                width={isSmallScreen ? (isPortrait ? 250 : 400) : 200}
              />
            </span>
          ))}
        </span>
      )}
    </>
  );
};