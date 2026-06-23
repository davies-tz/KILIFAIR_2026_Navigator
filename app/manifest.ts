import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KARIBU-KILIFAIR 2026 Navigator",
    short_name: "KILIFAIR Nav",
    description: "Indoor expo navigation, exhibitor directory, QR booth access, and event companion for KARIBU-KILIFAIR 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF4DF",
    theme_color: "#1F5B3B",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}
