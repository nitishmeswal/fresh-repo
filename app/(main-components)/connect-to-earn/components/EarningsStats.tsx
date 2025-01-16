'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, TrendingUp } from 'lucide-react';

interface EarningsData {
  totalEarned: number;
  dailyRate: number;
  uptime: number;
  nextPayout: number;
}

interface EarningsStatsProps {
  data: EarningsData;
}

export const EarningsStats: React.FC<EarningsStatsProps> = ({ data }) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Earnings Overview</h3>
        <Badge variant="secondary" className="font-mono">
          Active
        </Badge>
      </div>

      <div className="grid gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-sm">Total Earned</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{data.totalEarned}</span>
            <span className="text-sm text-muted-foreground">NLOV</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Daily Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{data.dailyRate}</span>
            <span className="text-sm text-muted-foreground">NLOV/day</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Uptime</span>
            </div>
            <span className="text-sm font-mono">{data.uptime}%</span>
          </div>
          <Progress value={data.uptime} />
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Next Payout</span>
            <span className="font-mono">{data.nextPayout} NLOV</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
