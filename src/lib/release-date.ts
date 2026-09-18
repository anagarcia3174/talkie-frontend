/**
 * True when `dateString` (an ISO "YYYY-MM-DD" release/air date from the
 * backend) is still in the future.
 *
 * This compares the date portion as plain strings against today's UTC
 * date, rather than parsing both into `Date` objects and comparing
 * instants. A date-only string like "2026-12-25" has no time zone of its
 * own — `new Date("2026-12-25")` parses it as UTC midnight — so comparing
 * that instant against `Date.now()` shifts the "upcoming" cutoff by a day
 * in one direction or the other depending on the device's local time
 * zone. ISO-formatted dates (zero-padded, YYYY-MM-DD) sort lexicographically
 * the same way they sort chronologically, so a plain string comparison
 * sidesteps all of that.
 */
export function isUpcoming(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateString.slice(0, 10) > today;
}

/**
 * Extracts the calendar year from an ISO "YYYY-MM-DD" date string, for
 * display (e.g. a movie's release year in a meta line).
 *
 * Reads the leading digits directly rather than going through
 * `new Date(dateString).getFullYear()`, which reads the year back out in
 * the device's *local* time zone — for a UTC-midnight date, that rolls
 * the year back by one for anyone west of UTC (e.g. "2027-01-01" would
 * read back as 2026 across the US in the evening of Dec 31 UTC).
 */
export function yearFromDate(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  const year = Number(dateString.slice(0, 4));
  return Number.isFinite(year) && year > 0 ? year : null;
}
