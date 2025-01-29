import React, { useState, useCallback } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    setDragging(true);
  }, []);

  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!dragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = -(clientY - rect.top - rect.height / 2) / (rect.height / 2);

    setPosition({ x, y });
    onMove(x, y);
  }, [dragging, onMove]);

  const handleEnd = useCallback(() => {
    setDragging(false);
    setPosition({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        touchAction: 'none'
      }}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div 
        style={{
          position: 'absolute',
          top: `${50 + position.y * 50}%`,
          left: `${50 + position.x * 50}%`,
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
};

export default Joystick;