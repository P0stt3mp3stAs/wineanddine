import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useGLTF, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import dynamic from 'next/dynamic';
import { BlendFunction } from 'postprocessing';
import { ContactShadows, Environment } from '@react-three/drei';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

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

// FirstPersonController component
const FirstPersonController = () => {
  const { camera, scene, gl } = useThree();
  const controlsRef = useRef<PointerLockControls | null>(null);
  const playerHitboxRef = useRef<THREE.Mesh>();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, running: false });
  const velocity = useRef(new THREE.Vector3());

  const moveSpeed = 0.1;
  const runningMultiplier = 2;

  useEffect(() => {
    const controls = new PointerLockControls(camera, gl.domElement);
    controlsRef.current = controls;

    const handleLock = () => {
      console.log('PointerLock activated');
    };

    const handleUnlock = () => {
      console.log('PointerLock deactivated');
    };

    controls.addEventListener('lock', handleLock);
    controls.addEventListener('unlock', handleUnlock);

    return () => {
      controls.removeEventListener('lock', handleLock);
      controls.removeEventListener('unlock', handleUnlock);
      controls.dispose();
    };
  }, [camera, gl]);

  useEffect(() => {
    const handleClick = () => {
      controlsRef.current?.lock();
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    // Create player hitbox
    const playerHitboxGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
    const playerHitboxMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      opacity: 0.5,
      transparent: true
    });
    const playerHitbox = new THREE.Mesh(playerHitboxGeometry, playerHitboxMaterial);
    playerHitbox.position.y = 0.9;
    scene.add(playerHitbox);
    playerHitboxRef.current = playerHitbox;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'ShiftLeft': moveState.current.running = true; break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'ShiftLeft': moveState.current.running = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [scene]);

  useFrame(() => {
    if (!controlsRef.current?.isLocked) return;

    const currentSpeed = moveState.current.running ? moveSpeed * runningMultiplier : moveSpeed;

    // Get camera's direction vectors
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // Get forward direction (excluding y component for ground movement)
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    // Get right direction by crossing forward with up vector
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    // Calculate movement vector based on camera orientation
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    if (moveState.current.forward) moveVector.add(forward.multiplyScalar(currentSpeed));
    if (moveState.current.backward) moveVector.add(forward.multiplyScalar(-currentSpeed));
    if (moveState.current.right) moveVector.add(right.multiplyScalar(currentSpeed));
    if (moveState.current.left) moveVector.add(right.multiplyScalar(-currentSpeed));

    // Check collisions
    const newPosition = camera.position.clone().add(moveVector);
    playerHitboxRef.current!.position.copy(newPosition);
    playerHitboxRef.current!.position.y = 0.9;

    let collision = false;

    // Check collision with object hitboxes
    scene.traverse((object) => {
      if (object.userData.isHitbox && object !== playerHitboxRef.current) {
        const objectBoundingBox = new THREE.Box3().setFromObject(object);
        const playerBoundingBox = new THREE.Box3().setFromObject(playerHitboxRef.current!);
        if (object.userData.isBaseHitbox) {
          if (!objectBoundingBox.containsPoint(newPosition)) {
            collision = true;
          }
        } else if (objectBoundingBox.intersectsBox(playerBoundingBox)) {
          collision = true;
        }
      }
    });

    // Check if player is within base boundaries
    const baseBoundaries = {
      minX: -10, maxX: 10,
      minZ: -10, maxZ: 10
    };
    if (
      newPosition.x < baseBoundaries.minX || newPosition.x > baseBoundaries.maxX ||
      newPosition.z < baseBoundaries.minZ || newPosition.z > baseBoundaries.maxZ
    ) {
      collision = true;
    }

    // Apply movement if no collision
    if (!collision) {
      camera.position.add(moveVector);
      playerHitboxRef.current!.position.copy(camera.position);
      playerHitboxRef.current!.position.y = 0.9;
    }
  });

  return null;
};

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

const LoadingScreen = () => {
  const { progress, loaded, total } = useProgress();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 text-white">
          Loading Models: {Math.round(progress)}%
          <br />
          <span className="text-sm text-gray-400">
            ({loaded}/{total} assets loaded)
          </span>
        </div>
      </div>
    </div>
  );
};

