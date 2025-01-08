"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Shield, Lock, Search } from "lucide-react";
import { GPU, gpuData } from '@/constants/values';
import { SortDropdown } from '@/components/pages/gpu-marketplace/sortDropDown';
import { FilterButton } from '@/components/pages/gpu-marketplace/filterButton';
import { InfoTooltip } from '@/components/pages/gpu-marketplace/infoToolTip';
import GpuCard from '@/components/pages/gpu-marketplace/gpuCard';
import { BuyDialog } from '@/components/pages/gpu-marketplace/buyDialogBox';
import { AnimatePresence, motion } from 'framer-motion';

export default function Marketplace() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [showFiveStar, setShowFiveStar] = useState(false);
  const [showAssured, setShowAssured] = useState(false);
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [useNlov, setUseNlov] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleGpuSelect = (gpu: GPU) => {
    setSelectedGpu(gpu);
    setShowBuyDialog(true);
  };

  const handleBuy = () => {
    router.push(`/wallet?gpu=${selectedGpu?.id}&useNlov=${useNlov}`);
    setShowBuyDialog(false);
  };

  return (
    <div className="flex flex-1 w-full h-screen flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-y-auto scrollbar-hide">
      {/* Header Section */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-blue-500/20">
        <div className="flex flex-row p-4 justify-between items-center max-w-7xl mx-auto">
          <div className="flex flex-row items-center gap-3">
            <SortDropdown onSort={setSortOption} />
            
            <FilterButton 
              active={showFiveStar} 
              onClick={() => setShowFiveStar(!showFiveStar)}
              className="hover:bg-blue-500/10 transition-colors"
            >
              <Star className={`h-4 w-4 ${showFiveStar ? 'fill-yellow-500 text-yellow-500' : 'text-blue-400'}`} />
              5★ & above
            </FilterButton>

            <FilterButton 
              active={showAssured} 
              onClick={() => setShowAssured(!showAssured)}
              className="hover:bg-blue-500/10 transition-colors"
            >
              <Shield className={`h-4 w-4 ${showAssured ? 'fill-blue-500 text-blue-500' : 'text-blue-400'}`} />
              <Lock className="h-3 w-3 absolute top-2 right-2" />
              Neurolov Assured
            </FilterButton>

            <FilterButton 
              active={false} 
              onClick={() => window.open('https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform', '_blank')}
              className="hover:bg-blue-500/10 transition-colors"
            >
              <Search className="h-4 w-4 text-blue-400" />
              GPU Unavailable?
            </FilterButton>
          </div>

          <div className="flex flex-row items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              GPU Marketplace
            </h1>
            <div className="relative">
              <span className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse">
                Beta
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl rounded-full"></div>
            </div>
          </div>

          <InfoTooltip />
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 p-6 max-w-7xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {gpuData.map((gpu) => (
              <GpuCard
                key={gpu.id}
                gpu={gpu}
                onSelect={handleGpuSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Buy Dialog */}
      <BuyDialog
        gpu={selectedGpu}
        open={showBuyDialog}
        onClose={() => setShowBuyDialog(false)}
        onBuy={handleBuy}
        useNlov={useNlov}
        onNlovToggle={setUseNlov}
      />
    </div>
  );
}