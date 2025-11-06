"use client";

import { SidebarProvider } from "@/context/SidebarProvider";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
