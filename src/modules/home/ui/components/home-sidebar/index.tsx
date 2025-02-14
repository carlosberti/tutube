import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { Sections } from "./sections";

export function HomeSideBar() {
  return (
    <Sidebar className="z-40 border-none pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <Sections />
      </SidebarContent>
    </Sidebar>
  );
}
