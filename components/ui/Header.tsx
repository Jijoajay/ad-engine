"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { useSidebarContext } from "@/context/SidebarProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MenuIcon, SearchIcon } from "@/assets/icons";
import { ThemeToggle } from "./toggle-theme";
import Profile01 from "./user-info";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();

  // Breadcrumbs like your TopNav
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Ad Engine", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-600 bg-[#020d1a] px-4 h-15 shadow-1 md:px-6 2xl:px-10">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg border border-[#1a1a1a] bg-[#020d1a] px-2 py-1.5 text-white hover:bg-[#111827] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* Mobile Logo */}
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

      {/* Breadcrumbs */}
      <div className="hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white text-sm">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full max-w-[250px] items-center rounded-full border border-[#1a1a1a] bg-[#111827] py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 outline-none focus:border-[#5750F1] transition-colors"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-[#111827] rounded-full transition-colors"
        >
          <Bell className="h-5 w-5 text-gray-400" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Info / Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-[#1a1a1a] cursor-pointer"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-[#020d1a] border border-gray-700 rounded-2xl shadow-lg p-1"
          >
            <Profile01 />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
