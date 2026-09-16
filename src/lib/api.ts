import { supabase } from "@/lib/supabase";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiFetch(path: string, init?: RequestInit) {
  const {
    data: { session },
  } = await supabase.auth.getSession(); // cached locally, not a network call

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      "Content-Type": "application/json",
    },
  });
}