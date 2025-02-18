"use client";

import { useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type VideoMetadata = {
  views: {
    compact: string;
    expanded: string;
  };
  date: {
    compact: string;
    expanded: string;
  };
};

type VideoDescriptionProps = {
  metadata: VideoMetadata;
  description?: string | null;
};

export function VideoDescription({
  description,
  metadata,
}: VideoDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="cursor-pointer rounded-xl bg-secondary/50 p-3 transition hover:bg-secondary/70"
      onClick={() => setIsExpanded((curr) => !curr)}
    >
      <div className="mb-2 flex gap-2 text-sm">
        <span className="font-medium">
          {isExpanded ? metadata.views.expanded : metadata.views.compact} views
        </span>

        <span className="font-medium">
          {isExpanded ? metadata.date.expanded : metadata.date.compact}
        </span>
      </div>

      <div className="relative">
        <p
          className={cn(
            "whitespace-pre-wrap text-sm",
            !metadata.date.expanded && "line-clamp-2"
          )}
        >
          {description || "No description"}
        </p>

        <div className="mt-4 flex items-center gap-1 text-sm font-medium">
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="size-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="size-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
