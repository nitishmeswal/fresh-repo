'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Cpu } from 'lucide-react';

interface GPUScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanComplete: (gpuName: string) => void;
}

export const GPUScanDialog: React.FC<GPUScanDialogProps> = ({
  open,
  onOpenChange,
  onScanComplete
}) => {
  React.useEffect(() => {
    if (open) {
      // Simulate GPU scanning
      const timer = setTimeout(() => {
        onScanComplete('NVIDIA RTX 4090');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [open, onScanComplete]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">GPU Scan</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative bg-blue-500/10 p-4 rounded-full">
              <Cpu className="w-8 h-8 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-white">Scanning GPU</h2>
          <p className="text-gray-400 text-center">
            Please wait while we detect your GPU specifications...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
