import { useState, useEffect, useRef } from "react";

export function useResponsiveCourt({
  sceneWidth,
  sceneHeight,
  maxWidth,
}: {
  sceneWidth: number;
  sceneHeight: number;
  maxWidth?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });

  const updateSize = () => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calcul du scale qui remplit la div sans déformer
    const scale = Math.min(
      containerWidth / sceneWidth,
      containerHeight / sceneHeight
    );

    setStageSize({
      width: containerWidth,
      height: containerHeight,
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
