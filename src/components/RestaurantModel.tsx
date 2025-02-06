// import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
// import { Canvas, useThree, useLoader } from '@react-three/fiber';
// import { useGLTF, useProgress, Preload } from '@react-three/drei';
// import * as THREE from 'three';
// import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
// import dynamic from 'next/dynamic';
// import { ContactShadows, Environment } from '@react-three/drei';
// import WineAnimation from './WineGlassText';
// import CameraPositions from './CameraPositions';
// import CameraPositionButtons from './CameraPositionButtons';
// import { cameraPositions } from './CameraPositions';

// // Types
// interface ModelProps {
//   url: string;
//   position?: [number, number, number];
//   id?: string;
//   isAvailable?: boolean;
//   onSelect?: (id: string) => void;
//   isBase?: boolean;
//   hitboxDimensions?: {
//     width: number;
//     height: number;
//     depth: number;
//     offsetX?: number;
//     offsetY?: number;
//     offsetZ?: number;
//   };
// }

// interface ModelViewerProps {
//   availableSeats?: string[];
//   onSeatSelect?: (id: string) => void;
//   onLoadingChange?: (isLoading: boolean) => void;
// }

// // Model component
// function Model({ url, position, id, onSelect }: ModelProps) {
//   const meshRef = useRef<THREE.Group>(null);
//   const { scene } = useGLTF(url) as any;

//   useEffect(() => {
//     if (meshRef.current) {
//       meshRef.current.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//           child.castShadow = true;
//           child.receiveShadow = true;
//         }
//       });
//     }
//   }, [scene]);

//   return (
//     <group
//       ref={meshRef}
//       position={position}
//       onClick={(event) => {
//         event.stopPropagation();
//         if (id && onSelect) {
//           onSelect(id);
//         }
//       }}
//     >
//       <primitive object={scene} />
//     </group>
//   );
// }

// // Crosshair component
// const Crosshair = () => (
//   <div style={{
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     width: '20px',
//     height: '20px',
//     border: '2px solid white',
//     borderRadius: '50%',
//     transform: 'translate(-50%, -50%)',
//     pointerEvents: 'none'
//   }} />
// );


// const PreloadScene = () => {
//   const { scene } = useThree();

//   useEffect(() => {
//     // Preload lights and effects setup
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
//     directionalLight.position.set(5, 5, 5);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 512;
//     directionalLight.shadow.mapSize.height = 512;

//     const spotLight = new THREE.SpotLight(0xffffff, 0.3);
//     spotLight.position.set(0, 4, 0);
//     spotLight.castShadow = true;
//     spotLight.angle = Math.PI / 4;
//     spotLight.penumbra = 0.5;

//     const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 0.3);

//     scene.add(ambientLight, directionalLight, spotLight, hemisphereLight);

//     return () => {
//       scene.remove(ambientLight, directionalLight, spotLight, hemisphereLight);
//     };
//   }, [scene]);

//   return null;
// };

// // Preload function to handle model and texture loading
// const PreloadModels = () => {
//   const modelUrls = [
//     '/models/base/base.gltf',
//     '/models/roof/roof.gltf',
//     '/models/stage/stage.gltf',
//     '/models/counter/counter.gltf',
//     '/models/art/art.gltf',
//     '/models/couch/couch.gltf',
//     '/models/2table/2table.gltf',
//     '/models/2table1/2table1.gltf',
//     '/models/2table2/2table2.gltf',
//     '/models/2table3/2table3.gltf',
//     '/models/4table/4table.gltf',
//     '/models/4table1/4table1.gltf',
//     '/models/stool/stool.gltf',
//     '/models/stool1/stool1.gltf',
//     '/models/stool2/stool2.gltf',
//     '/models/stool3/stool3.gltf'
//   ];

//   modelUrls.forEach(url => {
//     useGLTF.preload(url);
//   });

//   return null;
// };

// const LoadingScreen = () => {
//   const { progress, loaded, total } = useProgress();
  
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-c7">
//       <div className="text-center">
//         <WineAnimation />
//         <div className="w-64 h-2 bg-c5 rounded-full overflow-hidden">
//           <div 
//             className="h-full bg-c9 transition-all duration-300 ease-out"
//             style={{ width: `${progress}%` }}
//           />
//         </div>
//         <div className="mt-4 text-c9">
//           Loading Models: {Math.round(progress)}%
//           <br />
//           <span className="text-sm text-c9">
//             ({loaded}/{total} assets loaded)
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };


// // Main RestaurantModel component
// const RestaurantModel: React.FC<ModelViewerProps> = ({ 
//   availableSeats = [], 
//   onSeatSelect = () => {},
//   onLoadingChange 
// }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const { active } = useProgress();
//   const [currentPositionIndex, setCurrentPositionIndex] = useState(0);

//   useEffect(() => {
//     setIsLoading(active);
//     if (onLoadingChange) {
//       onLoadingChange(active);
//     }
//   }, [active, onLoadingChange]);

//   const handlePositionChange = (index: number) => {
//     setCurrentPositionIndex(index);
//   };

//   return (
//     <div className="w-full h-screen">
//       {isLoading && <LoadingScreen />}
//       <Canvas
//         shadows
//         camera={{
//           fov: 75,
//           near: 0.1,
//           far: 1000,
//           position: [0, 0.7, 0]
//         }}
//         gl={{
//           antialias: true,
//           toneMapping: THREE.ACESFilmicToneMapping,
//           outputEncoding: THREE.sRGBEncoding
//         }}
//       >
//         <Suspense fallback={null}>
//           {/* Improved lighting setup */}

//           <Preload all />
//           <PreloadModels />
//           <PreloadScene />


