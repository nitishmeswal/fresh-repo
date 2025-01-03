import { useState } from 'react';
// @ts-ignore
export default function CheckoutModal({ state, totalPrice, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!state.gpu || !state.aiModel) {
      alert('Please select both a GPU and an AI Model');
      return;
    }

    const isCompatible = true; // Replace with actual compatibility check
    if (!isCompatible) {
      alert('Selected GPU and AI Model are not compatible');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.gpulab.ai/container/deploy', {
        method: 'POST',
        // @ts-ignore
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.GPULAB_API_KEY,
        },
        body: JSON.stringify({
        //   model_id: state.model.container_id,
          model_id: 194,
          gpu_count: 1,
          gpu_type: "NVIDIA GeForce RTX 3090",
        //   gpu_type: state.gpu.name,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Deployment successful!');
        onClose();
      } else {
        alert(`Error: ${data.message || 'Failed to deploy'}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg max-w-lg mx-auto text-white">
        <h2 className="text-xl font-semibold mb-4">Checkout</h2>
        {state.gpu && state.aiModel ? (
          <>
            <div className="border-t border-gray-700 my-2" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total</span>
              <span className="font-medium">${totalPrice}/hr</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full mt-4 px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Deploying...' : 'Deploy Now'}
            </button>
          </>
        ) : (
          <p className="text-red-500">Please select both a GPU and an AI Model</p>
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
