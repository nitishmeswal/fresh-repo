"use client"

interface GpuSpecsProps {
    specs: {
      cores: string;
      tmus: string;
      rops: string;
      rtCores: string;
    };
  }
  
  const GpuSpecs = ({ specs }: GpuSpecsProps) => (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
      <h4 className="text-xl font-bold mb-4 text-white">Specifications</h4>
      <div className="space-y-3 text-gray-200">
        {Object.entries(specs).map(([key, value], index) => (
          <div key={key} className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full bg-${
              ['blue', 'purple', 'pink', 'indigo'][index]
            }-500`}></div>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );

  export { GpuSpecs };