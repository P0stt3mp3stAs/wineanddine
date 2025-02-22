'use client';

import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  PointerLockControls,
  useGLTF,
  Html,
  Preload,
  useProgress
} from '@react-three/drei';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
// import { Mesh, Object3D, Material, MeshStandardMaterial } from 'three';
// import { PointerLockControls as PointerLockControlsImpl } from 'three/examples/jsm/controls/PointerLockControls';
// import { group } from 'console';

const Crosshair: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="w-4 h-4 flex items-center justify-center">
        <div className="absolute w-4 h-0.5 bg-black opacity-70"></div>
        <div className="absolute w-0.5 h-4 bg-black opacity-70"></div>
      </div>
    </div>
  );
};

interface ModelViewerProps {
  availableSeats?: string[];
  onSeatSelect?: (seatId: string) => void;
  onLoadingChange?: (loading: boolean) => void;
}

interface ModelProps {
  url: string;
  position?: [number, number, number];
  id?: string;
  isAvailable?: boolean;
  onSelect?: (id: string) => void;
}


// Loading component for individual models
function ModelLoader({ url }: { url: string }) {
  const { progress } = useProgress();
  useGLTF(url, true);
  return (
    <Html center>
      <div className="text-white text-sm">
        Loading {Math.round(progress)}%
      </div>
    </Html>
  );
}

// Enhanced First Person Controller with WASD movement
const FirstPersonController = () => {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Movement parameters
  const moveSpeed = 0.05;
  const runningMultiplier = 1.5;
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    running: false
  });

  // Smooth movement parameters
  const velocity = useRef(new THREE.Vector3());
  const acceleration = 0.08;
  const deceleration = 0.85;
  const maxVelocity = 0.2;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true;
          break;
        case 'ShiftLeft':
          moveState.current.running = true;
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false;
          break;
        case 'ShiftLeft':
          moveState.current.running = false;
          break;
      }
    };

    const handleBlur = () => {
      moveState.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        running: false
      };
      velocity.current.set(0, 0, 0);
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!(controlsRef.current as any)?.isLocked) return;

    const currentSpeed = moveState.current.running ? 
      moveSpeed * runningMultiplier : 
      moveSpeed;

    // Get camera direction
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const rotation = new THREE.Vector3();

    // Update movement based on camera direction
    camera.getWorldDirection(direction);
    frontVector.setFromMatrixColumn(camera.matrix, 0);
    sideVector.setFromMatrixColumn(camera.matrix, 0);
    rotation.set(0, 0, 0);

    // Calculate movement direction
    direction.y = 0;
    direction.normalize();

    // Apply movement
    if (moveState.current.forward) {
      camera.position.addScaledVector(direction, currentSpeed);
    }
    if (moveState.current.backward) {
      camera.position.addScaledVector(direction, -currentSpeed);
    }
    if (moveState.current.left) {
      camera.position.addScaledVector(sideVector, -currentSpeed);
    }
    if (moveState.current.right) {
      camera.position.addScaledVector(sideVector, currentSpeed);
    }
  });

  return (
    <PointerLockControls 
      ref={controlsRef as any}
      onUnlock={() => {
        const startExploring = document.getElementById('startExploring');
        if (startExploring) startExploring.style.display = 'flex';
      }}
    />
  );
};

// Enhanced Model component with loading state
function Model({ url, position, id, isAvailable, onSelect }: ModelProps) {
  const { scene } = useGLTF(url);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  
  // Create a raycaster for center screen detection
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0); // Center of screen

  useFrame(() => {
    if (meshRef.current && id && isAvailable) {
      // Update raycaster with center screen position
      raycaster.setFromCamera(center, camera);
      
      // Check for intersection with the model
      const intersects = raycaster.intersectObject(meshRef.current, true);
      
      // Update hover state based on intersection
      setHovered(intersects.length > 0);
    }
  });
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Improve material quality
          if (child.material) {
            child.material.roughness = 0.7;
            child.material.metalness = 0.3;
            child.material.envMapIntensity = 1;
            
            if (id) {
              if (isAvailable) {
                if (id.startsWith('stool')) {
                  child.material.emissive = new THREE.Color(hovered ? 0x00ff00 : 0x004400);
                  child.material.emissiveIntensity = hovered ? 0.3 : 0.1;
                } else {
                  child.material.emissive = new THREE.Color(hovered ? 0x00ff00 : 0x004400);
                  child.material.emissiveIntensity = hovered ? 0.2 : 0.1;
                }
              } else {
                child.material.emissive = new THREE.Color(0xff9999);
                child.material.emissiveIntensity = 0.1;
              }
            }
          }
        }
      });
    }
  }, [hovered, isAvailable, id]);
  
  return (
    <Suspense fallback={<ModelLoader url={url} />}>
      <group 
        position={position}
        ref={meshRef}
        onClick={() => {
        // onClick={(event) => {
          if (id && isAvailable && hovered && onSelect) {
            // event.stopPropagation();
            onSelect(id);
          }
        }}
        onPointerOver={(event) => {
          if (id && isAvailable) {
            event.stopPropagation();
            setHovered(true);
          }
        }}
        onPointerOut={(event) => {
          if (id && isAvailable) {
            event.stopPropagation();
            setHovered(false);
          }
        }}
      >
        <primitive object={scene} scale={1} />
      </group>
    </Suspense>
  );
}

