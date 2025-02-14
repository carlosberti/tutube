"use client";

import MuxPlayer from "@mux/mux-player-react";

import { THUMBNAIL_FALLBACK } from "@/modules/videos/constants";

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
      className="h-full w-full object-contain"
      playbackId={playbackId || ""}
      poster={thumbnailUrl || THUMBNAIL_FALLBACK}
      playerInitTime={0}
      autoPlay={autoPlay}
      onPlay={onPlay}
      thumbnailTime={0}
      accentColor="#FF2056"
    />
  );
}
