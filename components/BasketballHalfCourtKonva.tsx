import { useState } from "react";
import { Layer, Group, Rect, Line, Arc } from "react-konva";

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

const BasketBallHalfCourtKonva = ({
  lineColor = "white",
  backgroundCourt = "black",
}) => {
  // const [isHovered, setIsHovered] = useState(false);

  // Exemple de points pour les arcs et lignes (à adapter selon ton code)
  const cornerLineXRight = 400;
  const arcsConfig = [
    { cx: 430, cy: 430, radius: 313, start: 183, end: 357 },
    { cx: 837, cy: 254, radius: 177, start: 101, end: 259 },
    { cx: 137, cy: 253, radius: 40, start: 280, end: 431 },
    { cx: 890, cy: 253, radius: 40, start: 101, end: 259 },
  ];

  const arcPointsList = arcsConfig.map(({ cx, cy, radius, start, end }) =>
    generateArcPoints(cx, cy, radius, start, end)
  );

  // Exemple d'accès :
  const [arcPoints, arcPoints2, arcPoints3, arcPoints4] = arcPointsList;

  return (
    <>
      <Group
      // opacity={isHovered ? 1 : 0.3}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fond terrain */}
        <Rect
          x={25}
          y={20}
          width={800}
          height={620}
          opacity={1}
          stroke={lineColor}
          fill={backgroundCourt}
        />
        {/* Ligne centrale */}

        {/* ligne tps mort tf*/}
        {/* <Line
          points={[500, 50, 500, 15]}
          x={-163}
          y={24}
          stroke={"lineColor"}
          strokeWidth={2}
        /> */}
        {/* ligne tps mort bf*/}
        {/* <Line
          points={[500, 50, 500, 15]}
          x={-163}
          y={420}
          stroke={lineColor}
          strokeWidth={2}
        /> */}
        {/* trait corner */}
        <Line
          points={[0, 10, 0, 0]} // même Y (50)
          x={254}
          y={628}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait corner */}
        <Line
          points={[0, 10, 0, 0]} // même Y (50)
          x={600}
          y={628}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={580}
          y={520}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={580}
          y={500}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={580}
          y={450}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={580}
          y={400}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={542}
          y={360}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={542}
          y={412}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={542}
          y={462}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* rect bas raquette */}
        <Rect
          x={544}
          y={510}
          width={10} // largeur
          height={10} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />

        {/* rect haut raquette */}
        <Rect
          x={302}
          y={510}
          width={10} // largeur
          height={10} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={262}
          y={520}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={262}
          y={500}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={262}
          y={450}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={262}
          y={398}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={300}
          y={360}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={300}
          y={412}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[0, 0, 15, 0]} // même Y → ligne horizontale
          x={300}
          y={461}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* Cercle raq */}
        <Group>
          <Arc
            x={430}
            y={326}
            innerRadius={0}
            outerRadius={112}
            angle={180} // demi-cercle
            rotation={180} // ouverture vers le haut
            stroke={lineColor}
            strokeWidth={2}
          />

          <Arc
            x={430}
            y={326}
            innerRadius={0}
            outerRadius={112}
            angle={180} // demi-cercle
            rotation={0} // ouverture vers le bas
            stroke={lineColor}
            strokeWidth={2}
            dash={[25, 5]}
          />

          {/* RAQUETTE */}
          <Rect
            x={280}
            y={326}
            width={300}
            height={310}
            stroke={lineColor}
            strokeWidth={2}
          />
          <Rect
            x={315}
            y={326}
            width={229}
            height={310}
            stroke={"purple"}
            strokeWidth={2}
          />
          <Group>
            <Line
              points={[400, -30, 400, 200]} // même X, Y différents → verticale
              stroke={lineColor}
              strokeWidth={3}
              x={342}
              y={435}
            />

            {/* Lignes droites côtés droite */}
            <Line
              points={[400, -30, 400, 200]} // même X, Y différents → verticale
              stroke={lineColor}
              strokeWidth={3}
              x={-282}
              y={435}
            />

            {/* Arc en forme de U */}
            {/*  */}
            <Line
              points={arcPoints}
              stroke={lineColor}
              strokeWidth={3}
              tension={0} // tension à 0 pour avoir une courbe lisse de type arc
              closed={false} // ligne ouverte, pas fermée
            />
          </Group>
          {/* <Group>
            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={-250}
              y={165}
            />

            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={-250}
              y={240}
            />

            <Line
              points={arcPoints3}
              stroke={lineColor}
              strokeWidth={3}
              tension={0}
              closed={false}
            />
          </Group> */}
        </Group>
      </Group>
    </>
  );
};

export default BasketBallHalfCourtKonva;
