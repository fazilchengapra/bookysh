import {
  getNowPlaying, getUpcoming, getTrailer,
  filterNowPlaying, filterUpcoming,
  type TMDBMovie,
} from "@/lib/tmdb";
import MoviesClientPage from "@/components/customer/movies/MoviesClientPage";

// Fetch trailers for movie list (only top 12 to avoid rate limits)
async function fetchTrailerKeys(movies: TMDBMovie[]): Promise<Record<number, string>> {
  const top = movies.slice(0, 12);
  const results = await Promise.allSettled(
    top.map(async (m) => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${m.id}/videos?api_key=d86edccefa9682ac2a92a664006b2684&language=en-US`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return { id: m.id, key: null };
      const data = await res.json();
      const trailer = getTrailer(data.results);
      return { id: m.id, key: trailer?.key ?? null };
    })
  );

  const map: Record<number, string> = {};
  results.forEach((r) => {
    if (r.status === "fulfilled" && r.value.key) {
      map[r.value.id] = r.value.key;
    }
  });
  return map;
}

export const metadata = {
  title: "Movies — Bokysh",
  description: "Book movie tickets for the latest blockbusters in your city.",
};

export default async function MoviesPage() {
  const [npRaw, upRaw] = await Promise.all([
    getNowPlaying(),
    getUpcoming(),
  ]);

  // Strictly filter: now playing = released on or before today
  //                  upcoming    = release date strictly in the future
  const nowPlaying = filterNowPlaying(npRaw.results);
  const upcoming   = filterUpcoming(upRaw.results);

  const [npKeys, upKeys] = await Promise.all([
    fetchTrailerKeys(nowPlaying),
    fetchTrailerKeys(upcoming),
  ]);

  return (
    <MoviesClientPage
      nowPlaying={nowPlaying}
      upcoming={upcoming}
      trailerKeys={{ ...npKeys, ...upKeys }}
    />
  );
}
