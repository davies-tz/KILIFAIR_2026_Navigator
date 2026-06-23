export type LatLngTuple = [number, number];

export type BoothPolygon = LatLngTuple[];

export type LocationStatus = "idle" | "loading" | "ready" | "denied" | "unavailable" | "error";

export type MapCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ExhibitorWithBooth = {
  id: string;
  companyName: string;
  slug: string;
  description: string;
  services: string[];
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  linkedin?: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  booth?: {
    id: string;
    boothNumber: string;
    hall: string;
    latitude: number;
    longitude: number;
    polygon?: BoothPolygon | unknown | null;
  } | null;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
};
