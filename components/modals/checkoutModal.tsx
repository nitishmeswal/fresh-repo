import { useState } from 'react';
import axios from 'axios';

// @ts-ignore
export default function CheckoutModal({ state, totalPrice, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!state.gpu || !state.aiModel) {
      alert('Please select both a GPU and an AI Model');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.gpulab.ai/container/deploy",
        {
          model_id: 194,
          gpu_count: 1,
          gpu_type: "NVIDIA GeForce RTX 3090",
        },
        {
          headers: {
            'Content-Type': "application/json",
            // 'api-key': process.env.GPULAB_API_KEY,
            'api-key': "7fOCxySH32XdB9hu0n1iKSP2fmqaaY6I"
          },
        }
      );

      if (response.status === 200) {
        alert('Deployment successful!');
        onClose();
      } else {
        alert(`Error: ${response.data.message || 'Failed to deploy'}`);
      }
    } catch (error) {
      const errorMsg =
    //   @ts-ignore
        error.response?.data?.message || 'An error occurred. Please try again.';
      alert(errorMsg);
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md mx-auto text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>
        {state.gpu && state.aiModel ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-semibold">${totalPrice}/hr</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full px-6 py-3 rounded-lg transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Deploying...' : 'Deploy Now'}
            </button>
          </>
        ) : (
          <p className="text-red-400">Please select a GPU and AI Model</p>
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
