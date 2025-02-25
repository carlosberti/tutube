"use client";

import { Loader2Icon } from "lucide-react";

import { AsyncBoundary } from "@/components/async-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";

type CommentsSectionProps = {
  videoId: string;
};

function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
  const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
    {
      videoId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    }
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-bold">
          {comments.pages[0].commentsCount} Comments
        </h1>

        <CommentForm videoId={videoId} />

        <div className="mt-1 flex flex-col gap-4">
          {comments.pages
            .flatMap((page) => page.items)
            .map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}

          <InfiniteScroll
            hasNextPage={query.hasNextPage}
            isFetchingNextPage={query.isFetchingNextPage}
            fetchNextPage={query.fetchNextPage}
          />
        </div>
      </div>
    </div>
  );
}

function CommentsSectionSkeleton() {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Loader2Icon className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}

export function CommentsSection({ videoId }: CommentsSectionProps) {
  return (
    <AsyncBoundary
      loadingFallback={<CommentsSectionSkeleton />}
      errorFallback={
        <div role="alert" aria-live="polite">
          Failed to load comments
        </div>
      }
    >
      <CommentsSectionSuspense videoId={videoId} />
    </AsyncBoundary>
  );
}
