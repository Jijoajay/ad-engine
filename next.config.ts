import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ["port.bluesuite.in","ferf1mheo22r9ira.public.blob.vercel-storage.com",], 
  },
  typescript:{
     ignoreBuildErrors: true,
  }
};

export default nextConfig;
