import React, { Suspense, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useProgress, Preload, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import dynamic from 'next/dynamic';
import { ContactShadows, Environment, AdaptiveDpr, AdaptiveEvents, BakeShadows, useDetectGPU } from '@react-three/drei';
import WineAnimation from './WineGlassText';
import CameraPositions from './CameraPositions';
import CameraPositionButtons from './CameraPositionButtons';


// Types
interface ModelProps {
  url: string;
  position?: [number, number, number];
  id?: string;
  isAvailable?: boolean;
  onSelect?: (id: string) => void;
  isBase?: boolean;
  hitboxDimensions?: {
    width: number;
    height: number;
    depth: number;
    offsetX?: number;
    offsetY?: number;
    offsetZ?: number;
  };
}

interface ModelViewerProps {
  availableSeats?: string[];
  onSeatSelect?: (id: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

// Device detection
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  const { progress, loaded, total } = useProgress();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-c7">
      <div className="text-center">
        {/* <WineAnimation /> */}
        <div className="w-64 h-2 bg-c5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-c9 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 text-c9">
          Loading Models: {Math.round(progress)}%
          <br />
          <span className="text-sm text-c9">
            ({loaded}/{total} assets loaded)
          </span>
        </div>
      </div>
    </div>
  );
};

// PreloadScene Component
interface PreloadSceneProps {
  deviceType: 'mobile' | 'desktop';
}

const PreloadScene: React.FC<PreloadSceneProps> = ({ deviceType }) => {
  const { scene } = useThree();

  useEffect(() => {
    const intensity = deviceType === 'mobile' ? 0.2 : 0.3;
    
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity);
    const directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = deviceType === 'mobile' ? 256 : 512;
    directionalLight.shadow.mapSize.height = deviceType === 'mobile' ? 256 : 512;

    const spotLight = new THREE.SpotLight(0xffffff, intensity);
    spotLight.position.set(0, 4, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, intensity);

    scene.add(ambientLight, directionalLight, spotLight, hemisphereLight);

    return () => {
      scene.remove(ambientLight, directionalLight, spotLight, hemisphereLight);
    };
  }, [scene, deviceType]);

  return null;
};

// Model Component
const Model: React.FC<ModelProps> = ({ url, position, id, onSelect }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url, true) as any;
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.geometry) {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
          }
          if (child.material) {
            child.material.precision = isMobile() ? 'lowp' : 'highp';
          }
        }
      });
    }
  }, [scene]);

  return (
    <group 
      ref={meshRef} 
      position={position} 
      onClick={(event) => {
        event.stopPropagation();
        if (id && onSelect) onSelect(id);
      }}
    >
      <primitive object={scene} />
    </group>
  );
};

import { isMobile as isDeviceMobile } from 'react-device-detect';

const OptimizedModel: React.FC<ModelProps> = ({ url, position, id, onSelect }) => {
  const meshRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url, true) as any;
  const gpu = useDetectGPU();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.geometry) {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
          }
          if (child.material) {
            // Adjust material quality based on GPU tier
            if (gpu.tier < 2) {
              child.material.precision = 'lowp';
              child.material.roughness = Math.min(child.material.roughness * 1.2, 1);
              child.material.metalness = Math.max(child.material.metalness * 0.8, 0);
            } else {
              child.material.precision = 'highp';
            }
          }
        }
      });
    }
  }, [scene, gpu.tier]);

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    if (id && onSelect) onSelect(id);
  };

  return (
    <group ref={meshRef} position={position} onClick={handleClick}>
      <primitive object={scene} />
    </group>
  );
};

interface LightingProps {
  intensity?: number;
}

const Lighting: React.FC<LightingProps> = ({ intensity = 0.5 }) => {
  const { scene } = useThree();

  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, intensity);
    const directionalLight = new THREE.DirectionalLight(0xffffff, intensity * 20);
    directionalLight.position.set(0, 1, 0);

    scene.add(ambientLight, directionalLight);

    return () => {
      scene.remove(ambientLight, directionalLight);
    };
  }, [scene, intensity]);

  return null;
};

