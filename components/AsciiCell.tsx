'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createAsciiScene, AsciiSceneInstance } from '@/lib/ascii-scene';

export interface AsciiCellProps {
  modelUrl: string;
  charset?: string;
  resolution?: number;
  color?: string;
  autoRotate?: boolean;
  animationSpeed?: number;
  title: string;
  description: string;
  span?: 'half' | 'full';
}

export default function AsciiCell({
  modelUrl,
  charset,
  resolution,
  color,
  autoRotate,
  animationSpeed,
  title,
  description,
  span = 'half',
}: AsciiCellProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<AsciiSceneInstance | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const initScene = useCallback(() => {
    if (!containerRef.current || sceneRef.current) return;

    const instance = createAsciiScene({
      modelUrl,
      charset,
      resolution,
      color,
      autoRotate,
      animationSpeed,
    });

    sceneRef.current = instance;
    instance.mount(containerRef.current);

    // IntersectionObserver for visibility-based pause/resume
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            instance.resume();
          } else {
            instance.pause();
          }
        });
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(containerRef.current);

    // ResizeObserver for responsive sizing
    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          instance.resize(Math.floor(width), Math.floor(height));
        }
      }
    });
    resizeObserverRef.current.observe(containerRef.current);
  }, [modelUrl, charset, resolution, color, autoRotate, animationSpeed]);

  useEffect(() => {
    initScene();

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (sceneRef.current) {
        sceneRef.current.unmount();
        sceneRef.current = null;
      }
    };
  }, [initScene]);

  return (
    <div
      className={`relative border border-[#1a1a1a] bg-[#000000] overflow-hidden transition-[border-color] duration-200 hover:border-[#333333] ${
        span === 'full' ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
      style={{ minHeight: span === 'full' ? '400px' : '350px' }}
    >
      {/* ASCII render container */}
      <div
        ref={containerRef}
        className="ascii-container absolute inset-0 opacity-0 transition-opacity duration-500"
      />

      {/* Text overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-[13px] font-bold text-white mb-1">{title}</h3>
        <p className="text-[11px]" style={{ color: '#888888' }}>
          {description}
        </p>
      </div>
    </div>
  );
}
