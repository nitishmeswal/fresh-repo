import { AIModel } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CustomModelCardProps {
  model: AIModel;
  onDeploy: (model: AIModel) => void;
}

export function CustomModelCard({ model, onDeploy }: CustomModelCardProps) {
  const Icon = model.icon;
  
  return (
    <Card className="relative overflow-hidden group bg-black/40 border-blue-500/20 hover:border-blue-500/40 transition-colors">
      {/* Gradient overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-gradient-to-br from-blue-600 to-blue-500" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-lg text-white">{model.name}</h3>
          </div>
          <div className="text-xs text-blue-400/60 bg-blue-500/10 px-2 py-1 rounded">
            Custom
          </div>
        </div>

        <p className="text-sm text-gray-400">{model.description}</p>

        <div className="space-y-2">
          {model.features && model.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-1 h-1 rounded-full bg-blue-500/40" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button
            onClick={() => onDeploy(model)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg group"
          >
            <span>Upload & Deploy</span>
            <motion.div
              className="ml-2"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>
      </div>
    </Card>
  );
}
