
const data = [
  {
    date: "05 Nov 2022",
    bars: [
      { label: "Overdue work", width: "30%", color: "bg-[#00FFBF]" },
      { label: "Processing", width: "40%", color: "bg-[#356CF9]" },
      { label: "Work finished late", width: "20%", color: "bg-[#9DB9FF]" },
      { label: "Done", width: "10%", color: "bg-[#9F9F9F]" },
    ],
  },
  {
    date: "04 Nov 2022",
    bars: [
      { label: "Overdue work", width: "40%", color: "bg-[#00FFBF]" },
      { label: "Processing", width: "20%", color: "bg-[#356CF9]" },
      { label: "Work finished late", width: "30%", color: "bg-[#9DB9FF]" },
      { label: "Done", width: "10%", color: "bg-[#9F9F9F]" },
    ],
  },
  {
    date: "03 Nov 2022",
    bars: [
      { label: "Overdue work", width: "25%", color: "bg-[#00FFBF]" },
      { label: "Processing", width: "50%", color: "bg-[#356CF9]" },
      { label: "Work finished late", width: "15%", color: "bg-[#9DB9FF]" },
      { label: "Done", width: "10%", color: "bg-[#9F9F9F]" },
    ],
  },
  {
    date: "02 Nov 2022",
    bars: [
      { label: "Overdue work", width: "25%", color: "bg-[#00FFBF]" },
      { label: "Processing", width: "50%", color: "bg-[#356CF9]" },
      { label: "Work finished late", width: "15%", color: "bg-[#9DB9FF]" },
      { label: "Done", width: "10%", color: "bg-[#9F9F9F]" },
    ],
  },
];

const Chart = () => {
  return (
    <div className="p-4 bg-gray-850 text-white rounded-lg space-y-10">
      <div className="flex flex-row justify-between items-center">
        <div className=" flex flex-1 flex-row items-center space-x-4">
         <h2 className=" font-semibold">Earning Statistics</h2>
          <select className="bg-white/15 px-2 py-1 rounded-md text-xs">
            <option>Week</option>
            <option>Month</option>
         </select>
        </div>

      {/* Legend */}
      <div className="flex gap-4 items-center text-xs font-bold">
        <div className="flex items-center p-1 rounded bg-white/15 ">
          <span className="w-3 h-3 bg-[#00FFBF] inline-block rounded mr-2"></span>
          Overdue work
        </div>
        <div className="flex items-center p-1 rounded bg-white/15 ">
          <span className="w-3 h-3 bg-[#356CF9] inline-block rounded mr-2"></span>
          Processing
        </div>
        <div className="flex items-center p-1 rounded bg-white/15 ">
          <span className="w-3 h-3 bg-[#9DB9FF] inline-block rounded mr-2"></span>
          Work finished late
        </div>
        <div className="flex items-center p-1 rounded bg-white/15 ">
          <span className="w-3 h-3 bg-[#9F9F9F] inline-block rounded mr-2"></span>
          Done
        </div>
      </div>
    </div>

      {/* Chart */}
      <div className="space-y-10">
        {data.map((row, idx) => (
          <div key={idx} className="flex items-center gap-4">
            {/* Date */}
            <div className="w-28 text-sm text-gray-400">{row.date}</div>
            {/* Bars */}
            <div className="flex-1 flex items-center space-x-1  ">
              {row.bars.map((bar, index) => (
                <div
                  key={index}
                  className={`h-4 rounded-full ${bar.color} w-${bar.width}`}
                  style={{ width: bar.width }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
