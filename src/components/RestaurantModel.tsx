import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { useGLTF, useProgress, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import dynamic from 'next/dynamic';
import { ContactShadows, Environment } from '@react-three/drei';
import WineAnimation from './WineGlassText';
import CameraPositions from './CameraPositions';
import CameraPositionButtons from './ CameraPositionButtons';
import { cameraPositions } from './CameraPositions';

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

// Model component
function Model({ url, position, id, isAvailable, onSelect, hitboxDimensions, isBase }: ModelProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const hitboxRef = useRef<THREE.Mesh | null>(null);
  const { scene } = useGLTF(url) as any;
  const originalMaterials = useRef<Map<THREE.Mesh, THREE.Material | THREE.Material[]>>(new Map());
  
  // Create highlight materials
  const availableHighlight = new THREE.MeshStandardMaterial({
    color: 0x00ff00,  // Green
    transparent: true,
    opacity: 0.8,
    emissive: 0x00ff00,
    emissiveIntensity: 0.5
  });

  const unavailableHighlight = new THREE.MeshStandardMaterial({
    color: 0xff0000,  // Red
    transparent: true,
    opacity: 0.8,
    emissive: 0xff0000,
    emissiveIntensity: 0.5
  });

  // Store original materials on first render
  useEffect(() => {
    if (meshRef.current && id) {  // Only for seats (elements with id)
      scene.traverse((child: THREE.Mesh) => {
        if (child instanceof THREE.Mesh) {
          originalMaterials.current.set(child, child.material);
        }
      });
    }
  }, [id, scene]);

  // Handle hover state changes
  useEffect(() => {
    if (meshRef.current && id) {  // Only for seats
      scene.traverse((child: THREE.Mesh) => {
        if (child instanceof THREE.Mesh) {
          if (hovered) {
            // Apply highlight material based on availability
            child.material = isAvailable ? availableHighlight : unavailableHighlight;
          } else {
            // Restore original material
            const originalMaterial = originalMaterials.current.get(child);
            if (originalMaterial) {
              child.material = originalMaterial;
            }
          }
        }
      });
    }
  }, [hovered, isAvailable, id, scene]);

  useEffect(() => {
    if (meshRef.current && hitboxDimensions) {
      const hitboxGeometry = new THREE.BoxGeometry(
        hitboxDimensions.width,
        hitboxDimensions.height,
        hitboxDimensions.depth
      );
      const hitboxMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,
        opacity: 0,     // Make hitbox invisible
        transparent: true
      });
      const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
      
      hitbox.position.set(
        hitboxDimensions.offsetX || 0,
        hitboxDimensions.offsetY || 0,
        hitboxDimensions.offsetZ || 0
      );
      
      hitbox.userData.isHitbox = true;
      hitbox.userData.isBaseHitbox = isBase;
      meshRef.current.add(hitbox);
      hitboxRef.current = hitbox;
    }
  }, [hitboxDimensions, isBase]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
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
        if (id && onSelect && isAvailable) {
          onSelect(id);
        }
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (id) {  // Only enable hover effect for seats
          setHovered(true);
        }
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        if (id) {  // Only enable hover effect for seats
          setHovered(false);
        }
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

// Crosshair component
const Crosshair = () => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '20px',
    height: '20px',
    border: '2px solid white',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  }} />
);


const PreloadScene = () => {
  const { scene } = useThree();

  useEffect(() => {
    // Preload lights and effects setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;

    const spotLight = new THREE.SpotLight(0xffffff, 0.3);
    spotLight.position.set(0, 4, 0);
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.3);

    scene.add(ambientLight, directionalLight, spotLight, hemisphereLight);

    return () => {
      scene.remove(ambientLight, directionalLight, spotLight, hemisphereLight);
    };
  }, [scene]);

  return null;
};

// Preload function to handle model and texture loading
const PreloadModels = () => {
  const modelUrls = [
    '/models/base/base.gltf',
    '/models/roof/roof.gltf',
    '/models/stage/stage.gltf',
    '/models/counter/counter.gltf',
    '/models/art/art.gltf',
    '/models/couch/couch.gltf',
    '/models/2table/2table.gltf',
    '/models/2table1/2table1.gltf',
    '/models/2table2/2table2.gltf',
    '/models/2table3/2table3.gltf',
    '/models/4table/4table.gltf',
    '/models/4table1/4table1.gltf',
    '/models/stool/stool.gltf',
    '/models/stool1/stool1.gltf',
    '/models/stool2/stool2.gltf',
    '/models/stool3/stool3.gltf'
  ];

  modelUrls.forEach(url => {
    useGLTF.preload(url);
  });

  return null;
};

const LoadingScreen = () => {
  const { progress, loaded, total } = useProgress();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-c7">
      <div className="text-center">
        <WineAnimation />
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


// Main RestaurantModel component
const RestaurantModel: React.FC<ModelViewerProps> = ({ 
  availableSeats = [], 
  onSeatSelect = () => {},
  onLoadingChange 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { active } = useProgress();
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

  useEffect(() => {
    setIsLoading(active);
    if (onLoadingChange) {
      onLoadingChange(active);
    }
  }, [active, onLoadingChange]);

  const handlePositionChange = (index: number) => {
    setCurrentPositionIndex(index);
  };

  return (
    <div className="w-full h-screen">
      {isLoading && <LoadingScreen />}
      <Canvas
        shadows
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0.7, 0]
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
      >
        <Suspense fallback={null}>
          {/* Improved lighting setup */}

          <Preload all />
          <PreloadModels />
          <PreloadScene />


          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.3} 
            castShadow 
            // shadow-mapSize={[1024, 1024]}
            shadow-mapSize={[256, 256]} 
          />
          <spotLight 
            position={[0, 4, 0]} 
            intensity={0.2} 
            castShadow
            angle={Math.PI / 4}
            penumbra={0.5}
          />
          <hemisphereLight 
            intensity={0.2} 
            groundColor={new THREE.Color(0x080820)}
          />

          {/* Environment and effects */}
          <Environment preset="apartment"/>
          <ContactShadows
            opacity={0.3}
            scale={10}
            blur={2}
            far={10}
            resolution={128}
            color="#000000"
          />
          
          <EffectComposer>
          <SSAO 
            samples={6}
            radius={0.1}
            intensity={8}
            luminanceInfluence={0.5}
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
          
          
          {/* Base models */}
          <Model url="/models/base/base.gltf" />
          <Model url="/models/roof/roof.gltf" />
          <Model url="/models/stage/stage.gltf" />
          <Model url="/models/counter/counter.gltf" />
          <Model url="/models/art/art.gltf" />

          <Model url="/models/couch/couch.gltf" id="couch" />
          <Model url="/models/2table/2table.gltf" id="2table" />
          <Model url="/models/2table1/2table1.gltf" id="2table1" />
          <Model url="/models/2table2/2table2.gltf" id="2table2" />
          <Model url="/models/2table3/2table3.gltf" id="2table3" />
          <Model url="/models/4table/4table.gltf" id="4table" />
          <Model url="/models/4table1/4table1.gltf" id="4table1" />
          <Model url="/models/stool/stool.gltf" id="stool" />
          <Model url="/models/stool1/stool1.gltf" id="stool1" />
          <Model url="/models/stool2/stool2.gltf" id="stool2" />
          <Model url="/models/stool3/stool3.gltf" id="stool3" />

          
        </Suspense>
        <CameraPositions currentPositionIndex={currentPositionIndex} />
      </Canvas>
      <CameraPositionButtons
        onPositionChange={handlePositionChange}
        availableSeats={availableSeats}
        onSeatSelect={onSeatSelect}
        currentPositionIndex={currentPositionIndex}
      />
      <Crosshair />
    </div>
  );
};

// Export with dynamic import to prevent SSR issues
export default dynamic(() => Promise.resolve(RestaurantModel), {
  ssr: false
});
