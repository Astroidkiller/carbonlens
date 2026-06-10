import React, { useMemo } from 'react';
import './NatureBackground.css';

export const NatureBackground: React.FC = () => {
  // Generate random values for mist and leaves so they look organic
  const mistParticles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `mist-${i}`,
      left: `${Math.random() * 100}vw`,
      width: `${Math.random() * 30 + 20}vw`,
      height: `${Math.random() * 30 + 20}vw`,
      animationDuration: `${Math.random() * 15 + 15}s`,
      animationDelay: `${Math.random() * 10}s`,
    }));
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: `leaf-${i}`,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 10 + 8}s`,
      animationDelay: `${Math.random() * 15}s`,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <div className="nature-bg-container" aria-hidden="true">
      {/* Mist Particles */}
      {mistParticles.map(mist => (
        <div
          key={mist.id}
          className="mist-particle"
          style={{
            left: mist.left,
            width: mist.width,
            height: mist.height,
            animationDuration: mist.animationDuration,
            animationDelay: mist.animationDelay,
          }}
        />
      ))}

      {/* Falling Leaves */}
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            left: leaf.left,
            animationDuration: leaf.animationDuration,
            animationDelay: leaf.animationDelay,
            transform: `scale(${leaf.scale})`,
          }}
        />
      ))}

      {/* Bottom Water Waves */}
      <div className="water-wave" />
      <div className="water-wave wave-2" />
    </div>
  );
};
