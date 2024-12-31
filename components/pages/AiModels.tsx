// "use client";
// import { models } from '@/constants/values';



// import React from 'react';
// import { FiHeart } from 'react-icons/fi';
// import { useTheme } from 'next-themes';
// import { Button } from "@/components/ui/button";



// function AiModels() {
//   const { theme } = useTheme();
//   const [favorites, setFavorites] = React.useState<string[]>([]);

//   const toggleFavorite = (modelId: string) => {
//     setFavorites(prev => 
//       prev.includes(modelId)
//         ? prev.filter(id => id !== modelId)
//         : [...prev, modelId]
//     );
//   };

//   return (
//     <div className={`ai-models-container  h-screen p-6 ${
//       theme === 'dark' 
//       ? 'bg-black2'
//       : 'bg-gray-50' 
//     }`}>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {models.map(model => {
//           const Icon = model.icon;
//           const isFavorite = favorites.includes(model.id);
          
//           return (
//             <div 
//               key={model.id} 
//               className={`relative rounded-xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
//                 theme === 'dark' 
//                 ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
//                 : 'bg-white border-gray-100 hover:border-gray-200' 
//               }`}
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className={`p-3 rounded-lg ${
//                     theme === 'dark' 
//                     ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20'
//                     : 'bg-gradient-to-br from-blue-50 to-indigo-50' 
//                   }`}>
//                     <Icon className={`w-6 h-6 ${
//                       theme === 'dark' 
//                       ? 'text-blue-400'
//                       : 'text-blue-600' 
//                     }`} />
//                   </div>
//                   <button 
//                     onClick={() => toggleFavorite(model.id)}
//                     className={`p-2 rounded-full transition-colors ${
//                       theme === 'dark'
//                       ? 'hover:bg-gray-800'
//                       : 'hover:bg-gray-100'
//                     }`}
//                   >
//                     <FiHeart
//                       className="w-5 h-5 transition-colors"
//                       fill={isFavorite ? '#FF0000' : 'none'}
//                       color={isFavorite ? '#FF0000' : theme === 'dark' 
//                         ? '#999999'
//                         : '#666666'
//                       } 
//                     />
//                   </button>
//                 </div>

//                 <div className="mt-4">
//                   <div className="flex items-center space-x-2">
//                     <h3 className={`text-xl font-semibold ${
//                       theme === 'dark' 
//                       ? 'text-white'
//                       : 'text-gray-900' 
//                     }`}>
//                       {model.name}
//                     </h3>
//                     {model.recommended && (
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         theme === 'dark'
//                         ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
//                         : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
//                       }`}>
//                         Recommended
//                       </span>
//                     )}
//                   </div>
//                   <p className={`mt-2 text-sm ${
//                     theme === 'dark' 
//                     ? 'text-gray-400'
//                     : 'text-gray-600' 
//                   }`}>
//                     {model.description}
//                   </p>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       model.type === 'Premium'
//                         ? theme === 'dark'
//                         ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-purple-400'
//                         : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600'
//                         : theme === 'dark'
//                         ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 text-blue-400'
//                         : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
//                     }`}>
//                       {model.type}
//                     </span>
//                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                       theme === 'dark' 
//                       ? 'bg-gray-800 text-gray-400'
//                       : 'bg-gray-100 text-gray-600' 
//                     }`}>
//                       {model.framework}
//                     </span>
//                   </div>
//                   <span className={`text-lg font-bold ${
//                     theme === 'dark'
//                     ? 'bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent'
//                     : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'
//                   }`}>
//                     ${model.pricePerHour}/hr
//                   </span>
//                 </div>

//                 <Button 
//                   className={`w-full mt-4 text-white border-0 ${
//                     theme === 'dark'
//                     ? 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
//                     : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
//                   }`}
//                 >
//                   Deploy Model
//                 </Button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default AiModels;




import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterMenu } from '@/components/FilterMenu';
import { Heart, Image as ImageIcon, Zap, Box, Video, Brain, MessageSquare, Music, Clock } from 'lucide-react'
import { AddToCartButton } from '@/components/addToCart';
import { models } from '@/constants/values';
const filterOptions = {
  generation: {
    name: "Generation",
    filters: ["Text", "Image", "Video", "3D", "Audio", "Real-time"]
  },
  type: {
    name: "Type",
    filters: ["Open Source", "Closed Source"]
  },
  sort: {
    name: "Sort by",
    filters: ["Newest", "Price: Low to High", "Price: High to Low"]
  }
};

export default function AiModelsPage() {
  return (
    <div className="flex flex-1 w-full min-h-screen flex-col bg-[#111111]">
      {/* Top Filter Bar */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        {Object.values(filterOptions).map((option, index) => (
          <FilterMenu key={index} name={option.name} filters={option.filters} />
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <AnimatePresence>
          {models.map((model) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A1A1A] rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-[#222] rounded-lg">
                    <model.icon size={24} className="text-blue-400" />
                  </div>
                  <button className="p-2 hover:bg-[#222] rounded-lg transition-colors">
                    <Heart size={20} className="text-gray-400" />
                  </button>
                </div>

                <h3 className="text-xl font-medium text-white mb-2">{model.name}</h3>
                <p className="text-gray-400 mb-4">{model.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#222] rounded-full text-sm text-gray-300">
                    {model.type}
                  </span>
                  {model.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm ${
                        tag === 'Premium' 
                          ? 'bg-purple-900/50 text-purple-300'
                          : 'bg-[#222] text-gray-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-medium text-blue-400">${model.price}/hr</span>
                  <AddToCartButton 
                    item={{
                      id: model.id,
                      name: model.name,
                      price: model.price,
                      type: 'ai-model'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
