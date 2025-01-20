import { useState } from 'react';
import { GPULabClient } from '@/gpulab';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  state: {
    gpu: any;
    aiModel: any;
  };
  totalPrice: number;
  onClose: () => void;
}

export default function CheckoutModal({ state, totalPrice, onClose }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!state.gpu || !state.aiModel) {
      toast.error('Selection Required', {
        description: 'Please select both a GPU and an AI Model'
      });
      return;
    }

    setLoading(true);
    const gpulab = GPULabClient.getInstance();

    try {
      // Create model configuration
      const modelConfig = {
        name: `${state.aiModel.name}-${Date.now()}`,
        image_name: state.aiModel.image || 'adhikjoshi/pytorch-gpulab:latest',
        author_url: 'https://github.com/GPULab-AI',
        category_id: 1,
        min_vram: state.gpu.memory || 16,
        isVisible: true,
        container_port: '8888',
        container_disk: 10,
        volume_disk: 50,
        volume_mount_path: '/workspace',
        readme: state.aiModel.description || 'No description provided'
      };

      // Deploy the model with volume and container
      const result = await gpulab.deployModel(modelConfig);

      toast.success('Deployment Successful!', {
        description: `Container ID: ${result.container_id}`
      });
      onClose();
      
    } catch (error: any) {
      const errorMessage = error.error || error.message || 'An error occurred during deployment';
      const errorStep = error.step || 'unknown';
      
      toast.error('Deployment Failed', {
        description: `Error in ${errorStep} step: ${errorMessage}`
      });
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto text-white">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span>Selected GPU:</span>
            <span>{state.gpu?.name || 'None'}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected Model:</span>
            <span>{state.aiModel?.name || 'None'}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Price:</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying...
              </>
            ) : (
              'Deploy Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
