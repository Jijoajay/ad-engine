"use client";
import { toast } from "sonner";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { motion } from "framer-motion";
import Image from "next/image";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { cn } from "@/lib/utils";
import { useDeviceStore } from "@/store/use-device-store";
import { useSearchParams } from "next/navigation";
import { useMediaTypeStore } from "@/store/use-media-type-store";

interface UploadContentProps {
    isAdmin?: boolean;
    projectList: any[];
    pagesByProject: Record<number, any[]>;
    adPositionsByPage: Record<number, any[]>;
    advertisements: any[];
    fetchAdData: () => void;
    saveAd: (formData: FormData) => Promise<boolean>;
    loading: boolean;
    hasWebsiteAds?: boolean;
    hasDeviceAds?: boolean
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
    hasWebsiteAds,
    hasDeviceAds
}: UploadContentProps) => {

    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedPageId, setSelectedPageId] = useState<number | null>(null);
    const [selectedSetgId, setSelectedSetgId] = useState<number | null>(null);
    const [selectedAdPosition, setSelectedAdPosition] = useState<string>("");
    const [selectedDeviceId, setSelectedDeviceId] = useState<string | "">("");
    const [deviceSearch, setDeviceSearch] = useState("");
    const [showDeviceList, setShowDeviceList] = useState(false);
    const [activeTab, setActiveTab] = useState("Website");
    const [files, setFiles] = useState<File[]>([]);
    const { deviceList, fetchDeviceList, saveDeviceAndReturn } = useDeviceStore();

    useEffect(() => {
        fetchAdData();
        fetchDeviceList();
    }, [fetchAdData, type, fetchDeviceList]);

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

    const advtSetgIds = useMemo(() => {
        return new Set(advertisements.map(ad => ad.advt_setg_id));
    }, [advertisements]);

    const validPageIds = useMemo(() => {
        if (isAdmin) return new Set();

        return new Set(
            Object.values(adPositionsByPage)
                .flat()
                .filter(pos => advtSetgIds.has(pos.setg_id) && pos.setg_page_id !== null)
                .map(pos => pos.setg_page_id)
        );
    }, [adPositionsByPage, advtSetgIds, isAdmin]);

    const validProjectIds = useMemo(() => {
        if (isAdmin) return new Set();

        return new Set(
            Object.values(adPositionsByPage)
                .flat()
                .filter(pos => advtSetgIds.has(pos.setg_id) && pos.setg_proj_id !== null)
                .map(pos => pos.setg_proj_id)
        );
    }, [adPositionsByPage, advtSetgIds, isAdmin]);

    const filteredProjects = useMemo(() => {
        if (isAdmin) return projectList;

        return projectList.filter((proj) => {
            const projId = proj.proj_id;
            if (!projId) return false;

            const hasPages =
                Array.isArray(pagesByProject[projId]) &&
                pagesByProject[projId].length > 0;

            if (!hasPages) return false;

            return validProjectIds.has(projId);
        });
    }, [projectList, pagesByProject, validProjectIds, isAdmin]);


    const filteredPages = useMemo(() => {
        if (!selectedProjectId) return [];

        const pages = pagesByProject[selectedProjectId] || [];

        if (isAdmin) return pages;

        return pages.filter(
            (page) => page.page_id !== null && validPageIds.has(page.page_id)
        );
    }, [selectedProjectId, pagesByProject, validPageIds, isAdmin]);

    console.log("filteredPages", filteredPages)

    const filteredAdPositions = useMemo(() => {
        const allAdPositions: any[] = Object.values(adPositionsByPage).flat();

        // Admin + Device tab: show all including null project/page
        if (isAdmin && activeTab.toLowerCase() === "device") {
            return allAdPositions.filter(
                (pos) => advtSetgIds.has(pos.setg_id) || pos.setg_proj_id === null || pos.setg_page_id === null
            );
        }

        if (selectedPageId && !isAdmin) {
            return (adPositionsByPage[selectedPageId] || []).filter(
                (pos: any) => advtSetgIds.has(pos.setg_id)
            );
        }

        if (selectedPageId && isAdmin) {
            console.log(" adPositionsByPage[selectedPageId] ", adPositionsByPage[selectedPageId])
            return adPositionsByPage[selectedPageId]
        }


        // Device tab for non-admin
        if (activeTab.toLowerCase() === "device") {
            return allAdPositions.filter(
                (pos) =>
                    pos.setg_proj_id === null &&
                    pos.setg_page_id === null &&
                    advtSetgIds.has(pos.setg_id)
            );
        }

        return [];
    }, [activeTab, selectedPageId, adPositionsByPage, advtSetgIds, isAdmin]);

    const handleRemoveFile = (fileName: string) => {
        setFiles((prev) => prev.filter((file) => file.name !== fileName));
        toast.success("File removed.");
    };

    const isUploadLimitReached =
        selectedSetgId &&
        advertisements.filter((ad) => ad.advt_setg_id === selectedSetgId).length === 1 &&
        files.length >= 1;

    const handleSubmit = async () => {
        if (
            activeTab?.toLowerCase() !== "device" &&
            (!selectedProjectId || !selectedPageId || !selectedSetgId)
        ) {
            toast.error("Please select project, page, and section.");
            return;
        }

        let finalDeviceId = selectedDeviceId;
        const formData = new FormData();

        const selectedAd = advertisements.find(
            (ad) => ad.advt_setg_id === selectedSetgId
        );


        if (activeTab.toLowerCase() === "device") {
            if (!selectedDeviceId) {
                toast.error("Please enter/select a device ID.");
                return;
            }

            const existingDevice = deviceList.find(
                (d) => String(d.device_udid) === String(selectedDeviceId)
            );

            if (!existingDevice) {
                const newDevice = await saveDeviceAndReturn({
                    device_udid: String(selectedDeviceId),
                    device_dvty_id: 1,
                    device_position: "center",
                });

                if (!newDevice?.device_id) {
                    toast.error("Failed to create device.");
                    return;
                }

                finalDeviceId = String(newDevice.device_id);
            } else {
                finalDeviceId = String(existingDevice.device_id);
            }



            if (!selectedAd) {
                toast.error("Selected device advertisement not found.");
                return;
            }

            // formData.append("advt_id", String(selectedAd.advt_id));
            // formData.append(
            //     "advt_view_count",
            //     String(selectedAd.advt_view_count ?? 0)
            // );
            // formData.append(
            //     "advt_click_count",
            //     String(selectedAd.advt_click_count ?? 0)
            // );

            formData.append("advt_device_id", finalDeviceId);
        }


        if (files.length === 0) {
            toast.error("Please upload an image or video.");
            return;
        }

        // moved the advt_setg_id, advt_view_count, advt_click_count these are common for all ads
        formData.append("advt_id", String(selectedAd.advt_id));
        formData.append("file", files[0]);
        formData.append("advt_setg_id", String(selectedSetgId));
        formData.append(
            "advt_view_count",
            String(selectedAd.advt_view_count ?? 0)
        );
        formData.append(
            "advt_click_count",
            String(selectedAd.advt_click_count ?? 0)
        );


        const success = await saveAd(formData);

        if (success) {
            if (isAdmin) {
                setFiles([]);
                setSelectedAdPosition("");
                setSelectedPageId(null);
                setSelectedSetgId(null);
                setSelectedProjectId(null);
                setSelectedDeviceId("");
                toast.success("Advertisement saved successfully!");
            } else {
                window.location.href = "/";
            }
        }
    };

    const deviceAdPositions = useMemo(() => {
        return Object.values(adPositionsByPage)
            .flat()
            .filter(
                (pos) =>
                    pos.setg_proj_id === null &&
                    pos.setg_page_id === null &&
                    advtSetgIds.has(pos.setg_id)
            );
    }, [adPositionsByPage, advtSetgIds]);


    const hasValidDeviceAds = deviceAdPositions.length > 0;

    const showWebsiteTab = hasWebsiteAds;
    const showDeviceTab = (hasDeviceAds && hasValidDeviceAds) || isAdmin;
    const showTabs = showWebsiteTab && showDeviceTab;


    useEffect(() => {
        if (showWebsiteTab) {
            setActiveTab("Website");
        } else if (showDeviceTab) {
            setActiveTab("Device");
        }
    }, [showWebsiteTab, showDeviceTab]);

    const filteredDevices = useMemo(() => {
        return deviceList.filter((d) =>
            d.device_udid.toLowerCase().includes(deviceSearch.toLowerCase())
        );
    }, [deviceSearch, deviceList]);

    const selectedSection = selectedSetgId
        ? filteredAdPositions.find((pos) => pos.setg_id === selectedSetgId)
        : undefined;

    const acceptedFileType: Accept =
        selectedSection?.mddt_mdty_id === 1
            ? { "video/*": [] }
            : { "image/*": [] };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: acceptedFileType,
        disabled: Boolean(
            selectedSetgId &&
            advertisements.filter((ad) => ad.advt_setg_id === selectedSetgId).length === 1 &&
            files.length >= 1
        ),
    });



    return (
        <div
            className={cn("bg-[#18181C] flex-col gap-10  text-white p-6 md:p-10 flex justify-start", !isAdmin ? "min-h-screen" : "rounded-xl")}
            style={{ paddingTop: !isAdmin ? "100px" : "30px", }}
        >
            {/* TAB SECTION */}
            <div className="w-full max-w-7xl items-start">
                <div className="flex flex-wrap justify-start gap-4">
                    {(showWebsiteTab || showDeviceTab) && (
                        <div className="flex gap-2 mb-4">
                            {showWebsiteTab && (
                                <button
                                    onClick={() => setActiveTab("Website")}
                                    className={`px-6 py-2 rounded-xl transition ${activeTab === "Website"
                                        ? "bg-linear-to-r from-purple-500 to-blue-500"
                                        : "bg-gray-800"
                                        }`}
                                >
                                    Website
                                </button>
                            )}

                            {showDeviceTab && (
                                <button
                                    onClick={() => setActiveTab("Device")}
                                    className={`px-6 py-2 rounded-xl transition ${activeTab === "Device"
                                        ? "bg-linear-to-r from-purple-500 to-blue-500"
                                        : "bg-gray-800"
                                        }`}
                                >
                                    Device
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

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
                        {
                            activeTab === "Device" &&
                            <>
                                <div className="relative mb-4">
                                    <label className="text-sm text-gray-400">Device</label>
                                    <input
                                        className="bg-[#0B0B10] border border-[#2A2A2A] p-3 rounded-md w-full"
                                        value={deviceSearch}
                                        placeholder="Search or enter device ID"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setDeviceSearch(value);
                                            setSelectedDeviceId(value);
                                            setShowDeviceList(true);
                                        }}
                                    />

                                    {showDeviceList && deviceSearch && (
                                        <div className="absolute w-full bg-[#0B0B10] mt-1 rounded-md z-50">
                                            {filteredDevices.map((device) => (
                                                <div
                                                    key={device.device_id}
                                                    className="p-3 hover:bg-[#1A1A22] cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedDeviceId(device.device_udid);
                                                        setDeviceSearch(device.device_udid);
                                                        setShowDeviceList(false);
                                                    }}
                                                >
                                                    {device.device_udid}
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                    >
                                        <option value="">Select Title</option>
                                        {filteredAdPositions.map((pos) => (<option key={pos.setg_id} value={pos.setg_ad_position}> {pos.setg_ad_position}
                                        </option>))}
                                    </select>
                                </div>
                            </>

                        }
                        {
                            activeTab === "Website" &&
                            <>
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
                                        {filteredProjects.map((proj) => (
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
                            </>
                        }


                        {/* Image Upload */}
                        <div className="mt-4">
                            <h2 className="font-semibold text-lg mb-2">
                                {selectedSection?.mddt_mdty_id === 1 ? "Upload Video" : "Upload Image"}
                            </h2>
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
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-[90%] sm:w-[380px] h-[250px] rounded-md overflow-hidden shadow-md"
                                    >
                                        {/* REMOVE BUTTON */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile(file.name);
                                            }}
                                            className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition"
                                        >
                                            ✕
                                        </button>

                                        {selectedSection?.mddt_mdty_id === 1 ? (
                                            <video
                                                src={URL.createObjectURL(file)}
                                                controls
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        ) : (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                width={380}
                                                height={250}
                                                className="object-cover w-full h-full"
                                            />
                                        )}
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
                        {
                            activeTab !== "Device" &&
                            <p className="text-center text-sm text-gray-400 mb-6">
                                {selectedPageId
                                    ? filteredAdPositions.find(
                                        (pos) => pos.setg_ad_position === selectedAdPosition
                                    )?.setg_ad_desc || "Upload ads for this section"
                                    : "Select a page and section to preview"}
                            </p>
                        }
                        <div className="flex flex-col items-center gap-4 pb-6">
                            {files.length > 0 ? (
                                files.map((file) => (
                                    <motion.div
                                        key={file.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-[90%] sm:w-[380px] h-[250px] rounded-md overflow-hidden shadow-md"
                                    >
                                        {selectedSection?.mddt_mdty_id === 1 ? (
                                            <video
                                                src={URL.createObjectURL(file)}
                                                controls
                                                className="w-full h-full object-contain bg-black"
                                            />
                                        ) : (
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                width={380}
                                                height={250}
                                                className="object-cover w-full h-full"
                                            />
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No image / video  uploaded yet</p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
