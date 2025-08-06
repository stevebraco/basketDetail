import { useState, useRef } from "react";

export function useYoutubePlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleReady = (event: any) => {
    setPlayer(event.target);
  };

  const seekTo = (timestamp: number) => {
    if (player) {
      player.seekTo(timestamp, true);
      setCurrentTime(timestamp);
      playerRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const reset = () => {
    setCurrentTime(null);
  };

  return {
    player,
    currentTime,
    playerRef,
    handleReady,
    seekTo,
    reset,
  };
}
