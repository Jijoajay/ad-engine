"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function DeviceContent() {
    const deviceData = [
        {
            id: 1,
            name: "Android Device",
            size: "1080 × 2400",
            position: "Top Banner",
            impressions: 5000,
            clicks: 120,
            price: 15,
            image: "/images/to-do-1.png",
        },
        {
            id: 2,
            name: "iOS Device",
            size: "1170 × 2532",
            position: "Bottom Banner",
            impressions: 3000,
            clicks: 90,
            price: 10,
            image: "/images/to-do-2.png",
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } },
            }}
            className="flex flex-col items-center gap-6  w-full mt-10"
        >
            {deviceData.map((device, index) => (
                <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.2 }}
                    className="bg-[#231F29] w-full border border-[#4C4C4C] rounded-xl overflow-hidden flex flex-col sm:flex-row"
                >
                    <div className="flex flex-col gap-4 sm:w-[65%] w-full p-5">
                        <h2 className="text-xl font-bold text-white">{device.name}</h2>
                        <p className="text-gray-300">Ad Size: {device.size}</p>
                        <p className="text-gray-300">Position: {device.position}</p>
                        <p className="text-gray-300">Impressions: {device.impressions}</p>
                        <p className="text-gray-300">Clicks: {device.clicks}</p>
                        <p className="text-gray-300 font-bold text-lg">${device.price}</p>
                    </div>

                    <div className="flex items-center justify-center sm:w-[35%] mt-5 sm:mt-0 bg-black">
                        <Image
                            src={device.image}
                            width={400}
                            height={500}
                            alt="Device Image"
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
