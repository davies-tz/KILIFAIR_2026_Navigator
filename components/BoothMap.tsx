"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Marker, Pane, Polygon, Polyline, Popup, Tooltip, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { AlertCircle, CheckCircle2, Loader2, Navigation } from "lucide-react";
import { BoothBottomSheet } from "@/components/BoothBottomSheet";
import { MapControls } from "@/components/MapControls";
import {
  boothMatchesQuery,
  getBoothPosition,
  getUniqueCategories,
  KILIFAIR_MAP_CENTER,
  KILIFAIR_MAP_ZOOM,
  KILIFAIR_SELECTED_ZOOM,
  parseBoothPolygon
} from "@/lib/map";
import { EXPO_BOUNDS, EXPO_ZONES } from "@/lib/expoLayout";
import { buildRouteToBooth, QR_CHECKPOINTS } from "@/lib/navigationGraph";
import type { ExhibitorWithBooth, LatLngTuple, LocationStatus } from "@/types";

const FAVORITES_STORAGE_KEY = "kilifair.favoriteBooths";

function labelIcon(label: string, sublabel?: string) {
  return L.divIcon({
    className: "",
    html: `<div style="min-width:115px;border-radius:10px;background:rgba(255,255,255,.92);border:1px solid rgba(201,154,46,.35);padding:6px 8px;box-shadow:0 10px 26px rgba(31,91,59,.18);font-family:system-ui"><div style="font-size:11px;font-weight:800;color:#1F5B3B;line-height:1.1">${label}</div>${sublabel ? `<div style="font-size:9px;font-weight:700;color:#E96B2C;margin-top:2px">${sublabel}</div>` : ""}</div>`,
    iconSize: [120, 44],
    iconAnchor: [60, 22]
  });
}

function boothLabelIcon(label: string) {
  return L.divIcon({
    className: "",
    html: `<div style="border-radius:6px;background:rgba(31,91,59,.96);color:white;padding:3px 5px;font-family:system-ui;font-size:9px;font-weight:800;box-shadow:0 6px 14px rgba(31,91,59,.24)">${label}</div>`,
    iconSize: [42, 18],
    iconAnchor: [21, 9]
  });
}

function MapViewController({
  resetNonce,
  selected,
  userLocation
}: {
  resetNonce: number;
  selected: ExhibitorWithBooth | null;
  userLocation: LatLngTuple | null;
}) {
  const map = useMap();

  useEffect(() => {
    const position = selected ? getBoothPosition(selected) : null;
    if (position) {
      map.flyTo(position, KILIFAIR_SELECTED_ZOOM, { duration: 0.8 });
    }
  }, [map, selected]);

  useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, KILIFAIR_SELECTED_ZOOM, { duration: 0.8 });
    }
  }, [map, userLocation]);

  useEffect(() => {
    if (resetNonce > 0) {
      map.flyTo(KILIFAIR_MAP_CENTER, KILIFAIR_MAP_ZOOM, { duration: 0.7 });
    }
  }, [map, resetNonce]);

  return null;
}

function LocationMessage({ message, status }: { message: string | null; status: LocationStatus }) {
  if (!message) return null;

  const Icon = status === "loading" ? Loader2 : status === "ready" ? CheckCircle2 : AlertCircle;

  return (
    <div className="absolute bottom-28 left-3 right-3 z-[900] flex items-center gap-2 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-safari-ink shadow-soft backdrop-blur md:bottom-6 md:left-6 md:right-auto md:max-w-sm">
      <Icon size={17} className={status === "loading" ? "animate-spin text-safari-orange" : status === "ready" ? "text-safari-forest" : "text-safari-orange"} />
      <span>{message}</span>
    </div>
  );
}

function facilityCenter(polygon: readonly (readonly [number, number])[]) {
  const y = polygon.reduce((sum, point) => sum + point[0], 0) / polygon.length;
  const x = polygon.reduce((sum, point) => sum + point[1], 0) / polygon.length;
  return [y, x] as LatLngTuple;
}

function fallbackBoothRectangle(position: LatLngTuple): LatLngExpression[] {
  const [y, x] = position;
  const height = 9;
  const width = 14;

  return [
    [y - height / 2, x - width / 2],
    [y - height / 2, x + width / 2],
    [y + height / 2, x + width / 2],
    [y + height / 2, x - width / 2]
  ];
}

