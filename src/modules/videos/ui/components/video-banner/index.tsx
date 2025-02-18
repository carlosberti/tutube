import { AlertTriangle } from "lucide-react";

import { VideoGetOneOutput } from "@/modules/videos/types";

type VideoBannerProps = {
  status: VideoGetOneOutput["muxStatus"];
};

export function VideoBanner({ status }: VideoBannerProps) {
  if (status === "ready") return null;

  return (
    <div className="flex items-center gap-2 rounded-b-xl bg-yellow-400 px-4 py-3">
      <AlertTriangle className="size-4 shrink-0 text-black" />
      <p className="line-clamp-1 text-xs font-medium text-black md:text-sm">
        Your video is being processed. It may take a few minutes.
      </p>
    </div>
  );
}
