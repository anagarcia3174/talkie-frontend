import { useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/use-auth";
import { useMediaScrubber } from "@/hooks/use-media-scrubber";
import {
  createComment,
  deleteComment,
  listEpisodeComments,
  listMovieComments,
} from "@/lib/comments";
import { formatTime } from "@/lib/format-time";
import { getMe } from "@/lib/profile";
import { isUpcoming as isDateUpcoming } from "@/lib/release-date";
import type { CommentWithUsername } from "@/lib/types";
import { colors, fonts, spacing } from "@/theme/tokens";
import { CommentComposer } from "./CommentComposer";
import { EyebrowLabel } from "./EyebrowLabel";
import { Scrubber } from "./Scrubber";
import { TimestampedQuote } from "./TimestampedQuote";

const VISIBLE_WINDOW_SECONDS = 10;

export function Comments({
  mediaType,
  tmdbId,
  season,
  episode,
  durationSeconds,
  releaseDate,
  belowHeader,
}: {
  mediaType: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
  durationSeconds: number | null;
  releaseDate?: string | null;
  belowHeader?: ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const scrubber = useMediaScrubber(durationSeconds ?? 1);
  const [draft, setDraft] = useState("");
  const signedIn = !!user;

  const { data: profile } = useQuery({ queryKey: ["me"], queryFn: getMe, enabled: signedIn });
  const hasUsername = !!profile?.username;
  const isUpcoming = isDateUpcoming(releaseDate);
  const canComment = signedIn && hasUsername && !isUpcoming;

  const queryKey =
    mediaType === "movie" ? ["comments", "movie", tmdbId] : ["comments", "tv", tmdbId, season, episode];

  const { data: comments, isLoading, error } = useQuery({
    queryKey,
    queryFn: () =>
      mediaType === "movie" ? listMovieComments(tmdbId) : listEpisodeComments(tmdbId, season!, episode!),
  });

  const createMutation = useMutation({
    mutationFn: (body: string) =>
      createComment({
        tmdb_media_type: mediaType,
        tmdb_id: tmdbId,
        season_number: mediaType === "tv" ? season! : null,
        episode_number: mediaType === "tv" ? episode! : null,
        timestamp_seconds: scrubber.position,
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setDraft("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const roundedPosition = Math.round(scrubber.position);

  const marks = useMemo(
    () =>
      (comments ?? []).map((c) => ({
        id: c.id,
        time: c.timestamp_seconds,
        active: c.timestamp_seconds === roundedPosition,
      })),
    [comments, roundedPosition]
  );

  const visibleComments = useMemo(
    () =>
      (comments ?? [])
        .filter(
          (c) =>
            c.timestamp_seconds <= roundedPosition &&
            c.timestamp_seconds >= roundedPosition - VISIBLE_WINDOW_SECONDS
        )
        .sort((a, b) => a.timestamp_seconds - b.timestamp_seconds),
    [comments, roundedPosition]
  );

  function handleDeletePress(comment: CommentWithUsername) {
    if (!user || comment.user_id !== user.id) return;
    Alert.alert("Delete comment?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(comment.id) },
    ]);
  }

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    createMutation.mutate(trimmed);
  }

  function handleComposerSubmit() {
    if (!canComment) {
      router.push("/profile");
      return;
    }
    submit();
  }

  const count = comments?.length ?? 0;
  const countLabel = `${count} comment${count === 1 ? "" : "s"}`;
  const composerTime = formatTime(scrubber.position);

  return (
    <View style={styles.wrap}>
      {/* One bordered header block — heading/count row, then whatever
          belowHeader supplies (the TV screen's season/episode pickers).
          The divider sits under all of it, not just the heading, so a
          picker row reads as part of this block rather than floating
          beneath a border that already closed it off. */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Comments</Text>
          <EyebrowLabel muted>{countLabel}</EyebrowLabel>
        </View>
        {belowHeader}
      </View>

      {durationSeconds === null ? (
        <EyebrowLabel muted>Loading episode…</EyebrowLabel>
      ) : (
        <>
          <Scrubber
            headerLabel="Playhead"
            position={scrubber.position}
            duration={durationSeconds}
            isPlaying={scrubber.isPlaying}
            speed={scrubber.speed}
            marks={marks}
            onSeek={scrubber.seek}
            onTogglePlay={scrubber.togglePlay}
            onCycleSpeed={scrubber.cycleSpeed}
          />

          <View style={styles.listBox}>
            {isLoading ? (
              <EyebrowLabel muted>Loading comments…</EyebrowLabel>
            ) : error ? (
              <EyebrowLabel muted>Couldn't load comments</EyebrowLabel>
            ) : count === 0 ? (
              <Text style={styles.empty}>No comments yet. Be the first to mark a moment.</Text>
            ) : visibleComments.length === 0 ? (
              <Text style={styles.empty}>No comments near this moment yet.</Text>
            ) : (
              <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                <View style={styles.list}>
                  {visibleComments.map((c) => (
                    <TimestampedQuote
                      key={c.id}
                      time={formatTime(c.timestamp_seconds)}
                      username={c.username ?? "unknown"}
                      active={c.timestamp_seconds === roundedPosition}
                      onPress={() => scrubber.seek(c.timestamp_seconds)}
                      onDelete={
                        user && c.user_id === user.id ? () => handleDeletePress(c) : undefined
                      }
                    >
                      {c.body}
                    </TimestampedQuote>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

          <CommentComposer
            label="Add a comment at"
            time={composerTime}
            value={draft}
            onChangeText={setDraft}
            onSubmit={handleComposerSubmit}
            submitLabel={
              isUpcoming
                ? "Comments open once this airs"
                : !signedIn
                  ? "Log in to join the conversation"
                  : !hasUsername
                    ? "Choose a username to comment"
                    : "Post comment"
            }
            pendingLabel="Posting…"
            isSubmitting={canComment && createMutation.isPending}
            editable={canComment}
            requireValue={canComment || isUpcoming}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  header: {
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 30,
    textTransform: "uppercase",
    color: colors.textPrimary,
  },
  listBox: { borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.bgElevated, padding: spacing.md },
  listScroll: { maxHeight: 260 },
  list: { gap: spacing.lg },
  empty: { fontFamily: fonts.body, fontSize: 15, lineHeight: 22.5, color: colors.textSecondary },
});
