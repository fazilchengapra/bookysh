import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getMovieDetails, getTrailer, posterUrl, backdropUrl,
  profileUrl, formatRuntime, formatMoney, ratingColor, filterRelated,
} from "@/lib/tmdb";
import MovieDetailClient from "@/components/customer/movies/MovieDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    const movie = await getMovieDetails(id);
    return {
      title: `${movie.title} — Bokysh`,
      description: movie.overview?.slice(0, 155),
    };
  } catch {
    return { title: "Movie — Bokysh" };
  }
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;

  let movie;
  try {
    movie = await getMovieDetails(id);
  } catch {
    notFound();
  }

  const trailer = getTrailer(movie.videos?.results ?? []);
  const director = movie.credits?.crew?.find((c) => c.job === "Director");
  const topCast  = (movie.credits?.cast ?? []).slice(0, 12);
  // Filter similar movies to only last 18 months or future releases
  const similar  = filterRelated(movie.similar?.results ?? []).slice(0, 6);

  return (
    <MovieDetailClient
      movie={movie}
      trailerKey={trailer?.key ?? null}
      director={director ?? null}
      topCast={topCast}
      similar={similar}
    />
  );
}
