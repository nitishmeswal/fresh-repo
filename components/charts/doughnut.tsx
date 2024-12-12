"use client";
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { useTheme } from "next-themes";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Space } from "lucide-react";
import { BiBorderRadius } from "react-icons/bi";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartItem {
  activity: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  chartData: ChartItem[];
  border?: boolean;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ chartData, border }) => {
  const { theme } = useTheme();
  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);
  const data = {
    labels: chartData.map((item) => item.activity),
    datasets: [
      {
        label: "Number of Items",
        data: chartData.map((item) => item.value),
        backgroundColor: chartData.map((item) => item.color),
        borderColor: theme === "light" ? "#28292b" : "white",
        borderWidth: 0,
        borderRadius: border? 10 : 0,
        spacing: 5,
        hoverBorderColor: theme === "light" ? "#28292b" : "white",
      },
    ],
  };

  const options = {
    cutout: "70%", // Adjusts the size of the doughnut hole
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      tooltip: {
        enabled: true,
      },
    },
    layout: {
      padding: {
        top: 20, // Adds padding at the top of the chart
        bottom: 20, // Adds padding at the bottom of the chart
        left: 20, // Adds padding on the left
        right: 20, // Adds padding on the right
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <Doughnut data={data} className="h-[12vh]" options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xl font-extrabold ${
              theme === "dark" ? "text-black" : "text-white"
            }`}
          >
            {totalVisitors.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <span
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span
              className={`text-sm ${
                theme === "dark" ? "text-gray-950" : "text-gray-100"
              }`}
            >
              {item.activity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChart;
