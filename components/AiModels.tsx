import React from 'react';
import { FiHeart } from 'react-icons/fi';

function AiModels() {
  const models = [
    {
      id: 1,
      name: 'AI Model Name',
      image: '/images/models/model-dark.png',
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 2,
      name: 'AI Model Name',
      image: '/images/models/model-blue.png',
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 3,
      name: 'AI Model Name',
      image: '/images/models/model-orange.png',
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 4,
      name: 'AI Model Name',
      image: '/images/models/model-collage.png',
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 5,
      name: 'AI Model Name',
      image: '/images/models/model-blue-dark.png',
      type: 'Free',
      framework: 'Figma'
    },
    {
      id: 6,
      name: 'AI Model Name',
      image: '/images/models/model-orange-dark.png',
      type: 'Free',
      framework: 'Figma'
    }
  ];

  return (
    <div className="ai-models-container">
      <div className="model-filters">
        <select className="filter-item">
          <option>Generation</option>
        </select>
        <select className="filter-item">
          <option>Category</option>
        </select>
      </div>

      <div className="models-grid">
        {models.map(model => (
          <div key={model.id} className="model-card">
            <div className="model-image">
              <img src={model.image} alt={model.name} />
              <button className="favorite-btn">
                <FiHeart />
              </button>
            </div>
            <div className="model-info">
              <div className="model-header">
                <img src="/figma-icon.png" alt="Figma" className="framework-icon" />
                <h3>{model.name}</h3>
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