import type { ExhibitorWithBooth } from "@/types";

function textScore(source: string, tokens: string[]) {
  const lower = source.toLowerCase();
  return tokens.reduce((score, token) => score + (token.length > 2 && lower.includes(token) ? 1 : 0), 0);
}

export function getRecommendedExhibitors(current: ExhibitorWithBooth, exhibitors: ExhibitorWithBooth[], limit = 6) {
  const tokens = [
    current.category.name,
    current.booth?.hall,
    ...current.services,
    ...current.companyName.split(/\s+/)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2);

  return exhibitors
    .filter((item) => item.id !== current.id && item.booth)
    .map((item) => {
      const source = [item.companyName, item.category.name, item.booth?.hall, item.description, ...item.services].filter(Boolean).join(" ");
      const sameCategory = item.category.slug === current.category.slug ? 4 : 0;
      const sameHall = item.booth?.hall === current.booth?.hall ? 3 : 0;
      const serviceOverlap = item.services.filter((service) => current.services.includes(service)).length * 2;
      return { item, score: sameCategory + sameHall + serviceOverlap + textScore(source, tokens) };
    })
    .sort((a, b) => b.score - a.score || a.item.companyName.localeCompare(b.item.companyName))
    .slice(0, limit)
    .map(({ item }) => item);
}
