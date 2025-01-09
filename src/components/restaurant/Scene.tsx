// // components/restaurant/Scene.tsx
// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
// import dynamic from 'next/dynamic';
// import LoadingScreen from './LoadingScreen';

// // Dynamic imports with loading priority
// const modelComponents = [
//   {
//     Component: dynamic(() => import('./models/Walls'), { ssr: false }),
//     priority: 1
//   },
//   {
//     Component: dynamic(() => import('./models/Base'), { ssr: false }),
//     priority: 2
//   },
//   {
//     Component: dynamic(() => import('./models/Bar'), { ssr: false }),
//     priority: 3
//   },
//   {
//     Component: dynamic(() => import('./models/Stage'), { ssr: false }),
//     priority: 4
//   },
//   {
//     Component: dynamic(() => import('./models/Tables1'), { ssr: false }),
//     priority: 5
//   },
//   {
//     Component: dynamic(() => import('./models/Tables2'), { ssr: false }),
//     priority: 6
//   },
//   {
//     Component: dynamic(() => import('./models/VIP'), { ssr: false }),
//     priority: 7
//   }
// ].sort((a, b) => a.priority - b.priority);

// const Scene: React.FC = () => {
//   const [loadedModels, setLoadedModels] = useState<Record<string, boolean>>({});

//   const updateLoadingProgress = (modelName: string) => {
//     setLoadedModels(prev => ({
//       ...prev,
//       [modelName]: true
//     }));
//   };

//   const loadingProgress = 
//     (Object.values(loadedModels).filter(Boolean).length / modelComponents.length) * 100;

//   return (
//     <div className="w-full h-screen">
//       {loadingProgress < 100 && <LoadingScreen progress={loadingProgress} />}
      
//       <Canvas shadows camera={{ position: [10, 10, 10], fov: 75 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
//         <Environment preset="lobby" />
        
//         <Suspense fallback={null}>
//           {modelComponents.map(({ Component }, index) => (
//             <Component 
//               key={index}
//               onLoad={() => updateLoadingProgress(`model_${index}`)}
//             />
//           ))}
//         </Suspense>

//         <OrbitControls 
//           enableDamping 
//           dampingFactor={0.05} 
//           minDistance={5}
//           maxDistance={30}
//         />
//       </Canvas>
//     </div>
//   );
// };

// export default Scene;