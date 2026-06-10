import React from 'react';

export const NatureBackground: React.FC = () => {
  // Generate random properties for multiple falling leaves
  const leaves = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${10 + Math.random() * 15}s`,
    animationDelay: `${Math.random() * 10}s`,
    opacity: 0.2 + Math.random() * 0.4,
    size: 16 + Math.random() * 24,
  }));

  return (
    <>
      <style>{`
        @keyframes fall {
          0% {
            transform: translate(0, -10vh) rotate(0deg);
          }
          100% {
            transform: translate(20vw, 110vh) rotate(360deg);
          }
        }
        @keyframes sway {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }
        @keyframes wave {
          0% {
            background-position-x: 0;
          }
          100% {
            background-position-x: 1000px;
          }
        }
        @keyframes breathe {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        .leaf {
          position: absolute;
          top: -50px;
          will-change: transform;
          pointer-events: none;
        }
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 150px;
          overflow: hidden;
          pointer-events: none;
        }
        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2310b981' fill-opacity='0.15'/%3E%3C/svg%3E");
          background-size: 800px 100%;
          animation: wave 20s linear infinite;
        }
        .wave:nth-child(2) {
          bottom: 10px;
          opacity: 0.5;
          animation-direction: reverse;
          animation-duration: 25s;
        }
        .air-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.05) 0%, transparent 60%);
          animation: breathe 8s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      
      {/* Air Glow Effect */}
      <div className="air-glow z-0"></div>

      {/* Falling Leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {leaves.map((leaf) => (
          <div
            key={leaf.id}
            className="leaf"
            style={{
              left: leaf.left,
              animationName: 'fall, sway',
              animationDuration: `${leaf.animationDuration}, 4s`,
              animationTimingFunction: 'linear, ease-in-out',
              animationIterationCount: 'infinite, infinite',
              animationDelay: `${leaf.animationDelay}, ${leaf.animationDelay}`,
              opacity: leaf.opacity,
            }}
          >
            {/* Simple Leaf SVG */}
            <svg
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-emerald-500 drop-shadow-sm"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22ZM12 2V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Fresh Water Waves */}
      <div className="wave-container z-0">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
};
