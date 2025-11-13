"use client"

import {
  Users,
  Monitor,
  MousePointerClick,
  Folder,
  DollarSign,
  BarChart3,
  LineChart,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import AdminLayout from "@/layout/AdminLayout"

export default function DashboardSkeleton() {
  return (
        <div className="space-y-6 animate-pulse">
        {/* Top Metrics Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
            <Card key={i}>
                <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                    <Skeleton className="h-4 w-24 mb-2 bg-muted" />
                    <Skeleton className="h-6 w-16 bg-muted" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                </div>
                <div className="mt-3 flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                    <Skeleton className="h-3 w-24 bg-muted" />
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Second Row Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
            <Card key={i}>
                <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <div>
                    <Skeleton className="h-4 w-28 mb-2 bg-muted" />
                    <Skeleton className="h-6 w-20 bg-muted" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                </div>
                <div className="mt-3 flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full bg-muted" />
                    <Skeleton className="h-3 w-24 bg-muted" />
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
            <Card key={i} className="lg:col-span-1">
                <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#F0F0F0]">
                    <Skeleton className="h-5 w-5 rounded-full bg-muted" />
                    <Skeleton className="h-5 w-32 bg-muted" />
                </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                <div className="flex flex-col justify-between h-full">
                    {[...Array(6)].map((_, j) => (
                    <Skeleton
                        key={j}
                        className="h-4 bg-muted rounded"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                    />
                    ))}
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
  )
}
