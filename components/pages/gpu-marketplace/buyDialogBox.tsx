"use client"

import { CreditCard, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { GPU } from '@/constants/values';
import { NlovPaymentOption } from "./nlogPaymentOption";
import { PricingSummary } from "./pricingSummery";
import { GpuSpecs } from "./gpu-specs";

interface BuyDialogProps {
  gpu: GPU | null;
  open: boolean;
  onClose: () => void;
  onBuy: () => void;
  useNlov: boolean;
  onNlovToggle: (value: boolean) => void;
}

export const BuyDialog = ({ 
  gpu, 
  open, 
  onClose, 
  onBuy, 
  useNlov, 
  onNlovToggle 
}: BuyDialogProps) => {
  if (!gpu) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-gray-900 to-black border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Buy {gpu.name}
            <div className="text-base font-medium text-gray-300 mt-2">
              {gpu.specs.available} unit{gpu.specs.available !== 1 ? 's' : ''} available
            </div>
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <GpuSpecs specs={gpu.specs} />
            <NlovPaymentOption useNlov={useNlov} onToggle={onNlovToggle} />
            <PricingSummary gpu={gpu} useNlov={useNlov} />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onBuy}
            className={`flex-1 transition-all duration-300 ${
              useNlov 
                ? `bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0` 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay with {useNlov ? '$NLOV' : 'USD'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};