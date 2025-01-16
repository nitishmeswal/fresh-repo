'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIModel } from '@/services/types';

interface ModelCardProps {
  model: AIModel;
  onDeploy: (model: AIModel) => void;
}

export function ModelCard({ model, onDeploy }: ModelCardProps) {
  return (
    <Card 
      className="bg-gradient-to-b from-gray-900 to-[#1A1A1A] p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all cursor-pointer"
      onClick={() => onDeploy(model)}
    >
      <CardHeader className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {model.icon}
            <div>
              <CardTitle className="text-lg font-semibold text-white">
                {model.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-400">
                {model.type}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-sm text-gray-300 mb-4">
          {model.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-400 font-medium">Deploy Now</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
