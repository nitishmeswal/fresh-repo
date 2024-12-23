import React from 'react';
import GPUCard from './GPUCard';
import styles from '@/styles/marketplace.module.css';
import { GPU } from '@/constants/values';

interface GPUGridProps {
  data: GPU[];
  onSelect: (gpu: GPU) => void;
}

const GPUGrid: React.FC<GPUGridProps> = ({ data, onSelect }) => {
  return (
    <div className={styles.gpuGrid}>
      {data.map((gpu) => (
        <GPUCard 
          key={gpu.id} 
          gpu={gpu} 
          onSelect={onSelect} 
        />
      ))}
    </div>
  );
};

export default React.memo(GPUGrid);
