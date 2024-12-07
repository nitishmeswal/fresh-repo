"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useTheme } from "next-themes"


import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { activity: "Done", value: 28, fill: "var(--color-chrome)" },
  { activity: "Overdue Work", value: 22, fill: "var(--color-safari)" },
  { activity: "Processing", value:30, fill: "var(--color-firefox)" },
  { activity: "Work Finished Late", value: 20, fill: "var(--color-edge)" },
]

const chartConfig = {
  chrome: {
    label: "Done",
    color: "#818181",
  },
  safari: {
    label: "Overdue Work",
    color: "#0055ff",
  },
  firefox: {
    label: "Firefox",
    color: "#00ffbf",
  },
  edge: {
    label: "Work Finished Late",
    color: "#356cf9",
  },

} satisfies ChartConfig

export function DonutChart() {
  const {theme} = useTheme()
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <Card className={`flex flex-col border-none
      ${theme === 'light' 
        ? 'bg-gray-850 hover:bg-blue-600' 
        : 'bg-gray-100 hover:bg-blue-500'
      }
    `}>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="activity"
              innerRadius={65}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={`fill-for text-[40px] font-extrabold 
                            ${theme === 'light' ? 'text-white' : 'text-black'}
                            `}
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm text-[#8E9ABB]"
                        >
                          Jobs
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
        
        </div>
      </CardFooter> */}
    </Card>
  )
}
