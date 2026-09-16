import { apiFetch } from "@/lib/api";
import type {
  SearchResult,
  MovieDetails,
  TVShowDetails,
  EpisodeDetails,
  TrendingResults,
} from "@/lib/types";

export const search = (query: string) =>
  apiFetch<SearchResult[]>(`/search?query=${encodeURIComponent(query)}`);

export const trending = () => apiFetch<TrendingResults>("/trending");

export const getMovie = (tmdbId: number) => apiFetch<MovieDetails>(`/movies/${tmdbId}`);

export const getTVShow = (tmdbId: number) => apiFetch<TVShowDetails>(`/tv/${tmdbId}`);

export const getEpisode = (tmdbId: number, season: number, episode: number) =>
  apiFetch<EpisodeDetails>(`/tv/${tmdbId}/season/${season}/episode/${episode}`);
