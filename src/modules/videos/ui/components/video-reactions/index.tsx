import { useClerk } from "@clerk/nextjs";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { VideoGetOneOutput } from "@/modules/videos/types";
import { trpc } from "@/trpc/client";

type VideoReactionsProps = {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
};

export function VideoReactions({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess() {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess() {
      utils.videos.getOne.invalidate({ id: videoId });
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="flex flex-none items-center">
      <Button
        variant="secondary"
        className="gap-2 rounded-l-full rounded-r-none pr-4"
        disabled={like.isPending || dislike.isPending}
        onClick={() => like.mutate({ id: videoId })}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>

      <Separator orientation="vertical" className="h-7" />

      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
        disabled={like.isPending || dislike.isPending}
        onClick={() => dislike.mutate({ id: videoId })}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
}
