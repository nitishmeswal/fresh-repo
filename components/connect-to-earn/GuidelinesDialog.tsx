'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle, Cpu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GuidelinesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  gpuName: string;
}

export const GuidelinesDialog: React.FC<GuidelinesDialogProps> = ({ 
  open, 
  onOpenChange, 
  onAccept,
  gpuName 
}) => {
  const guidelines = {
    hardware: {
      title: 'Hardware Requirements',
      items: [
        'NVIDIA GPU with minimum 8GB VRAM',
        'Latest NVIDIA drivers installed',
        'Stable internet connection (10Mbps+)',
        'Proper cooling system required'
      ]
    },
    operation: {
      title: 'Operating Guidelines',
      items: [
        'Maintain stable internet connection',
        'Keep GPU temperature below 80°C',
        'Avoid intensive GPU tasks while mining',
        'Minimum session duration: 1 hour'
      ]
    },
    earnings: {
      title: 'Earnings & Payouts',
      items: [
        'Earnings based on GPU performance',
        'Real-time earnings tracking',
        'Automatic power cost deduction',
        'Minimum payout: 100 NLOV'
      ]
    },
    security: {
      title: 'Security & Safety',
      items: [
        'Automatic thermal throttling',
        'Real-time performance monitoring',
        'Secure wallet integration',
        'Automated safety protocols'
      ]
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Cpu className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white">
                {gpuName}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Review guidelines before connecting
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {Object.values(guidelines).map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      <p className="text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4">
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-white mb-1">Important Note</h4>
                <p className="text-sm text-gray-400">
                  Your GPU will be locked for the selected duration to ensure stable earnings.
                  You can still use your computer normally, but intensive GPU tasks may affect mining performance.
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={onAccept}
          >
            <Check className="w-4 h-4 mr-2" />
            I Agree & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
