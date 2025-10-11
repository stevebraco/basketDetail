import { useState, useEffect, useRef } from "react";

interface UseResponsiveCourtProps {
  sceneWidth: number;
  sceneHeight: number;
}

export function useResponsiveCourt({
  sceneWidth,
  sceneHeight,
}: UseResponsiveCourtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });

  const updateSize = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const scale = containerWidth / sceneWidth;

    setStageSize({
      width: sceneWidth * scale,
      height: sceneHeight * scale,
      scale,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { containerRef, stageSize };
}
