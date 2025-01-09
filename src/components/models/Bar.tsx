// // components/restaurant/models/Bar.tsx
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

// const Bar: React.FC<ModelProps> = ({ onLoad }) => {
//   const gltf = useGLTF('/models/bar/untitled.gltf') as unknown as GLTFResult;

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

//   return <primitive object={gltf.scene} position={[5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />;
// };

// export default Bar;
// useGLTF.preload('/models/bar/untitled.gltf');