'use client';

import { useEffect, useRef } from 'react';
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewerProps {
  src: string;
  alt: string;
  poster?: string;
  className?: string;
}

export default function ModelViewer({ src, alt, poster, className = '' }: ModelViewerProps) {
  const modelViewerRef = useRef(null);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      alt={alt}
      poster={poster}
      loading="eager"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      environment-image="neutral"
      exposure="0.75"
      ar={false}
      ar-modes="none"
      ar-scale="fixed"
      className={`w-full h-[400px] bg-muted/50 rounded-lg ${className}`}
    />
  );
}
