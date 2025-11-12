"use client";
 
import { useProjectStore } from '@/store/use-project-store';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {

  const { slug_id } = useParams<{ slug_id: string }>();
  const { loadingFetch, fetchProjectByHash } = useProjectStore();
  

  useEffect(() => {
    if (slug_id !== "0") {
      fetchProjectByHash(slug_id)
    }
  }, [slug_id, fetchProjectByHash])


  return (
    <div>page</div>
  )
}

export default page