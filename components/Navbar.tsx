"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Handbag, Menu, User, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { ButtonColorful } from "@/components/ui/button-colorful"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme } = useTheme()
  const isLightTheme = theme === "light"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Updated navigation links with new order
  const navLinks = [
    { name: "Facilities", href: "/facilities" },
    { name: "Events", href: "/events" },
    { name: "To Do", href: "/todo" },
    { name: "Advertising", href: "/advertising" },
    { name: "About Us", href: "/#about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Contact Us", href: "/#contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black ${isScrolled
          ? isLightTheme
            ? "bg-white/70 backdrop-blur-md shadow-md"
            : "bg-black/50 backdrop-blur-md shadow-md"
          : "bg-transparent"
        }`}
    >
      <div className="px-[5%]">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <Link href="/" className="flex items-center">
            <span className={`text-2xl sm:text-3xl font-bold ${isLightTheme ? "text-gray-800" : "text-white"}`}>
              Ad
              <span className="bg-clip-text text-transparent bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">Engine</span>
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/cart" className="p-0.5 rounded-full bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] bg-[#0A0A0A]">
              <div className="p-2 bg-[#0A0A0A] rounded-full ">
                <Handbag />
              </div>
            </Link>

            <div className="p-0.5 rounded-full bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]">
              <div className="p-2 bg-[#0A0A0A] rounded-full">
                <User />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          {/* <div className="lg:hidden flex items-center">
            <button
              className={`p-2 rounded-full ${isLightTheme ? "bg-gray-200/70" : "bg-black/30"} backdrop-blur-sm focus:outline-none transition-colors`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className={`h-5 w-5 sm:h-6 sm:w-6 ${isLightTheme ? "text-gray-800" : "text-white"}`} />
              ) : (
                <Menu className={`h-5 w-5 sm:h-6 sm:w-6 ${isLightTheme ? "text-gray-800" : "text-white"}`} />
              )}
            </button>
          </div> */}
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden ${isLightTheme ? "bg-white/95" : "bg-black/95"} backdrop-blur-md border-t ${isLightTheme ? "border-gray-200" : "border-gray-800"}`}
          >
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block ${isLightTheme
                      ? "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      : "text-white/80 hover:text-blue-400 hover:bg-white/5"
                    } py-3 px-4 rounded-lg transition-all duration-200 text-base font-medium`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <ButtonColorful label="Login" className="w-full text-white h-12 text-base font-medium" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
