'use client';

import React, { useState } from 'react';
import { PaymentMethodButton } from './PaymentMethodButton';
import cardIcon from '@/public/pages/wallet/card-icon.svg';
import upiIcon from '@/public/pages/wallet/upi-icon.svg';
import bankIcon from '@/public/pages/wallet/bank-icon.svg';
import cryptoIcon from '@/public/pages/wallet/crypto-icon.svg';

type PaymentMethod = 'card' | 'upi' | 'bank' | 'crypto';

interface PaymentMethodsProps {
  onMethodSelect: (method: PaymentMethod) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onMethodSelect }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    onMethodSelect(method);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <PaymentMethodButton
        icon={cardIcon}
        label="Card"
        onClick={() => handleMethodSelect('card')}
        selected={selectedMethod === 'card'}
      />
      <PaymentMethodButton
        icon={upiIcon}
        label="UPI"
        onClick={() => handleMethodSelect('upi')}
        selected={selectedMethod === 'upi'}
      />
      <PaymentMethodButton
        icon={bankIcon}
        label="Bank Transfer"
        onClick={() => handleMethodSelect('bank')}
        selected={selectedMethod === 'bank'}
      />
      <PaymentMethodButton
        icon={cryptoIcon}
        label="Crypto"
        onClick={() => handleMethodSelect('crypto')}
        selected={selectedMethod === 'crypto'}
      />
    </div>
  );
};
