'use client';
import React from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { DeploymentStep } from '@/services/types';

interface DeploymentStepsProps {
  steps: DeploymentStep[];
}

export function DeploymentSteps({ steps }: DeploymentStepsProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center space-x-3">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${step.status === 'completed' ? 'bg-green-500/20 text-green-500' :
              step.status === 'failed' ? 'bg-red-500/20 text-red-500' :
              step.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
              'bg-gray-500/20 text-gray-500'}
          `}>
            {step.status === 'completed' && <Check className="w-5 h-5" />}
            {step.status === 'failed' && <X className="w-5 h-5" />}
            {step.status === 'in-progress' && <Loader2 className="w-5 h-5 animate-spin" />}
            {step.status === 'pending' && <div className="w-2 h-2 rounded-full bg-current" />}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">{step.name}</p>
            {step.message && (
              <p className="text-xs text-gray-400 mt-1">{step.message}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
