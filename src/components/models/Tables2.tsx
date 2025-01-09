// // components/restaurant/models/Tables2.tsx
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

// const Tables2: React.FC<ModelProps> = ({ onLoad }) => {
//   const gltf = useGLTF('/models/tables/tables2/untitled 2.gltf') as unknown as GLTFResult;

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

//   return <primitive object={gltf.scene} position={[-5, 0, 5]} />;
// };

// export default Tables2;
// useGLTF.preload('/models/tables/tables2/untitled 2.gltf');