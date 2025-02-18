import { useMemo } from "react";

import { format, formatDistanceToNow } from "date-fns";

import { VideoGetOneOutput } from "@/modules/videos/types";

import { VideoDescription } from "../video-description";
import { VideoMenu } from "../video-menu";
import { VideoOwner } from "../video-owner";
import { VideoReactions } from "../video-reactions";

type VideoTopRowProps = {
  video: VideoGetOneOutput;
};

export function VideoTopRow({ video }: VideoTopRowProps) {
  const videoMetadata = useMemo(
    () => ({
      views: {
        compact: Intl.NumberFormat("en-US", { notation: "compact" }).format(
          1000
        ),
        expanded: Intl.NumberFormat("en-US", { notation: "standard" }).format(
          1000
        ),
      },
      date: {
        compact: formatDistanceToNow(video.createdAt, { addSuffix: true }),
        expanded: format(video.createdAt, "d MMM yyyy"),
      },
    }),
    [video.createdAt]
  );

  return (
    <div className="mt-4 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <VideoOwner user={video.user} videoId={video.id} />

        <div className="-mb-2 flex gap-2 overflow-x-auto pb-2 sm:mb-0 sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible sm:pb-0">
          <VideoReactions />

          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>

      <VideoDescription
        metadata={videoMetadata}
        description={video.description}
      />
    </div>
  );
}
