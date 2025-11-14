"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ButtonColorful } from "./button-colorful";

const EmptyCart = () => {
    const router = useRouter();

    return (
        <>
            <div className="text-center text-gray-400  w-full max-w-7xl">
                <div className="text-white w-full item-start mb-5">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-start">Your Cart</h1>
                    <p className="text-gray-400 text-sm mt-1 text-start">
                        Review your selected ad placements before checkout
                    </p>
                </div>
                <div className="flex flex-col justify-center items-center text-gray-300 border border-[#4C4C4C] rounded-xl bg-[#231F29] py-10">
                    <div className="w-auto h-auto opacity-90 relative">
                        <div className="relative w-[300px] h-80 opacity-90">
                            <Image
                                src="/images/cart.png"
                                alt="Empty Cart"
                                fill
                                style={{ objectFit: "contain" }}
                            />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-400 text-sm max-w-md text-center mb-6">
                        Looks like you haven’t added anything to your cart yet. Go ahead and explore ads.
                    </p>

                    {/* Button */}
                    <div>
                        <ButtonColorful
                            label="Explore ADs"
                            onClick={() => router.push("/")}
                            className="px-8 py-3 rounded-xl w-50 font-thin cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmptyCart;
