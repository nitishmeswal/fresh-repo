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
  const cleanupRef = useRef(null);

  const {
    initializeEffect,
    toggleDisperse,
    handleMouseMove,
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

    let isComponentMounted = true;

    // Clear any existing content and WebGL context
    while (mountRef.current.firstChild) {
      if (mountRef.current.firstChild.remove) {
        mountRef.current.firstChild.remove();
      } else {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    }

    // Try to initialize with error handling
    try {
      if (isComponentMounted) {
        cleanupRef.current = initializeEffect(mountRef.current);
      }
    } catch (error) {
      console.error('Failed to initialize particle effect:', error);
      // Cleanup on error
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    }

    return () => {
      isComponentMounted = false;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [initializeEffect, modelPath, width, height]);

  return (
    <div 
      className="relative w-full h-full"
      ref={mountRef}
      onMouseMove={handleMouseMove}
      onClick={toggleDisperse}
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        cursor: 'pointer'
      }}
    />
  );
};

export default ParticleEffect;
