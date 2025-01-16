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
  const startTimeRef = useRef(Date.now());
  const isInitialAnimationRef = useRef(true);

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
    console.log('Loading model from:', modelPath);
    loader.load(modelPath, (gltf) => {
      console.log('Model loaded successfully');
      let vertices = [];
      gltf.scene.traverse((child) => {
        if (child.isMesh && child.geometry) {
          console.log('Found mesh:', child.name);
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
      console.log('Total vertices found:', vertices.length);

      // Scale and center the vertices
      const box = new THREE.Box3();
      vertices.forEach(vertex => box.expandByPoint(vertex));
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim;

      vertices = vertices.map(v => {
        return new THREE.Vector3(
          (v.x - center.x) * scale,
          (v.y - center.y) * scale,
          (v.z - center.z) * scale
        );
      });

      const finalParticleCount = Math.min(particleCount, vertices.length);
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(finalParticleCount * 3);
      const originalPositions = new Float32Array(finalParticleCount * 3);
      const disperseDirections = new Float32Array(finalParticleCount * 3);

      for (let i = 0; i < finalParticleCount; i++) {
        const vertex = vertices[Math.floor(Math.random() * vertices.length)];
        const i3 = i * 3;

        // For initial animation, start particles from dispersed positions
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * disperseDistance * 2;
        
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = Math.sin(angle) * radius;
        positions[i3 + 2] = (Math.random() - 0.5) * disperseDistance;

        // Store original positions
        originalPositions[i3] = vertex.x;
        originalPositions[i3 + 1] = vertex.y;
        originalPositions[i3 + 2] = vertex.z;

        // Calculate disperse directions
        disperseDirections[i3] = Math.cos(angle);
        disperseDirections[i3 + 1] = Math.sin(angle);
        disperseDirections[i3 + 2] = (Math.random() - 0.5) * 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));
      geometry.setAttribute('disperseDirection', new THREE.BufferAttribute(disperseDirections, 3));

      const material = new THREE.PointsMaterial({
        size: particleSize,
        color: particleColor,
        transparent: true,
        opacity: 0,
        sizeAttenuation: true
      });

      particlesRef.current = new THREE.Points(geometry, material);
      
      // Rotate to face left
      particlesRef.current.rotation.y = Math.PI / 2;  // 90 degrees rotation around Y axis
      
      scene.add(particlesRef.current);

      camera.position.z = 2.4;
      camera.lookAt(0, 0, 0);

      startTimeRef.current = Date.now();
      isInitialAnimationRef.current = true;

      const animate = () => {
        if (!particlesRef.current || !mountElement.parentElement) {
          return;
        }

        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        const positions = particlesRef.current.geometry.attributes.position;
        const originalPositions = particlesRef.current.geometry.attributes.originalPosition;
        const disperseDirections = particlesRef.current.geometry.attributes.disperseDirection;

        // Fade in opacity during initial animation
        if (isInitialAnimationRef.current) {
          particlesRef.current.material.opacity = Math.min(1, elapsedTime);
        }

        const transitionSpeed = isInitialAnimationRef.current ? 0.03 : 0.02;
        let allParticlesInPlace = true;

        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          
          if (isDispersedRef.current) {
            const dx = disperseDirections.array[i3] * disperseSpeed;
            const dy = disperseDirections.array[i3 + 1] * disperseSpeed;
            const dz = disperseDirections.array[i3 + 2] * disperseSpeed;

            positions.array[i3] += dx * transitionSpeed;
            positions.array[i3 + 1] += dy * transitionSpeed;
            positions.array[i3 + 2] += dz * transitionSpeed;
          } else {
            const dx = originalPositions.array[i3] - positions.array[i3];
            const dy = originalPositions.array[i3 + 1] - positions.array[i3 + 1];
            const dz = originalPositions.array[i3 + 2] - positions.array[i3 + 2];
            
            // Ease the movement with a smoother transition
            const ease = isInitialAnimationRef.current ? 0.08 : 0.06;
            positions.array[i3] += dx * ease;
            positions.array[i3 + 1] += dy * ease;
            positions.array[i3 + 2] += dz * ease;

            // Check if this particle is close enough to its target
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (distance > 0.01) {
              allParticlesInPlace = false;
            }
          }
        }

        // If all particles are in place, end initial animation
        if (isInitialAnimationRef.current && allParticlesInPlace) {
          isInitialAnimationRef.current = false;
          console.log('Initial animation complete');
        }

        positions.needsUpdate = true;
        renderer.render(scene, camera);
        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();
    });

    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (particlesRef.current) {
        scene.remove(particlesRef.current);
        particlesRef.current.geometry.dispose();
        particlesRef.current.material.dispose();
      }
      if (renderer && renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };

    return cleanup;
  }, [width, height, particleCount, particleSize, particleColor, disperseSpeed, modelPath, disperseDistance]);

  const toggleDisperse = useCallback(() => {
    if (isInitialAnimationRef.current) return; // Don't allow toggling during initial animation
    isDispersedRef.current = !isDispersedRef.current;
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (isInitialAnimationRef.current) return; // Don't handle mouse movement during initial animation
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / height) * 2 + 1;
  }, [width, height]);

  return {
    initializeEffect,
    toggleDisperse,
    handleMouseMove,
  };
};
