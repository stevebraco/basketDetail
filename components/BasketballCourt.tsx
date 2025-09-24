import React, { useMemo, useRef } from "react";
import { Stage, Layer, Group, Rect, Text, Circle, Shape } from "react-konva";
import BasketBallHalfCourtKonva from "./BasketballHalfCourtKonva";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { useBasketballStats } from "@/hooks/useBasketballStats";
import ZoneWithStats from "./ZoneWithStats";
import useImage from "@/hooks/useImage";

interface Zone {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "rect" | "concave" | "arc";
  shapeProps: any;
  attempts?: number;
  makes?: number;
  percentage?: number;
}

interface Action {
  x: number;
  y: number;
  typeItem: string;
  player: string;
  made?: boolean;
}

interface BasketballCourtProps {
  stageSize: { width: number; height: number; scale: number };
  isReadOnly: boolean;
  selectedPlayer?: { name: string };
  matchDetails: { isHalfCourt: boolean };
  handleCourtClick: (
    x: number,
    y: number,
    time: number,
    scale: number,
    zone: string
  ) => void;
  currentTime: number;
  actions: Action[];
}

export default function BasketballCourt({
  stageSize,
  isReadOnly,
  selectedPlayer,
  matchDetails,
  handleCourtClick,
  currentTime,
  actions,
}: BasketballCourtProps) {
  const zonesData: Zone[] = useMemo(
    () => [
      {
        id: "paint_right",
        label: "Raquette",
        x: 75,
        y: 180,
        type: "rect",
        shapeProps: { width: 200, height: 145 },
      },
      {
        id: "paint_left",
        label: "Raquette",
        x: 750,
        y: 180,
        type: "rect",
        shapeProps: { width: 200, height: 145 },
      },
      {
        id: "mid_left",
        label: "Mid-range Gauche",
        x: 75,
        y: 325,
        type: "rect",
        shapeProps: { width: 200, height: 100, cornerRadius: [0, 0, 45, 0] },
      },
      {
        id: "mid_left",
        label: "Mid-range basket right",
        x: 750,
        y: 325,
        type: "rect",
        shapeProps: { width: 200, height: 100, cornerRadius: [0, 0, 0, 45] },
      },
      {
        id: "mid_right",
        label: "Mid-range droit",
        x: 75,
        y: 80,
        type: "rect",
        shapeProps: { width: 200, height: 100, cornerRadius: [0, 45, 0, 0] },
      },
      {
        id: "mid_right",
        label: "Mid-range droit",
        x: 750,
        y: 80,
        type: "rect",
        shapeProps: { width: 200, height: 100, cornerRadius: [45, 0, 0, 0] },
      },
      {
        id: "corner_right",
        label: "Corner droit",
        x: 75,
        y: 40,
        type: "rect",
        shapeProps: { width: 130, height: 40 },
      },
      {
        id: "corner_right",
        label: "Corner droit",
        x: 820,
        y: 40,
        type: "rect",
        shapeProps: { width: 130, height: 40 },
      },
      {
        id: "corner_left",
        label: "Corner gauche",
        x: 75,
        y: 430,
        type: "rect",
        shapeProps: { width: 130, height: 40 },
      },
      {
        id: "corner_left_right",
        label: "Corner gauche ",
        x: 820,
        y: 430,
        type: "rect",
        shapeProps: { width: 130, height: 40 },
      },
      {
        id: "three_right",
        label: "3-points Droite",
        x: 490,
        y: 100,
        type: "concave",
        shapeProps: {
          x: 450,
          y: 100,
          rotation: 90,
          offsetX: 150,
          offsetY: 115,
          rectX: 92,
          rectY: 92,
          rectW: 70,
          rectH: 308,
          centerX: 303,
          centerY: 415,
          radius: 173,
          arcStart: -Math.PI / 1.6,
          arcEnd: 3.2282,
        },
      },
      {
        id: "three_right",
        label: "3-points Droite droit",
        x: 535,
        y: 410,
        type: "concave",
        shapeProps: {
          x: 450,
          y: 100,
          rotation: 270,
          offsetX: 150,
          offsetY: 115,
          rectX: 92,
          rectY: 92,
          rectW: 70,
          rectH: 308,
          centerX: 303,
          centerY: 415,
          radius: 173,
          arcStart: -Math.PI / 1.6,
          arcEnd: 3.2282,
        },
      },

      {
        id: "three_left_inverted",
        label: "3-points Gauche Inversé",
        x: 440,
        y: 100,
        type: "concave",
        shapeProps: {
          x: 450,
          y: 100,
          rotation: -90,
          offsetX: 460,
          offsetY: 327,
          // offsetY: 327,
          rectX: 92,
          rectY: 92,
          rectW: 75,
          rectH: 306,
          centerX: 303,
          centerY: 75,
          radius: 173,
          arcStart: 3.05,
          arcEnd: 1.955,
        },
      },
      {
        id: "three_left_inverted",
        label: "3-points Gauche Inversé",
        x: 585,
        y: 410,
        type: "concave",
        shapeProps: {
          x: 450,
          y: 100,
          rotation: -270,
          offsetX: 460,
          offsetY: 327,
          // offsetY: 327,
          rectX: 92,
          rectY: 92,
          rectW: 75,
          rectH: 306,
          centerX: 303,
          centerY: 75,
          radius: 173,
          arcStart: 3.05,
          arcEnd: 1.955,
        },
      },
      {
        id: "three_center",
        label: "3-points axe",
        x: 170,
        y: 205,
        type: "arc",
        shapeProps: {
          x: 10,
          y: 50,
          innerRadius: 173,
          outerRadius: 320,
          angle: 47,
          rotation: -11.61,
          fill: "rgba(0,150,255,0.5)",
          strokeWidth: 3,
        },
      },
      // {
      //   id: "three_center",
      //   label: "3-points axe droit",
      //   x: 878,
      //   y: 220,
      //   type: "arc",
      //   shapeProps: {
      //     x: 10,
      //     y: 50,
      //     innerRadius: 173,
      //     outerRadius: 320,
      //     angle: 47,
      //     rotation: 76.9,
      //     fill: "rgba(0,150,255,0.5)",
      //     strokeWidth: 3,
      //   },
      // },
    ],
    []
  );

  const backgroundImage = useImage("/backCourt.png");

  const { refs, stats, drawZone, getColorFromPercentage, containsPoint } =
    useBasketballStats(zonesData, actions, selectedPlayer);

  const zonesWithStats = zonesData.map((zone) => {
    const stat = stats.find((s) => s.id === zone.id);
    return {
      ...zone,
      percentage: stat?.percentage ?? 0,
      attempts: stat?.attempts ?? 0,
      makes: stat?.makes ?? 0,
    };
  });

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      scaleX={stageSize.scale}
      scaleY={stageSize.scale}
      opacity={1}
      style={{
        position: "relative",
        top: 0,
        left: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
      }}
      onClick={(e) => {
        if (isReadOnly) return;
        if (!selectedPlayer.name) return;
        if (e.target !== e.target.getStage()) return;

        const stage = e.target.getStage();
        const pointerPosition = stage!.getPointerPosition();

        if (!pointerPosition) return;

        const scale = stage.scaleX(); // si scaleX = scaleY
        const localX = (pointerPosition.x - stage.x()) / scale;
        const localY = (pointerPosition.y - stage.y()) / scale;

        const findZone = zonesWithStats.find((zone) =>
          containsPoint(zone, localX, localY, refs.current[zone.id])
        );

        if (pointerPosition) {
          handleCourtClick(
            pointerPosition.x,
            pointerPosition.y,
            currentTime,
            stageSize.scale,
            findZone?.label
          );
        }
      }}
    >
      <Layer listening={false}>
        {matchDetails.isHalfCourt ? (
          <BasketBallHalfCourtKonva />
        ) : (
          <BasketBallCourtKonva
            backgroundImage={backgroundImage}
            stageSize={stageSize}
          />
        )}
      </Layer>
      {/* <Layer>
        {zonesWithStats.map((zone) => (
          <ZoneWithStats
            key={zone.id}
            zone={zone}
            refs={refs}
            drawZone={drawZone}
            getColorFromPercentage={getColorFromPercentage}
            onClick={() => console.log("Zone cliquée :", zone.label)}
          />
        ))}
      </Layer> */}
    </Stage>
  );
}
