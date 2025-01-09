import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useParticleEffect } from './useParticleEffect';
import './ParticleEffect.css';

const ParticleEffect = ({
  modelPath,
  width = 600,
  height = 600,
  particleCount = 25000,
  particleSize = 0.02,
  particleColor = 0x007bff,
  disperseSpeed = 0.15,
  disperseDistance = 2,
}) => {
  const mountRef = useRef(null);
  const {
    initializeEffect,
    cleanupEffect,
    handleMouseMove,
    handleMouseLeave,
  } = useParticleEffect({
    modelPath,
    width,
    height,
    particleCount,
    particleSize,
    particleColor,
    disperseSpeed,
    disperseDistance,
  });

  useEffect(() => {
    if (!mountRef.current) return;
    
    const cleanup = initializeEffect(mountRef.current);
    return () => cleanup();
  }, [initializeEffect]);

  return (
    <div 
      className="particle-effect-container"
      ref={mountRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default ParticleEffect;
