"use client";

import MuxPlayer from "@mux/mux-player-react";

type VideoPlayerProps = {
  playbackId?: string | null;
  thumbnailUrl?: string | null;
  autoPlay?: boolean;
  onPlay?: () => void;
};

export function VideoPlayer({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) {
  return (
    <MuxPlayer
      className="w-full h-full object-contain"
      playbackId={playbackId || ""}
      poster={thumbnailUrl || "/placeholder.jpg"}
      playerInitTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      thumbnailTime={0}
      accentColor="#FF2056"
    />
  );
}
