import React, { Suspense, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ModelGroup {
  priority: number;
  models: {
    url: string;
    id?: string;
  }[];
}

// Group models by priority
const modelGroups: ModelGroup[] = [
  {
    priority: 1,
    models: [
      { url: '/models/base/base.gltf' },
      { url: '/models/roof/roof.gltf' },
    ]
  },
  {
    priority: 2,
    models: [
      { url: '/models/stage/stage.gltf' },
      { url: '/models/counter/counter.gltf' },
    ]
  },
  {
    priority: 3,
    models: [
      { url: '/models/couch/couch.gltf', id: 'couch' },
      { url: '/models/2table/2table.gltf', id: '2table' },
      { url: '/models/2table1/2table1.gltf', id: '2table1' },
    ]
  },
  {
    priority: 4,
    models: [
      { url: '/models/2table2/2table2.gltf', id: '2table2' },
      { url: '/models/2table3/2table3.gltf', id: '2table3' },
      { url: '/models/4table/4table.gltf', id: '4table' },
    ]
  },
  {
    priority: 5,
    models: [
      { url: '/models/4table1/4table1.gltf', id: '4table1' },
      { url: '/models/stool/stool.gltf', id: 'stool' },
      { url: '/models/stool1/stool1.gltf', id: 'stool1' },
      { url: '/models/stool2/stool2.gltf', id: 'stool2' },
      { url: '/models/stool3/stool3.gltf', id: 'stool3' },
    ]
  },
];

const OptimizedModel: React.FC<{ url: string; id?: string }> = ({ url, id }) => {
  const { scene } = useGLTF(url, true);
  const clonedScene = scene.clone();

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Optimize geometries
        if (child.geometry) {
          child.geometry.dispose();
          child.geometry = child.geometry.clone();
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
        }
        // Optimize materials
        if (child.material) {
          const oldMaterial = child.material;
          child.material = new THREE.MeshStandardMaterial({
            map: oldMaterial.map,
            color: oldMaterial.color,
            metalness: 0.5,
            roughness: 0.7,
          });
          oldMaterial.dispose();
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} />;
};

const ModelGroupLoader: React.FC<{ group: ModelGroup }> = ({ group }) => {
  return (
    <>
      {group.models.map((model, index) => (
        <OptimizedModel key={index} {...model} />
      ))}
    </>
  );
};

export const ProgressiveModels: React.FC = () => {
  const [loadedGroups, setLoadedGroups] = useState<number[]>([]);

  useEffect(() => {
    const loadNextGroup = (priority: number) => {
      if (priority <= modelGroups.length) {
        setLoadedGroups(prev => [...prev, priority]);
        if (priority < modelGroups.length) {
          setTimeout(() => loadNextGroup(priority + 1), 1000);
        }
      }
    };

    loadNextGroup(1);
  }, []);

  return (
    <>
      {modelGroups.map((group, index) => (
        loadedGroups.includes(group.priority) && (
          <Suspense key={index} fallback={null}>
            <ModelGroupLoader group={group} />
          </Suspense>
        )
      ))}
    </>
  );
};