// Main ModelViewer component
const ModelViewer: React.FC<ModelViewerProps> = ({ 
  availableSeats = [], 
  onSeatSelect, 
  onLoadingChange 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const { active } = useProgress();

  useEffect(() => {
    setIsLoading(active);
    if (onLoadingChange) {
      onLoadingChange(active);
    }
  }, [active, onLoadingChange]);

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
            worldDistanceThreshold={0.5} // Add this
            worldDistanceFalloff={0.1}   // Add this
            worldProximityThreshold={6}  // Add this
            worldProximityFalloff={1}    // Add this
          />
            <Bloom 
              intensity={0.1}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.025}
            />
          </EffectComposer>
          
          {/* Base models */}
          <Model 
            url="/models/base/base.gltf" 
            // hitboxDimensions={{ width: 4.23, height: 1.4, depth: 4.3, offsetZ: 0.025, offsetX: 0, offsetY: 0.65 }}
            hitboxDimensions={{
              width: 4.23,
              height: 1.8,
              depth: 4.3,
              offsetX: 0,
              offsetY: 0.65,
              offsetZ: 0.025
            }}
            isBase={true}
          />

          <Model 
            url="/models/stage/stage.gltf" 
            hitboxDimensions={{ width: 1, height: 1, depth: 0.95, offsetZ: 1.5, offsetX: -1.5, offsetY: 0.5 }}
          />

          <Model 
            url="/models/counter/counter.gltf" 
            hitboxDimensions={{ width: 0.5, height: 1, depth: 1.3, offsetZ: 0.65, offsetX: 1.5, offsetY: 0.5 }}
          />
          
                    {/* Interactive models */}
          <Model 
            url="/models/couch/couch.gltf" 
            id="couch" 
            isAvailable={availableSeats.includes('couch')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 1, height: 1, depth: 1.5, offsetZ: -1.2, offsetX: 1.3, offsetY: 0.5 }}
          />
          <Model 
            url="/models/2table/2table.gltf" 
            id="2table"
            isAvailable={availableSeats.includes('2table')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.3, height: 1, depth: 0.5, offsetZ: 0.3, offsetX: -1.5, offsetY: 0.5 }}
          />
          <Model 
            url="/models/2table1/2table1.gltf" 
            id="2table1"
            isAvailable={availableSeats.includes('2table1')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.3, height: 1, depth: 0.5, offsetZ: -1.65, offsetX: -1.5, offsetY: 0.5 }}
          />
          <Model 
            url="/models/2table2/2table2.gltf" 
            id="2table2"
            isAvailable={availableSeats.includes('2table2')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.5, height: 1, depth: 0.3, offsetZ: 1.7, offsetX: -0.2, offsetY: 0.5 }}
          />
          <Model 
            url="/models/2table3/2table3.gltf" 
            id="2table3"
            isAvailable={availableSeats.includes('2table3')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.5, height: 1, depth: 0.3, offsetZ: 1.7, offsetX: 0.8, offsetY: 0.5 }}
          />
          <Model 
            url="/models/4table/4table.gltf" 
            id="4table"
            isAvailable={availableSeats.includes('4table')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.5, height: 1, depth: 0.5, offsetZ: -1.65, offsetX: -0.6, offsetY: 0.5 }}
          />
          <Model 
            url="/models/4table1/4table1.gltf" 
            id="4table1"
            isAvailable={availableSeats.includes('4table1')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.5, height: 1, depth: 0.5, offsetZ: -0.75, offsetX: -1.5, offsetY: 0.5 }}
          />
          <Model 
            url="/models/stool/stool.gltf" 
            id="stool"
            isAvailable={availableSeats.includes('stool')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.2, height: 1, depth: 0.2, offsetZ: 1.15, offsetX: 1.25, offsetY: 0.5 }}
          />
          <Model 
            url="/models/stool1/stool1.gltf" 
            id="stool1"
            isAvailable={availableSeats.includes('stool1')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.2, height: 1, depth: 0.2, offsetZ: 0.825, offsetX: 1.25, offsetY: 0.5 }}
          />
          <Model 
            url="/models/stool2/stool2.gltf" 
            id="stool2"
            isAvailable={availableSeats.includes('stool2')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.2, height: 1, depth: 0.2, offsetZ: 0.475, offsetX: 1.25, offsetY: 0.5 }}
          />
          <Model 
            url="/models/stool3/stool3.gltf" 
            id="stool3"
            isAvailable={availableSeats.includes('stool3')}
            onSelect={onSeatSelect}
            hitboxDimensions={{ width: 0.2, height: 1, depth: 0.2, offsetZ: 0.15, offsetX: 1.25, offsetY: 0.5 }}
          />
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