export interface SearchResult {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  release_year?: number;
  poster_path?: string;
  overview?: string;
}

export type TrendingResult = SearchResult;

export interface TrendingResults {
  movies: TrendingResult[];
  shows: TrendingResult[];
}

export interface MovieDetails {
  tmdb_id: number;
  title: string;
  /** ISO "YYYY-MM-DD". Use lib/release-date's helpers rather than
   * `new Date(...)` directly — see that file for why. */
  release_date?: string;
  runtime_minutes?: number;
  poster_path?: string;
  overview?: string;
}

export interface SeasonSummary {
  season_number: number;
  episode_count: number;
  air_date?: string;
}

export interface TVShowDetails {
  tmdb_id: number;
  name: string;
  first_air_year?: number;
  poster_path?: string;
  overview?: string;
  seasons: SeasonSummary[];
}

export interface EpisodeDetails {
  runtime_minutes?: number;
  air_date?: string;
}

export interface Comment {
  id: string;
  user_id: string;
  tmdb_media_type: "movie" | "tv";
  tmdb_id: number;
  season_number: number | null;
  episode_number: number | null;
  timestamp_seconds: number;
  body: string;
  created_at: string;
}

export interface CommentWithUsername extends Comment {
  username: string | null;
}

export type ReportReason = "spam" | "harassment" | "inappropriate" | "spoiler" | "other";

export interface Report {
  id: string;
  comment_id: string;
  reason: ReportReason;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  created_at: string;
}
