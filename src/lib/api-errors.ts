import { ApiError } from "@/lib/api";


export type ApiErrorContext =
  | "username"
  | "comment-create"
  | "comment-delete"
  | "account-delete";


export function describeApiError(err: unknown, context?: ApiErrorContext): string {
  if (!(err instanceof ApiError)) {
    const message = err instanceof Error ? err.message : String(err);
    if (/network|fetch|timed? ?out/i.test(message)) {
      return "Couldn't reach the server. Check your connection and try again.";
    }
    return "Something went wrong. Please try again.";
  }

  switch (err.status) {
    case 400:
      if (context === "username") {
        return "Usernames can only use letters, numbers, and underscores (3–30 characters).";
      }
      if (context === "comment-create") {
        return "Couldn't post that comment. Try again.";
      }
      return "That didn't go through. Please try again.";
    case 401:
      return "You need to be logged in for that.";
    case 403:
      if (context === "comment-delete") {
        return "You can only delete your own comments.";
      }
      if (context === "account-delete") {
        return "We couldn't confirm your recent sign-in. Please try again.";
      }
      return "You don't have permission to do that.";
    case 404:
      if (context === "comment-delete") {
        return "That comment was already removed.";
      }
      return "Couldn't find that.";
    case 409:
      if (context === "username") {
        return "That username is already taken.";
      }
      return "That already exists.";
    case 429:
      return "Too many attempts. Please wait a minute and try again.";
    case 502:
      return "Couldn't reach the movie database. Try again in a moment.";
    default:
      return "Something went wrong. Please try again.";
  }
}
