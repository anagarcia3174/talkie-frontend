import { apiFetch } from "@/lib/api";
import type { Profile } from "@/lib/types";

export const getMe = () => apiFetch<Profile>("/me");

// NOTE: talkie-backend doesn't have this route yet — AuthHandler.Me only
// handles GET /me right now. Add a PATCH /me handler (calling the existing
// SetUsername sqlc query) before this will actually work; see
// EXPO_FRONTEND_GUIDE.md's Phase 9 note for the original context.
export const updateUsername = (username: string) =>
  apiFetch<Profile>("/me", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });
