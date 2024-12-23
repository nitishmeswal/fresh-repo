'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { WalletState } from '@/types/wallet-index';

interface CryptoWalletProps {
  walletState: WalletState;
  onConnect: () => void;
}

export const CryptoWallet: React.FC<CryptoWalletProps> = ({ walletState, onConnect }) => {
  return (
    <div className="space-y-4">
      {walletState.isAvailable ? (
        <>
          {walletState.isConnected ? (
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm">Connected Wallet: {walletState.address}</p>
            </div>
          ) : (
            <Button onClick={onConnect} className="w-full">
              Connect Wallet
            </Button>
          )}
        </>
      ) : (
        <p className="text-sm text-red-500">
          No crypto wallet detected. Please install a wallet extension.
        </p>
      )}
    </div>
  );
};
