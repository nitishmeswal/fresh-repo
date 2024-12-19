import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OverdueWorkCard = () => {
  // Data for the first chart (Overdue Work)
  const overdueData = {
    datasets: [
      {
        data: [38, 62], // 38% done, 62% remaining
        backgroundColor: ['#818181', '#F3F6FF'], // Blue and Gray
        borderWidth: 0,
      },
    ],
  };

  // Data for the second chart (Work Finished Late)
  const lateWorkData = {
    datasets: [
      {
        data: [62, 38], // 62% done, 38% remaining
        backgroundColor: ['#00FFBF', '#F3F6FF'], // Green and Gray
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '80%', // Makes the doughnut chart's center hollow
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips
      legend: { display: false }, // Disable legends
    },
  };

  return (
    <div className=" text-white p-6 rounded-lg w-full max-w-md space-y-6">
      {/* Title */}
      <h3 className="text-lg font-semibold">Overdue Work</h3>

      {/* Overdue Work Section */}
      <div className="flex items-center justify-between">
        {/* Chart */}
        <div className="relative w-20 h-20">
          <Doughnut data={overdueData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            38%
          </div>
        </div>
        {/* Details */}
        <div>
          <h4 className="text-3xl font-bold">06</h4>
          <p className="text-sm">Overdue work</p>
          <p className="text-xs text-gray-400">More than <span className="text-blue-400">32 jobs</span> in progress</p>
        </div>
      </div>

      {/* Work Finished Late Section */}
      <div className="flex items-center justify-between">
        {/* Chart */}
        <div className="relative w-20 h-20">
          <Doughnut data={lateWorkData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
            62%
          </div>
        </div>
        {/* Details */}
        <div>
          <h4 className="text-3xl font-bold text-green-400">19</h4>
          <p className="text-sm">Work finished late</p>
          <p className="text-xs text-gray-400">More than <span className="text-blue-400">32 jobs</span> in progress</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Footer */}
      <p className="text-xs text-gray-400">0 jobs created with no time</p>
    </div>
  );
};

export default OverdueWorkCard;