//           <ambientLight intensity={0.2} />
//           <directionalLight 
//             position={[5, 5, 5]} 
//             intensity={0.3} 
//             castShadow 
//             // shadow-mapSize={[1024, 1024]}
//             shadow-mapSize={[256, 256]} 
//           />
//           <spotLight 
//             position={[0, 4, 0]} 
//             intensity={0.2} 
//             castShadow
//             angle={Math.PI / 4}
//             penumbra={0.5}
//           />
//           <hemisphereLight 
//             intensity={0.2} 
//             groundColor={new THREE.Color(0x080820)}
//           />

//           {/* Environment and effects */}
//           <Environment preset="apartment"/>
//           <ContactShadows
//             opacity={0.3}
//             scale={10}
//             blur={2}
//             far={10}
//             resolution={128}
//             color="#000000"
//           />
          
//           <EffectComposer>
//           <SSAO 
//             samples={6}
//             radius={0.1}
//             intensity={8}
//             luminanceInfluence={0.5}
//             color={new THREE.Color('black')}
//             worldDistanceThreshold={0.5}
//             worldDistanceFalloff={0.1} 
//             worldProximityThreshold={6}
//             worldProximityFalloff={1}
//           />
//             <Bloom 
//               intensity={0.03}
//               luminanceThreshold={0.95}
//               luminanceSmoothing={0.025}
//             />
//           </EffectComposer>
          
          
//           {/* Base models */}
//           <Model url="/models/base/base.gltf" />
//           <Model url="/models/roof/roof.gltf" />
//           <Model url="/models/stage/stage.gltf" />
//           <Model url="/models/counter/counter.gltf" />
//           <Model url="/models/art/art.gltf" />

//           <Model url="/models/couch/couch.gltf" id="couch" />
//           <Model url="/models/2table/2table.gltf" id="2table" />
//           <Model url="/models/2table1/2table1.gltf" id="2table1" />
//           <Model url="/models/2table2/2table2.gltf" id="2table2" />
//           <Model url="/models/2table3/2table3.gltf" id="2table3" />
//           <Model url="/models/4table/4table.gltf" id="4table" />
//           <Model url="/models/4table1/4table1.gltf" id="4table1" />
//           <Model url="/models/stool/stool.gltf" id="stool" />
//           <Model url="/models/stool1/stool1.gltf" id="stool1" />
//           <Model url="/models/stool2/stool2.gltf" id="stool2" />
//           <Model url="/models/stool3/stool3.gltf" id="stool3" />

          
//         </Suspense>
//         <CameraPositions currentPositionIndex={currentPositionIndex} />
//       </Canvas>
//       <CameraPositionButtons
//         onPositionChange={handlePositionChange}
//         availableSeats={availableSeats}
//         onSeatSelect={onSeatSelect}
//         currentPositionIndex={currentPositionIndex}
//       />
//       <Crosshair />
//     </div>
//   );
// };

// // Export with dynamic import to prevent SSR issues
// export default dynamic(() => Promise.resolve(RestaurantModel), {
//   ssr: false
// });

import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, useProgress, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import dynamic from 'next/dynamic';
import { ContactShadows, Environment, AdaptiveDpr, AdaptiveEvents, BakeShadows } from '@react-three/drei';
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

// Crosshair Component
const Crosshair: React.FC = () => (
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

// Model Chunk Component
interface ModelChunkProps {
  models: ModelProps[];
}

const ModelChunk: React.FC<ModelChunkProps> = ({ models }) => {
  return (
    <>
      {models.map((model, index) => (
        <Model key={index} {...model} />
      ))}
    </>
  );
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
    { url: '/models/base/base.gltf' },
    { url: '/models/roof/roof.gltf' },
    { url: '/models/stage/stage.gltf' },
    { url: "/models/counter/counter.gltf" },
    { url: "/models/art/art.gltf" }
  ];

  const furnitureModels = [
    { url: '/models/couch/couch.gltf', id: 'couch' },
    { url: "/models/2table/2table.gltf", id: "2table" },
    { url: "/models/2table1/2table1.gltf", id: "2table1" },
    { url: "/models/2table2/2table2.gltf", id: "2table2" },
    { url: "/models/2table3/2table3.gltf", id: "2table3" },
    { url: "/models/4table/4table.gltf", id: "4table" },
    { url: "/models/4table1/4table1.gltf", id: "4table1" },
    { url: "/models/stool/stool.gltf", id: "stool" },
    { url: "/models/stool1/stool1.gltf", id: "stool1" },
    { url: "/models/stool2/stool2.gltf", id: "stool2" },
    { url: "/models/stool3/stool3.gltf", id: "stool3" },
  ];

  return (
    <div className="w-full h-screen">
      {isLoading && <LoadingScreen />}
      <Canvas
        shadows
        dpr={[1, deviceType === 'mobile' ? 1.5 : 2]}
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: [0, 0.7, 0]
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding
        }}
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />
        
        <Suspense fallback={null}>
          <Preload all />
          <PreloadScene deviceType={deviceType} />

          <Suspense fallback={null}>
            <ModelChunk models={baseModels} />
          </Suspense>
          
          <Suspense fallback={null}>
            <ModelChunk models={furnitureModels} />
          </Suspense>

          <Environment preset="apartment" />
          <ContactShadows
            opacity={0.2}
            scale={deviceType === 'mobile' ? 5 : 10}
            blur={1}
            far={5}
            resolution={64}
            color="#000000"
          />
          
          {deviceType === 'desktop' && (
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

export default dynamic(() => Promise.resolve(RestaurantModel), { ssr: false });