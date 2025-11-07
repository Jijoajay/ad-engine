"use client";

import { useCartStore } from "@/store/use-cart-store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";


export const CartBadge = () => {
  const { cart } = useCartStore()
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (cart.length > 0) {
      setAnimate(true)
      const timeout = setTimeout(() => setAnimate(false), 400)
      return () => clearTimeout(timeout)
    }
  }, [cart.length])

  if (cart.length === 0) return null

  return (
    <motion.div
      key={cart.length}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: animate ? 1.4 : 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className="absolute -top-1 -right-1 bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)] text-white text-[10px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
    >
      {cart.length}
    </motion.div>
  )
}
