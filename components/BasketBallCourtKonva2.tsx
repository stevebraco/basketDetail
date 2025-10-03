import { useState } from "react";
import {
  Layer,
  Group,
  Rect,
  Line,
  Arc,
  Image as KonvaImage,
} from "react-konva";

function generateArcPoints(
  cx,
  cy,
  radius,
  startAngle,
  endAngle,
  numPoints = 50
) {
  const points = [];
  const angleStep = (endAngle - startAngle) / numPoints;

  for (let i = 0; i <= numPoints; i++) {
    const angle = startAngle + i * angleStep;
    // Convertir degrés en radians
    const rad = (angle * Math.PI) / 180;
    const x = cx + radius * Math.cos(rad);
    const y = cy + radius * Math.sin(rad);
    points.push(x, y);
  }

  return points;
}

const BasketBallCourtKonva2 = ({
  lineColor = "white",
  backgroundCourt = "black",
  backgroundImage,
  stage,
}) => {
  // const [isHovered, setIsHovered] = useState(false);

  // Exemple de points pour les arcs et lignes (à adapter selon ton code)
  const cornerLineXRight = 400;
  const arcsConfig = [{ cx: 188, cy: 280, radius: 153, start: 180, end: 360 }];

  const arcPointsList = arcsConfig.map(({ cx, cy, radius, start, end }) =>
    generateArcPoints(cx, cy, radius, start, end)
  );

  // Exemple d'accès :
  const [arcPoints] = arcPointsList;

  return (
    <>
      <Group
        rotationDeg={0}
        x={0}
        y={0}
        // opacity={isHovered ? 1 : 0.3}
        // onMouseEnter={() => setIsHovered(true)}
        // onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fond terrain */}
        <Rect
          x={0}
          y={0}
          width={369}
          height={433}
          opacity={1}
          stroke={lineColor}
          fill="transparent"
        />
        <Line
          points={[35, 155, 35, 0]}
          x={0}
          y={320}
          stroke={lineColor}
          strokeWidth={2}
        />
        <Line
          points={[340, 155, 340, 0]}
          x={0}
          y={320}
          stroke={lineColor}
          strokeWidth={2}
        />
        <Line
          points={arcPoints}
          stroke={lineColor}
          strokeWidth={3}
          tension={0} // tension à 0 pour avoir une courbe lisse de type arc
          closed={false} // ligne ouverte, pas fermée
        />
        <Rect
          x={130}
          y={220}
          width={110}
          height={220}
          opacity={1}
          stroke={"red"}
          fill="transparent"
        />
      </Group>
    </>
  );
};

export default BasketBallCourtKonva2;
