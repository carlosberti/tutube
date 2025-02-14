import { FormSection } from "../sections/form-section";

type VideoViewProps = {
  videoId: string;
};

export function VideoView({ videoId }: VideoViewProps) {
  return (
    <div className="max-w-screen-lg px-4 pt-2.5">
      <FormSection videoId={videoId} />
    </div>
  );
}
