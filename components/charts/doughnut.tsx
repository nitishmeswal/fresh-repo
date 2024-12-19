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
        borderColor: theme === "dark" ? "#28292b" : "white",
        borderWidth: 0,
        borderRadius: border? 10 : 0,
        spacing: 5,
        hoverBorderColor: theme === "dark" ? "#28292b" : "white",
      },
    ],
  };

  const options = {
    cutout: border ? "80%" : "70%", 
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
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <Doughnut data={data} className={`h-[${border? 12:14}vh]`} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-3xl font-extrabold ${
              theme === "dark" 
              ? "text-white"
              : "text-black" 
            }`}
          >
            {totalVisitors.toLocaleString()}
          </span>
          <span className=" text-sm text-gray-550">
            jobs
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center mb-[6px]">
            <span
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: item.color }}
            ></span>
            <span
              className={`text-sm ${
                theme === "dark" 
                ? "text-gray-100"
                : "text-gray-950" 
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
