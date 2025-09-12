import { useState, useEffect, useRef } from "react";

export function useResponsiveCourt({
  sceneWidth,
  sceneHeight,
  maxWidth,
  scale = 1,
}: {
  sceneWidth: number;
  sceneHeight: number;
  maxWidth?: number;
  scale?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });

  // const updateSize = () => {
  //   if (!containerRef.current) return;
  //   let containerWidth = containerRef.current.offsetWidth;

  //   if (maxWidth && containerWidth > maxWidth) {
  //     containerWidth = maxWidth;
  //   }

  //   // const computedScale = (containerWidth / sceneWidth) * scale;

  //   const scaleX = containerWidth / sceneWidth;
  //   const scaleY = containerRef.current.offsetHeight / sceneHeight;

  //   // Contain
  //   const computedScale = Math.min(scaleX, scaleY) * scale;

  //   setStageSize({
  //     width: sceneWidth * scale,
  //     height: sceneHeight * scale,
  //     scale: computedScale,
  //   });
  // };

  const updateSize = () => {
    if (!containerRef.current) return;

    let containerWidth = containerRef.current.offsetWidth;
    let containerHeight = containerRef.current.offsetHeight;

    if (maxWidth && containerWidth > maxWidth) {
      containerWidth = maxWidth;
    }

    const scaleX = containerWidth / sceneWidth;
    const scaleY = containerHeight / sceneHeight;

    // Responsive, mais jamais > 1
    const computedScale = Math.min(1, Math.min(scaleX, scaleY) * 1);

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
