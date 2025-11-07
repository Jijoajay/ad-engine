import { motion } from "framer-motion";

export default function CartSkeleton() {
  const items = [1, 2, 3]; // Number of cart items

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* ---- Left: Cart Items Skeleton ---- */}
      <div className="flex-1 flex flex-col gap-6">
        {items.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6 gap-6 animate-pulse"
          >
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row items-start gap-6 w-full flex-1">
              <div className="bg-gray-600 rounded-xl w-[120px] h-[120px] shrink-0" />

              <div className="flex flex-col gap-3 w-full">
                <div className="h-4 bg-gray-600 rounded w-3/4" />
                <div className="h-4 bg-gray-600 rounded w-1/2" />
                <div className="h-4 bg-gray-600 rounded w-full" />

                {/* Quantity placeholder */}
                <div className="h-6 bg-gray-600 rounded w-[90px]" />

                {/* Remove button placeholder */}
                <div className="h-6 bg-gray-600 rounded w-[100px]" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-between items-end gap-3 w-full sm:w-auto">
              <div className="h-6 bg-gray-600 rounded w-16" />
              <div className="h-4 bg-gray-600 rounded w-28" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---- Right: Order Summary Skeleton ---- */}
      <div className="w-full lg:w-[35%] flex flex-col gap-6">
        {/* Order Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6 flex flex-col gap-5 animate-pulse"
        >
          <div className="h-6 bg-gray-600 rounded w-1/3" /> {/* Title */}
          <div className="flex justify-between text-gray-300 text-sm">
            <div className="h-4 bg-gray-600 rounded w-1/2" />
            <div className="h-4 bg-gray-600 rounded w-1/4" />
          </div>
          <div className="h-4 bg-gray-600 rounded w-1/2" /> {/* Promo code */}
          <hr className="border-gray-600" />
          <div className="flex justify-between items-start text-lg font-semibold">
            <div className="h-6 bg-gray-600 rounded w-16" />
            <div className="flex flex-col gap-1">
              <div className="h-6 bg-gray-600 rounded w-16" />
              <div className="h-4 bg-gray-600 rounded w-20" />
            </div>
          </div>
          <div className="h-10 bg-gray-600 rounded w-full" /> {/* Place Order button */}
        </motion.div>

        {/* Promo Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6 animate-pulse"
        >
          <div className="h-5 bg-gray-600 rounded w-1/4 mb-2" /> {/* Promo title */}
          <div className="h-4 bg-gray-600 rounded w-full" /> {/* Promo description */}
        </motion.div>
      </div>
    </div>
  );
}
