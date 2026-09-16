
export interface SearchResult {
  tmdb_id: number;
  media_type: "movie" | "tv";
  title: string;
  release_year?: number;
  poster_path?: string;
  overview?: string;
}

export type TrendingResult = SearchResult;
