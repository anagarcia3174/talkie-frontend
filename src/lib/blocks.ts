import { apiFetch } from "@/lib/api";
import type { BlockedUser } from "@/lib/types";

export const listBlockedUsers = () => apiFetch<BlockedUser[]>("/me/blocks");

export const blockUser = (userId: string) =>
  apiFetch<void>(`/users/${userId}/block`, { method: "POST" });

export const unblockUser = (userId: string) =>
  apiFetch<void>(`/users/${userId}/block`, { method: "DELETE" });
