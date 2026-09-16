export function formatTime(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function parseTime(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d{1,2}(:\d{1,2}){1,2}$/.test(trimmed)) return null;

  const parts = trimmed.split(":").map(Number);
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (seconds > 59) return null;
    return minutes * 60 + seconds;
  }
  const [hours, minutes, seconds] = parts;
  if (minutes > 59 || seconds > 59) return null;
  return hours * 3600 + minutes * 60 + seconds;
}
