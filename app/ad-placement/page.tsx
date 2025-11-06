"use client";

import MainLayout from "@/layout/MainLayout";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonColorful } from "@/components/ui/button-colorful";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

type TabKey = "facilities" | "events" | "to-do";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Get tab from URL or default to "facilities" ---
  const initialTab = (searchParams.get("tab") as TabKey) || "facilities";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // --- Sync tab with URL ---
  useEffect(() => {
    router.replace(`?tab=${activeTab}`);
  }, [activeTab, router]);

  const departments: { id: TabKey; name: string }[] = [
    { id: "facilities", name: "Facilities" },
    { id: "events", name: "Events" },
    { id: "to-do", name: "To Do" },
  ];

  const data: Record<
    TabKey,
    {
      image: string;
      size: string;
      section: string;
      description: string;
      price: string;
    }[]
  > = {
    facilities: [
      {
        image: "/images/facilities.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
    ],
    events: [
      {
        image: "/images/event-1.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
      {
        image: "/images/event-2.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
    ],
    "to-do": [
      {
        image: "/images/to-do-1.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
      {
        image: "/images/to-do-2.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
      {
        image: "/images/to-do-3.png",
        size: "448 × 237",
        section: "Our partners",
        description:
          "Quality brands that support our facilities and community",
        price: "$20",
      },
    ],
  };

  return (
    <MainLayout>
      <section className="flex flex-col gap-10 items-start mt-[120px] px-[5%] ">
        {/* ---- Tab Buttons ---- */}
        <div className="w-full">
          <div className="flex flex-wrap justify-center gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setActiveTab(dept.id)}
                className={`flex items-center gap-2 px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  activeTab === dept.id
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Animated Section ---- */}
        <div className="w-full bg-[#0B0B10] text-white flex flex-col justify-center gap-10 items-start overflow-hidden rounded-xl p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -100, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.98 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col gap-10 w-full"
            >
              {data[activeTab].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  className="bg-[#231F29] w-full flex flex-col sm:flex-row border border-[#4C4C4C] rounded-xl overflow-hidden"
                >
                  {/* Left Section */}
                  <div className="flex flex-col gap-6 sm:w-[65%] w-full p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-2">
                        <div>
                          <h2 className="text-lg font-semibold">Size:</h2>
                          <p className="text-gray-300">{item.size}</p>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">Section:</h2>
                          <p className="text-gray-300">{item.section}</p>
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold">Description:</h2>
                          <p className="text-gray-300">{item.description}</p>
                        </div>
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {item.price}
                      </p>
                    </div>

                    <div className="flex justify-start md:justify-end">
                      <ButtonColorful
                        isIcon={false}
                        label="Add to cart"
                        className="text-white h-10 text-sm sm:text-base font-medium"
                      />
                    </div>
                  </div>

                  {/* Right Section */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative sm:w-[35%] w-full h-[250px] sm:h-auto"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.section}
                      fill
                      className="transition duration-500 ease-in-out object-cover object-center rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </MainLayout>
  );
};

export default Page;
