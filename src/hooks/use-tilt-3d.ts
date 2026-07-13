"use client";

import { useState, useCallback, MouseEvent } from "react";

interface Tilt3DConfig {
  maxTilt?: number;      // Max rotation in degrees (default: 10)
  scale?: number;        // Scale on hover (default: 1.03)
  speed?: number;        // Transition speed in ms (default: 400)
  glare?: boolean;       // Enable glare effect (default: true)
  reset?: boolean;       // Reset on mouse leave (default: true)
}

interface Tilt3DReturn {
  style: React.CSSProperties;
  onMouseMove: (e: MouseEvent<HTMLElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isHovered: boolean;
}

export function useTilt3D(config: Tilt3DConfig = {}): Tilt3DReturn {
  const {
    maxTilt = 10,
    scale = 1.03,
    speed = 400,
    reset = true,
  } = config;

  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = ((centerY - y) / centerY) * maxTilt;

      setTransform({ rotateX, rotateY, scale });
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    [maxTilt, scale]
  );

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (reset) {
      setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    }
    setIsHovered(false);
  }, [reset]);

  const style: React.CSSProperties = {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, ${transform.scale})`,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
    transformStyle: "preserve-3d",
    "--mouse-x": `${glarePosition.x}%`,
    "--mouse-y": `${glarePosition.y}%`,
  } as React.CSSProperties;

  return {
    style,
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    isHovered,
  };
}
