// /easytrade-ui/src/app/ui/floating-cubes.tsx
'use client';

import { useState, useEffect } from 'react';
// No separate CSS import if all styles are managed via globals.css + Tailwind
// If you had a floating-cubes.css, you'd import it: import './floating-cubes.css';

interface CubeStyle extends React.CSSProperties {
  // CSS variables to be set via inline style
  '--cube-actual-size'?: string;
  '--cube-max-opacity'?: string;
  // animationName, animationDuration, animationDelay are standard CSS properties
}

export default function FloatingCubes() {
  const [cubesData, setCubesData] = useState<Array<{ id: number; style: CubeStyle; className: string }>>([]);
  const numberOfCubes = 15; // Adjust for desired density

  useEffect(() => {
    const generatedCubes = [];
    for (let i = 0; i < numberOfCubes; i++) {
      const size = Math.random() * 80 + 20; // Cubes between 20px and 100px
      const duration = 20 + Math.random() * 20; // Animation duration 20s to 40s
      const delay = Math.random() * -duration; // Negative delay to start at different points in animation

      generatedCubes.push({
        id: i,
        className: `cube cube-color-${(i % 4) + 1}`, // Cycles cube-color-1 to cube-color-4
        style: {
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100}vh`, // Initial top position (CSS bottom: -160px will make it start from bottom)
          animationName: 'animateCubes', // Must match @keyframes name in CSS
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--cube-actual-size': `${size}px`, // CSS variable for size
          '--cube-max-opacity': (Math.random() * 0.06 + 0.02).toFixed(2), // Max opacity 0.02 to 0.08
        },
      });
    }
    setCubesData(generatedCubes);
  }, []);

  if (cubesData.length === 0) { // Avoid SSR of random styles / prevent hydration mismatch
    return null;
  }

  return (
    <div className="cubes-container" aria-hidden="true"> {/* Styled in globals.css */}
      {cubesData.map(cube => (
        <div
          key={cube.id}
          className={cube.className} // Applies .cube and .cube-color-X
          style={cube.style} // Applies JS-generated styles
        >
          {/* Simple squares, no 3D faces in this version */}
        </div>
      ))}
    </div>
  );
}
