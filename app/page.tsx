"use client";

import HomeComponent from "@/components/home-component";
import Loading from "@/components/loading";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeComponent />
    </Suspense>
  );
}