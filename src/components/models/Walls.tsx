// // components/restaurant/models/Walls.tsx
// import React, { useEffect } from 'react';
// import { useGLTF } from '@react-three/drei';
// import * as THREE from 'three';

// interface ModelProps {
//   onLoad?: () => void;
// }

// interface GLTFResult {
//   nodes: Record<string, any>;
//   materials: Record<string, any>;
//   scene: THREE.Group;
// }

// const Walls: React.FC<ModelProps> = ({ onLoad }) => {
//   const gltf = useGLTF('/models/tables/walls/untitled 2.gltf') as unknown as GLTFResult;

//   useEffect(() => {
//     gltf.scene.traverse((child) => {
//       if (child instanceof THREE.Mesh) {
//         child.geometry.computeVertexNormals();
//         if (child.material) {
//           child.material.dispose();
//         }
//       }
//     });
//     onLoad?.();
//   }, [gltf, onLoad]);

//   return <primitive object={gltf.scene} position={[0, 0, 0]} />;
// };

// export default Walls;
// useGLTF.preload('/models/tables/walls/untitled 2.gltf');