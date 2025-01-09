// // components/restaurant/LoadingScreen.tsx
// import React from 'react';

// interface LoadingScreenProps {
//   progress: Record<string, boolean>;
// }

// const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
//   const loadedCount = Object.values(progress).filter(Boolean).length;
//   const totalModels = Object.keys(progress).length;
//   const percentage = Math.round((loadedCount / totalModels) * 100);

//   return (
//     <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-75">
//       <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
//         <div 
//           className="h-full bg-white transition-all duration-300 ease-out"
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//       <p className="mt-4 text-white text-lg">
//         Loading Restaurant ({percentage}%)
//       </p>
//     </div>
//   );
// };

// export default LoadingScreen;