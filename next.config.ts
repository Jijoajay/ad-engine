import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ["port.bluesuite.in"], 
  },
  typescript:{
     ignoreBuildErrors: true,
  }
};

export default nextConfig;
