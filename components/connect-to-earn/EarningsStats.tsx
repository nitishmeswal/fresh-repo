'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Clock, Zap, History } from 'lucide-react';

interface EarningStats {
  currentSession: {
    duration: string;
    earnings: number;
    powerCost: number;
    netEarnings: number;
  };
  lifetimeEarnings: number;
  history: Array<{
    date: string;
    earnings: number;
  }>;
}

interface EarningsStatsProps {
  stats: EarningStats;
  onCashout: () => void;
}

export const EarningsStats: React.FC<EarningsStatsProps> = ({ stats, onCashout }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#1A1A1A] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Coins className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold text-white">Current Earnings</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Gross Earnings</span>
              <span className="text-white">${stats.currentSession.earnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Power Cost</span>
              <span className="text-red-400">-${stats.currentSession.powerCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-400">Net Earnings</span>
              <span className="text-green-400">${stats.currentSession.netEarnings.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1A1A1A] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold text-white">Session Duration</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{stats.currentSession.duration}</p>
            <p className="text-sm text-gray-400">Active Mining Time</p>
          </div>
        </Card>

        <Card className="p-6 bg-[#1A1A1A] border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-semibold text-white">Lifetime Earnings</h3>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">${stats.lifetimeEarnings.toFixed(2)}</p>
            <Button
              onClick={onCashout}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Coins className="w-4 h-4 mr-2" />
              Cashout
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-[#1A1A1A] border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <History className="w-5 h-5 text-orange-500" />
          </div>
          <h3 className="font-semibold text-white">Earnings History</h3>
        </div>
        <div className="space-y-4">
          {stats.history.map((entry, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/50">
              <span className="text-gray-400">{entry.date}</span>
              <span className="text-white font-medium">${entry.earnings.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
