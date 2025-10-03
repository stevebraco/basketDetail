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

const BasketBallCourtKonva = ({
  lineColor = "white",
  backgroundCourt = "black",
  backgroundImage,
  stage,
}) => {
  // const [isHovered, setIsHovered] = useState(false);

  // Exemple de points pour les arcs et lignes (à adapter selon ton code)
  const cornerLineXRight = 400;
  const arcsConfig = [
    { cx: 100, cy: 300, radius: 232, start: 281, end: 439 },
    { cx: 800, cy: 300, radius: 232, start: 101, end: 259 },
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
        {/* {backgroundImage && (
          <KonvaImage
            image={backgroundImage}
            x={75}
            y={40}
            width={875}
            height={430}
            listening={false} // évite de bloquer les clics
          />
        )} */}
        {/* Fond terrain */}
        <Rect
          x={0}
          y={0}
          width={900}
          height={600}
          opacity={1}
          stroke={lineColor}
          fill="transparent"
        />
        {/* Ligne centrale */}
        <Line
          points={[500, 50, 500, 480]}
          x={12}
          y={-10}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* ligne tps mort tf*/}
        <Line
          points={[500, 50, 500, 15]}
          x={-163}
          y={24}
          stroke={"lineColor"}
          strokeWidth={2}
        />
        {/* ligne tps mort bf*/}
        <Line
          points={[500, 50, 500, 15]}
          x={-163}
          y={420}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait corner */}
        <Line
          points={[0, 50, 10, 50]} // même Y (50)
          x={75}
          y={111}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait corner */}
        <Line
          points={[0, 50, 10, 50]} // même Y (50)
          x={75}
          y={298}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={51}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={64}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={96.5}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={130}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={154}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={120}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={88}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* rect bas raquette */}
        <Rect
          x={150} // position horizontale
          y={307} // position verticale
          width={12} // largeur
          height={6} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />

        {/* rect haut raquette */}
        <Rect
          x={150} // position horizontale
          y={190} // position verticale
          width={12} // largeur
          height={6} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={154}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={120}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={88}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={51}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={64}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={96.5}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={130}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* Cercle raq */}
        <Group>
          <Arc
            x={230}
            y={300}
            innerRadius={0} // pour un arc plein (pas un anneau)
            outerRadius={65} // rayon du cercle
            angle={180} // angle en degrés (180° pour un demi-cercle)
            rotation={270} // angle de départ en degrés (0 = à droite)
            stroke={"purple"}
            strokeWidth={2}
          />
          <Arc
            x={230}
            y={300}
            innerRadius={0} // pour un arc plein (pas un anneau)
            outerRadius={65} // rayon du cercle
            angle={180} // angle en degrés (180° pour un demi-cercle)
            rotation={90} // angle de départ en degrés (0 = à droite)
            stroke={lineColor}
            strokeWidth={2}
            dash={[12, 5]}
          />
          {/* RAQUETTE HAUT */}
          <Rect
            x={0}
            y={220}
            width={230}
            height={160}
            stroke={"red"}
            strokeWidth={2}
          />
          <Rect
            x={0}
            y={235}
            width={230}
            height={130}
            stroke={"yellow"}
            strokeWidth={2}
          />
          <Group>
            <Line
              points={[cornerLineXRight, 50, 255, 50]}
              stroke={"red"}
              strokeWidth={3}
              x={-255}
              y={477}
            />

            {/* Lignes droites côtés droite */}
            <Line
              points={[cornerLineXRight, 50, 255, 50]}
              stroke={"blue"}
              strokeWidth={3}
              x={-255}
              y={22}
              // rotation={80}
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
          <Group>
            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={-250}
              y={165}
            />

            {/* Lignes droites côtés droite */}
            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={-250}
              y={240}
              // rotation={80}
            />

            {/* Arc en forme de U */}
            {/*  */}
            <Line
              points={arcPoints3}
              stroke={lineColor}
              strokeWidth={3}
              tension={0} // tension à 0 pour avoir une courbe lisse de type arc
              closed={false} // ligne ouverte, pas fermée
            />
          </Group>
        </Group>

        {/* coté g */}
        <Line
          points={[500, 50, 500, 15]}
          x={186}
          y={24}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* ligne tps mort bf*/}
        <Line
          points={[500, 50, 500, 15]}
          x={186}
          y={420}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait corner */}
        <Line
          points={[0, 50, 10, 50]} // même Y (50)
          x={935}
          y={111}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait corner */}
        <Line
          points={[0, 50, 10, 50]} // même Y (50)
          x={935}
          y={298}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={771}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={758}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={725}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={691}
          y={324}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={733.5}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={701}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette bas raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={667}
          y={306}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* rect bas raquette */}
        <Rect
          x={860} // position horizontale
          y={307} // position verticale
          width={12} // largeur
          height={6} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />

        {/* rect haut raquette */}
        <Rect
          x={860} // position horizontale
          y={190} // position verticale
          width={12} // largeur
          height={6} // hauteur
          fill={lineColor} // couleur de remplissage
          stroke={lineColor} // couleur de bordure
          strokeWidth={2} // épaisseur de bordure
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={667}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={733.5}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut raquette */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={701}
          y={190}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={771}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={758}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={725}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* trait raquette haut */}
        <Line
          points={[100, 0, 100, 10]} // même X (100)
          x={691}
          y={170}
          stroke={lineColor}
          strokeWidth={2}
        />
        {/* Cercle raq */}
        <Group>
          <Group>
            <Arc
              x={670}
              y={300}
              innerRadius={0} // pour un arc plein (pas un anneau)
              outerRadius={65} // rayon du cercle
              angle={180} // angle en degrés (180° pour un demi-cercle)
              rotation={270} // angle de départ en degrés (0 = à droite)
              stroke={"red"}
              strokeWidth={2}
              dash={[12, 5]}
            />
            <Arc
              x={670}
              y={300}
              innerRadius={0} // pour un arc plein (pas un anneau)
              outerRadius={65} // rayon du cercle
              angle={180} // angle en degrés (180° pour un demi-cercle)
              rotation={90} // angle de départ en degrés (0 = à droite)
              stroke={"red"}
              strokeWidth={2}
            />
          </Group>
          {/* RAQUETTE BAS */}
          <Rect
            x={670}
            y={220}
            width={230}
            height={160}
            stroke={"red"}
            strokeWidth={2}
          />
          <Rect
            x={670}
            y={235}
            width={230}
            height={130}
            stroke={lineColor}
            strokeWidth={2}
          />
          <Group>
            <Line
              points={[cornerLineXRight, 50, 255, 50]}
              stroke={"red"}
              strokeWidth={3}
              x={500}
              y={477}
            />

            {/* Lignes droites côtés droite */}
            <Line
              points={[cornerLineXRight, 50, 255, 50]}
              stroke={"purple"}
              strokeWidth={3}
              x={500}
              y={22}
              // rotation={80}
            />

            {/* Arc en forme de U */}
            {/*  */}
            <Line
              points={arcPoints2}
              stroke={lineColor}
              strokeWidth={3}
              tension={0} // tension à 0 pour avoir une courbe lisse de type arc
              closed={false} // ligne ouverte, pas fermée
            />
          </Group>
          <Group>
            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={502}
              y={165}
            />

            {/* Lignes droites côtés droite */}
            <Line
              points={[cornerLineXRight, 50, 370, 50]}
              stroke={lineColor}
              strokeWidth={3}
              x={502}
              y={240}
              // rotation={80}
            />

            {/* Arc en forme de U */}
            {/*  */}
            <Line
              points={arcPoints4}
              stroke={lineColor}
              strokeWidth={3}
              tension={0} // tension à 0 pour avoir une courbe lisse de type arc
              closed={false} // ligne ouverte, pas fermée
            />
          </Group>
        </Group>
      </Group>
    </>
  );
};

export default BasketBallCourtKonva;
