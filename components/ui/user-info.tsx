"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import {
  LogOut,
  MoveUpRight,
  Settings,
  CreditCard,
  FileText,
  Loader2,
  Home,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
}

interface Profile01Props {
  name: string;
  role: string;
  avatar: string;
  subscription?: string;
}

const defaultProfile = {
  name: "Admin",
  role: "Administrator",
  avatar:
    "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
  subscription: "Free Trial",
} satisfies Required<Profile01Props>;

export default function Profile01({
  name = defaultProfile.name,
  role = defaultProfile.role,
  avatar = defaultProfile.avatar,
  subscription = defaultProfile.subscription,
}: Partial<Profile01Props> = defaultProfile) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const success = await logout();
      if (success) {
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-2xl border border-[#33353A]">
        <div className="relative px-6 pt-6 pb-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-2">
            <div className="relative shrink-0 mb-2">
              <Image
                src={avatar}
                alt={name}
                width={72}
                height={72}
                className="rounded-full ring-4 bg-[#1A1B1E] object-cover"
              />
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#F0F0F0]">{name}</h2>
              <p className="text-muted-foreground">{role}</p>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Menu Items */}
          <div className="space-y-2 pt-3 text-[#A0A0A0]">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-2 hover:bg-neutral-700 
                            rounded-lg 
                           transition-colors duration-300 ease-in-out"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-[#A0A0A0]">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center">
                  {item.value && (
                    <span className="text-sm text-[#A0A0A0] mr-2">
                      {item.value}
                    </span>
                  )}
                  {item.external && <MoveUpRight className="w-4 h-4" />}
                </div>
              </Link>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              type="button"
              className="w-full flex items-center justify-between p-2 
                         rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                         hover:bg-red-600 hover:text-white disabled:opacity-60"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium text-[#A0A0A0]">
                  Logout
                </span>
              </div>
              {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
