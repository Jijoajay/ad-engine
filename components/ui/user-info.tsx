"use client";

import { ChevronUpIcon, LogOutIcon } from "@/assets/icons";
import { Dropdown, DropdownContent, DropdownTrigger } from "./dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { Home } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export function UserInfo() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const USER = {
    name: "Admin",
    email: "admin@buts.io",
    img: "/images/user.png",
  };

  const {logout} = useAuthStore();

  const handleLogout = async()=>{
    const success = await logout();
    if(success){
      router.push("/login")
    }
  }

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="size-12 rounded-full"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />
          <figcaption className="flex items-center gap-1 font-medium text-white max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-[#2A2A2A] bg-[#0F0F0F] shadow-lg min-h-[100px] min-w-[20rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="size-12 rounded-full"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={200}
            height={200}
          />

          <figcaption className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-white">{USER.name}</div>

            <div className="leading-none text-gray-400">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-[#2A2A2A]" />

        <div className="p-2 text-base text-gray-400">
          <Link
            href={"/"}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] font-medium text-gray-300 transition-all duration-500 ease-out",
              "hover:bg-linear-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-[0_0_12px_rgba(147,51,234,0.6)] hover:scale-[1.03]",
              "active:scale-[0.97]"
            )}
          >
            <Home />
            <span className="text-base font-medium">Go To Home</span>
          </Link>
        </div>
        <div className="p-2 text-base text-gray-400">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] font-medium text-gray-300 transition-all duration-500 ease-out",
              "hover:bg-linear-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white hover:shadow-[0_0_12px_rgba(147,51,234,0.6)] hover:scale-[1.03]",
              "active:scale-[0.97]"
            )}
          >
            <LogOutIcon className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12" />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>

      </DropdownContent>
    </Dropdown>
  );
}
