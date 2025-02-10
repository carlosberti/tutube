"use client";

import { AsyncBoundary } from "@/components/async-boundary";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

function VideosSectionSuspense() {
  const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    { limit: DEFAULT_LIMIT },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <div>
      {JSON.stringify(data)}

      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
}

export function VideosSection() {
  return (
    <AsyncBoundary
      // loadingFallback={<VideosSkeleton />}
      loadingFallback={<p>;pading...</p>}
      errorFallback={
        <div role="alert" aria-live="polite">
          Failed to load videos
        </div>
      }
    >
      <VideosSectionSuspense />
    </AsyncBoundary>
  );
}
