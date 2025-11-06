"use client";

import { ButtonColorful } from "@/components/ui/button-colorful";
import { ColorlyText } from "@/components/ui/colory-text";
import MainLayout from "@/layout/MainLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      size: "1336×400",
      section: "Our partners",
      duration: "30 Days",
      qty: 1,
      price: 20,
      performance: "High performing placement - 83% avg. CTR",
    },
    {
      id: 2,
      size: "448×237",
      section: "Our partners",
      duration: "30 Days",
      qty: 1,
      price: 20,
      performance: "High performing placement - 67% avg. CTR",
    },
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-[#0B0B10] text-white py-10 sm:py-20 px-[5%] flex flex-col lg:flex-row gap-8 pt-[120px]"
      >
        {/* ---- Left Side: Cart Items ---- */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Your Cart</h1>
            <p className="text-gray-400 text-sm">
              Review your selected ad placements before checkout
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* ---- Cart List ---- */}
            <div className="flex flex-col gap-8 w-full lg:w-[65%]">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6 gap-6"
                  >
                    {/* Left Section */}
                    <div className="flex flex-col sm:flex-row items-start gap-6 w-full flex-1">
                      <div className="bg-[#BFB7CB] rounded-xl flex items-center justify-center w-[120px] h-[120px] text-sm text-black font-medium shrink-0">
                        {item.size}
                      </div>

                      <div className="flex flex-col gap-1">
                        <div>
                          <h2 className="text-lg text-[#D9D9D9] font-semibold">
                            Banner Size:
                          </h2>
                          <p className="text-white">{item.size}</p>
                        </div>
                        <div>
                          <h2 className="text-lg text-[#D9D9D9] font-semibold">
                            Section:
                          </h2>
                          <p className="text-white">{item.section}</p>
                        </div>
                        <div>
                          <h2 className="text-lg text-[#D9D9D9] font-semibold">
                            Duration:
                          </h2>
                          <p className="text-white">{item.duration}</p>
                        </div>

                        {/* Qty */}
                        <div className="flex flex-col gap-1">
                          <h2 className="text-lg text-[#D9D9D9] font-semibold">
                            Qty:
                          </h2>
                          <div className="flex items-center border border-gray-600 rounded-md w-[90px]">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="px-2 text-lg text-gray-400 hover:text-white transition"
                            >
                              −
                            </button>
                            <span className="px-3">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="px-2 text-lg text-gray-400 hover:text-white transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col justify-between items-end gap-3 w-full sm:w-auto">
                      <div className="text-right">
                        <p className="text-2xl sm:text-3xl font-bold">
                          ${item.price}
                        </p>
                        <p className="text-xs text-gray-400">per campaign</p>
                      </div>
                      <div className="border border-green-500 text-green-400 rounded-md px-3 py-1 text-xs text-center">
                        {item.performance}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ---- Order Summary ---- */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full lg:w-[35%] flex flex-col gap-6"
            >
              <div className="bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6 flex flex-col gap-5">
                <h2 className="text-xl font-semibold">Order summary</h2>

                <div className="flex justify-between text-gray-300 text-sm">
                  <p>Subtotal ({items.length} items):</p>
                  <p>${subtotal}</p>
                </div>

                <div>
                  <ColorlyText title="+ Add Promo code" />
                </div>

                <hr className="border-[#4C4C4C]" />

                <div className="flex justify-between items-start text-lg font-semibold">
                  <p>Total:</p>
                  <div>
                    <p className="text-right">${subtotal}</p>
                    <p className="text-xs text-gray-400 font-normal text-right">
                      Including taxes
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <ButtonColorful
                    isIcon={false}
                    label="Place Order"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>

              {/* ---- Promo Box ---- */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6"
              >
                <h3 className="font-semibold text-lg mb-1">Promo</h3>
                <p className="text-gray-300 text-sm">
                  Try promo code <ColorlyText title="SAVE10" /> for 10% off your
                  first campaign
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  );
}
