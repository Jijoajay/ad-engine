"use client";

import MainLayout from "@/layout/MainLayout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ButtonColorful } from "@/components/ui/button-colorful";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjectPageStore } from "@/store/use-project-page-store";
import { useAdSettingsStore } from "@/store/use-ad-settings-store";
import { AdCardSkeleton } from "./skeleton/ad-card-skeleton";
import { useCartStore } from "@/store/use-cart-store";

type TabKey = string;

const PageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, cart, hydrated } = useCartStore();
  const [hashId, setHashId] = useState<string | null>(null);
  const initialTab = searchParams.get("tab")?.replace(/-/g, " ") as TabKey;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const { fetchAdSettings, loadingAdSettings, adSettings } = useAdSettingsStore();
  const { projectPageListByHash, fetchProjectPageByHashId, loadingHash } = useProjectPageStore();

  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (activeTab) {
      router.replace(`?tab=${slugify(activeTab)}`);
    }
  }, [activeTab, router]);

  useEffect(() => {
    const storedHash = sessionStorage.getItem("selected_project_hash");
    if (storedHash) {
      setHashId(storedHash);
      fetchProjectPageByHashId(storedHash);
    }
  }, [fetchProjectPageByHashId]);

  useEffect(() => {
    if (projectPageListByHash && projectPageListByHash.length > 0 && hashId) {
      const firstPage = projectPageListByHash[0];
      if (firstPage && firstPage.hash_id) {
        setActiveTab(firstPage.page_name);
        fetchAdSettings(hashId, firstPage.hash_id);
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

  return (
    <MainLayout>
      <section className="flex flex-col gap-10 items-start mt-[120px] px-[5%] ">
        {/* Tabs */}
        <div className="w-full items-start">
          <div className="flex flex-wrap justify-start gap-4">
            {loadingHash ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 sm:h-12 w-32 sm:w-36 rounded-lg bg-gray-800 animate-pulse"
                />
              ))
            ) : (
              projectPageListByHash?.map((dept) => (
                <button
                  key={dept.page_id}
                  onClick={() => handleTabClick(dept)}
                  className={`flex items-center gap-2 px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${activeTab === dept.page_name
                    ? "bg-linear-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                >
                  {dept.page_name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Ad Cards */}
        {loadingAdSettings ? (
          Array.from({ length: 2 }).map((_, i) => <AdCardSkeleton key={i} />)
        ) : adSettings && adSettings.length > 0 ? (
          adSettings.map((ad, index) => {
            const isInCart = cart.some((item) => item.hash_id === ad.hash_id); // ✅ moved here

            return (
              <motion.div
                key={ad.hash_id || index}
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
                        <h2 className="text-lg font-semibold">Ad Position:</h2>
                        <p className="text-gray-300">{ad.setg_ad_position}</p>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Description:</h2>
                        <p className="text-gray-300">{ad.setg_ad_desc}</p>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Ad Size:</h2>
                        <p className="text-gray-300">{ad.setg_ad_size}</p>
                      </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold">${ad.setg_ad_charges}</p>
                  </div>

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
                    transition={{ duration: 0.4 }}
                  >
                    <ButtonColorful
                      isIcon={false}
                      label={isInCart ? "Added to Cart" : "Add to Cart"}
                      onClick={() => {
                        if (!isInCart) {
                          addToCart({
                            ...ad,
                            setg_ad_charges: Number(ad.setg_ad_charges),
                          });
                        }
                      }}
                      className={`text-white h-10 text-sm sm:text-base font-medium ${isInCart ? "opacity-80 cursor-not-allowed" : ""
                        }`}
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative sm:w-[35%] w-full h-[250px] sm:h-auto"
                >
                  <Image
                    src={ad.file_url || "/placeholder.svg"}
                    alt={ad.project_page_name}
                    fill
                    className="transition duration-500 ease-in-out object-cover object-center rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
                  />
                </motion.div>
              </motion.div>
            );
          })
        ) : (
          <p className="text-gray-400 text-center w-full">
            No ads available for this section.
          </p>
        )}

      </section>
    </MainLayout>
  );
};

export default PageContent;
