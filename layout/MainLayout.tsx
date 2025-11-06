import Loading from '@/components/loading'
import Navbar from '@/components/Navbar'
import React, { Suspense } from 'react'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout : React.FC<MainLayoutProps> = ({children}) => {
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