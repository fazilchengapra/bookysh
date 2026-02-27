// ──────────────────────────────────────────────────────────
//  Ticketmaster Discovery API Utility  |  lib/ticketmaster.ts
// ──────────────────────────────────────────────────────────

const API_KEY  = process.env.TICKETMASTER_API_KEY ?? "mk3B7bAAqHZh70Jik8Kqm4V08MeTxLgO";
const BASE_URL = "https://app.ticketmaster.com/discovery/v2";

/* ── Core fetch ─────────────────────────────────────────── */
async function tm<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("apikey", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR — refresh every hour
  });
  if (!res.ok) throw new Error(`Ticketmaster ${endpoint}: ${res.status} ${res.statusText}`);
  return res.json();
}

/* ── Image helper ───────────────────────────────────────── */
export function bestImage(images: TMImage[] | undefined, minWidth = 640): string | null {
  if (!images || images.length === 0) return null;
  // prefer 16_9 ratio images above minWidth, fall back to anything
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted.find((i) => (i.width ?? 0) >= minWidth && i.ratio === "16_9")?.url
    ?? sorted.find((i) => (i.width ?? 0) >= minWidth)?.url
    ?? sorted[0]?.url
    ?? null;
}

/* ── Date helpers ────────────────────────────────────────── */
function todayStr(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z"); // Ticketmaster wants full ISO
}

/* ── Endpoints ──────────────────────────────────────────── */

/** All upcoming events (generic) */
export const getEvents = (page = 0, size = 20) =>
  tm<TMResponse>("/events.json", {
    startDateTime: todayStr(),
    size: String(size),
    page: String(page),
    sort: "date,asc",
  });

/** Events filtered by Ticketmaster segment/classification */
export const getEventsBySegment = (segment: TMSegment, page = 0, size = 20) =>
  tm<TMResponse>("/events.json", {
    segmentName: segment,
    startDateTime: todayStr(),
    size: String(size),
    page: String(page),
    sort: "date,asc",
  });

/** Events filtered by classification keyword */
export const getEventsByKeyword = (keyword: string, page = 0, size = 20) =>
  tm<TMResponse>("/events.json", {
    keyword,
    startDateTime: todayStr(),
    size: String(size),
    page: String(page),
    sort: "relevance,desc",
  });

/** Single event by Ticketmaster ID */
export const getEventById = (id: string) =>
  tm<TMEvent>(`/events/${id}.json`);

/** Search events */
export const searchEvents = (q: string, page = 0, size = 20) =>
  tm<TMResponse>("/events.json", {
    keyword: q,
    startDateTime: todayStr(),
    size: String(size),
    page: String(page),
  });

/* ── Types ──────────────────────────────────────────────── */

export type TMSegment =
  | "Music"
  | "Sports"
  | "Arts & Theatre"
  | "Film"
  | "Miscellaneous";

export interface TMImage {
  url: string;
  ratio?: "16_9" | "3_2" | "4_3";
  width?: number;
  height?: number;
  fallback?: boolean;
}

export interface TMVenue {
  id: string;
  name: string;
  city?: { name: string };
  state?: { name: string; stateCode: string };
  country?: { name: string; countryCode: string };
  address?: { line1: string };
  postalCode?: string;
  location?: { latitude: string; longitude: string };
  url?: string;
}

export interface TMClassification {
  primary?: boolean;
  segment?: { id: string; name: string };
  genre?: { id: string; name: string };
  subGenre?: { id: string; name: string };
  type?: { id: string; name: string };
  subType?: { id: string; name: string };
}

export interface TMPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TMSale {
  public?: {
    startDateTime?: string;
    endDateTime?: string;
  };
}

export interface TMEvent {
  id: string;
  name: string;
  url?: string;
  images?: TMImage[];
  dates?: {
    start?: {
      localDate?: string;  // "YYYY-MM-DD"
      localTime?: string;  // "HH:MM:SS"
      dateTime?: string;   // ISO 8601
      dateTBD?: boolean;
      timeTBD?: boolean;
    };
    status?: { code: "onsale" | "offsale" | "cancelled" | "postponed" | "rescheduled" };
    timezone?: string;
  };
  classifications?: TMClassification[];
  priceRanges?: TMPriceRange[];
  sales?: TMSale;
  info?: string;
  pleaseNote?: string;
  accessibility?: { info?: string };
  _embedded?: {
    venues?: TMVenue[];
    attractions?: TMAttraction[];
  };
}

export interface TMAttraction {
  id: string;
  name: string;
  images?: TMImage[];
  url?: string;
  classifications?: TMClassification[];
}

export interface TMResponse {
  _embedded?: {
    events?: TMEvent[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

/* ── Format helpers ─────────────────────────────────────── */

export function formatEventDate(event: TMEvent): string {
  const d = event.dates?.start;
  if (!d || d.dateTBD) return "Date TBA";
  if (!d.localDate) return "Date TBA";
  const date = new Date(d.localDate + "T00:00:00");
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function formatEventTime(event: TMEvent): string {
  const d = event.dates?.start;
  if (!d || d.timeTBD || !d.localTime) return "Time TBA";
  const [h, m] = d.localTime.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function formatPriceRange(ranges: TMPriceRange[] | undefined): string {
  if (!ranges || ranges.length === 0) return "See website";
  const r = ranges[0];
  if (r.min === r.max) return `${r.currency} ${r.min}`;
  return `${r.currency} ${r.min} – ${r.max}`;
}

export function getEventSegment(event: TMEvent): string {
  return event.classifications?.[0]?.segment?.name ?? "Event";
}

export function getEventGenre(event: TMEvent): string {
  return event.classifications?.[0]?.genre?.name ?? "";
}

export function getVenue(event: TMEvent): TMVenue | null {
  return event._embedded?.venues?.[0] ?? null;
}

export function getVenueLabel(event: TMEvent): string {
  const v = getVenue(event);
  if (!v) return "Venue TBA";
  const parts = [v.name, v.city?.name].filter(Boolean);
  return parts.join(", ");
}

export function statusColor(code: string | undefined): string {
  switch (code) {
    case "onsale":    return "emerald";
    case "offsale":   return "red";
    case "cancelled": return "red";
    case "postponed": return "amber";
    default:          return "emerald";
  }
}
