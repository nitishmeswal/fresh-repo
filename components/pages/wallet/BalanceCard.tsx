'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, pendingBalance }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Balance</CardTitle>
        <CardDescription>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
              {pendingBalance > 0 && (
                <p className="text-sm text-gray-500">
                  Pending: ${pendingBalance.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
