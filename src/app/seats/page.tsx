'use client';

import ModelViewer from '@/components/ModelViewer';
import React from 'react';

export default function SeatsPage() {
  return (
    <main className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 text-center mt-20">
        <h1 className="text-3xl font-black">Wine and Dine Seats</h1>
      </div>
      <div>
        <ModelViewer />
      </div>
      {/* <div className="flex-grow overflow-auto">
        <div className="sketchfab-embed-wrapper p-4">
          <iframe 
            title="Generic Bar Stool" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; fullscreen; xr-spatial-tracking" 
            data-xr-spatial-tracking
            src="https://sketchfab.com/models/dc8146f54dd344928e2c395ea6f82a4e/embed"
            className="w-full h-screen"
          />
          <p className="text-xs text-gray-600 mt-2">
            <a 
              href="https://sketchfab.com/3d-models/generic-bar-stool-dc8146f54dd344928e2c395ea6f82a4e?utm_medium=embed&utm_campaign=share-popup&utm_content=dc8146f54dd344928e2c395ea6f82a4e" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Generic Bar Stool
            </a>{' '}
            by{' '}
            <a 
              href="https://sketchfab.com/wunderform.3d?utm_medium=embed&utm_campaign=share-popup&utm_content=dc8146f54dd344928e2c395ea6f82a4e" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              wunderform
            </a>{' '}
            on{' '}
            <a 
              href="https://sketchfab.com?utm_medium=embed&utm_campaign=share-popup&utm_content=dc8146f54dd344928e2c395ea6f82a4e" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 hover:underline"
            >
              Sketchfab
            </a>
          </p>
        </div>
      </div> */}
    </main>
  );
}