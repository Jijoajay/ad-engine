"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { NAV_DATA } from "@/data";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  function NavItem({
    href,
    icon: Icon,
    title,
    isActive,
  }: {
    href: string;
    icon: any;
    title: string;
    isActive: boolean;
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          isActive && "bg-accent text-foreground font-medium"
        )}
      >
        {Icon && <Icon className="h-4 w-4 mr-3 shrink-0" />}
        {title}
      </Link>
    );
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-background shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-64 bg-background border-r border-gray-600",
          "transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:w-64"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header / Brand */}
          <div className="h-15 px-6 flex items-center border-b border-gray-600">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-lg font-semibold hover:cursor-pointer text-foreground">
                Ad<span className="text-primary">Engine</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              {NAV_DATA.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  {section.label && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem
                        key={item.title}
                        href={item.url}
                        icon={item.icon}
                        title={item.title}
                        isActive={pathname === item.url}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Section */}
          {/* <div className="px-4 py-4 border-t border-gray-600">
            <div className="space-y-1">
              <NavItem
                href="/dashboard/settings"
                icon={NAV_DATA.find((d) =>
                  d.items.find((i) => i.title === "AD Settings")
                )?.items.find((i) => i.title === "AD Settings")?.icon}
                title="Settings"
                isActive={pathname === "/dashboard/settings"}
              />
              <NavItem
                href="/help"
                icon={NAV_DATA.find((d) =>
                  d.items.find((i) => i.title === "Help")
                )?.items.find((i) => i.title === "Help")?.icon}
                title="Help"
                isActive={pathname === "/help"}
              />
            </div>
          </div> */}
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
