"use client";

import CartSkeleton from "@/components/skeleton/ad-skeleton";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { ColorlyText } from "@/components/ui/colory-text";
import EmptyCart from "@/components/ui/empty-cart";
import MainLayout from "@/layout/MainLayout";
import { useCartStore } from "@/store/use-cart-store";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
  const router = useRouter();
  const { cart, fetchCart, updateQuantity, removeFromCart, loading, makePayment, paymentLoading } =
    useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const subtotal = cart.reduce(
    (acc, item) => acc + Number(item.setg_ad_charges || 0) * (item.cart_odr_quantity || 1),
    0
  );

  const handlePlaceOrder = async () => {
    const success = await makePayment();
    if (success) {
      router.push("/payment-successful");
    } else {
      router.push("/payment-failed");
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-[#0E0E11] text-white py-10 sm:py-20 px-[5%] flex flex-col justify-center lg:flex-row gap-8 pt-[100px]"
      >
        <div className="container pt-[50px]">
          {
            ( cart.length !== 0 || loading ) &&
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">Your Cart</h1>
              <p className="text-gray-400 text-sm mt-1">
                Review your selected ad placements before checkout
              </p>
            </div>
          }

          {loading ? (
            <div className="text-center text-gray-400 py-20 animate-pulse">
              <CartSkeleton />
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <EmptyCart />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-10 mt-10">
              {/* ---- Left Section: Cart Items ---- */}
              <div className="flex flex-col gap-8 w-full lg:w-[65%]">
                <AnimatePresence>
                  {cart.map((item, i) => (
                    <motion.div
                      key={item.cart_odr_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="bg-[#12101A] border border-[#2E2C36] rounded-2xl p-6 sm:p-8 min-h-[270px] flex flex-col sm:flex-row justify-between items-start gap-6 hover:shadow-[0_0_20px_rgba(128,90,213,0.15)] transition-all duration-300"
                    >
                      {/* Left Section */}
                      <div className="flex items-center gap-6 sm:w-auto w-[50%]">
                        {/* Image Placeholder */}
                        <div className="bg-[#BFB7CB] rounded-2xl flex items-center justify-center w-[134px] h-[134px] text-black font-medium text-sm shrink-0">
                          {item.setg_ad_size}
                        </div>

                        {/* Details */}
                        <div className="flex flex-col justify-center">
                          <div>
                            <p className="font-bold text-[#D9D9D9] text-[20px]">Banner Size:</p>
                            <p className="text-[#A1A1A1] text-base">{item.setg_ad_size}</p>
                          </div>

                          <div className="mt-3">
                            <p className="font-bold text-[#D9D9D9] text-[20px]">Section:</p>
                            <p className="text-[#A1A1A1] text-base">{item.setg_ad_position}</p>
                          </div>

                          <div className="mt-3">
                            <p className="font-bold text-[#D9D9D9] text-[20px]">Duration:</p>
                            <p className="text-[#A1A1A1] text-base">30 Days</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col justify-between items-end gap-4 mt-4 sm:mt-0 w-[50%] h-full">
                        <div className="flex justify-between items-center w-full">
                          {/* Quantity Selector */}
                          <div className="flex flex-col gap-2">
                            <p className="font-bold text-[#D9D9D9] text-[20px]">Qty:</p>
                            <div className="flex items-center border border-gray-600 rounded-md text-white justify-between px-2 py-1 w-[90px]">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.cart_odr_id,
                                    Math.max(1, (item.cart_odr_quantity || 1) - 1)
                                  )
                                }
                                className="px-2 text-lg text-gray-400 hover:text-white transition"
                              >
                                −
                              </button>
                              <span className="px-2 text-sm">{item.cart_odr_quantity || 1}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.cart_odr_id, (item.cart_odr_quantity || 1) + 1)
                                }
                                className="px-2 text-lg text-gray-400 hover:text-white transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-semibold text-white">
                              ${item.setg_ad_charges}
                            </p>
                            <p className="text-xs text-gray-400">per campaign</p>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between gap-5">
                          {/* Badge */}
                          <div className="border border-[#39AF41] text-[#39AF41] rounded-xl p-3 py-2 text-xs">
                            High performing placement - 83% avg. CTR
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.cart_odr_id)}
                            className="text-xs text-red-400 hover:text-red-300 border cursor-pointer border-red-500 px-4 py-2 rounded-xl transition-all duration-200"
                          >
                            Remove
                          </button>
                        </div>



                      </div>
                    </motion.div>

                  ))}
                </AnimatePresence>
              </div>

              {/* ---- Right Section: Order Summary ---- */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full lg:w-[35%] flex flex-col gap-6"
              >
                {/* Order Summary Box */}
                <div className="bg-[#1A1822] border border-[#2E2C36] rounded-2xl p-6 flex flex-col gap-5">
                  <h2 className="text-xl font-bold text-white">
                    Order summary
                  </h2>

                  <div className="flex justify-between text-gray-300 text-sm">
                    <p>Subtotal ({cart.length} items):</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>

                  <button className="text-[#A78BFA] text-sm hover:underline text-left">
                    + Add promo code
                  </button>

                  <hr className="border-[#2E2C36]" />

                  <div className="flex justify-between items-start text-lg font-semibold">
                    <p>Total:</p>
                    <div>
                      <p className="text-right">${subtotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 text-right">
                        Including taxes
                      </p>
                    </div>
                  </div>

                  <ButtonColorful
                    loading={paymentLoading}
                    onClick={handlePlaceOrder}
                    label="Place order"
                    className="w-full mt-2"
                  />
                </div>

                {/* Promo Box */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-[#1A1822] border border-[#2E2C36] rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-lg mb-1">Promo</h3>
                  <p className="text-gray-300 text-sm">
                    Try promo code <ColorlyText title="SAVE10" /> for 10% off
                    your first campaign
                  </p>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}
