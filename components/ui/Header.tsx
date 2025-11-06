"use client";

import Image from "next/image";
import Link from "next/link";
import { UserInfo } from "./user-info";
import { ThemeToggleSwitch } from "./toggle-theme";
import { useSidebarContext } from "@/context/SidebarProvider";
import { MenuIcon, SearchIcon } from "@/assets/icons";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-600 bg-[#020d1a] px-4 py-5 shadow-1 md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border text-white border-[#1a1a1a] bg-[#020d1a] px-1.5 py-1 hover:bg-[#111827] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image
            src={"/images/logo/logo-icon.svg"}
            width={32}
            height={32}
            alt="Logo"
          />
        </Link>
      )}

      {/* <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-white">
          Dashboard
        </h1>
        <p className="font-medium text-gray-400">
          Next.js Admin Dashboard Solution
        </p>
      </div> */}

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="relative w-full max-w-[300px]">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full items-center gap-3.5 rounded-full border border-[#1a1a1a] bg-[#111827] py-3 pl-[53px] pr-5 text-white placeholder-gray-400 outline-none transition-colors focus-visible:border-[#5750F1]"
          />
          <SearchIcon className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 max-[1015px]:size-5 text-gray-400" />
        </div>

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
