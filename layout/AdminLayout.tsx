"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Providers } from "@/app/providers";
import Loading from "@/components/loading";
import { Header } from "@/components/ui/Header";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { useAuthStore } from "@/lib/auth-store";
import Sidebar from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.user_type !== 0) {
      router.replace("/");
    }
  }, [user, isAuthenticated, router]);

  if (!user || user.user_type !== 0) {
    return (
      <div className="flex h-screen items-center justify-center text-white">
        <Loading />
      </div>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <NextTopLoader color="#5750F1" showSpinner={false} />
        <div className="flex h-screen overflow-hidden"> {/* prevent whole page scroll */}
          <Sidebar />
          <div className="flex flex-col w-full bg-gray-2">
            <Header />
            <main
              className="flex-1 overflow-y-auto isolate mx-auto w-full max-w-screen-2xl p-4 md:p-6 2xl:p-10 bg-[#1A1B1E] text-[#A0A0A0]"
            >
              {children}
            </main>
          </div>
        </div>
      </Providers>
    </Suspense>
  );
};

export default AdminLayout;
