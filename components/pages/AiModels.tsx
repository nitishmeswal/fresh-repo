import React from 'react';
import { FiHeart } from 'react-icons/fi';
import model1 from'@/public/pages/model 1.png'
import model2 from'@/public/pages/model 2.png'
import model3 from'@/public/pages/model 3.png'
import model4 from'@/public/pages/model 4.png'
import model5 from'@/public/pages/model 5.png'
import model6 from'@/public/pages/model 6.png'
import modelLogo from '@/public/pages/model-logo.png'
import Image from 'next/image';
import { useTheme } from 'next-themes';

function AiModels() {
  const { theme } = useTheme();
  // const [like, setLike] = React.useState(false);
  const models = [
    {
      id: 1,
      name: 'AI Model Name',
      image: model1,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 2,
      name: 'AI Model Name',
      image: model2,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 3,
      name: 'AI Model Name',
      image: model3,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 4,
      name: 'AI Model Name',
      image: model4,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 5,
      name: 'AI Model Name',
      image: model5,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 6,
      name: 'AI Model Name',
      image: model6,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 7,
      name: 'AI Model Name',
      image: model5,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 8,
      name: 'AI Model Name',
      image: model6,
      whishlist: false,
      type: 'Free',
      framework: 'Figma'
    }
  ];

  return (
    <div className=" ai-models-container overflow-y-auto h-screen ">
      <div className="models-grid">
        {models.map(model => (
          <div key={model.id} className="model-card">
            <div className="model-image">
              <Image src={model.image} alt={model.name} />
              <button className="favorite-btn">
                <FiHeart
                onClick={() => model.whishlist = !model.whishlist}
                fill={model.whishlist ? '#FF0000' : 'none'}
                color={model.whishlist ? '#FF0000' : '#000000'}
                />
              </button>
            </div>
            <div className="model-info">
                <div className="model-header">
                <Image src={modelLogo} alt="Figma" className="framework-icon" />
                <h3 className={theme === 'light' ? ' text-white' : ' text-black'}>{model.name}</h3>
                </div>
              <div className="model-meta">
                <span>{model.type}</span>
                <span>|</span>
                <span>{model.framework}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiModels; 