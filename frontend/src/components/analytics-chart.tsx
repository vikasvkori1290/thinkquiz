"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface AnalyticsChartProps {
  data: { date: string; totalXp: number }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Chart config for the new shadcn Chart component
  const chartConfig = {
    totalXp: {
      label: "Total XP",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Cumulative XP</CardTitle>
        <CardDescription>Your learning progress over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-totalXp)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-totalXp)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value}
                className="text-xs text-muted-foreground"
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value}`}
                className="text-xs text-muted-foreground"
                width={40}
              />
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1, strokeDasharray: "4 4" }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                type="monotone"
                dataKey="totalXp"
                stroke="var(--color-totalXp)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#fillXp)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "var(--color-totalXp)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
