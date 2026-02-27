'use client';

import dynamic from 'next/dynamic';

const AsciiCell = dynamic(() => import('./AsciiCell'), { ssr: false });

const cells = [
  {
    modelUrl: 'LeePerrySmith/LeePerrySmith.glb',
    title: 'Perception',
    description: 'Machine vision trained on the human point of view.',
    charset: ' .:-+*=%@#',
    resolution: 0.15,
    color: '#00ffff',
    autoRotate: true,
    span: 'half' as const,
  },
  {
    modelUrl: 'Soldier.glb',
    title: 'Field Intelligence',
    description: 'Autonomous awareness for high-stakes environments.',
    charset: ' .:-+*=%@#',
    resolution: 0.14,
    color: '#ffffff',
    autoRotate: false,
    animationSpeed: 1,
    span: 'half' as const,
  },
  {
    modelUrl: 'RobotExpressive/RobotExpressive.glb',
    title: 'Embodied Systems',
    description: 'Where software meets the physical world.',
    charset: ' ░▒▓█',
    resolution: 0.15,
    color: '#88ccff',
    autoRotate: false,
    animationSpeed: 0.5,
    span: 'half' as const,
  },
  {
    modelUrl: 'Horse.glb',
    title: 'Motion Analysis',
    description: 'Understanding movement at every frame.',
    charset: ' .:-+*=%@#',
    resolution: 0.13,
    color: '#88ffcc',
    autoRotate: false,
    animationSpeed: 1,
    span: 'half' as const,
  },
  {
    modelUrl: 'Flamingo.glb',
    title: 'We see what you see.',
    description: '',
    charset: ' .:-+*=%@#',
    resolution: 0.12,
    color: '#00ffff',
    autoRotate: true,
    animationSpeed: 0.8,
    span: 'full' as const,
  },
];

export default function Grid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {cells.map((cell, i) => (
        <AsciiCell
          key={i}
          modelUrl={cell.modelUrl}
          title={cell.title}
          description={cell.description}
          charset={cell.charset}
          resolution={cell.resolution}
          color={cell.color}
          autoRotate={cell.autoRotate}
          animationSpeed={cell.animationSpeed}
          span={cell.span}
        />
      ))}
    </div>
  );
}
