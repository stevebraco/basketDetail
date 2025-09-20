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

    // Largeur disponible
    let containerWidth = containerRef.current.offsetWidth;
    if (maxWidth && containerWidth > maxWidth) {
      containerWidth = maxWidth;
    }

    // 👉 On garde les proportions d’origine
    const computedScale = containerWidth / sceneWidth;

    setStageSize({
      width: sceneWidth * computedScale,
      height: sceneHeight * computedScale,
      scale: computedScale,
    });
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return { containerRef, stageSize };
}
