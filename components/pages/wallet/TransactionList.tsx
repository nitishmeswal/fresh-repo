'use client';

import React, { memo } from 'react';
import { Card } from "@/components/ui/card";
import { NLOVTransaction } from '@/types/transactions';

interface TransactionListProps {
  transactions: NLOVTransaction[];
}

const TransactionItem = memo(({ transaction }: { transaction: NLOVTransaction }) => (
  <Card className="p-4">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="font-medium">{transaction.source}</h3>
        <p className="text-sm text-gray-500">
          {transaction.type === 'earning' ? 'Earned from computation' : 'Received payment'}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">${transaction.amount.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.timestamp).toLocaleDateString()}
        </p>
      </div>
    </div>
  </Card>
));

TransactionItem.displayName = 'TransactionItem';

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};
