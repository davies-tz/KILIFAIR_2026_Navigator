import type { BoothPolygon, LatLngTuple } from "@/types";

export const EXPO_BOUNDS: [LatLngTuple, LatLngTuple] = [[0, 0], [920, 1420]];
export const KILIFAIR_MAP_CENTER: LatLngTuple = [460, 710];
export const KILIFAIR_MAP_ZOOM = -1;
export const KILIFAIR_SELECTED_ZOOM = 0;
export const DEMO_ENTRANCE_LOCATION: LatLngTuple = [86, 88];

export const EXPO_ZONES = [
  { name: "Gate A / Entrance", kind: "Access", polygon: [[40, 30], [40, 260], [135, 260], [135, 30]] },
  { name: "Food Court", kind: "Food stalls", polygon: [[55, 1090], [55, 1350], [170, 1350], [170, 1090]] },
  { name: "B2B Networking", kind: "Business lounge", polygon: [[700, 520], [700, 870], [860, 870], [860, 520]] },
  { name: "VIP & Buyer Lounge", kind: "Lounge", polygon: [[700, 900], [700, 1250], [860, 1250], [860, 900]] },
  { name: "Stage Audience", kind: "Program area", polygon: [[210, 1080], [210, 1350], [380, 1350], [380, 1080]] },
  { name: "Seminar / Workshop", kind: "Program area", polygon: [[500, 1080], [500, 1350], [650, 1350], [650, 1080]] },
  { name: "Media", kind: "Press area", polygon: [[395, 1080], [395, 505], [465, 505], [465, 1080]] },
] as const;

const SECTION_BASE: Record<string, { x: number; y: number; hall: string }> = {
  A: { x: 170, y: 130, hall: "4x4 Vehicles / Safari Camps" },
  B: { x: 170, y: 235, hall: "Tanzania / Zanzibar Tourism" },
  C: { x: 170, y: 340, hall: "Tanzania / Zanzibar Tourism" },
  D: { x: 170, y: 445, hall: "Tanzania / Zanzibar Tourism" },
  E: { x: 170, y: 550, hall: "East Africa Tourism" },
  F: { x: 170, y: 655, hall: "Uganda / Kenya / Rwanda Tourism" },
  G: { x: 170, y: 760, hall: "Zanzibar Tourism" },
  H: { x: 170, y: 865, hall: "Tanzania Tourism Pavilion" },
  J: { x: 500, y: 130, hall: "Lodges / Tour Operators" },
  K: { x: 500, y: 235, hall: "Lodges / Tour Operators" },
  L: { x: 500, y: 340, hall: "Lodges / Tour Operators" },
  M: { x: 500, y: 445, hall: "Lodges / Tour Operators" },
  N: { x: 500, y: 550, hall: "Lodges / Tour Operators" },
  O: { x: 500, y: 655, hall: "Tour Operators" },
  P: { x: 500, y: 760, hall: "Tour Operators" },
  Q: { x: 500, y: 865, hall: "Tour Operators" },
  R: { x: 830, y: 130, hall: "Premium Resorts / Lodges" },
  S: { x: 830, y: 235, hall: "Premium Resorts / Lodges" },
  T: { x: 830, y: 340, hall: "Premium Resorts / Lodges" },
  U: { x: 830, y: 555, hall: "Industry Supplier" },
  UR: { x: 1085, y: 555, hall: "Outdoor / Premium Supplier" },
  V: { x: 830, y: 700, hall: "Industry Supplier" },
  W: { x: 830, y: 805, hall: "Tourism Industry Supplier" },
  X: { x: 1085, y: 130, hall: "SME / Arts & Craft" },
  Y: { x: 1085, y: 340, hall: "SME / Arts & Craft" },
  Z: { x: 1085, y: 700, hall: "SME / Arts & Craft" },
  FS: { x: 1030, y: 1020, hall: "Food Court & Drinks" },
  OUT: { x: 1200, y: 900, hall: "Outdoor Area" },
};

function primaryStandCode(boothNumber: string) {
  const match = boothNumber.toUpperCase().match(/(UR|FS|OUT|[A-Z])\s*[-/]?\s*(\d+)/);
  return { prefix: match?.[1] ?? "A", number: Number(match?.[2] ?? 1) };
}

export function getBoothHall(boothNumber: string) {
  const { prefix } = primaryStandCode(boothNumber);
  return SECTION_BASE[prefix]?.hall ?? "Expo Area";
}

export function getBoothCoordinate(boothNumber: string): LatLngTuple {
  const { prefix, number } = primaryStandCode(boothNumber);
  const base = SECTION_BASE[prefix] ?? SECTION_BASE.A;
  const col = (number - 1) % 10;
  const row = Math.floor((number - 1) / 10);
  const x = base.x + col * 28;
  const y = base.y + row * 26;
  return [y, x];
}

export function getBoothPolygon(boothNumber: string): BoothPolygon {
  const [y, x] = getBoothCoordinate(boothNumber);
  const width = boothNumber.toUpperCase().startsWith("FS") ? 22 : 24;
  const height = boothNumber.toUpperCase().startsWith("FS") ? 18 : 22;
  return [[y - height / 2, x - width / 2], [y - height / 2, x + width / 2], [y + height / 2, x + width / 2], [y + height / 2, x - width / 2]];
}
