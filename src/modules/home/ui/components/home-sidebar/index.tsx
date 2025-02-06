import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { Sections } from "./sections";

export function HomeSideBar() {
  return (
    <Sidebar className="pt-16 z-40 border-none" collapsible="icon">
      <SidebarContent className="bg-background">
        <Sections />
      </SidebarContent>
    </Sidebar>
  );
}
