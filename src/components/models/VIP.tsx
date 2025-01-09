// // components/restaurant/models/VIP.tsx
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

// const VIP: React.FC<ModelProps> = ({ onLoad }) => {
//   const gltf = useGLTF('/models/vip/untitled.gltf') as unknown as GLTFResult;

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

//   return <primitive object={gltf.scene} position={[7, 0, -5]} rotation={[0, -Math.PI / 4, 0]} />;
// };

// export default VIP;
// useGLTF.preload('/models/vip/untitled.gltf');