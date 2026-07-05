import React, { useMemo } from 'react';
import './NatureBackground.css';

export const NatureBackground: React.FC = () => {
  const orbs = useMemo(() => [
    { id: 'orb-1', left: '15%', top: '30%', size: '25vw', color: 'rgba(52, 211, 153, 0.04)', duration: '25s', delay: '0s' },
    { id: 'orb-2', left: '70%', top: '15%', size: '20vw', color: 'rgba(99, 102, 241, 0.03)', duration: '30s', delay: '5s' },
    { id: 'orb-3', left: '50%', top: '70%', size: '22vw', color: 'rgba(14, 165, 233, 0.03)', duration: '28s', delay: '10s' },
  ], []);

  const leaves = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => ({
      id: `leaf-${i}`,
      left: `${15 + i * 18}vw`,
      animationDuration: `${12 + i * 3}s`,
      animationDelay: `${i * 4}s`,
    }));
  }, []);

  return (
    <div className="nature-bg-container" aria-hidden="true">
      {/* Ambient glow orbs */}
      {orbs.map(orb => (
        <div
          key={orb.id}
          className="ambient-orb"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            background: orb.color,
            animationDuration: orb.duration,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Sparse falling leaves */}
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            left: leaf.left,
            animationDuration: leaf.animationDuration,
            animationDelay: leaf.animationDelay,
          }}
        />
      ))}
    </div>
  );
};
