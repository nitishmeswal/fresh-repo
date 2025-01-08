'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Settings, Zap } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface MiningPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectPlan: (duration: number) => void;
}

export const MiningPlanDialog: React.FC<MiningPlanDialogProps> = ({
  open,
  onOpenChange,
  onSelectPlan
}) => {
  const [customHours, setCustomHours] = React.useState(4);

  const plans = [
    {
      duration: 3,
      title: "Quick Session",
      description: "Perfect for a test run",
      icon: Clock
    },
    {
      duration: 8,
      title: "Standard Session",
      description: "Recommended for optimal earnings",
      icon: Zap
    },
    {
      duration: 24,
      title: "Extended Session",
      description: "Maximum earning potential",
      icon: Clock
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Select Mining Plan
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {plans.map((plan) => (
            <Card
              key={plan.duration}
              className="p-4 bg-[#1A1A1A] border-gray-800 hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => onSelectPlan(plan.duration)}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <plan.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-white">{plan.title}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
                <p className="text-lg font-semibold text-white">{plan.duration}h</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-[#1A1A1A] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-white">Custom Plan</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Duration</span>
              <span className="text-white font-medium">{customHours} hours</span>
            </div>
            
            <Slider
              value={[customHours]}
              onValueChange={(value) => setCustomHours(value[0])}
              min={1}
              max={24}
              step={1}
              className="w-full"
            />

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onSelectPlan(customHours)}
            >
              Start Custom Plan
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
