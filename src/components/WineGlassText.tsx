import React from 'react';

const WineAnimation = () => {
  return (
    <div className="flex items-center justify-center mb-10">
      <div className="relative h-64 w-64 mx-auto border-b-4 border-neutral-400 rounded-b-lg">
        {/* Plate shadow */}
        <div className="absolute -bottom-3 left-6 w-52 h-1 bg-neutral-300 rounded-b-md"></div>
        
        {/* Bottle */}
        <div className="absolute w-12 bottom-0 left-24 z-10">
          {/* Cork */}
          <div className="relative mx-auto bg-red-800 w-5 h-10 rounded-t border-b-2 border-yellow-400">
            <div className="absolute top-1 -left-0.5 bg-red-900 border-t border-b border-red-700 w-6 h-2.5 rounded"></div>
          </div>
          
          {/* Neck */}
          <div className="mx-auto bg-green-800/90 w-5 h-2.5"></div>
          
          {/* Body */}
          <div className="relative mx-auto pt-8 bg-green-800/90 w-12 h-28 rounded-t-2xl rounded-b">
            {/* Label */}
            <div className="relative bg-yellow-50 h-8 border-2 border-yellow-200 z-20 animate-spin-label"></div>
            {/* Label Shadow */}
            <div className="absolute h-8 bg-black/30 top-8 z-10 animate-spin-shadow"></div>
          </div>
        </div>
        
        {/* Cork (fallen) */}
        <div className="absolute h-6 w-4 bottom-0 bg-yellow-50 border-t-2 border-red-800 animate-spin-cork"></div>
        
        {/* Glass */}
        <div className="absolute w-10 bottom-0 left-24 animate-spin-glass">
          {/* Bowl */}
          <div className="bg-neutral-300/50 pt-2.5 w-10 h-8 rounded-t rounded-b-3xl">
            {/* Wine */}
            <div className="bg-red-800 mx-auto w-8 h-6 rounded-t rounded-b-3xl"></div>
          </div>
          {/* Stem */}
          <div className="mx-auto bg-neutral-300/50 w-1 h-8"></div>
          {/* Foot */}
          <div className="bg-neutral-300/50 w-10 h-1 rounded-t-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default WineAnimation;