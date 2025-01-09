"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronDown, Star, Shield, Filter, Lock, Search, Coins, Info, CreditCard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from '@/styles/marketplace.module.css';
import { GPU, gpuData } from '@/constants/values';
import { useToast } from "@/components/ui/use-toast";

const Home = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sortOption, setSortOption] = useState("relevance");
  const [showFiveStar, setShowFiveStar] = useState(false);
  const [showAssured, setShowAssured] = useState(false);
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [useNlov, setUseNlov] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleGpuSelect = (gpu: GPU) => {
    setSelectedGpu(gpu);
    setShowBuyDialog(true);
  };

  const handleBuy = () => {
    router.push(`/wallet?gpu=${selectedGpu?.id}&useNlov=${useNlov}`);
    setShowBuyDialog(false);
  };

  const FilterButton = ({ active, onClick, children }: 
                        { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <Button 
      variant="outline" 
      className={`flex items-center gap-2 font-medium text-lg border-0 rounded-full mx-2
        ${active 
          ? 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-200' 
          : 'bg-gray-350 dark:bg-gray-950 text-gray-950 dark:text-gray-350'} 
        group`}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div className="flex flex-1 w-full h-screen flex-col bg-white dark:bg-black 
                    dark:bg-black2 overflow-y-auto scrollbar-hide px-0">
      {/* Sort and filter buttons at the top */}
      <div className="flex flex-row p-4 justify-between shrink-0 items-center">
        <div className="flex flex-row items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-[200px] justify-between dark:text-gray-350 text-gray-950
                           font-medium text-lg dark:bg-gray-950 bg-gray-350 group border-0 rounded-full"
              >
                Sort by
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-[200px] dark:bg-gray-950 bg-gray-350">
              <DropdownMenuItem 
                onClick={() => setSortOption("price-low-high")}
                className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                           hover:bg-gray-900 dark:hover:bg-gray-300
                           hover:text-gray-250 dark:hover:text-gray-800"
              >
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("price-high-low")}
                className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                        hover:bg-gray-900 dark:hover:bg-gray-300
                        hover:text-gray-250 dark:hover:text-gray-800"
              >
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("popularity")}
                className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                           hover:bg-gray-900 dark:hover:bg-gray-300 
                           hover:text-gray-250 dark:hover:text-gray-800"
              >
                Popularity
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("new-listed")}
                className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                           hover:bg-gray-900 dark:hover:bg-gray-300
                           hover:text-gray-250 dark:hover:text-gray-800"
              >
                New Listed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("relevance")}
                className="text-gray-950 dark:text-gray-350 font-medium text-lg 
                           hover:bg-gray-900 dark:hover:bg-gray-300
                           hover:text-gray-250 dark:hover:text-gray-800"
              >
                Relevance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 5 Star Filter */}
          <FilterButton active={showFiveStar} onClick={() => setShowFiveStar(!showFiveStar)}>
            <Star className={`h-4 w-4 ${showFiveStar ? 'fill-current' : ''}`} />
            5★ & above
          </FilterButton>

          {/* Neurolov Assured */}
          <FilterButton active={showAssured} onClick={() => setShowAssured(!showAssured)}>
            <Shield className={`h-4 w-4 ${showAssured ? 'fill-current' : ''}`} />
            <Lock className="h-3 w-3 absolute top-2 right-2" />
            Neurolov Assured
          </FilterButton>

          {/* GPU Unavailable Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-gray-950 dark:text-gray-350 font-medium text-lg 
                  bg-gray-350 dark:bg-gray-950 group border-0 rounded-full mx-2 hover:bg-blue-600 
                  hover:text-white hover:bg-blue-dark:600 dark:hover:text-white"
              >
                <Search className="h-4 w-4" />
                GPU Unavailable?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-black text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-white mb-2">
                  Can't find the GPU you need?
                </DialogTitle>
                <DialogDescription className="text-gray-400 mb-6">
                  List your GPU requirements and earn $NLOV tokens when your 
                  request helps expand our marketplace.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center p-8 space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600/20">
                  <Search className="w-8 h-8 text-blue-500" />
                </div>
                <Button 
                  className="w-full max-w-md py-6 text-lg font-semibold
                 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200"
                  onClick={() => window.open('https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform', '_blank')}
                >
                  <div className="flex flex-col items-center">
                    <span>List Your GPU Requirements</span>
                    <span className="text-sm font-normal opacity-90">Earn $NLOV Tokens</span>
                  </div>
                </Button>
                <p className="text-sm text-gray-400 text-center max-w-md">
                  Your input helps us expand our GPU marketplace. 
                  Receive $NLOV tokens when your requested specifications are added to our platform.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Button */}
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="p-2 rounded-full hover:bg-gray-800/20 transition-colors group"
                aria-label="Information about features"
              >
                <Info className="h-5 w-5 text-gray-400 group-hover:text-[#20A5EF] transition-colors" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="left"
              sideOffset={10}
              className="w-[350px] p-4 bg-gray-900/95 backdrop-blur-sm text-gray-100 
                         rounded-xl border border-gray-800 shadow-xl animate-in fade-in-0 zoom-in-95"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#20A5EF]" />
                    <p className="text-sm font-semibold text-white">Neurolov Assured</p>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Verified GPUs with guaranteed performance, reliability, and security. 
                    Backed by Neurolov's quality assurance.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-[#20A5EF]" />
                    <p className="text-sm font-semibold text-white">Pay with $NLOV</p>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Get 30% discount on all GPU rentals by paying with $NLOV tokens, 
                    Neurolov's native cryptocurrency.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#20A5EF]" />
                    <p className="text-sm font-semibold text-white">High Rated GPUs</p>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We recommend choosing GPUs with 5★ ratings for the best computing experience, 
                    as rated by our community.
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* GPU Grid */}
      <div className={styles.gpuGrid}>
        {gpuData.map((gpu) => (
          <div
            key={gpu.id}
            className={`${styles.gpuCard} pb-12 ${styles.comingSoon}`}
            onClick={() => handleGpuSelect(gpu)}
          >
            <div className={styles.gpuTitle}>
              {gpu.name}
            </div>
            <div className={styles.gpuImageWrapper}>
              <Image
                src={gpu.image}
                alt={gpu.name}
                width={600}
                height={400}
                className={styles.gpuImage}
                priority
              />
            </div>
            <div className={styles.gpuInfo}>
              <div className={styles.priceTag}>
                From ${gpu.price.usd}/hr
              </div>
              <button className={styles.selectButton}>
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Buy Dialog */}
      {selectedGpu && (
        <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
          <DialogContent className="sm:max-w-[500px] bg-gradient-to-b 
                      from-gray-900 to-black border border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold mb-4 bg-gradient-to-r 
                        from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {selectedGpu.name}
              </DialogTitle>
              <DialogDescription className="space-y-4">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl
                                border border-gray-700">
                  <h4 className="text-xl font-bold mb-4 text-white">Specifications</h4>
                  <div className="space-y-3 text-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p>{selectedGpu.specs.cores}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      <p>{selectedGpu.specs.tmus}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      <p>{selectedGpu.specs.rops}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <p>{selectedGpu.specs.rtCores}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl border transition-all duration-300 ${
                  useNlov 
                    ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50' 
                    : 'bg-gray-900 border-gray-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-white">Pay with $NLOV</span>
                      <span className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-green-500
                       to-emerald-500 rounded-full text-white">
                        Save 30%
                      </span>
                    </div>
                    <Button
                      variant={useNlov ? "default" : "outline"}
                      onClick={() => setUseNlov(!useNlov)}
                      className={useNlov 
                        ? `bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 border-0`
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                      }
                    >
                      <Coins className="w-4 h-4 mr-2" />
                      {useNlov ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>

                <div className={`mt-6 p-6 rounded-xl transition-all duration-300 ${
                  useNlov 
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30' 
                    : 'bg-gray-900 border border-gray-700'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-300">Price per Hour</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 
                              to-purple-400 bg-clip-text text-transparent">
                      ${useNlov ? selectedGpu.price.nlov : selectedGpu.price.usd}
                    </span>
                  </div>
                  {useNlov && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-400">$NLOV Savings</span>
                      <span className="font-medium text-emerald-400">
                        -${(selectedGpu.price.usd - selectedGpu.price.nlov).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-400 text-center font-medium">
                    🚀 GPU Marketplace coming in Version 2.0! Stay tuned for the launch.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowBuyDialog(false)}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-900 
                         hover:text-white transition-colors"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowBuyDialog(false);
                  toast({
                    title: "Coming Soon!",
                    description: "GPU Marketplace will be available in Version 2.0",
                    variant: "default",
                  });
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 
                         hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;