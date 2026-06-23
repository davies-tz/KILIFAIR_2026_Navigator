import type { BoothPolygon, ExhibitorWithBooth, LatLngTuple } from "@/types";
export { KILIFAIR_MAP_CENTER, KILIFAIR_MAP_ZOOM, KILIFAIR_SELECTED_ZOOM } from "@/lib/expoLayout";

export function getBoothPosition(exhibitor: ExhibitorWithBooth): LatLngTuple | null {
  if (!exhibitor.booth) return null;
  return [exhibitor.booth.latitude, exhibitor.booth.longitude];
}

export function parseBoothPolygon(polygon: unknown): BoothPolygon | null {
  if (!Array.isArray(polygon)) return null;

  const points = polygon.filter((point): point is LatLngTuple => {
    return (
      Array.isArray(point) &&
      point.length === 2 &&
      typeof point[0] === "number" &&
      typeof point[1] === "number"
    );
  });

  return points.length >= 3 ? points : null;
}

export function boothMatchesQuery(exhibitor: ExhibitorWithBooth, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = [
    exhibitor.companyName,
    exhibitor.category.name,
    exhibitor.description,
    exhibitor.website,
    exhibitor.booth?.boothNumber,
    exhibitor.booth?.hall,
    ...exhibitor.services
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
}

export function getUniqueCategories(exhibitors: ExhibitorWithBooth[]) {
  return Array.from(new Map(exhibitors.map((exhibitor) => [exhibitor.category.slug, exhibitor.category])).values()).sort(
    (first, second) => first.name.localeCompare(second.name)
  );
}
