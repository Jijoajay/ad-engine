"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Handbag,
  Menu,
  Upload,
  User,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { CartBadge } from "./cart-badge";
import { useAdStore } from "@/store/use-ad-store";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const { advertisements } = useAdStore();
  const { user, logout, isAuthenticated } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const userModalRef = useRef<HTMLDivElement | null>(null);
  const isLightTheme = theme === "light";

  // Close user modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userModalRef.current &&
        !userModalRef.current.contains(event.target as Node)
      ) {
        setIsUserModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navbar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const success = await logout();
    if (success) router.push("/login");
  };

  const navLinks = [
    { name: "Facilities", href: "/facilities" },
    { name: "Events", href: "/events" },
    { name: "To Do", href: "/todo" },
    { name: "Advertising", href: "/advertising" },
    { name: "About Us", href: "/#about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact Us", href: "/#contact" },
  ];

  const userMenuItems = [
    { href: "/profile", label: "Profile", icon: UserCircle },
    { href: "/my-ads", label: "My ADs", icon: UserCircle },
    { href: "/change-password", label: "Change Password", icon: UserCircle },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0A0A0A] ${
        isScrolled
          ? isLightTheme
            ? "bg-white/70 backdrop-blur-md shadow-md"
            : "bg-black/50 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="px-[5%] w-full flex justify-center">
        <div className="container">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span
                className={`text-2xl sm:text-3xl font-bold ${
                  isLightTheme ? "text-gray-800" : "text-white"
                }`}
              >
                Ad
                <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">
                  Engine
                </span>
              </span>
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-5 relative">
              {advertisements.length > 0 && (
                <Link
                  href="/ad-upload"
                  className="relative p-0.5 rounded-full bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]"
                >
                  <div className="p-2 bg-[#0A0A0A] rounded-full relative">
                    <Upload className="text-white" />
                  </div>
                </Link>
              )}

              <Link
                href="/cart"
                className="relative p-0.5 rounded-full bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]"
              >
                <div className="p-2 bg-[#0A0A0A] rounded-full relative">
                  <Handbag className="text-white" />
                  <CartBadge />
                </div>
              </Link>

              {/* 👤 User Icon with Modal */}
              <div
                className="p-0.5 rounded-full bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] cursor-pointer relative"
                onClick={() => setIsUserModalOpen(!isUserModalOpen)}
                ref={userModalRef}
              >
                <div className="p-2 bg-[#0A0A0A] rounded-full">
                  <User className="text-white" />
                </div>

                {/* User Modal */}
                <AnimatePresence>
                  {isUserModalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-2 w-60 bg-[#1a1a1a] text-white rounded-2xl shadow-lg border border-gray-700 p-3 z-50"
                    >
                      {isAuthenticated ? (
                        <>
                          <p className="text-sm px-3 py-2 border-b border-gray-700">
                            {user?.name || "User"}
                          </p>

                          {userMenuItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                              <motion.div
                                key={href}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href={href}
                                  onClick={() => setIsUserModalOpen(false)}
                                  className={`flex items-center gap-2 px-3 py-2 mt-2 rounded-lg transition-all duration-300 ${
                                    isActive
                                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:opacity-90 scale-[1.02]"
                                      : "hover:bg-white/10"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" /> {label}
                                </Link>
                              </motion.div>
                            );
                          })}

                          <motion.button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 mt-2 hover:bg-red-600/20 rounded-lg transition w-full text-left"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="w-4 h-4 text-red-400" /> Logout
                          </motion.button>
                        </>
                      ) : (
                        <Link
                          href="/login"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                            pathname === "/login"
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:opacity-90 scale-[1.02]"
                              : "hover:bg-white/10"
                          }`}
                          onClick={() => setIsUserModalOpen(false)}
                        >
                          <UserCircle className="w-4 h-4" /> Login
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🟣 Mobile Menu Toggle */}
              <button
                className="lg:hidden text-white focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden ${
              isLightTheme ? "bg-white/95" : "bg-black/95"
            } backdrop-blur-md border-t ${
              isLightTheme ? "border-gray-200" : "border-gray-800"
            }`}
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block py-3 px-4 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-linear-to-r from-purple-500 to-blue-500 text-white shadow-md hover:opacity-90 scale-[1.02]"
                        : isLightTheme
                        ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        : "text-white/80 hover:text-blue-400 hover:bg-white/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <ButtonColorful
                    label="Login"
                    className="w-full text-white h-12 text-base font-medium"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
