"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ButtonColorful } from "@/components/ui/button-colorful";
import MainLayout from "@/layout/MainLayout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // 👈 import toast
import { useAuthStore } from "@/lib/auth-store";

interface PostData {
  image: string;
  title: string;
  link: string;
}

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [user, router]);

  const posts: PostData[] = [
    {
      image: "/images/desination-kp.png",
      title: "destination-kp",
      link: "/ad-placement",
    },
    {
      image: "/images/ysn.png",
      title: "ysn",
      link: "/ad-placement",
    },
    {
      image: "/images/battle-lounge.png",
      title: "battle-lounge",
      link: "/ad-placement",
    },
  ];

  const handleNext = () => {
    if (selected) {
      const selectedPost = posts.find((p) => p.title === selected);
      if (selectedPost) router.push(selectedPost.link);
    } else {
      toast.error("Please select a website first!"); // 👈 replaces alert
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen flex flex-col items-center justify-center gap-10 bg-[#17171a] overflow-hidden">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold text-white"
        >
          Choose website
        </motion.h2>

        {/* Cards */}
        <motion.div
          className="flex gap-5 flex-wrap justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {posts.map((post) => (
            <motion.div
              key={post.title}
              onClick={() => setSelected(post.title)}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`relative group size-[300px] rounded-xl p-[2px] cursor-pointer transition-all duration-300
                ${
                  selected === post.title
                    ? "bg-[linear-gradient(to_right,#9333ea_70%,#2563eb_100%)]"
                    : "bg-transparent border border-[#4C4C4C]"
                }`}
            >
              <div className="flex h-full w-full flex-col items-center justify-center rounded-xl bg-[#231F29] transition-transform duration-300">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={200}
                  height={150}
                  className="transition duration-500 ease-in-out object-cover group-hover:scale-110 object-center"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <ButtonColorful
            label="Next"
            isIcon={false}
            onClick={handleNext}
            className="w-full sm:w-auto h-10 sm:h-11 md:h-12 px-4 sm:px-6 md:px-8 text-sm sm:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          />
        </motion.div>
      </section>
    </MainLayout>
  );
}
