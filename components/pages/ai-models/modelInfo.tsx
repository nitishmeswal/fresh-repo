import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Book, 
  GitBranch, 
  Star, 
  Download,
  MessageSquare,
  Clock,
  FileCode,
  Scale
} from 'lucide-react';

interface ModelInfoProps {
  modelId: string;
}

export const ModelInfo = ({ modelId }: ModelInfoProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <Card className="p-6 bg-black/40 border-blue-500/20 lg:col-span-2">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-400">Model Overview</h3>
            <p className="text-sm text-gray-400 mt-1">
              A state-of-the-art language model fine-tuned for specific tasks
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className="border-blue-500/20">
              v2.0.0
            </Badge>
            <Badge variant="outline" className="border-green-500/20 text-green-400">
              Stable
            </Badge>
          </div>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-4 text-gray-300">
            <p>
              This model is designed for high-performance natural language processing tasks,
              offering superior accuracy and efficiency. It has been trained on a diverse
              dataset and optimized for production use.
            </p>
            
            <h4 className="text-blue-400 font-medium">Key Features</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Advanced natural language understanding</li>
              <li>Optimized for low-latency inference</li>
              <li>Support for multiple languages</li>
              <li>Fine-tuning capabilities</li>
            </ul>

            <h4 className="text-blue-400 font-medium">Use Cases</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Text generation and completion</li>
              <li>Sentiment analysis</li>
              <li>Language translation</li>
              <li>Question answering</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button variant="outline" className="border-blue-500/20 hover:bg-blue-500/10">
            <Book className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button variant="outline" className="border-blue-500/20 hover:bg-blue-500/10">
            <GitBranch className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
          <Button variant="outline" className="border-blue-500/20 hover:bg-blue-500/10">
            <Download className="w-4 h-4 mr-2" />
            Download Weights
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="space-y-6">
        <Card className="p-6 bg-black/40 border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Model Stats</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Rating</span>
              </div>
              <span className="text-sm text-blue-400">4.8/5.0</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Download className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm text-gray-400">Downloads</span>
              </div>
              <span className="text-sm text-blue-400">50K+</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-sm text-gray-400">Community</span>
              </div>
              <span className="text-sm text-blue-400">Active</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-orange-400 mr-2" />
                <span className="text-sm text-gray-400">Last Update</span>
              </div>
              <span className="text-sm text-blue-400">2 days ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/40 border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Technical Specs</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileCode className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Parameters</span>
              </div>
              <span className="text-sm text-blue-400">1.3B</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Scale className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-sm text-gray-400">Model Size</span>
              </div>
              <span className="text-sm text-blue-400">2.8 GB</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-sm text-gray-400">Training Time</span>
              </div>
              <span className="text-sm text-blue-400">72 hours</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
