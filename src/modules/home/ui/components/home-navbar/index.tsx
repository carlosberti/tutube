import Image from "next/image";
import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

import { SearchInput } from "./search-input";

export function HomeNavBar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center bg-white px-2 pr-5">
      <div className="flex w-full items-center gap-4">
        <div className="flex flex-shrink-0 items-center">
          <SidebarTrigger />
          <Link href="/">
            <div className="flex items-center gap-1 p-4">
              <Image src="/logo.svg" alt="TuTube logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">TuTube</p>
            </div>
          </Link>
        </div>

        <div className="mx-auto flex max-w-[720px] flex-1 justify-center">
          <SearchInput />
        </div>

        <div className="items-centerflex flex-shrink-0 gap-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
