"use client";

import React, { useCallback, useState } from "react";
import MainLayout from "@/layout/MainLayout";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { useAdStore } from "@/store/use-ad-store";

const TestVideoUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { saveAd } = useAdStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const video = acceptedFiles[0];

    if (!video.type.startsWith("video/")) {
      toast.error("Only video files are allowed");
      return;
    }

    setFile(video);
    toast.success("Video added");
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a video");
      return;
    }

    const formData = new FormData();

    formData.append("advt_user_id", "1");
    formData.append("advt_setg_id", "11");
    formData.append("advt_ordt_id", "");
    formData.append("advt_media_path", "");
    formData.append("advt_view_count", "100");
    formData.append("advt_click_count", "0");
    formData.append("advt_charges", "0.00");
    formData.append("advt_payment_status", "1");

    formData.append("file", file);

    setLoading(true);
    const success = await saveAd(formData);
    setLoading(false);

    if (success) {
      toast.success("Test video uploaded successfully");
      setFile(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#18181C] text-white p-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-[#231F29] border border-[#4C4C4C] rounded-xl p-6"
        >
          <h1 className="text-xl font-semibold mb-4 text-center">
            Test Video Advertisement Upload
          </h1>

          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-500 rounded-lg min-h-[200px] flex items-center justify-center cursor-pointer hover:border-purple-500 transition"
          >
            <input {...getInputProps()} />
            {!file ? (
              <p className="text-gray-400">Click or drop a video here</p>
            ) : (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-full max-h-[300px] object-contain bg-black rounded-md"
              />
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end mt-6">
            <ButtonColorful
              label={loading ? "Uploading..." : "Submit"}
              isIcon={false}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default TestVideoUploadPage;
