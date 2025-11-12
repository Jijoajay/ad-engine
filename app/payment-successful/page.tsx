"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Check } from "lucide-react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import Link from "next/link";

const PaymentSuccess = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Track window size for responsive confetti
    const updateSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      {/* Continuous Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={100}
        gravity={0.3}
        recycle={true}      
        run={true}          
      />

      {/* Main card animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg z-10"
      >
        {/* Top Green Section */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#3BB54A] flex flex-col items-center justify-center py-10 relative"
        >
          {/* 👍 Animated Thumb */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [-45, 10, 0],
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.3,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              transition: { type: "spring", stiffness: 200 },
            }}
            whileTap={{
              scale: 0.95,
              rotate: -5,
            }}
            className="text-6xl z-10"
          >
            👍
          </motion.div>

          <h1 className="text-white text-xl font-semibold mt-4 z-10">
            payment successful!
          </h1>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-[#151515] text-center py-10"
        >
          {/* Check Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            className="flex justify-center mb-4"
          >
            <div className="bg-[#3BB54A] p-4 rounded-full">
              <Check className="text-white w-8 h-8" />
            </div>
          </motion.div>

          {/* Texts */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white text-2xl font-bold mb-2"
          >
            Thank you
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 mb-6 text-sm"
          >
            Your transaction was completed successfully, thank you for your purchase
          </motion.p>

          {/* Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center"
          >
            <Link href="/ad-upload">
              <ButtonColorful
                label="Done"
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

export default PaymentSuccess;