// Main Component
const RestaurantModel: React.FC<ModelViewerProps> = ({ 
  availableSeats = [], 
  onSeatSelect = () => {},
  onLoadingChange 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { active } = useProgress();
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');
  const gpu = useDetectGPU();
  const [lightIntensity, setLightIntensity] = useState(0.5);

  useEffect(() => {
    setDeviceType(isMobile() ? 'mobile' : 'desktop');
  }, []);

  useEffect(() => {
    setIsLoading(active);
    if (onLoadingChange) onLoadingChange(active);
  }, [active, onLoadingChange]);

  const handlePositionChange = (index: number) => {
    setCurrentPositionIndex(index);
  };

  const baseModels = [
    { url: '/models/base_optimized.gltf' },
    { url: '/models/roof_optimized.gltf' },
    { url: '/models/stage_optimized.gltf' },
    { url: "/models/art_optimized.gltf" },

    { url: "/models/counter/counter.gltf" },
  ];

  const furnitureModels = [
    { url: '/models/couch/couch.gltf', id: 'couch' },
    { url: "/models/2table/2table.gltf", id: "2table" },
    { url: "/models/2table1/2table1.gltf", id: "2table1" },
    { url: "/models/2table2/2table2.gltf", id: "2table2" },
    { url: "/models/2table3/2table3.gltf", id: "2table3" },
    { url: "/models/4table/4table.gltf", id: "4table" },
    { url: "/models/4table1/4table1.gltf", id: "4table1" },

    { url: "/models/stool_optimized.gltf", id: "stool" },
    { url: "/models/stool1_optimized.gltf", id: "stool1" },
    { url: "/models/stool2_optimized.gltf", id: "stool2" },
    { url: "/models/stool3_optimized.gltf", id: "stool3" },
  ];

  return (
    <div className="w-full h-screen">
      {isLoading && <LoadingScreen />}
      <Canvas
        shadows
        dpr={[1, deviceType === 'mobile' ? 1 : 1.5]}
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0.7, 0]
        }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
        performance={{ min: 0.5 }}
      >
        <Lighting intensity={lightIntensity} />
        {/* <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows /> */}
        
        {/* <Suspense fallback={null}>
          <Preload all /> */}

          <Suspense fallback={null}>
            {baseModels.map((model, index) => (
              <OptimizedModel key={index} {...model} />
            ))}
          </Suspense>
          
          <Suspense fallback={null}>
            {furnitureModels.map((model, index) => (
              <OptimizedModel 
                key={index} 
                {...model} 
                onSelect={onSeatSelect}
                isAvailable={availableSeats.includes(model.id || '')}
              />
            ))}
          </Suspense>

          {/* <Environment preset="apartment" />
          <ContactShadows
            opacity={0.2}
            scale={deviceType === 'mobile' ? 5 : 10}
            blur={1}
            far={5}
            resolution={deviceType === 'mobile' ? 32 : 64}
            color="#000000"
          />
          
          {deviceType === 'desktop' && gpu.tier > 1 && (
            <EffectComposer multisampling={0}>
              <SSAO
                samples={4}
                radius={0.1}
                intensity={6}
                luminanceInfluence={0.6}
                color={new THREE.Color('black')}
                worldDistanceThreshold={0.5}
                worldDistanceFalloff={0.1} 
                worldProximityThreshold={6}
                worldProximityFalloff={1}
              />
              <Bloom
                intensity={0.03}
                luminanceThreshold={0.95}
                luminanceSmoothing={0.025}
              />
            </EffectComposer>
          )}
        </Suspense> */}
        <CameraPositions currentPositionIndex={currentPositionIndex} />
      </Canvas>
      <CameraPositionButtons
        onPositionChange={handlePositionChange}
        availableSeats={availableSeats}
        onSeatSelect={onSeatSelect}
        currentPositionIndex={currentPositionIndex}
      />
    </div>
  );
};

export default dynamic(() => Promise.resolve(RestaurantModel), { ssr: false });