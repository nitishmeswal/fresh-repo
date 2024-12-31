import { GPU } from '@/constants/values';

interface PricingSummaryProps {
  gpu: GPU;
  useNlov: boolean;
}

export const PricingSummary = ({ gpu, useNlov }: PricingSummaryProps) => (
  <div className={`mt-6 p-6 rounded-xl transition-all duration-300 ${
    useNlov 
      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30' 
      : 'bg-gray-900 border border-gray-700'
  }`}>
    <div className="flex justify-between items-center mb-3">
      <span className="text-gray-300">Price per Hour</span>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        ${useNlov ? gpu.price.nlov : gpu.price.usd}
      </span>
    </div>
    {useNlov && (
      <div className="flex justify-between items-center text-sm">
        <span className="text-emerald-400">$NLOV Savings</span>
        <span className="font-medium text-emerald-400">
          -${(gpu.price.usd - gpu.price.nlov).toFixed(2)}
        </span>
      </div>
    )}
  </div>
);