export function BoothMap({ exhibitors, initialBooth }: { exhibitors: ExhibitorWithBooth[]; initialBooth?: string }) {
  const [category, setCategory] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [query, setQuery] = useState("");
  const [qrCheckpoint, setQrCheckpoint] = useState(QR_CHECKPOINTS[0].id);
  const [resetNonce, setResetNonce] = useState(0);
  const [selected, setSelected] = useState<ExhibitorWithBooth | null>(null);
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

  const categories = useMemo(() => getUniqueCategories(exhibitors), [exhibitors]);

  const visibleExhibitors = useMemo(() => {
    return exhibitors.filter((exhibitor) => {
      if (!exhibitor.booth) return false;
      if (category && exhibitor.category.slug !== category) return false;
      return boothMatchesQuery(exhibitor, query);
    });
  }, [category, exhibitors, query]);

  const activeCheckpoint = useMemo(() => {
    return QR_CHECKPOINTS.find((item) => item.id === qrCheckpoint) ?? QR_CHECKPOINTS[0];
  }, [qrCheckpoint]);

  const routeDetails = useMemo(() => {
    const selectedPosition = selected ? getBoothPosition(selected) : null;
    const boothNumber = selected?.booth?.boothNumber;

    if (!selectedPosition || !boothNumber) return null;

    try {
      const builtRoute = buildRouteToBooth(qrCheckpoint, selectedPosition, boothNumber);

      if (builtRoute?.points?.length >= 2 && Number.isFinite(builtRoute.distance)) {
        return builtRoute;
      }
    } catch {
      // Fallback below keeps the navigator usable even if the corridor graph fails.
    }

    const directDistance = Math.round(
      Math.hypot(
        activeCheckpoint.position[0] - selectedPosition[0],
        activeCheckpoint.position[1] - selectedPosition[1]
      )
    );

    return {
      points: [activeCheckpoint.position, selectedPosition],
      distance: directDistance,
      estimatedMinutes: Math.max(1, Math.ceil(directDistance / 75)),
      instructions: [
        `Start at ${activeCheckpoint.name}.`,
        `Follow the highlighted route to booth ${boothNumber}.`,
        "Look for the highlighted stand when you arrive."
      ]
    };
  }, [activeCheckpoint, qrCheckpoint, selected]);

  const route = routeDetails?.points?.length ? (routeDetails.points as LatLngExpression[]) : undefined;

  const recommendations = useMemo(() => {
    if (!selected) return [];

    const selectedPosition = getBoothPosition(selected);

    return exhibitors
      .filter((exhibitor) => exhibitor.id !== selected.id && exhibitor.booth)
      .map((exhibitor) => {
        const position = getBoothPosition(exhibitor);
        const sameCategory = exhibitor.category.slug === selected.category.slug;

        const distance =
          selectedPosition && position
            ? Math.round(
                Math.hypot(
                  position[0] - selectedPosition[0],
                  position[1] - selectedPosition[1]
                )
              )
            : 99999;

        return {
          exhibitor,
          distance,
          score: (sameCategory ? 0 : 10000) + distance
        };
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 4);
  }, [exhibitors, selected]);

  useEffect(() => {
    const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setFavorites(parsed.filter((item) => typeof item === "string"));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!initialBooth) return;
    const normalized = initialBooth.toLowerCase();
    const match = exhibitors.find((item) => item.booth?.boothNumber.toLowerCase() === normalized);
    if (match) setSelected(match);
  }, [exhibitors, initialBooth]);

  useEffect(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (trimmedQuery.length < 2 || visibleExhibitors.length === 0) return;

    const exactOrBestMatch =
      visibleExhibitors.find((exhibitor) => exhibitor.booth?.boothNumber.toLowerCase() === trimmedQuery) ??
      visibleExhibitors.find((exhibitor) => exhibitor.companyName.toLowerCase().includes(trimmedQuery)) ??
      visibleExhibitors[0];

    if (exactOrBestMatch && selected?.id !== exactOrBestMatch.id) {
      setSelected(exactOrBestMatch);
    }
  }, [query, selected?.id, visibleExhibitors]);

  function persistFavorites(nextFavorites: string[]) {
    setFavorites(nextFavorites);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
  }

  function toggleFavorite() {
    if (!selected) return;
    const nextFavorites = favorites.includes(selected.id)
      ? favorites.filter((id) => id !== selected.id)
      : [...favorites, selected.id];
    persistFavorites(nextFavorites);
  }

  function requestLocation({ forNavigation = false } = {}) {
    setLocationStatus("loading");
    setLocationMessage(forNavigation ? "Calculating route from selected QR checkpoint..." : "Placing demo visitor position...");

    window.setTimeout(() => {
      const checkpoint = QR_CHECKPOINTS.find((item) => item.id === qrCheckpoint) ?? QR_CHECKPOINTS[0];
      setUserLocation(checkpoint.position);
      setLocationStatus("ready");
      setLocationMessage(forNavigation ? `Smart route ready from ${checkpoint.name} to selected booth.` : `Demo location: ${checkpoint.name}.`);
    }, 350);
  }

  async function selectBooth(exhibitor: ExhibitorWithBooth) {
    setSelected(exhibitor);
    try {
      await fetch(`/api/exhibitors/${exhibitor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ viewed: true })
      });
    } catch {
      // Analytics should never block map use.
    }
  }

  function resetMap() {
    setCategory("");
    setQuery("");
    setSelected(null);
    setUserLocation(null);
    setLocationMessage(null);
    setResetNonce((value) => value + 1);
  }

  function navigateToSelected() {
    requestLocation({ forNavigation: true });
  }

  return (
    <main className="mobile-map-screen relative h-[calc(100vh-64px)] min-h-[520px] overflow-hidden bg-safari-cream pb-20 md:h-[calc(100vh-72px)] md:min-h-[620px] md:pb-0">
      <MapContainer
        center={KILIFAIR_MAP_CENTER}
        zoom={KILIFAIR_MAP_ZOOM}
        minZoom={-3}
        maxZoom={2}
        crs={L.CRS.Simple}
        maxBounds={EXPO_BOUNDS}
        scrollWheelZoom
        className="h-full bg-[#f8efd8]"
        zoomControl={false}
      >
        <MapViewController resetNonce={resetNonce} selected={selected} userLocation={userLocation} />

        <Polygon
          positions={[[18, 18], [18, 1400], [900, 1400], [900, 18]]}
          pathOptions={{ color: "#1F5B3B", fillColor: "#FFF4DF", fillOpacity: 0.95, weight: 3 }}
        />

        {EXPO_ZONES.map((zone) => (
          <Fragment key={zone.name}>
            <Polygon
              positions={zone.polygon as unknown as LatLngExpression[]}
              pathOptions={{ color: "#C99A2E", fillColor: "#C99A2E", fillOpacity: 0.2, weight: 2, dashArray: "8 5" }}
            />
            <Marker position={facilityCenter(zone.polygon)} icon={labelIcon(zone.name, zone.kind)} interactive={false} />
          </Fragment>
        ))}

        {visibleExhibitors.map((exhibitor) => {
          const position = getBoothPosition(exhibitor);
          if (!position) return null;

          const savedPolygon = parseBoothPolygon(exhibitor.booth?.polygon);
          const polygon = savedPolygon ?? fallbackBoothRectangle(position);
          const isSelected = selected?.id === exhibitor.id;
          const isFavorite = favorites.includes(exhibitor.id);
          const hasActiveSearch = Boolean(query.trim());
          const shouldShowContext = !selected || isSelected || hasActiveSearch;
          const shouldLabel = isSelected || hasActiveSearch || (!selected && visibleExhibitors.length <= 85);

          if (!shouldShowContext && !isSelected) return null;

          return (
            <Fragment key={exhibitor.id}>
              <Polygon
                pathOptions={{
                  color: isSelected ? "#E96B2C" : hasActiveSearch ? "#C99A2E" : "#D8C58B",
                  fillColor: isSelected ? "#E96B2C" : isFavorite ? "#1F5B3B" : "#ffffff",
                  fillOpacity: isSelected ? 0.92 : selected ? 0.12 : 0.42,
                  opacity: isSelected ? 1 : selected ? 0.32 : 0.85,
                  weight: isSelected ? 5 : selected ? 1 : 1.4
                }}
                positions={polygon}
                eventHandlers={{ click: () => selectBooth(exhibitor) }}
              >
                <Popup>
                  <strong>{exhibitor.companyName}</strong>
                  <br />
                  Booth {exhibitor.booth?.boothNumber}
                </Popup>
              </Polygon>

              {shouldLabel ? (
                <Marker
                  position={position}
                  icon={boothLabelIcon(exhibitor.booth?.boothNumber ?? "")}
                  interactive={false}
                />
              ) : null}
            </Fragment>
          );
        })}

        {selected ? (
          <CircleMarker center={activeCheckpoint.position} radius={11} pathOptions={{ color: "#ffffff", fillColor: "#0F766E", fillOpacity: 0.98, weight: 3 }}>
            <Tooltip direction="top" offset={[0, -8]} permanent>
              Start: {activeCheckpoint.name}
            </Tooltip>
            <Popup>Selected QR checkpoint start position</Popup>
          </CircleMarker>
        ) : userLocation ? (
          <CircleMarker center={userLocation} radius={10} pathOptions={{ color: "#ffffff", fillColor: "#1F5B3B", fillOpacity: 0.95, weight: 3 }}>
            <Tooltip direction="top" offset={[0, -8]} permanent>
              {activeCheckpoint.name ?? "You are here"}
            </Tooltip>
            <Popup>QR checkpoint position</Popup>
          </CircleMarker>
        ) : null}

        {route ? (
          <Pane name="kilifair-route-pane" style={{ zIndex: 720 }}>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#ffffff",
                weight: 17,
                opacity: 0.95,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
            <Polyline
              positions={route}
              pathOptions={{
                color: "#0F766E",
                weight: 10,
                opacity: 1,
                lineCap: "round",
                lineJoin: "round"
              }}
            />
            <Polyline
              positions={route}
              pathOptions={{
                color: "#E96B2C",
                weight: 3,
                opacity: 0.95,
                dashArray: "10 12",
                lineCap: "round",
                lineJoin: "round"
              }}
            />
          </Pane>
        ) : null}
      </MapContainer>

      <MapControls
        categories={categories}
        category={category}
        locationStatus={locationStatus}
        query={query}
        resultCount={visibleExhibitors.length}
        selectedBooth={selected?.booth?.boothNumber}
        onCategoryChange={setCategory}
        onLocate={() => requestLocation()}
        onQueryChange={setQuery}
        onReset={resetMap}
      />

      <div className="absolute bottom-24 left-3 right-3 z-[900] max-h-[58vh] overflow-y-auto rounded-2xl border border-safari-gold/20 bg-white/95 p-3 shadow-soft backdrop-blur md:left-auto md:right-6 md:top-24 md:bottom-auto md:w-80 md:max-h-[calc(100vh-150px)]">
        <label className="text-xs font-black uppercase tracking-wide text-safari-orange">
          Start from QR checkpoint
        </label>

        <select
          value={qrCheckpoint}
          onChange={(event) => setQrCheckpoint(event.target.value)}
          className="mt-2 w-full rounded-xl border border-safari-gold/25 bg-safari-cream px-3 py-2 text-sm font-bold text-safari-ink outline-none"
        >
          {QR_CHECKPOINTS.map((checkpoint) => (
            <option key={checkpoint.id} value={checkpoint.id}>
              {checkpoint.name}
            </option>
          ))}
        </select>

        {selected ? (
          <div className="mt-3 rounded-xl border border-safari-gold/20 bg-safari-cream p-3">
            <p className="text-xs font-black uppercase tracking-wide text-safari-orange">
              Selected destination
            </p>

            <h3 className="mt-1 text-sm font-black text-safari-ink">
              {selected.booth?.boothNumber} · {selected.companyName}
            </h3>

            <p className="mt-1 text-xs text-safari-muted">
              {selected.category.name}
            </p>

            {routeDetails ? (
              <div className="mt-3 rounded-xl bg-safari-forest p-3 text-white">
                <div className="flex items-center gap-2 text-sm font-black">
                  <Navigation size={16} />
                  Estimated walk: {routeDetails.estimatedMinutes} min · {routeDetails.distance}m
                </div>

                <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs leading-5 text-white/82">
                  {routeDetails.instructions.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-safari-cream p-3 text-sm text-safari-muted">
            Select a booth to see estimated walking time and recommended nearby exhibitors.
          </div>
        )}

        {selected && recommendations.length > 0 ? (
          <div className="mt-3 rounded-xl border border-safari-gold/20 bg-white p-3">
            <p className="text-xs font-black uppercase tracking-wide text-safari-orange">
              Recommended next
            </p>

            <div className="mt-2 space-y-2">
              {recommendations.map(({ exhibitor, distance }) => (
                <button
                  key={exhibitor.id}
                  type="button"
                  onClick={() => void selectBooth(exhibitor)}
                  className="w-full rounded-lg border border-safari-gold/15 bg-safari-cream px-3 py-2 text-left transition hover:border-safari-orange hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-xs font-black text-safari-ink">
                      {exhibitor.companyName}
                    </p>
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-safari-orange">
                      {exhibitor.booth?.boothNumber}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-safari-muted">
                    {exhibitor.category.name} · approx. {distance}m away
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <LocationMessage message={locationMessage} status={locationStatus} />

      <BoothBottomSheet
        exhibitor={selected}
        isFavorite={selected ? favorites.includes(selected.id) : false}
        onClose={() => setSelected(null)}
        onNavigate={navigateToSelected}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}
