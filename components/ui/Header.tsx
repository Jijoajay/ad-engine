"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const formatLabel = (segment: string) =>
  segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const pathname = usePathname();

  const breadcrumbs: BreadcrumbItem[] = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      label: formatLabel(segment),
      href: "/" + arr.slice(0, index + 1).join("/"),
    }));

  return (
    <header className="px-3 sm:px-6 flex items-center justify-between bg-[#1A1B1E] border-b border-[#33353A] h-15">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="rounded-lg border border-[#33353A] bg-[#1A1B1E] px-2 py-1.5 text-foreground hover:bg-accent lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* Mobile Logo */}
      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Image src={"/images/logo/logo-icon.svg"} width={32} height={32} alt="Logo" />
        </Link>
      )}

      {/* Breadcrumbs */}
      <div className="hidden sm:flex items-center space-x-1 truncate max-w-[300px] font-medium text-sm">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            )}
            {index < breadcrumbs.length - 1 ? (
              <Link
                href={item.href!}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        {/* Search */}
        <div className="relative hidden md:block">
          <input
            type="search"
            placeholder="Search"
            className="flex w-full max-w-[250px] items-center rounded-full border border-[#33353A] bg-[#1A1B1E] py-2 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary transition-colors"
          />
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
        </div>

        {/* Notifications */}
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-accent rounded-full transition-colors"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        </button>

        {/* Theme Toggle */}
        {/* <ThemeToggle /> */}

        {/* User Info / Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
              alt="User avatar"
              width={28}
              height={28}
              className="rounded-full ring-2 ring-bg-[#33353A] sm:w-8 sm:h-8 cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-[#1A1B1E] border border-[#33353A] rounded-2xl shadow-lg"
          >
            <Profile01 />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
