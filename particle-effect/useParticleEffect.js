import { useCallback, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export const useParticleEffect = ({
  modelPath,
  width,
  height,
  particleCount,
  particleSize,
  particleColor,
  disperseSpeed,
  disperseDistance,
}) => {
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, worldX: 0, worldY: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const animationFrameRef = useRef(null);
  const isDispersedRef = useRef(false);

  const initializeEffect = useCallback((mountElement) => {
    // Scene setup
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    rendererRef.current = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountElement.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Load model and create particles
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      let vertices = [];
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          const positions = child.geometry.attributes.position.array;
          for (let i = 0; i < positions.length; i += 3) {
            vertices.push(new THREE.Vector3(
              positions[i],
              positions[i + 1],
              positions[i + 2]
            ));
          }
        }
      });

      if (vertices.length === 0) {
        console.error('No vertices found in the model');
        return;
      }

      const finalParticleCount = Math.min(particleCount, vertices.length);
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(finalParticleCount * 3);
      const originalPositions = new Float32Array(finalParticleCount * 3);
      const disperseDirections = new Float32Array(finalParticleCount * 3);
      const speeds = new Float32Array(finalParticleCount);

      for (let i = 0; i < finalParticleCount; i++) {
        const vertex = vertices[Math.floor(Math.random() * vertices.length)];
        const noise = 0.01;
        const i3 = i * 3;

        positions[i3] = vertex.x + (Math.random() - 0.5) * noise;
        positions[i3 + 1] = vertex.y + (Math.random() - 0.5) * noise;
        positions[i3 + 2] = vertex.z + (Math.random() - 0.5) * noise;

        originalPositions[i3] = positions[i3];
        originalPositions[i3 + 1] = positions[i3 + 1];
        originalPositions[i3 + 2] = positions[i3 + 2];

        const angle = Math.random() * Math.PI * 2;
        const upwardBias = Math.random() * 0.5;
        disperseDirections[i3] = Math.cos(angle);
        disperseDirections[i3 + 1] = Math.sin(angle) + upwardBias;
        disperseDirections[i3 + 2] = (Math.random() - 0.5) * 0.5;

        speeds[i] = Math.random() * disperseSpeed + 0.1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
      geometry.setAttribute('disperseDirection', new THREE.BufferAttribute(disperseDirections, 3));

      const material = new THREE.PointsMaterial({
        color: particleColor,
        size: particleSize,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
      });

      particlesRef.current = new THREE.Points(geometry, material);
      scene.add(particlesRef.current);

      camera.position.z = 5;
      animate();
    });

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position;
        const originalPositions = particlesRef.current.geometry.attributes.originalPosition;
        const disperseDirections = particlesRef.current.geometry.attributes.disperseDirection;
        
        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          if (isDispersedRef.current) {
            positions.array[i3] += disperseDirections.array[i3] * disperseSpeed;
            positions.array[i3 + 1] += disperseDirections.array[i3 + 1] * disperseSpeed;
            positions.array[i3 + 2] += disperseDirections.array[i3 + 2] * disperseSpeed;
          } else {
            positions.array[i3] += (originalPositions.array[i3] - positions.array[i3]) * 0.1;
            positions.array[i3 + 1] += (originalPositions.array[i3 + 1] - positions.array[i3 + 1]) * 0.1;
            positions.array[i3 + 2] += (originalPositions.array[i3 + 2] - positions.array[i3 + 2]) * 0.1;
          }
        }
        
        positions.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountElement && renderer.domElement) {
        mountElement.removeChild(renderer.domElement);
      }
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        particlesRef.current.material.dispose();
      }
      renderer.dispose();
    };
  }, [width, height, particleCount, particleSize, particleColor, disperseSpeed, modelPath]);

  const handleMouseMove = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    if (particlesRef.current) {
      const intersects = raycasterRef.current.intersectObject(particlesRef.current);
      isDispersedRef.current = intersects.length > 0;
    }
  }, [width, height]);

  const handleMouseLeave = useCallback(() => {
    isDispersedRef.current = false;
  }, []);

  return {
    initializeEffect,
    handleMouseMove,
    handleMouseLeave,
  };
};
