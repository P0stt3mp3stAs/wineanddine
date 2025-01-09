// 'use client';

// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
// import { Group } from 'three';
// import * as THREE from 'three';

// // Define proper types for the GLTF result
// interface ModelProps {
//   path: string;
//   position: [number, number, number];
//   rotation?: [number, number, number];
// }

// // Helper type for dynamic materials and nodes
// type GenericObject = { [key: string]: any };

// interface GLTFResult {
//   nodes: GenericObject;
//   materials: GenericObject;
//   scene: THREE.Group;
//   scenes: THREE.Group[];
//   animations: THREE.AnimationClip[];
//   asset: { version: string };
// }

// const Model: React.FC<ModelProps> = ({ path, position, rotation = [0, 0, 0] }) => {
//   const gltf = useGLTF(path) as unknown as GLTFResult;
//   return <primitive object={gltf.scene} position={position} rotation={rotation} />;
// };

// const LoadingScreen = () => (
//   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
//     <div className="text-2xl">Loading Restaurant...</div>
//   </div>
// );

// const Restaurant3D: React.FC = () => {
//   return (
//     <div className="w-full h-screen">
//       <Suspense fallback={<LoadingScreen />}>
//         <Canvas shadows>
//           {/* Camera Setup */}
//           <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          
//           {/* Lighting */}
//           <ambientLight intensity={0.5} />
//           <directionalLight
//             position={[10, 10, 5]}
//             intensity={1}
//             castShadow
//             shadow-mapSize-width={1024}
//             shadow-mapSize-height={1024}
//           />
          
//           {/* Environment */}
//           <Environment preset="lobby" />
          
//           {/* Restaurant Models */}
//           <group>
//             {/* Base */}
//             <Model 
//               path="/models/base/untitled.gltf" 
//               position={[0, 0, 0]} 
//             />
            
//             {/* Bar */}
//             <Model 
//               path="/models/bar/untitled.gltf" 
//               position={[5, 0, 0]} 
//               rotation={[0, Math.PI / 2, 0]}
//             />
            
//             {/* Stage */}
//             <Model 
//               path="/models/stage/untitled.gltf" 
//               position={[-5, 0, -5]} 
//             />
            
//             {/* Tables Section 1 */}
//             <Model 
//               path="/models/tables/tables1/untitled 3.gltf" 
//               position={[0, 0, 5]} 
//             />
            
//             {/* Tables Section 2 */}
//             <Model 
//               path="/models/tables/tables2/untitled 2.gltf" 
//               position={[-5, 0, 5]} 
//             />
            
//             {/* Walls */}
//             <Model 
//               path="/models/tables/walls/untitled 2.gltf" 
//               position={[0, 0, 0]} 
//             />
            
//             {/* VIP Section */}
//             <Model 
//               path="/models/vip/untitled.gltf" 
//               position={[7, 0, -5]} 
//               rotation={[0, -Math.PI / 4, 0]}
//             />
//           </group>

//           {/* Controls */}
//           <OrbitControls 
//             enableDamping 
//             dampingFactor={0.05} 
//             minDistance={5}
//             maxDistance={30}
//             maxPolarAngle={Math.PI / 2}
//           />
//         </Canvas>
//       </Suspense>
//     </div>
//   );
// };

// // Preload all models
// const modelPaths = [
//   '/models/base/untitled.gltf',
//   '/models/bar/untitled.gltf',
//   '/models/stage/untitled.gltf',
//   '/models/tables/tables1/untitled 3.gltf',
//   '/models/tables/tables2/untitled 2.gltf',
//   '/models/tables/walls/untitled 2.gltf',
//   '/models/vip/untitled.gltf'
// ];

// modelPaths.forEach(path => useGLTF.preload(path));

// export default Restaurant3D;