'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface GPUScanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GPUScanDialog: React.FC<GPUScanDialogProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [gpuDetails, setGpuDetails] = useState<any>(null);

  // Simulate GPU scan
  React.useEffect(() => {
    if (isOpen && !scanComplete) {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanComplete(true);
            setGpuDetails({
              name: 'NVIDIA GeForce RTX 4080',
              vram: '16GB GDDR6X',
              driver: '546.33',
              compatible: true,
              issues: [],
              recommendations: [
                'Update to latest driver version 547.09',
                'Configure power management settings',
              ],
            });
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, scanComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>GPU Compatibility Scan</DialogTitle>
          <DialogDescription>
            Checking your GPU specifications and compatibility
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!scanComplete ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-8">
                <Cpu className="w-16 h-16 animate-pulse text-blue-500" />
              </div>
              <Progress value={scanProgress} className="w-full" />
              <p className="text-center text-sm text-gray-500">
                Scanning GPU capabilities... {scanProgress}%
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{gpuDetails.name}</h3>
                    <p className="text-sm text-gray-500">
                      VRAM: {gpuDetails.vram} | Driver: {gpuDetails.driver}
                    </p>
                  </div>
                  {gpuDetails.compatible ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Compatible
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="w-4 h-4 mr-1" />
                      Not Compatible
                    </Badge>
                  )}
                </div>
              </Card>

              {gpuDetails.issues.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Issues Found</h4>
                  <ul className="space-y-1">
                    {gpuDetails.issues.map((issue: string, index: number) => (
                      <li key={index} className="flex items-center text-red-500">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gpuDetails.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recommendations</h4>
                  <ul className="space-y-1">
                    {gpuDetails.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-center text-blue-500">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={!scanComplete}
          >
            Cancel
          </Button>
          <Button
            onClick={onComplete}
            disabled={!scanComplete || !gpuDetails?.compatible}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
