"use client";

import { useMemo } from "react";

import Link from "next/link";

import { cva, VariantProps } from "class-variance-authority";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import { VideoGetManyOutput } from "@/modules/videos/types";

import { VideoMenu } from "../video-menu";
import { VideoThumbnail } from "../video-thumbnail";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type VideoRowCardProps = {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
} & VariantProps<typeof videoRowCardVariants> &
  VariantProps<typeof thumbnailVariants>;

// function VideoRowCardSkeleton() {
//   return (
//     <div>
//       <h1>Video Row Card</h1>
//     </div>
//   );
// }

export function VideoRowCard({ data, onRemove, size }: VideoRowCardProps) {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(
      data.viewCount
    );
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("en-US", { notation: "compact" }).format(
      data.likeCount
    );
  }, [data.likeCount]);

  return (
    <div className={videoRowCardVariants({ size })}>
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          title={data.title}
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          duration={data.duration}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <Link href={`/videos/${data.id}`} className="min-w-0 flex-1">
            <h3
              className={cn(
                "line-clamp-2 font-medium",
                size === "compact" ? "text-sm" : "text-base"
              )}
            >
              {data.title}
            </h3>

            {size === "default" && (
              <>
                <p className="mt-1 text-xs text-muted-foreground">
                  {compactViews} views • {compactLikes} likes
                </p>

                <div className="my-3 flex items-center gap-2">
                  <UserAvatar
                    size="sm"
                    imageUrl={data.user.imageUrl}
                    name={data.user.name}
                  />

                  <UserInfo size="sm" name={data.user.name} />
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="line-clamp-2 w-fit text-xs text-muted-foreground">
                      {data.description ?? "No description"}
                    </p>
                  </TooltipTrigger>

                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>From the video description</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}

            {size === "compact" && (
              <>
                <UserInfo size="sm" name={data.user.name} />

                <p className="mt-1 text-xs text-muted-foreground">
                  {compactViews} views • {compactLikes} likes
                </p>
              </>
            )}
          </Link>

          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}
