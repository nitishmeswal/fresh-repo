import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EarningStatistics = () => {
  const data = {
    labels: ["05 Nov 2022", "05 Nov 2022", "04 Nov 2022", "03 Nov 2022"],
    datasets: [
      {
        label: "Overdue work",
        data: [20, 18, 15, 25],
        backgroundColor: "#00F5D4",
        borderRadius: 5,
        barThickness: 15,
      },
      {
        label: "Processing",
        data: [40, 30, 35, 40],
        backgroundColor: "#2B67FF",
        borderRadius: 5,
      },
      {
        label: "Work finished late",
        data: [30, 35, 25, 20],
        backgroundColor: "#91C8FF",
        borderRadius: 5,
      },
      {
        label: "Done",
        data: [10, 17, 25, 15],
        backgroundColor: "#7D7D7D",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Earning Statistics",
        color: "white",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "white" },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { color: "white" },
      },
    },
  };

  return (
    <div style={{ background: "#1E1E1E", padding: "20px", borderRadius: "10px" }}>
    
      <Bar data={data}
      // @ts-ignore
      options={options} />
    </div>
  );
};

export default EarningStatistics;