// Main ModelViewer component
const ModelViewer: React.FC<ModelViewerProps> = ({ 
  availableSeats = [], 
  onSeatSelect, 
  onLoadingChange 
}) => {
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(true);
      const timeout = setTimeout(() => {
        onLoadingChange(false);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [onLoadingChange]);

  return (
    <div className="w-full h-screen">
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
          toneMappingExposure: 1,
          outputEncoding: THREE.sRGBEncoding
        }}
      >
        <Suspense fallback={null}>
          {/* Improved lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={0.5} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
          />
          <spotLight 
            position={[0, 4, 0]} 
            intensity={0.3} 
            castShadow
            angle={Math.PI / 4}
            penumbra={0.5}
          />
          <hemisphereLight 
            intensity={0.3} 
            groundColor={new THREE.Color(0x080820)}
          />

          {/* Environment and effects */}
          <Environment preset="apartment"/>
          <ContactShadows
            opacity={0.5}
            scale={10}
            blur={2}
            far={10}
            resolution={256}
            color="#000000"
          />
          
          <EffectComposer>
            <SSAO 
              radius={0.1}
              intensity={150}
              luminanceInfluence={0.5}
              color={new THREE.Color('black')}
              worldDistanceThreshold={1.0}
              worldDistanceFalloff={0.1}
              worldProximityThreshold={1.0}
              worldProximityFalloff={0.1}
            />
            <Bloom 
              intensity={0.1}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.025}
            />
          </EffectComposer>
          
          {/* Base models */}
          <Model url="/models/base/base.gltf" />

          <Model url="/models/stage/stage.gltf" />

          <Model url="/models/counter/counter.gltf" />

          <Model url="/models/art/art.gltf" />
          
          {/* Interactive models */}
          <Model 
            url="/models/couch/couch.gltf" 
            id="couch" 
            isAvailable={availableSeats.includes('couch')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table/2table.gltf" 
            id="2table"
            isAvailable={availableSeats.includes('2table')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table1/2table1.gltf" 
            id="2table1"
            isAvailable={availableSeats.includes('2table1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table2/2table2.gltf" 
            id="2table2"
            isAvailable={availableSeats.includes('2table2')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/2table3/2table3.gltf" 
            id="2table3"
            isAvailable={availableSeats.includes('2table3')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/4table/4table.gltf" 
            id="4table"
            isAvailable={availableSeats.includes('4table')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/4table1/4table1.gltf" 
            id="4table1"
            isAvailable={availableSeats.includes('4table1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool/stool.gltf" 
            id="stool"
            isAvailable={availableSeats.includes('stool')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool1/stool1.gltf" 
            id="stool1"
            isAvailable={availableSeats.includes('stool1')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool2/stool2.gltf" 
            id="stool2"
            isAvailable={availableSeats.includes('stool2')}
            onSelect={onSeatSelect}
          />
          <Model 
            url="/models/stool3/stool3.gltf" 
            id="stool3"
            isAvailable={availableSeats.includes('stool3')}
            onSelect={onSeatSelect}
          />
          {/* <Preload all /> */}
        </Suspense>
        <FirstPersonController />
      </Canvas>
      <Crosshair />
    </div>
  );
};

// Export with dynamic import to prevent SSR issues
export default dynamic(() => Promise.resolve(ModelViewer), {
  ssr: false
});