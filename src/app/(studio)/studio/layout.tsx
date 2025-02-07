import { StudioLayout } from "@/modules/studio/ui/layouts/studio-layout";

type StudioLayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: StudioLayoutProps) {
  return <StudioLayout>{children}</StudioLayout>;
}
