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

import { useEffect, useMemo } from "react"
import { useDashboardStore } from "@/store/use-dashboard-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardSkeleton from "../skeleton/dashboard-skeleton"
import { motion } from "framer-motion"
import ReactECharts from "echarts-for-react"
import * as echarts from "echarts"

export default function Content() {
  const { data, fetchDashboard, loading } = useDashboardStore()

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const earningData = useMemo(() => {
    if (!data?.total_earnings_last_one_year) return []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return data.total_earnings_last_one_year.map((item) => ({
      month: monthNames[parseInt(item.month_num) - 1],
      earnings: item.earning,
    }))
  }, [data])

  const adData = useMemo(() => {
    if (!data?.ads_last_one_year) return []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return data.ads_last_one_year.map((item) => ({
      month: monthNames[parseInt(item.month_num) - 1],
      ads: item.total_ads,
    }))
  }, [data])

  if (loading) return <DashboardSkeleton />
  if (!data) return <p className="p-4">No data available</p>

  // ==== ECHART OPTIONS ====

  const earningsChartOptions = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: earningData.map((d) => d.month),
      axisLabel: { color: "#aaa" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#aaa" },
      splitLine: { lineStyle: { color: "#444" } },
    },
    series: [
      {
        data: earningData.map((d) => d.earnings),
        type: "bar",
        smooth: true,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#3b82f6" },
            { offset: 1, color: "#1e3a8a" },
          ]),
        },
      },
    ],
  }

  const adsChartOptions = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: adData.map((d) => d.month),
      axisLabel: { color: "#aaa" },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#aaa" },
      splitLine: { lineStyle: { color: "#444" } },
    },
    series: [
      {
        data: adData.map((d) => d.ads),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 4,
          color: "#22c55e",
        },
        itemStyle: {
          color: "#22c55e",
          borderColor: "#14532d",
          borderWidth: 2,
        },
        areaStyle: {
          opacity: 0.2,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#22c55e" },
            { offset: 1, color: "#052e16" },
          ]),
        },
      },
    ],
  }

  return (
    <motion.div
      className="space-y-6 bg-background"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
    >
      {/* METRIC CARDS ROW 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Total Users",
            value: data.total_users,
            icon: <Users className="h-8 w-8 text-blue-600" />,
            change: "+3%",
            color: "text-green-600",
          },
          {
            title: "Active Users",
            value: data.active_users,
            sub: `Inactive: ${data.inactive_users}`,
            icon: <Monitor className="h-8 w-8 text-purple-600" />,
          },
          {
            title: "Total Impressions",
            value: Number(data.total_impressions).toLocaleString(),
            icon: <BarChart3 className="h-8 w-8 text-green-600" />,
            change: "+12%",
            color: "text-green-600",
          },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }}>
            <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-bold text-[#F0F0F0]">{item.value}</p>
                    {item.sub && <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>}
                  </div>
                  {item.icon}
                </div>

                {item.change && (
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className={item.color}>{item.change}</span>
                    <span className="text-muted-foreground ml-1">from last month</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* METRIC CARDS ROW 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: "Total Clicks",
            value: Number(data.total_clicks).toLocaleString(),
            icon: <MousePointerClick className="h-8 w-8 text-orange-600" />,
            change: "+12%",
          },
          {
            title: "Total Ads",
            value: data.total_advertisements,
            icon: <Folder className="h-8 w-8 text-cyan-600" />,
            change: "+22",
          },
          {
            title: "Total Earnings",
            value: `₹${parseFloat(data.total_earnings).toLocaleString()}`,
            icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
            change: "+151%",
          },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ scale: 1.02 }}>
            <Card className="transition-all duration-300 hover:shadow-xl hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="text-2xl font-bold text-[#F0F0F0]">{item.value}</p>
                  </div>
                  {item.icon}
                </div>

                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{item.change}</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* EARNINGS CHART */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[#F0F0F0] gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" /> Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts option={earningsChartOptions} style={{ height: "300px" }} />
          </CardContent>
        </Card>

        {/* ADS CHART */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#F0F0F0]">
              <LineChart className="h-5 w-5 text-green-600" /> Total New Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReactECharts option={adsChartOptions} style={{ height: "300px" }} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
