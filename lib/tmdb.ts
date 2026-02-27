// ──────────────────────────────────────────────────────────
//  TMDB API Utility  |  lib/tmdb.ts
//  API Key: d86edccefa9682ac2a92a664006b2684
// ──────────────────────────────────────────────────────────

const API_KEY  = "d86edccefa9682ac2a92a664006b2684";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

/* ── Image helpers ───────────────────────────────────────── */
export const posterUrl   = (path: string | null, size: "w342" | "w500" | "original" = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const backdropUrl = (path: string | null, size: "w1280" | "original" = "w1280") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const profileUrl  = (path: string | null) =>
  path ? `${IMG_BASE}/w185${path}` : null;

export const ytThumbnail = (key: string) =>
  `https://img.youtube.com/vi/${key}/maxresdefault.jpg`;

/* ── Core fetch ─────────────────────────────────────────── */
async function tmdb<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("language", "en-US");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR — refresh every hour
  });
  if (!res.ok) throw new Error(`TMDB ${endpoint}: ${res.status} ${res.statusText}`);
  return res.json();
}

/* ── Endpoints ──────────────────────────────────────────── */
// Only currently-in-theatre movies (TMDB handles the date window)
export const getNowPlaying = (page = 1) =>
  tmdb<TMDBListResponse>("/movie/now_playing", { page: String(page), region: "IN" });

// Only movies with a future or very-near release date
export const getUpcoming = (page = 1) =>
  tmdb<TMDBListResponse>("/movie/upcoming", { page: String(page), region: "IN" });

export const searchMovies = (q: string, page = 1) =>
  tmdb<TMDBListResponse>("/search/movie", { query: q, page: String(page) });

/* ── Date helpers ────────────────────────────────────────── */
function today(): string {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/**
 * Keep only movies whose release_date is in the past (or today).
 * Useful to clean TMDB's now_playing list which can include near-future dates.
 */
export function filterNowPlaying(movies: TMDBMovie[]): TMDBMovie[] {
  const t = today();
  return movies.filter((m) => m.release_date && m.release_date <= t);
}

/**
 * Keep only movies whose release_date is in the future (strictly after today).
 * Ensures upcoming section never shows already-released or old films.
 */
export function filterUpcoming(movies: TMDBMovie[]): TMDBMovie[] {
  const t = today();
  return movies.filter((m) => m.release_date && m.release_date > t);
}

/**
 * Filter similar/related movies shown on the detail page:
 * only keep movies with a release_date within the past 18 months or future.
 */
export function filterRelated(movies: TMDBMovie[]): TMDBMovie[] {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 18);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return movies.filter((m) => m.release_date && m.release_date >= cutoffStr);
}

export const getMovieDetails = (id: string | number) =>
  tmdb<TMDBMovieDetails>(`/movie/${id}`, {
    append_to_response: "videos,credits,similar",
  });

/* ── Types ──────────────────────────────────────────────── */
export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
}

export interface TMDBListResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: "Trailer" | "Teaser" | "Clip" | "Featurette" | "Behind the Scenes" | "Bloopers";
  official: boolean;
  published_at: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number | null;
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages:     { english_name: string }[];
  videos: { results: TMDBVideo[] };
  credits: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  similar: TMDBListResponse;
}

/* ── Helpers ─────────────────────────────────────────────── */
export function getTrailer(videos: TMDBVideo[]): TMDBVideo | null {
  // Prefer official YouTube trailer; fall back to any trailer/teaser
  return (
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ??
    null
  );
}

export function formatRuntime(mins: number | null): string {
  if (!mins) return "N/A";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function formatMoney(amount: number): string {
  if (!amount) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(amount);
}

export function ratingColor(r: number): string {
  if (r >= 7.5) return "#10b981"; // green
  if (r >= 6)   return "#F59E0B"; // amber
  return "#ef4444";               // red
}
