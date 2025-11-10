"use client";

import Loading from '@/components/loading'
import Navbar from '@/components/Navbar'
import { useAdStore } from '@/store/use-ad-store';
import { useCartStore } from '@/store/use-cart-store';
import React, { Suspense, useEffect } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout : React.FC<MainLayoutProps> = ({children}) => {

    const { fetchCart } = useCartStore();
    const { fetchAdData } = useAdStore();

    useEffect(()=>{
        fetchCart()
        fetchAdData()
    },[])
    
    return (
        <main>
            <Suspense fallback={<Loading />}>
            <Navbar />
            {children}
            </Suspense>
        </main>
    )
}

export default MainLayout