"use client";

import Link from "next/link";

import { useAuth, useClerk } from "@clerk/nextjs";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { CommentGetManyOutput } from "@/modules/comments/types";
import { trpc } from "@/trpc/client";

type CommentItemProps = {
  comment: CommentGetManyOutput["items"][number];
};

export function CommentItem({ comment }: CommentItemProps) {
  const { userId } = useAuth();
  const clerk = useClerk();

  const utils = trpc.useUtils();
  const remove = trpc.comments.remove.useMutation({
    onSuccess() {
      toast.success("Comment removed");
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const like = trpc.commentReactions.like.useMutation({
    onSuccess() {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const dislike = trpc.commentReactions.dislike.useMutation({
    onSuccess() {
      utils.comments.getMany.invalidate({ videoId: comment.videoId });
    },
    onError(error) {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
        return;
      }

      toast.error(error.message);
    },
  });

  return (
    <div>
      <div className="flex gap-4">
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link href={`/users/${comment.userId}`}>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="pb-0.5 text-sm font-medium">
                {comment.user.name}
              </span>

              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.updatedAt, {
                  addSuffix: true,
                })}
              </span>
            </div>
          </Link>

          <p className="text-sm">{comment.value}</p>

          {/* <div className=" flex items-center gap-2"> */}
          <div className="mt-1 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={like.isPending || dislike.isPending}
              onClick={() => like.mutate({ commentId: comment.id })}
            >
              <ThumbsUpIcon
                className={cn(
                  comment.viewerReaction === "like" && "fill-black"
                )}
              />
            </Button>

            <span className="text-xs text-muted-foreground">
              {comment.likeCount}
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              disabled={dislike.isPending || like.isPending}
              onClick={() => dislike.mutate({ commentId: comment.id })}
            >
              <ThumbsDownIcon
                className={cn(
                  comment.viewerReaction === "dislike" && "fill-black"
                )}
              />
            </Button>

            <span className="text-xs text-muted-foreground">
              {comment.dislikeCount}
            </span>
          </div>
          {/* </div> */}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {}}>
              <MessageSquareIcon className="size-4" />
              Reply
            </DropdownMenuItem>
            {comment.user.clerkId === userId && (
              <DropdownMenuItem
                onClick={() => remove.mutate({ id: comment.id })}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
