import { CornerDownRightIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import { CommentItem } from "../comment-item";

type CommentRepliesProps = {
  parentId: string;
  videoId: string;
};

export function CommentReplies({ parentId, videoId }: CommentRepliesProps) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.comments.getMany.useInfiniteQuery(
      { limit: DEFAULT_LIMIT, parentId, videoId },
      {
        getNextPageParam(lastPage) {
          return lastPage.nextCursor;
        },
      }
    );

  return (
    <div className="pl-14">
      <div className="gap4 mt-2 flex flex-col">
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading &&
          data?.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} variant="reply" comment={comment} />
            ))}
      </div>

      {hasNextPage && (
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          {isFetchingNextPage ? "Loading more replies..." : "Show more replies"}
        </Button>
      )}
    </div>
  );
}
