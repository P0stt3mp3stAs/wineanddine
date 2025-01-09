'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Define the props for the model
interface ModelProps {
  url: string;
  scale?: number;
}

// Component to load and render the GLTF model
function Model({ url, scale = 0.1 }: ModelProps) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} scale={scale} />;
}

// Main 3D Viewer Component
export default function ModelViewer() {
  // Preload all models
  useEffect(() => {
    const modelUrls = [
      '/models/base/base.gltf',
      '/models/art/art.gltf',
      '/models/couch/couch.gltf',
      '/models/2table/2table.gltf',
      '/models/4table/4table.gltf',
      '/models/stool/stool.gltf',
      '/models/counter/counter.gltf',
      '/models/stage/stage.gltf'
    ];

    modelUrls.forEach(url => useGLTF.preload(url));
  }, []);

  return (
    <div className="w-full h-screen">
      <Canvas 
        camera={{ 
          position: [0, 2, 10], 
          fov: 45 
        }}
        className="bg-gray-100"
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
        />

        {/* Camera Controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />

        {/* Model Loading */}
        <Suspense fallback={null}>
          <Model url="/models/base/base.gltf"/>
          
          <Model url="/models/art/art.gltf"/>
          
          <Model url="/models/couch/couch.gltf"/>

          <Model url="/models/2table/2table.gltf"/>

          <Model url="/models/4table/4table.gltf"/>
          
          <Model url="/models/stool/stool.gltf"/>

          <Model url="/models/counter/counter.gltf"/>

          <Model url="/models/stage/stage.gltf"/>
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload models to improve performance
useGLTF.preload('/models/base/base.gltf');
useGLTF.preload('/models/art/art.gltf');
useGLTF.preload('/models/couch/couch.gltf');
useGLTF.preload('/models/2table/2table.gltf');
useGLTF.preload('/models/4table/4table.gltf');
useGLTF.preload('/models/stool/stool.gltf');
useGLTF.preload('/models/counter/counter.gltf');
useGLTF.preload('/models/stage/stage.gltf');