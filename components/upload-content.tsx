"use client";
import { toast } from "sonner";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import Image from "next/image";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { cn } from "@/lib/utils";

interface UploadContentProps {
    isAdmin?: boolean;
    projectList: any[];
    pagesByProject: Record<number, any[]>;
    adPositionsByPage: Record<number, any[]>;
    advertisements: any[];
    fetchAdData: () => void;
    saveAd: (formData: FormData) => Promise<boolean>;
    loading: boolean;
}

export const UploadContent = ({
    isAdmin = false,
    projectList,
    pagesByProject,
    adPositionsByPage,
    advertisements,
    fetchAdData,
    saveAd,
    loading,
}: UploadContentProps) => {
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
    const [selectedSetgId, setSelectedSetgId] = useState<number | null>(null);
    const [selectedAdPosition, setSelectedAdPosition] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);

    // Fetch initial data
    useEffect(() => {
        fetchAdData();
    }, [fetchAdData]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (!selectedSetgId) return;

            const adsForSetg = advertisements.filter(
                (ad) => ad.advt_setg_id === selectedSetgId
            );

            const maxUploads = adsForSetg.length > 1 ? Infinity : 1;

            if (files.length >= maxUploads) {
                toast.warning("Upload limit reached for this section.");
                return;
            }

            const availableSlots = maxUploads - files.length;
            const newFiles = acceptedFiles.slice(0, availableSlots);

            if (newFiles.length === 0) {
                toast.warning("No more files can be uploaded here.");
                return;
            }

            setFiles((prev) => [...prev, ...newFiles]);
            toast.success(`${newFiles.length} file${newFiles.length > 1 ? "s" : ""} added.`);
        },
        [selectedSetgId, advertisements, files.length]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        disabled: Boolean(
            selectedSetgId &&
            advertisements.filter((ad) => ad.advt_setg_id === selectedSetgId).length === 1 &&
            files.length >= 1
        ),
    });

    const removeFile = (name: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== name));
        toast.info("File removed.");
    };

    const filteredPages = useMemo(() => {
        if (!selectedProjectId) return [];
        return pagesByProject[selectedProjectId] || [];
    }, [selectedProjectId, pagesByProject]);

    const filteredAdPositions = useMemo(() => {
        if (!selectedPageId) return [];
        return adPositionsByPage[selectedPageId] || [];
    }, [selectedPageId, adPositionsByPage]);

    const isUploadLimitReached =
        selectedSetgId &&
        advertisements.filter((ad) => ad.advt_setg_id === selectedSetgId).length === 1 &&
        files.length >= 1;

    const handleSubmit = async () => {
        if (!selectedProjectId || !selectedPageId || !selectedSetgId) {
            toast.error("Please select project, page, and section.");
            return;
        }

        if (files.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        const selectedSetting = adPositionsByPage[selectedPageId]?.find(
            (pos: any) => pos.setg_id === selectedSetgId
        );

        if (!selectedSetting) {
            toast.error("Selected setting not found.");
            return;
        }

        const existingAd = advertisements.find(
            (ad) => ad.advt_setg_id === selectedSetgId
        );

        const formData = new FormData();

        // Only append advt_id if NOT admin
        if (!isAdmin && existingAd) {
            formData.append("advt_id", String(existingAd.advt_id));
        }

        formData.append("advt_view_count", String(selectedSetting.setg_view_count));
        formData.append("advt_click_count", String(selectedSetting.setg_click_count));
        formData.append("file", files[0]);

        // Additional fields for admin
        if (isAdmin) {
            formData.append("advt_setg_id", String(selectedSetgId));
            formData.append("advt_charges", String(selectedSetting.setg_ad_charges ?? 0));
            formData.append("isAdminPosted", "1");
        }

        const success = await saveAd(formData);

        if (success) {
            if (isAdmin) {
                setFiles([]);
                setSelectedAdPosition("")
                setSelectedPageId(null)
                setSelectedSetgId(null)
                setSelectedProjectId(null)
                toast.success("Advertisement saved successfully!");
            } else {
                window.location.href = "/";
            }
        }
    };




    return (
        <div
            className={cn("bg-[#18181C]  text-white p-6 md:p-10 flex justify-center", !isAdmin ? "min-h-screen" : "rounded-xl")}
            style={{ paddingTop: !isAdmin ? "150px" : "30px", }}
        >
            <div className={("container")}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col lg:flex-row border border-[#4C4C4C] bg-[#231F29] rounded-xl p-4 md:p-6 gap-6 md:gap-8"
                >
                    {/* LEFT FORM */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Project */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-400 mb-2">Project</label>
                            <select
                                className="bg-[#0B0B10] border mt-2 border-[#2A2A2A] p-3 rounded-md text-white outline-none w-full"
                                value={selectedProjectId ?? ""}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    setSelectedProjectId(id);
                                    setSelectedPageId(null);
                                    setSelectedSetgId(null);
                                    setSelectedAdPosition("");
                                    setFiles([]);
                                }}
                            >
                                <option value="">Select Project</option>
                                {projectList.map((proj) => (
                                    <option key={proj.proj_id} value={proj.proj_id}>
                                        {proj.proj_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Page */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-400">Page</label>
                            <select
                                className="bg-[#0B0B10] border mt-2 border-[#2A2A2A] p-3 rounded-md text-white outline-none w-full"
                                value={selectedPageId ?? ""}
                                onChange={(e) => {
                                    const id = Number(e.target.value);
                                    console.log("id", id);
                                    setSelectedPageId(id);
                                    setSelectedSetgId(null);
                                    setSelectedAdPosition("");
                                    setFiles([]);
                                }}
                                disabled={!selectedProjectId}
                            >
                                <option value="">Select Page</option>
                                {filteredPages.map((page) => (
                                    <option key={page.setg_id} value={page.page_id}>
                                        {page.page_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Section */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-400">Section</label>
                            <select
                                className="bg-[#0B0B10] border border-[#2A2A2A] p-3 mt-2 rounded-md text-white outline-none w-full"
                                value={selectedAdPosition}
                                onChange={(e) => {
                                    const selected = filteredAdPositions.find((pos) => pos.setg_ad_position === e.target.value);
                                    setSelectedAdPosition(e.target.value); setSelectedSetgId(selected?.setg_id ?? null); setFiles([]);
                                }}
                                disabled={!selectedPageId} >
                                <option value="">Select Section</option>
                                {filteredAdPositions.map((pos) => (<option key={pos.setg_id} value={pos.setg_ad_position}> {pos.setg_ad_position}
                                </option>))}
                            </select> 
                        </div>

                        {/* Title */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-400">Title</label>
                            <select
                                className="bg-[#0B0B10] border border-[#2A2A2A] p-3 rounded-md mt-2 text-white outline-none w-full"
                                value={selectedAdPosition}
                                onChange={(e) => {
                                    const selected = filteredAdPositions.find((pos) => pos.setg_ad_position === e.target.value);
                                    setSelectedAdPosition(e.target.value); setSelectedSetgId(selected?.setg_id ?? null); setFiles([]);
                                }}
                                disabled={!selectedPageId} >
                                <option value="">Select Title</option>
                                {/* {filteredAdPositions.map((pos) => (<option key={pos.setg_id} value={pos.setg_ad_position}> {pos.setg_ad_position} */}
                                {/* </option>))} */}
                            </select> </div>

                        {/* Image Upload */}
                        <div className="mt-4">
                            <h2 className="font-semibold text-lg mb-2">Add image</h2>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-4 flex flex-wrap gap-3 min-h-[150px] cursor-pointer transition ${isUploadLimitReached
                                    ? "border-gray-600 cursor-not-allowed opacity-50"
                                    : "border-gray-500 hover:border-purple-500/70"
                                    }`}
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

                                {!isUploadLimitReached && (
                                    <div className="flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-md border border-gray-600 text-gray-400 text-3xl font-thin">
                                        +
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 mt-8">
                            <button className="px-6 py-2 border border-gray-500 rounded-md text-gray-300 hover:bg-gray-800 transition-all duration-300">
                                Cancel
                            </button>
                            <ButtonColorful
                                label={loading ? "Saving..." : "Submit"}
                                isIcon={false}
                                onClick={handleSubmit}
                                disabled={loading}
                            />
                        </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="hidden lg:block bg-[#4C4C4C] w-px h-auto" />

                    {/* RIGHT PREVIEW */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex-1 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 px-2"
                    >
                        <h2 className="text-center text-lg font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,#8236D4_0%,#2E65E5_100%)] mb-3">
                            {selectedAdPosition || "Section Preview"}
                        </h2>
                        <p className="text-center text-sm text-gray-400 mb-6">
                            {selectedPageId
                                ? filteredAdPositions.find(
                                    (pos) => pos.setg_ad_position === selectedAdPosition
                                )?.setg_ad_desc || "Upload ads for this section"
                                : "Select a page and section to preview"}
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
        </div>
    )
}
