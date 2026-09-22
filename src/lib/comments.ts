import { apiFetch } from "@/lib/api";
import type { Comment, CommentWithUsername, Report, ReportReason } from "@/lib/types";

export const MAX_COMMENT_LENGTH = 280;

export const listMovieComments = (tmdbId: number) =>
  apiFetch<CommentWithUsername[]>(`/movies/${tmdbId}/comments`);

export const listEpisodeComments = (tmdbId: number, season: number, episode: number) =>
  apiFetch<CommentWithUsername[]>(`/tv/${tmdbId}/season/${season}/episode/${episode}/comments`);

interface CreateCommentInput {
  tmdb_media_type: "movie" | "tv";
  tmdb_id: number;
  season_number: number | null;
  episode_number: number | null;
  timestamp_seconds: number;
  body: string;
}

export const createComment = (input: CreateCommentInput) =>
  apiFetch<Comment>("/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const deleteComment = (commentId: string) =>
  apiFetch<void>(`/comments/${commentId}`, { method: "DELETE" });

export const reportComment = (commentId: string, input: { reason: ReportReason; detail?: string }) =>
  apiFetch<Report>(`/comments/${commentId}/reports`, {
    method: "POST",
    body: JSON.stringify(input),
  });
