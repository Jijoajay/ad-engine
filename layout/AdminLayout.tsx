import { Providers } from '@/app/providers'
import Loading from '@/components/loading'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/sidebar'
import NextTopLoader from 'nextjs-toploader'
import React, { Suspense } from 'react'

interface AdminLayoutProps {
    children: React.ReactNode
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <>
            <Suspense fallback={<Loading />}>
                <Providers>
                    <NextTopLoader color="#5750F1" showSpinner={false} />

                    <div className="flex min-h-screen">
                        <Sidebar />

                        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                            <Header />
                            <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10 bg-black text-white h-full">
                                {children}
                            </main>
                        </div>
                    </div>
                </Providers>
            </Suspense>
        </>
    )
}

export default AdminLayout