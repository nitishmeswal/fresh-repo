import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Play, Settings, RefreshCw } from 'lucide-react';

interface ModelPlaygroundProps {
  modelId: string;
}

export const ModelPlayground = ({ modelId }: ModelPlaygroundProps) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [temperature, setTemperature] = useState([0.7]);
  const [maxLength, setMaxLength] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOutput('This is a sample output from the model. In production, this would be the actual response from your AI model.');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Input</h3>
          
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your prompt here..."
            className="flex-1 min-h-[200px] bg-black/40 border-blue-500/20 resize-none mb-4"
          />

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-gray-400">Temperature</Label>
                <span className="text-sm text-blue-400">{temperature[0]}</span>
              </div>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                min={0}
                max={1}
                step={0.1}
                className="[&_[role=slider]]:bg-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-sm text-gray-400">Max Length</Label>
                <span className="text-sm text-blue-400">{maxLength[0]}</span>
              </div>
              <Slider
                value={maxLength}
                onValueChange={setMaxLength}
                min={0}
                max={100}
                step={1}
                className="[&_[role=slider]]:bg-blue-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            disabled={!input || isLoading}
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Run
          </Button>
        </div>
      </Card>

      {/* Output Section */}
      <Card className="p-6 bg-black/40 border-blue-500/20">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">Output</h3>
          
          <div className="flex-1 bg-black/40 border border-blue-500/20 rounded-md p-4 min-h-[200px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
              </div>
            ) : output ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-300"
              >
                {output}
              </motion.div>
            ) : (
              <div className="text-gray-500 text-center h-full flex items-center justify-center">
                Output will appear here
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-500/20 hover:bg-blue-500/10"
              onClick={() => setOutput('')}
              disabled={!output}
            >
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-blue-500/20 hover:bg-blue-500/10"
              disabled={!output}
            >
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
