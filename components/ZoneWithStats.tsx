import { Stage, Layer, Group, Rect, Text, Circle, Shape } from "react-konva";

interface ZoneWithStatsProps {
  zone: Zone;
  refs: React.MutableRefObject<{ [key: string]: any }>;
  drawZone: (ctx: CanvasRenderingContext2D, zone: Zone) => void;
  getColorFromPercentage: (pct: number) => string;
}

const ZoneWithStats: React.FC<ZoneWithStatsProps> = ({
  zone,
  refs,
  drawZone,
  getColorFromPercentage,
}) => {
  const s = zone.shapeProps;

  // Calcul du centre du texte selon le type
  let centerX = zone.x;
  let centerY = zone.y;

  if (zone.type === "rect") {
    centerX += 85;
    centerY += s.height / 2;
  } else if (zone.type === "concave") {
    centerX = zone.id === "three_left_inverted" ? 380 : 380; // approximation du centre pour toutes les zones concaves
    centerY =
      zone.id === "three_left_inverted" ? s.centerY + 300 : s.centerY - 280;
  } else if (zone.type === "arc") {
    centerX = s.x + 390;
    centerY = s.y + 200;
  }

  return (
    <Group key={zone.id}>
      <Shape
        ref={(el) => (refs.current[zone.id] = el)}
        x={zone.x}
        y={zone.y}
        rotation={s.rotation || 0}
        offsetX={s.offsetX || 0}
        offsetY={s.offsetY || 0}
        sceneFunc={(context, shape) => {
          drawZone(context, zone);
          context.fillStyle = getColorFromPercentage(zone.percentage || 0);
          context.fill();
        }}
      />
      <Text
        text={`${zone.percentage}%`}
        x={centerX}
        y={centerY}
        fontSize={16}
        fill="yellow"
        width={s.width || 100}
        height={s.height || 50}
        align="center"
        verticalAlign="middle"
        rotation={s.rotation || 0}
        offsetX={(s.width || 100) / 2}
        offsetY={(s.height || 50) / 2}
        listening={false}
      />
    </Group>
  );
};

export default ZoneWithStats;
