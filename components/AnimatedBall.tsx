import { Image as KonvaImage } from "react-konva";
import { useEffect } from "react";
import { useMotionPosition } from "@/hooks/useMotion";

interface BallProps {
  image: HTMLImageElement;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  size?: number;
  draggable?: boolean;
  onDragMove?: (e: any) => void;
}

export default function AnimatedBall({
  image,
  startX,
  startY,
  targetX,
  targetY,
  size = 30,
  draggable = false,
  onDragMove,
}: BallProps) {
  const { position, moveTo } = useMotionPosition(startX, startY);

  useEffect(() => {
    moveTo(targetX, targetY);
  }, [targetX, targetY, moveTo]);

  return (
    <KonvaImage
      image={image}
      x={position.x}
      y={position.y}
      width={size}
      height={size}
      draggable={draggable}
      onDragMove={onDragMove}
    />
  );
}
