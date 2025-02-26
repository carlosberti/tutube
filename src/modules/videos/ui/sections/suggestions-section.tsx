"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client";

import { VideoGridCard } from "../components/video-grid-card";
import { VideoRowCard } from "../components/video-row-card";

type SuggestionsSectionProps = {
  videoId: string;
  isManual?: boolean;
};

export function SuggestionsSection({
  videoId,
  isManual,
}: SuggestionsSectionProps) {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
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
    <>
      <div className="hidden space-y-3 md:block">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} size="compact" data={video} />
          ))}
      </div>

      <div className="space-y-10 md:hidden">
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
        isManual={isManual}
      />
    </>
  );
}
