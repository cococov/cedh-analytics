interface PlaceCoords {
  lat: number;
  lng: number;
}

interface ImageDialogState {
  isOpen: boolean;
  image?: string;
  label?: string;
}

interface ImageDialogPayload {
  image?: string;
  label?: string;
}

interface Auspices {
  name: string;
  image: string;
  link?: string;
  rectangle?: boolean;
  bigLogo?: boolean;
}

interface Contact {
  kind: string;
  value: string;
}

interface Price {
  place: string;
  name: string;
  info: string;
  image: string;
  isCard: boolean;
  small?: boolean;
}

interface placePhoto {
  label: string;
  image: string;
}

interface schedule {
  time: string;
  event: string;
}

interface EventInfo {
  date: string;
  cost: string[];
  costDisclaimer?: string;
  placeCoords: PlaceCoords;
  placeName: string;
  placeDirection: string;
  placePhotos?: placePhoto[];
  prices: Price[];
  quorum: string;
  rules: string[];
  mode: (string | string[])[];
  schedule: schedule[];
  disclaimer?: string | null;
  contact: Contact[];
  auspices: Auspices[];
}

interface EventData {
  name: string;
  showName: boolean;
  id: string;
  bookmark: string;
  imageName?: string | null;
  serie: string;
  number: number;
  hidden: boolean;
}

interface InfoProps {
  tournamentInfo: Required<EventInfo & EventData>;
}

interface ServerSideParams {
  params: { id: string; name: string; };
  res: { setHeader(name: string, value: string): void; };
};

interface ServerSideAnswer {
  props?: { tournamentInfo: EventData | EventInfo; };
  notFound?: boolean;
};

export {
  PlaceCoords,
  ImageDialogState,
  ImageDialogPayload,
  Auspices,
  Contact,
  Price,
  placePhoto,
  EventInfo,
  EventData,
  InfoProps,
  ServerSideParams,
  ServerSideAnswer,
};
