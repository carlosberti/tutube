"use client";

import { AsyncBoundary } from "@/components/async-boundary";
import { CommentForm } from "@/modules/comments/ui/components/comment-form";
import { CommentItem } from "@/modules/comments/ui/components/comment-item";
import { trpc } from "@/trpc/client";

type CommentsSectionProps = {
  videoId: string;
};

function CommentsSectionSuspense({ videoId }: CommentsSectionProps) {
  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId });

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-6">
        <h1>0 Comments</h1>

        <CommentForm videoId={videoId} />

        <div className="mt-1 flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommentsSectionSkeleton() {
  return <div className="h-24 w-full animate-pulse rounded-md bg-muted"></div>;
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
