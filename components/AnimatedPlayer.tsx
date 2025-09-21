import { Circle } from "react-konva";
import { useEffect } from "react";
import { useMotionPosition } from "@/hooks/useMotion";

interface PlayerProps {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  radius: number;
  color: string;
  draggable?: boolean;
  onDragMove?: (e: any) => void;
}

export function AnimatedPlayer({
  startX,
  startY,
  targetX,
  targetY,
  radius,
  color,
  draggable = false,
  onDragMove,
}: PlayerProps) {
  const { position, moveTo } = useMotionPosition(startX, startY);

  useEffect(() => {
    moveTo(targetX, targetY);
  }, [targetX, targetY, moveTo]);

  return (
    <Circle
      x={position.x}
      y={position.y}
      radius={radius}
      fill={color}
      draggable={draggable}
      onDragMove={onDragMove}
    />
  );
}
