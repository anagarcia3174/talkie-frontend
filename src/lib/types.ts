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
  release_year?: number;
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

export interface Profile {
  id: string;
  username: string | null;
  created_at: string;
}
