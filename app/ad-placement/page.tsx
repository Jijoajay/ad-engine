"use client";

import Loading from "@/components/loading";
import PageContent from "@/components/page-content";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
}
