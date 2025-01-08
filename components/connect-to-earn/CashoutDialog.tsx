'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coins, CreditCard, Wallet, Gift, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CashoutOption {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  minAmount: number;
  processingTime: string;
  bonus?: string;
}

interface CashoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
}

export const CashoutDialog: React.FC<CashoutDialogProps> = ({
  open,
  onOpenChange,
  amount
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const cashoutOptions: CashoutOption[] = [
    {
      id: 'bank',
      title: 'Bank Transfer',
      description: 'Direct deposit to your bank account',
      icon: CreditCard,
      minAmount: 50,
      processingTime: '2-3 business days'
    },
    {
      id: 'crypto',
      title: 'Crypto Wallet',
      description: 'Instant transfer to your crypto wallet',
      icon: Wallet,
      minAmount: 10,
      processingTime: 'Instant',
      bonus: '+2% bonus'
    },
    {
      id: 'gift',
      title: 'Gift Cards',
      description: 'Convert to popular gift cards',
      icon: Gift,
      minAmount: 25,
      processingTime: 'Instant',
      bonus: '+5% value'
    }
  ];

  const handleCashout = async () => {
    if (!selectedOption) return;
    
    setProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setSuccess(true);
    
    // Reset and close after success
    setTimeout(() => {
      setSuccess(false);
      setSelectedOption(null);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A1A] border-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-yellow-500" />
            Cashout Earnings
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Available Balance: ${amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {!success ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cashoutOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "p-4 border-2 cursor-pointer transition-all duration-200 hover:bg-gray-900/50",
                      selectedOption === option.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-800 bg-black/30"
                    )}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          selectedOption === option.id ? "bg-blue-500/20" : "bg-gray-800"
                        )}>
                          <option.icon className={cn(
                            "w-5 h-5",
                            selectedOption === option.id ? "text-blue-500" : "text-gray-400"
                          )} />
                        </div>
                        <h3 className="font-semibold text-white">{option.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 flex-grow">{option.description}</p>
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Min. Amount</span>
                          <span className="text-white">${option.minAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-gray-400">Processing</span>
                          <span className="text-white">{option.processingTime}</span>
                        </div>
                        {option.bonus && (
                          <div className="mt-2">
                            <span className="text-green-500 text-sm">{option.bonus}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button
                className="w-full mt-4"
                size="lg"
                disabled={!selectedOption || processing}
                onClick={handleCashout}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Cashout Now
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-white">Cashout Successful!</h3>
              <p className="text-gray-400 text-center">
                Your payment is being processed and will be available soon.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
