import { apiFetch } from "@/lib/api";
import type { Profile } from "@/lib/types";

export const getMe = () => apiFetch<Profile>("/me");

export const updateUsername = (username: string) =>
  apiFetch<Profile>("/me", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });

export const deleteAccount = (appleAuthorizationCode?: string) =>
  apiFetch<void>("/me", {
    method: "DELETE",
    body: JSON.stringify({
      apple_authorization_code: appleAuthorizationCode ?? "",
    }),
  });
