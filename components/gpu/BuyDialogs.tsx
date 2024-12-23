import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {GPU} from '@/constants/values';

interface BuyDialogProps {
  gpu: GPU;
  isOpen: boolean;
  onClose: () => void;
}

const BuyDialog: React.FC<BuyDialogProps> = ({ gpu, isOpen, onClose }) => {
  const router = useRouter();
  const [useNlov, setUseNlov] = useState(false);

  const handleBuy = () => {
    router.push(`/wallet?gpu=${gpu.id}&useNlov=${useNlov}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900">
        <DialogHeader>
          <DialogTitle>{gpu.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>{gpu.specs.cores}</p>
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleBuy}>
            Pay with {useNlov ? '$NLOV' : 'USD'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyDialog;
