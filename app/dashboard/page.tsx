import Content from '@/components/content/content'
import AdminLayout from '@/layout/AdminLayout'
import React from 'react'

const DashboardPage = () => {
  return (
    <AdminLayout>
      <section>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#F0F0F0] mb-3">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your activities.
            </p>
          </div>
        </div>

        {/* Dashboard Content */}
        <Content />
      </section>
    </AdminLayout>
  )
}

export default DashboardPage