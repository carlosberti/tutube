import Link from "next/link";

import { VideoGetManyOutput } from "@/modules/videos/types";

import { VideoThumbnail } from "../video-thumbnail";
import { VideoInfo } from "../vindeo-info";

type VideoGridCardProps = {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
};

export function VideoGridCard({ data, onRemove }: VideoGridCardProps) {
  return (
    <div className="group flex w-full flex-col gap-2">
      <Link href={`/videos/${data.id}`}>
        <VideoThumbnail
          title={data.title}
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          duration={data.duration}
        />
      </Link>

      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
}
