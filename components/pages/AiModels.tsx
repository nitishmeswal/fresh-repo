"use client";

// import React from 'react';
// import { FiHeart } from 'react-icons/fi';
import { models } from '@/constants/values';
// import modelLogo from '@/public/pages/model-logo.png'
// import Image from 'next/image';
// import { useTheme } from 'next-themes';
// import { FiHeart } from 'react-icons/fi';

// function AiModels() {
//   const { theme } = useTheme();
//   // const [like, setLike] = React.useState(false);
//   const models = [
//     {
//       id: 1,
//       name: 'AI Model Name',
//       image: model1,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 2,
//       name: 'AI Model Name',
//       image: model2,
//       whishlist: true,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 3,
//       name: 'AI Model Name',
//       image: model3,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 4,
//       name: 'AI Model Name',
//       image: model4,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 5,
//       name: 'AI Model Name',
//       image: model5,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 6,
//       name: 'AI Model Name',
//       image: model6,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 7,
//       name: 'AI Model Name',
//       image: model5,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     },
//     {
//       id: 8,
//       name: 'AI Model Name',
//       image: model6,
//       whishlist: false,
//       type: 'Free',
//       framework: 'Figma'
//     }
//   ];

//   return (
//     <div className=" ai-models-container  ">
//       <div className="models-grid">
//         {models.map(model => (
//           <div key={model.id} className="model-card">
//             <div className="model-image">
//               <Image src={model.image} alt={model.name} />
//               <button className="favorite-btn bg-transparent hover:bg-black/25" 
//                       onClick={() => model.whishlist = !model.whishlist}>
//                 <FiHeart
//                 fill={model.whishlist ? '#FF0000' : 'none'}
//                 color={model.whishlist ? '#FF0000' : '#000000'}
//                 />
//               </button>
//             </div>
//             <div className="model-info">
//                 <div className="model-header">
//                 <Image src={modelLogo} alt="Figma" className="framework-icon" />
//                 <h3 className={theme === "dark" ? ' text-white' : ' text-black'}>{model.name}</h3>
//                 </div>
//               <div className="model-meta">
//                 <span>{model.type}</span>
//                 <span>|</span>
//                 <span>{model.framework}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AiModels; 


import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";



function AiModels() {
  const { theme } = useTheme();
  const [favorites, setFavorites] = React.useState<string[]>([]);

  const toggleFavorite = (modelId: string) => {
    setFavorites(prev => 
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  return (
    <div className={`ai-models-container  h-screen p-6 ${
      theme === 'dark' 
      ? 'bg-black2'
      : 'bg-gray-50' 
    }`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map(model => {
          const Icon = model.icon;
          const isFavorite = favorites.includes(model.id);
          
          return (
            <div 
              key={model.id} 
              className={`relative rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                theme === 'dark' 
                ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                : 'bg-white border-gray-100 hover:border-gray-200' 
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${
                    theme === 'dark' 
                    ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20'
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50' 
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      theme === 'dark' 
                      ? 'text-blue-400'
                      : 'text-blue-600' 
                    }`} />
                  </div>
                  <button 
                    onClick={() => toggleFavorite(model.id)}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark'
                      ? 'hover:bg-gray-800'
                      : 'hover:bg-gray-100'
                    }`}
                  >
                    <FiHeart
                      className="w-5 h-5 transition-colors"
                      fill={isFavorite ? '#FF0000' : 'none'}
                      color={isFavorite ? '#FF0000' : theme === 'dark' 
                        ? '#999999'
                        : '#666666'
                      } 
                    />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-xl font-semibold ${
                      theme === 'dark' 
                      ? 'text-white'
                      : 'text-gray-900' 
                    }`}>
                      {model.name}
                    </h3>
                    {model.recommended && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        theme === 'dark'
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                        : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                      }`}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' 
                    ? 'text-gray-400'
                    : 'text-gray-600' 
                  }`}>
                    {model.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      model.type === 'Premium'
                        ? theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-400'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600'
                        : theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                    }`}>
                      {model.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      theme === 'dark' 
                      ? 'bg-gray-800 text-gray-400'
                      : 'bg-gray-100 text-gray-600' 
                    }`}>
                      {model.framework}
                    </span>
                  </div>
                  <span className={`text-lg font-bold ${
                    theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
                  }`}>
                    ${model.pricePerHour}/hr
                  </span>
                </div>

                <Button 
                  className={`w-full mt-4 text-white border-0 ${
                    theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  }`}
                >
                  Deploy Model
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AiModels;