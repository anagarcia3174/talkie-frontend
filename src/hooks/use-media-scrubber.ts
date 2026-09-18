import { useEffect, useState } from "react";

const SPEED_STEPS = [1, 1.5, 2, 0.5];

export function useMediaScrubber(durationSeconds: number) {
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setPosition((prev) => {
        const next = prev + speed;
        if (next >= durationSeconds) {
          setIsPlaying(false);
          return durationSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, speed, durationSeconds]);

  function seek(seconds: number) {
    setPosition(Math.max(0, Math.min(durationSeconds, Math.round(seconds))));
  }

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function cycleSpeed() {
    setSpeed((prev) => {
      const idx = SPEED_STEPS.indexOf(prev);
      return SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
    });
  }

  return { position, isPlaying, speed, seek, togglePlay, cycleSpeed };
}
