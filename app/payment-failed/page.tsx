"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import Link from "next/link";

const PaymentFailed = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
      {/* Animated container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg"
      >
        {/* Top Red Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#a4161a] flex flex-col items-center justify-center py-10"
        >
          <div className="text-6xl">👎</div>
          <h1 className="text-white text-xl font-semibold mt-4">
            payment Failed!
          </h1>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-[#151515] text-center py-10"
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              className="bg-[#e63946] p-4 rounded-full"
            >
              <X className="text-white w-8 h-8" />
            </motion.div>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white text-2xl font-bold mb-2"
          >
            Try again
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-6 text-sm"
          >
            Oops payment failed, something went wrong. Please try again!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center"
          >
            <Link href="/ad-upload">
              <ButtonColorful
                label="Try again"
                isIcon={false}
                className="w-28 font-thin"
              />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailed;
