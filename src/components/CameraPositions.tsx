import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

// Define camera positions
export const cameraPositions: { name: string; position: [number, number, number]; rotation: [number, number, number]; seatId: string }[] = [
  // { name: "from stage", position: [-1.6, 0.6, 1.6], rotation: [0, -0.85, 0] },
  { name: "Couch", position: [0.3, 0.8, -0.3], rotation: [-0.4, -0.85, -0.3], seatId: "couch" },
  { name: "2Table", position: [-1.9, 0.5, -0.3], rotation: [0.3, 3.5, 0.2], seatId: "2table" },
  { name: "2Table1", position: [-1.8, 0.5, -2.1], rotation: [0.2, 3.5, 0.1], seatId: "2table1" },
  { name: "2Table2", position: [-0.2, 0.5, 2.2], rotation: [-0.2, 0, 0], seatId: "2table2" },
  { name: "2Table3", position: [1, 0.5, 2.1], rotation: [-0.2, 0.5, 0.1], seatId: "2table3" },
  { name: "4Table", position: [-0.5, 0.5, -2.1], rotation: [0.2, 3, 0], seatId: "4table" },
  { name: "4Table1", position: [-1.8, 0.5, -1.4], rotation: [0.2, 3.5, 0.1], seatId: "4table1" },
  { name: "Stool", position: [0.6, 0.5, 1.15], rotation: [-1.5, -1.3, -1.5], seatId: "stool" },
  { name: "Stool1", position: [0.6, 0.5, 0.825], rotation: [-1.5, -1.3, -1.5], seatId: "stool1" },
  { name: "Stool2", position: [0.6, 0.5, 0.485], rotation: [-1.5, -1.3, -1.5], seatId: "stool2" },
  { name: "Stool3", position: [0.6, 0.5, 0.143], rotation: [-1.5, -1.3, -1.5], seatId: "stool3" },
];

interface CameraPositionsProps {
  currentPositionIndex: number;
}

const CameraPositions: React.FC<CameraPositionsProps> = ({ currentPositionIndex }) => {
  const { camera } = useThree();
  const animationRef = useRef<{
    startTime: number;
    startPosition: THREE.Vector3;
    startRotation: THREE.Euler;
    endPosition: THREE.Vector3;
    endRotation: THREE.Euler;
  } | null>(null);

  useEffect(() => {
    const currentPosition = cameraPositions[currentPositionIndex];
    const endPosition = new THREE.Vector3(...currentPosition.position);
    const endRotation = new THREE.Euler(...currentPosition.rotation);

    animationRef.current = {
      startTime: Date.now(),
      startPosition: camera.position.clone(),
      startRotation: camera.rotation.clone(),
      endPosition,
      endRotation,
    };
  }, [currentPositionIndex, camera]);

  useFrame(() => {
    if (animationRef.current) {
      const { startTime, startPosition, startRotation, endPosition, endRotation } = animationRef.current;
      const duration = 1000; // Animation duration in milliseconds
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-in-out)
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      // Interpolate position
      camera.position.lerpVectors(startPosition, endPosition, easeProgress);

      // Interpolate rotation
      const interpolatedRotation = new THREE.Euler(
        THREE.MathUtils.lerp(startRotation.x, endRotation.x, easeProgress),
        THREE.MathUtils.lerp(startRotation.y, endRotation.y, easeProgress),
        THREE.MathUtils.lerp(startRotation.z, endRotation.z, easeProgress)
      );
      camera.rotation.copy(interpolatedRotation);

      if (progress === 1) {
        animationRef.current = null;
      }
    }
  });

  return null;
};

export default CameraPositions;

// 1.575
// 3.1418