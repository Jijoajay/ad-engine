"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import MainLayout from "@/layout/MainLayout";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { motion } from "framer-motion";

const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [section, setSection] = useState("Our partners");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <MainLayout>
      <div className="bg-[#0B0B10] text-white p-6 md:p-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col lg:flex-row border border-[#4C4C4C] bg-[#231F29] rounded-xl p-4 md:p-6 gap-6 md:gap-8"
        >
          {/* LEFT SIDE - FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 flex flex-col"
          >
            <label className="text-sm text-gray-400">Page</label>
            <div>
              <select className="bg-[#0B0B10] border border-[#2A2A2A] p-3 rounded-md text-white outline-none w-full md:w-auto">
                <option>Facilities</option>
                <option>Events</option>
                <option>To Do</option>
              </select>
            </div>

            <div className="mt-4">
              <h2 className="font-semibold text-lg">Section:</h2>
              <p className="text-gray-300">{section}</p>
            </div>

            <div className="mt-4">
              <h2 className="font-semibold text-lg mb-2">Add image</h2>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-500 rounded-lg p-4 flex flex-wrap gap-3 min-h-[150px] cursor-pointer transition hover:border-purple-500/70"
              >
                <input {...getInputProps()} />
                {files.map((file) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative w-[160px] sm:w-[200px] h-[120px] rounded overflow-hidden group"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
                <div className="flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-md border border-gray-600 text-gray-400 text-3xl font-thin">
                  +
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button className="px-6 py-2 border border-gray-500 rounded-md text-gray-300 hover:bg-gray-800 transition-all duration-300">
                Cancel
              </button>
              <ButtonColorful label="Submit" isIcon={false} />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="hidden lg:block bg-[#4C4C4C] w-px h-auto" />

          {/* RIGHT SIDE - LIVE PREVIEW */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-1 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 px-2"
          >
            <h2 className="text-center text-lg font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#8236D4_0%,#2E65E5_100%)] mb-3">
              Our Partners
            </h2>

            <p className="text-center text-sm text-gray-400 mb-6">
              Quality brands that support our facilities and community
            </p>

            <div className="flex flex-col items-center gap-4 pb-6">
              {files.length > 0 ? (
                files.map((file) => (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-[90%] sm:w-[380px] h-[200px] sm:h-[250px] rounded-md overflow-hidden shadow-md hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={380}
                      height={250}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No images uploaded yet</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Page;
