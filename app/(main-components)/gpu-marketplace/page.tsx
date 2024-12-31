"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Shield, Lock, Search } from "lucide-react";
import { GPU, gpuData } from '@/constants/values';
import { SortDropdown } from '@/components/pages/gpu-marketplace/sortDropDown';
import { FilterButton } from '@/components/pages/gpu-marketplace/filterButton';
import { InfoTooltip } from '@/components/pages/gpu-marketplace/infoToolTip';
import GpuCard  from '@/components/pages/gpu-marketplace/gpuCard';
import { BuyDialog } from '@/components/pages/gpu-marketplace/buyDialogBox';
import { AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-1 w-full h-screen flex-col bg-white dark:bg-black dark:bg-black2 overflow-y-auto scrollbar-hide px-0">
      <div className="flex flex-row p-4 justify-between shrink-0 items-center">
        <div className="flex flex-row items-center gap-2">
          <SortDropdown onSort={setSortOption} />
          
          <FilterButton active={showFiveStar} onClick={() => setShowFiveStar(!showFiveStar)}>
            <Star className={`h-4 w-4 ${showFiveStar ? 'fill-current' : ''}`} />
            5★ & above
          </FilterButton>

          <FilterButton active={showAssured} onClick={() => setShowAssured(!showAssured)}>
            <Shield className={`h-4 w-4 ${showAssured ? 'fill-current' : ''}`} />
            <Lock className="h-3 w-3 absolute top-2 right-2" />
            Neurolov Assured
          </FilterButton>

          <FilterButton active={false} onClick={() => window.open('https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform', '_blank')}>
            <Search className="h-4 w-4" />
            GPU Unavailable?
          </FilterButton>
        </div>

        <InfoTooltip />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
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