"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { useDashboardStore } from "@/store/use-dashboard-store";

export const title = "Dynamic Ads Line Chart";

const chartConfig = {
  ads: {
    label: "Total Ads",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartLineDots() {
  const { data } = useDashboardStore();

  // ---- Convert API response to chart format ----
  const adData = useMemo(() => {
    if (!data?.ads_last_one_year) return [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return data.ads_last_one_year.map((item) => ({
      month: monthNames[parseInt(item.month_num) - 1],
      ads: item.total_ads,
    }));
  }, [data]);

  return (
    
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={adData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="month"
            tickFormatter={(value) => value.slice(0, 3)}
            tickLine={false}
            tickMargin={8}
          />

          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />

          <Line
            activeDot={{ r: 6 }}
            dataKey="ads"
            dot={{ fill: "lab(43.0295 75.21 -86.5669)" }}
            stroke="lab(43.0295 75.21 -86.5669)"
            strokeWidth={2}
            type="natural"
          />
        </LineChart>
      </ChartContainer>
  );
}
