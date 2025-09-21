import { Arrow } from "react-konva";
import { useAnimatedPath } from "@/hooks/useAnimatedPath";

interface AnimatedArrowProps {
  path: { x: number; y: number }[];
  progress: number;
  stroke?: string;
  strokeWidth?: number;
  pointerLength?: number;
  pointerWidth?: number;
  dash?: number[];
}

export default function AnimatedArrow({
  path,
  progress,
  stroke = "yellow",
  strokeWidth = 3,
  pointerLength = 10,
  pointerWidth = 5,
  dash = [],
}: AnimatedArrowProps) {
  const animatedPoints = useAnimatedPath(path, progress);

  const pointsArray = animatedPoints.flatMap((p) => [p.x, p.y]);

  if (pointsArray.length < 4) return null;

  return (
    <Arrow
      points={pointsArray}
      stroke={stroke}
      fill={stroke}
      strokeWidth={strokeWidth}
      pointerLength={pointerLength}
      pointerWidth={pointerWidth}
      dash={dash}
    />
  );
}
