"use client";

import React, { useRef, useEffect } from "react";
import { Group, Rect, Transformer } from "react-konva";

interface TShapeProps {
  shapeProps: {
    id: number;
    x: number;
    y: number;
    rotation: number;
    used?: boolean;
  };
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const TShape: React.FC<TShapeProps> = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        ref={shapeRef}
        x={shapeProps.x}
        y={shapeProps.y}
        rotation={shapeProps.rotation}
        draggable
        onClick={() => {
          onSelect(); // sélectionne le T existant
          // ❌ Ne pas créer un nouveau T ici
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          onChange({ ...shapeProps, rotation: node.rotation() });
        }}
      >
        {/* Corps du T */}
        <Rect x={-5} y={-20} width={10} height={25} fill="white" />
        <Rect x={-15} y={-20} width={30} height={8} fill="white" />
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[]} // pas de redimension
        />
      )}
    </>
  );
};

export default TShape;
