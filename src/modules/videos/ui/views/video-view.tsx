import { CommentsSection } from "../sections/comments-section";
import { SuggestionsSection } from "../sections/suggestions-section";
import { VideoSection } from "../sections/video-section";

type VideoViewProps = {
  videoId: string;
};

export function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="mx-auto mb-10 flex max-w-[1700px] flex-col px-4 pt-2.5">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1">
          <VideoSection videoId={videoId} />

          <div className="mt-4 block xl:hidden">
            <SuggestionsSection videoId={videoId} />
          </div>

          <CommentsSection videoId={videoId} />
        </div>

        <div className="shrink-1 hidden w-[380px] xl:block 2xl:w-[460px]">
          <SuggestionsSection videoId={videoId} isManual />
        </div>
      </div>
    </div>
  );
}
