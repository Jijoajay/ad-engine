"use client";

import MainLayout from "@/layout/MainLayout";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonColorful } from "@/components/ui/button-colorful";
import Image from "next/image";
import { X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useAdSettingsStore } from "@/store/use-ad-settings-store";
import { AdCardSkeleton } from "./skeleton/ad-card-skeleton";
import { useCartStore } from "@/store/use-cart-store";
import { useMediaDetailStore } from "@/store/use-media-detail-store";
import { cn } from "@/lib/utils";

type TabKey = string;

const PageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, cart } = useCartStore();
  const [hashId, setHashId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const initialTab = searchParams.get("tab")?.replace(/-/g, " ") as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const { fetchAdSettings, loadingAdSettings, adSettings } = useAdSettingsStore();
  const { projectPageListByHash, fetchProjectPageByHashId, loadingHash } = useProjectPageStore();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (activeTab && activeTab !== initialTab) {
      router.replace(`?tab=${slugify(activeTab)}`, { scroll: false });
    }
  }, [activeTab]);

  useEffect(() => {
    const storedHash = sessionStorage.getItem("selected_project_hash");
    if (storedHash) {
      setHashId(storedHash);
      fetchProjectPageByHashId(storedHash);
    }
  }, [fetchProjectPageByHashId]);

  useEffect(() => {
    if (initialTab !== "device") {
      if (projectPageListByHash && projectPageListByHash.length > 0 && hashId) {
        const firstPage = projectPageListByHash[0];
        if (firstPage && firstPage.hash_id) {
          setActiveTab(firstPage.page_name);
          fetchAdSettings(hashId, firstPage.hash_id);
        }
      }
    }
  }, [projectPageListByHash, hashId, fetchAdSettings]);

  const handleTabClick = (dept: any) => {
    const projectHash = sessionStorage.getItem("selected_project_hash");
    const pageHash = dept.hash_id;

    if (projectHash && pageHash) {
      setActiveTab(dept.page_name);
      fetchAdSettings(projectHash, pageHash);
    }
  };
  
  useEffect(() => {
    if (activeTab?.toLowerCase() === "device") {
      fetchAdSettings("null", "null");
    }
  }, [activeTab]);


  return (
    <MainLayout>
      <section className="flex flex-col justify-start items-center gap-10 pt-[150px] pb-10 px-[5%] bg-[#18181C]  min-h-screen text-white ">
        <div className="container flex flex-col items-center justify-center gap-10 ">
          {/* Tabs */}
          <div className="w-full max-w-7xl items-start">
            <div className="flex flex-wrap justify-start gap-4">
              {
                activeTab !== "device" &&
                (
                  loadingHash ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-10 sm:h-12 w-32 sm:w-36 rounded-lg bg-gray-800 animate-pulse" />
                    ))
                  ) : (
                    projectPageListByHash?.map((dept) => (
                      <button
                        key={dept.page_id}
                        onClick={() => handleTabClick(dept)}
                        className={`flex items-center gap-2 px-6 py-2 sm:py-3 rounded-xl font-thin text-sm sm:text-base transition-all duration-300 capitalize ${activeTab === dept.page_name
                          ? "bg-linear-to-r from-purple-500 to-blue-500 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                          }`}
                      >
                        {dept.page_name}
                      </button>
                    ))
                  )
                )
              }

            </div>
          </div>

          {/* Ad Cards */}
          {
            loadingAdSettings ? (
              Array.from({ length: 2 }).map((_, i) => <AdCardSkeleton key={i} />)
            ) : adSettings && adSettings.length > 0 ? (
              adSettings.map((ad, index) => {
                const isInCart = cart.some((item) => item.cart_odr_setg_id === ad.setg_id);
                const isLoading = loadingId === ad.hash_id;

                return (
                  <motion.div
                    key={ad.hash_id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                    className={cn("bg-[#231F29] max-w-7xl w-full flex flex-col sm:flex-row border border-[#4C4C4C] rounded-xl overflow-hidden min-h-[300px]", activeTab === "device" && "max-h-[150px]")}
                  >
                    {/* Left Section */}
                    <div className="flex flex-col gap-6 sm:w-[65%] w-full p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-2">
                          {
                            activeTab !== "device" &&
                            <div>
                              <h2 className="text-[20px] text-[#D9D9D9] font-bold">Ad Size:</h2>
                              <p className="text-[#A1A1A1] text-base">{ad.setg_ad_size}</p>
                            </div>
                          }
                          <div>
                            <h2 className="text-[20px] text-[#D9D9D9] font-bold">Ad Position:</h2>
                            <p className="text-[#A1A1A1] text-base">{ad.setg_ad_position}</p>
                          </div>
                          {
                            activeTab !== "device" &&
                            <div>
                              <h2 className="text-[20px] text-[#D9D9D9] font-bold">Ad Impression Count:</h2>
                              <p className="text-[#A1A1A1] text-base">{ad.setg_view_count}</p>
                            </div>
                          }
                          {
                            activeTab !== "device" &&
                            <div>
                              <h2 className="text-[20px] text-[#D9D9D9] font-bold">Ad Click Count:</h2>
                              <p className="text-[#A1A1A1] text-base">{ad.setg_click_count}</p>
                            </div>
                          }
                          <div>
                            <h2 className="text-[20px] text-[#D9D9D9] font-bold">Description:</h2>
                            <p className="text-[#A1A1A1] text-base">{ad.setg_ad_desc}</p>
                          </div>
                        </div>
                        <div className="flex items-start justify-start h-full">
                          <p className="text-2xl text-start font-bold text-[#D9D9D9]">${ad.setg_ad_charges}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          animate={
                            isInCart
                              ? {
                                scale: [1, 1.05, 1],
                                boxShadow: "0 0 10px rgba(147,51,234,0.6)",
                              }
                              : {}
                          }
                          className="w-40 cursor-pointer"
                          transition={{ duration: 0.4 }}
                        >
                          <ButtonColorful
                            isIcon={false}
                            loading={isLoading}
                            label={isInCart ? "Added to Cart" : "Add to Cart"}
                            onClick={async () => {
                              if (!isInCart) {
                                setLoadingId(ad.hash_id);
                                await addToCart({
                                  ...ad,
                                  setg_ad_charges: Number(ad.setg_ad_charges),
                                });
                                setLoadingId(null);
                              }
                            }}
                            className={`text-white h-10 w-40 text-sm sm:text-base font-thin ${isInCart ? "opacity-80 cursor-not-allowed" : ""
                              }`}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Right Section (Image) */}
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="relative sm:w-[35%] w-full h-[250px] sm:h-auto cursor-pointer flex items-center justify-center bg-black"
                      onClick={() => setPreviewImage(ad.file_url || "/placeholder.svg")}
                    >
                      <Image
                        src={ad.file_url || "/placeholder.svg"}
                        alt={ad.project_page_name}
                        width={500}
                        height={500}
                        className="object-contain rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
                      />
                    </motion.div>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center w-full">No ads available for this section.</p>
            )
          }
        </div>
      </section>

      {/* 🖼️ Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)} // close when clicking outside
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="rounded-2xl object-contain"
              />

              {/* Close Button */}
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/70 rounded-full hover:bg-black transition cursor-pointer"
              >
                <X className="w-7 h-7 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </MainLayout>
  );
};

export default PageContent;
