"use client";

import { AsyncBoundary } from "@/components/async-boundary";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";

import { VideoBanner } from "../components/video-banner";
import { VideoPlayer } from "../components/video-player";
import { VideoTopRow } from "../components/video-top-row";

type VideoSectionProps = {
  videoId: string;
};

function VideoSecitonSuspense({ videoId }: VideoSectionProps) {
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });

  return (
    <>
      <div
        className={cn(
          "relative aspect-video overflow-hidden rounded-xl bg-black",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={() => {}}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>

      <VideoBanner status={video.muxStatus} />

      <VideoTopRow video={video} />
    </>
  );
}

function VideoSectionSkeleton() {
  return null;
}

export function VideoSection({ videoId }: VideoSectionProps) {
  return (
    <AsyncBoundary
      loadingFallback={<VideoSectionSkeleton />}
      errorFallback={
        <div role="alert" aria-live="polite">
          Failed to load video
        </div>
      }
    >
      <VideoSecitonSuspense videoId={videoId} />
    </AsyncBoundary>
  );
}
