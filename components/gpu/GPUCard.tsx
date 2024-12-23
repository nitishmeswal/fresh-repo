import React from 'react';
import Image from 'next/image';
import styles from '@/styles/marketplace.module.css';
import { GPU } from '@/constants/values';

interface GPUCardProps {
  gpu: GPU;
  onSelect: (gpu: GPU) => void;
}

const GPUCard: React.FC<GPUCardProps> = ({ gpu, onSelect }) => {
  return (
    <div
      className={`${styles.gpuCard} ${!gpu.available ? styles.comingSoon : ''}`}
      onClick={() => gpu.available && onSelect(gpu)}
    >
      <div className={styles.gpuTitle}>{gpu.name}</div>
      <div className={styles.gpuImageWrapper}>
        <Image
          src={gpu.image}
          alt={gpu.name}
          width={400}
          height={250}
          className={styles.gpuImage}
          priority
        />
        {!gpu.available && (
          <div className={styles.comingSoonOverlay}>
            Coming Soon
          </div>
        )}
      </div>
      <div className={styles.gpuInfo}>
        <div className={styles.priceTag}>
          From ${gpu.price.usd}/hr
        </div>
        <button className={styles.selectButton}>
          {gpu.available ? 'Buy GPU' : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(GPUCard);
