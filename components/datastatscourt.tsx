"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";
import {
  Stage,
  Layer,
  Group,
  Rect,
  Text,
  Circle,
  Shape,
  Arc,
} from "react-konva";
import { CustomEventType, PlayerStatsUpdate, Shot } from "@/types/types";
import ShotMarker from "./ui/ShotMaker";
import { useYoutubePlayer } from "@/hooks/useYoutubePlayer";
import { useBasketballCourt } from "@/hooks/useBasketballCourt";
import { Card } from "./ui/card";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import { useSearchParams } from "next/navigation";

export default function BasketballCourtSVG({
  initialShots = [],
  selectedPlayer,
  onUpdateStats,
  videoId,
}: {
  initialShots?: Shot[];
  selectedPlayer?: string | null;
  onUpdateStats: (
    update: PlayerStatsUpdate,
    shotOrEvent: Shot | CustomEventType
  ) => void;
  videoId?: string;
}) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const isReadOnly = searchParams.get("view");

  const sceneWidth = 1010;
  const maxWidth = 1010;
  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth,
    sceneHeight: 500,
    maxWidth: 1011,
  });

  const courtWidth = 500;

  const svgWidth = 930 * stageSize.scale;

  const basketLeft = { x: 165, y: 500 / 2 };
  const basketRight = { x: 811, y: 500 / 2 };
  const threePointRadius = (100 / courtWidth) * 875 * stageSize.scale;

  const cornerZoneHeight = 50;
  const cornerZoneWidth = 90;

  // Zone gauche (haut et bas)
  const cornerLeftTop = { x: 50, y: 75 };
  const cornerLeftBottom = {
    x: 50,
    y: 375,
  };

  // Zone droite (haut et bas)
  const cornerRightTop = { x: 930 - cornerZoneWidth, y: 75 };
  const cornerRightBottom = {
    x: 850,
    y: 375,
  };

  const isThreePointShot = (x: number, y: number) => {
    const isLeft = x < svgWidth / 2;
    const basket = isLeft ? basketLeft : basketRight;

    // Vérifie si le tir est dans l'une des zones de corner
    const inCornerZone =
      (isLeft &&
        ((x >= cornerLeftTop.x &&
          x <= cornerLeftTop.x + cornerZoneWidth &&
          y >= cornerLeftTop.y &&
          y <= cornerLeftTop.y + cornerZoneHeight) ||
          (x >= cornerLeftBottom.x &&
            x <= cornerLeftBottom.x + cornerZoneWidth &&
            y >= cornerLeftBottom.y &&
            y <= cornerLeftBottom.y + cornerZoneHeight))) ||
      (!isLeft &&
        ((x >= cornerRightTop.x &&
          x <= cornerRightTop.x + cornerZoneWidth &&
          y >= cornerRightTop.y &&
          y <= cornerRightTop.y + cornerZoneHeight) ||
          (x >= cornerRightBottom.x &&
            x <= cornerRightBottom.x + cornerZoneWidth &&
            y >= cornerRightBottom.y &&
            y <= cornerRightBottom.y + cornerZoneHeight)));

    if (inCornerZone) return false; // 2 points

    // Sinon, distance au panier
    const dx = x - basket.x;
    const dy = y - basket.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance > threePointRadius; // true = 3 points
  };
  const {
    player,
    currentTime,
    playerRef,
    handleReady,
    seekTo,
    reset,
    getCurrentTime,
  } = useYoutubePlayer();

  const {
    actions,
    allPoints,
    pendingEvent,
    pendingTimestamp,
    commentaire,
    eventType,
    reboundType,
    setCommentaire,
    setEventType,
    setReboundType,
    setPendingTimestamp,
    handleCourtClick,
    confirmEvent,
    resetPending,
  } = useBasketballCourt({
    initialShots,
    selectedPlayer,
    onUpdateStats,
    isThreePointShot,
    getCurrentTime,
  });

  const VIDEO_ID = videoId;

  const originalSvgWidth = 930;

  // Récupère la largeur du conteneur
  const containerWidth = containerRef.current?.offsetWidth ?? originalSvgWidth;

  type Zone = {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    contains: (x: number, y: number) => boolean;
  };
  const containsInvertedCorner = (px, py, zone) => {
    const x = zone.x;
    const y = zone.y;
    const w = zone.width;
    const h = zone.height;
    const r = 30;

    // Zone du coin arrondi inversé (supérieur gauche)
    if (px >= x && px <= x + r && py >= y && py <= y + r) {
      const dx = px - x;
      const dy = py - y;
      return dx * dx + dy * dy >= r * r; // exclut l'intérieur de l'arrondi
    }

    // Partie rectangle normale
    return px >= x && px <= x + w && py >= y && py <= y + h;
  };

  type Zone = {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    useRadius?: boolean;
    useShape?: boolean;
    cornerRadius?: number[] | number;
    shapeProps?: {
      x: number;
      y: number;
      rotation: number;
      offsetX: number;
      offsetY: number;
      rectX: number;
      rectY: number;
      rectW: number;
      rectH: number;
      centerX: number;
      centerY: number;
      radius: number;
      arcStart: number;
      arcEnd: number;
    };
    contains: (px: number, py: number) => boolean;
  };

  const zones: Zone[] = [
    {
      id: "mid_left",
      label: "Mid-range Gauche",
      x: 80,
      y: 325,
      width: 195,
      height: 100,
      useShape: false,
      useRadius: true,
      cornerRadius: [0, 0, 20, 0],
      contains: (px, py) =>
        containsInvertedCorner(px, py, {
          x: 50,
          y: 100,
          width: 200,
          height: 150,
        }),
    },
    {
      id: "three_right",
      label: "3-points Droite",
      x: 450,
      y: 100,
      width: 50,
      height: 250,
      useShape: true,
      useRadius: false,
      shapeProps: {
        x: 450, // position du Shape
        y: 100,
        rotation: 90,
        offsetX: 150,
        offsetY: 105,
        rectX: 92, // rectangle interne
        rectY: 92,
        rectW: 50,
        rectH: 250,
        centerX: 300, // centre de l'arc
        centerY: 360,
        radius: 173,
        arcStart: -Math.PI / 1.6,
        arcEnd: 3.25,
      },
      contains: (px, py) => {
        const { rectX, rectY, rectW, rectH, centerX, centerY, radius } =
          zones.find((z) => z.id === "three_right")!.shapeProps!;

        // Vérifie si le point est dans le rectangle
        const inRect =
          px >= rectX &&
          px <= rectX + rectW &&
          py >= rectY &&
          py <= rectY + rectH;

        // Vérifie la distance au centre de l'arc
        const dx = px - centerX;
        const dy = py - centerY;
        const dist2 = dx * dx + dy * dy;

        // On veut exclure l’intérieur du cercle
        const outsideCircle = dist2 >= radius * radius;

        return inRect && outsideCircle;
      },
    },
    {
      id: "mid_right",
      label: "Mid-range Droite",
      x: 530,
      y: 150,
      width: 150,
      height: 200,
      useShape: false,
      useRadius: false,
      contains: (px, py) => px > 530 && py >= 150 && py <= 350,
    },
  ];

  function calculateZoneStats(actions: Action[], zones: Zone[]) {
    // On garde seulement les tirs
    const shots = actions.filter((a) => a.typeItem === "shot");

    return zones.map((zone) => {
      const attempts = shots.filter((s) => zone.contains(s.x, s.y)).length;
      const makes = shots.filter(
        (s) => zone.contains(s.x, s.y) && s.made
      ).length;
      return {
        ...zone,
        attempts,
        makes,
        percentage: attempts > 0 ? Math.round((makes / attempts) * 100) : 0,
      };
    });
  }

  function getColorFromPercentage(pct: number) {
    if (pct >= 60) return "green";
    if (pct >= 40) return "orange";
    if (pct > 0) return "red";
    return "red";
  }

  const zoneStats = calculateZoneStats(actions, zones);
  console.log(zoneStats);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      {/* Player YouTube */}
      <Card className="col-span-6">
        <div ref={playerRef} className="mt-4 relative pb-[56.25%] h-0">
          <YouTube
            videoId={VIDEO_ID}
            onReady={handleReady}
            opts={{
              height: "100%",
              width: "100%",
              playerVars: { autoplay: 0, rel: 0 },
            }}
            className="absolute top-0 left-0 w-full h-full"
          />
          {currentTime !== null && (
            <Button variant="secondary" className="mt-2" onClick={reset}>
              Fermer la vidéo
            </Button>
          )}
        </div>
      </Card>
      <Card
        className="col-span-6 flex items-center p-0"
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          maxWidth: `${maxWidth}px`,
        }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          scaleX={stageSize.scale}
          scaleY={stageSize.scale}
          x={-20}
          y={-5}
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
            if (!selectedPlayer || !player) return;
            const stage = e.target.getStage();
            const pointerPosition = stage.getPointerPosition();
            if (pointerPosition) {
              handleCourtClick(
                pointerPosition.x,
                pointerPosition.y,
                currentTime,
                stageSize.scale
              );
            }
          }}
        >
          <Layer>
            <BasketBallCourtKonva />
            {/* <Shape
              x={450} // position X ajustée selon ton canvas
              y={100} // position Y ajustée selon ton canvas
              rotation={90} // rotation pour “poser” la forme vers le bas
              offsetX={150} // centre horizontal de rotation
              offsetY={105} // centre vertical de rotation
              scaleX={1} // réduction horizontale
              scaleY={1} // réduction verticale
              sceneFunc={(context, shape) => {
                const x = 92;
                const y = 92;
                const w = 50;
                const h = 250;

                const basketLeft = { x: 165, y: 250 };
                const r = threePointRadius;

                context.beginPath();

                // Début bas gauche (angle droit)
                context.moveTo(x, y + h);

                // Côté gauche (vertical)
                context.lineTo(x, y);

                // Côté haut (horizontal)
                context.lineTo(x + w, y);

                // Arc concave vers le bas après rotation
                context.arc(
                  300, // centre X du cercle
                  360, // centre Y du cercle
                  173, // rayon augmenté
                  -Math.PI / 1.6,
                  3.25,
                  true // sens antihoraire
                );

                // Descend verticalement (côté droit)
                context.lineTo(x + w, y + h);

                // Bas (ligne de fermeture)
                context.lineTo(x, y + h);

                context.closePath();
                context.fillStrokeShape(shape);
              }}
              fill="red"
              stroke="black"
              strokeWidth={1}
            /> */}

            {zoneStats.map((zone) => (
              <Group key={zone.id}>
                {zone.useShape && zone.shapeProps ? (
                  <Shape
                    x={zone.shapeProps.x}
                    y={zone.shapeProps.y}
                    rotation={zone.shapeProps.rotation}
                    offsetX={zone.shapeProps.offsetX}
                    offsetY={zone.shapeProps.offsetY}
                    sceneFunc={(context, shape) => {
                      const {
                        rectX,
                        rectY,
                        rectW,
                        rectH,
                        centerX,
                        centerY,
                        radius,
                        arcStart,
                        arcEnd,
                      } = zone.shapeProps;

                      context.beginPath();

                      // Début bas gauche (angle droit)
                      context.moveTo(rectX, rectY + rectH);

                      // Côté gauche (vertical)
                      context.lineTo(rectX, rectY);

                      // Côté haut (horizontal)
                      context.lineTo(rectX + rectW, rectY);

                      // Arc concave
                      context.arc(
                        centerX,
                        centerY,
                        radius,
                        arcStart,
                        arcEnd,
                        true
                      );

                      // Descend verticalement (côté droit)
                      context.lineTo(rectX + rectW, rectY + rectH);

                      // Bas (ligne de fermeture)
                      context.lineTo(rectX, rectY + rectH);

                      context.closePath();
                      context.fillStrokeShape(shape);
                    }}
                    fill={getColorFromPercentage(zone.percentage)}
                    stroke="black"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                ) : zone.useRadius ? (
                  <Rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={getColorFromPercentage(zone.percentage)}
                    opacity={0.3}
                    cornerRadius={zone.cornerRadius}
                  />
                ) : (
                  <Rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill={getColorFromPercentage(zone.percentage)}
                    opacity={0.3}
                  />
                )}

                <Text
                  text={`${zone.percentage}%`}
                  x={zone.x + zone.width / 2 - 15}
                  y={zone.y + zone.height / 2 - 10}
                  fontSize={16}
                  fill="black"
                />
              </Group>
            ))}
          </Layer>
        </Stage>
        {/* Lignes à 3 points */}
        <svg
          width={stageSize.width}
          height={stageSize.height}
          stroke="red"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <circle
            cx={basketLeft.x * stageSize.scale}
            cy={basketLeft.y * stageSize.scale}
            r={threePointRadius} // déjà scaled
            stroke="yellow"
            strokeWidth={1 * stageSize.scale}
            fill="none"
          />
          <circle
            cx={basketRight.x * stageSize.scale}
            cy={basketRight.y * stageSize.scale}
            r={threePointRadius} // déjà scaled
            stroke="yellow"
            strokeWidth={1 * stageSize.scale}
            fill="none"
          />
          {/* Zone corner gauche */}

          <rect
            x={50 * stageSize.scale}
            y={35 * stageSize.scale}
            width={875 * stageSize.scale} // svgWidthResponsive
            height={(214 / 430) * sceneWidth * stageSize.scale} // svgHeightResponsive
            stroke="orange"
            strokeWidth={2 * stageSize.scale}
            fill="none"
          />

          {/* Zones corner */}
          {/* Left Top */}
          <rect
            x={cornerLeftTop.x * stageSize.scale}
            y={cornerLeftTop.y * stageSize.scale}
            width={cornerZoneWidth * stageSize.scale}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
          {/* Left Bottom */}
          <rect
            x={cornerLeftBottom.x * stageSize.scale}
            y={cornerLeftBottom.y * stageSize.scale}
            width={cornerZoneWidth * stageSize.scale}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
          {/* Right Top */}
          <rect
            x={cornerRightTop.x * stageSize.scale}
            y={cornerRightTop.y * stageSize.scale}
            width={cornerZoneWidth * stageSize.scale}
            height={cornerZoneHeight * stageSize.scale}
            fill="red"
            opacity={0.5}
          />
          {/* Right Bottom */}
          <rect
            x={cornerRightBottom.x * stageSize.scale}
            y={cornerRightBottom.y * stageSize.scale}
            width={cornerZoneWidth * stageSize.scale}
            height={cornerZoneHeight * stageSize.scale}
            fill="red"
            opacity={0.5}
          />
        </svg>

        {/* Affichage des tirs */}
        {actions
          .filter(
            (a) =>
              (!selectedPlayer || a.player === selectedPlayer) &&
              (a.typeItem === "shot" || a.typeItem === "event")
          )
          .map((shot, i) => {
            console.log(shot);
            return (
              <ShotMarker
                key={`shot-${i}`}
                shot={shot as Shot}
                isTooltipVisible={tooltipIndex === i}
                onShowTooltip={() => setTooltipIndex(i)}
                onHideTooltip={() => setTooltipIndex(null)}
                onClick={() => seekTo(Math.max(shot.timestamp - 5, 0))}
                scale={stageSize.scale}
                getCurrentTime={getCurrentTime}
              />
            );
          })}

        {/* Affichage des événements */}
        {/* {actions
          .filter((a) => a.typeItem === "event")
          .map((event, i) => (
            <svg
              key={`event-${i}`}
              style={{
                position: "absolute",
                top: event.y - 6,
                left: event.x - 6,
                pointerEvents: "none",
              }}
              width={12}
              height={12}
            >
              <circle
                cx={6}
                cy={6}
                r={6}
                fill={getColorForEvent((event as CustomEventType).eventType)}
                opacity={0.8}
              />
            </svg>
          ))} */}

        {/* Pop-up ajout événement */}
        {pendingEvent && (
          <div
            className="absolute z-50 bg-white border p-3 rounded shadow-md"
            style={{
              top: pendingEvent.y - 160,
              left: pendingEvent.x,
              transform: "translateX(-50%)",
              minWidth: 240,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <label className="font-semibold block mb-1">Type d'événement</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="mb-2 w-full border px-2 py-1 rounded"
            >
              <option value="tir">Tir</option>
              <option value="rebond">Rebond</option>
              <option value="perte_de_balle">Perte de balle</option>
              <option value="interception">Interception</option>
            </select>

            {eventType === "rebond" && (
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Type de rebond
                </label>
                <select
                  value={reboundType}
                  onChange={(e) =>
                    setReboundType(e.target.value as "off" | "def")
                  }
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="off">Offensif</option>
                  <option value="def">Défensif</option>
                </select>
              </div>
            )}

            <label className="block text-sm font-medium">Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-2"
              rows={2}
            />

            <label className="text-sm font-medium block">
              Temps (HH:MM:SS)
            </label>
            <input
              type="text"
              value={pendingTimestamp ?? ""}
              onChange={(e) => setPendingTimestamp(e.target.value)}
              className="border px-2 py-1 w-full mb-2 rounded"
            />

            <div className="flex gap-2 justify-end">
              {eventType === "tir" ? (
                <>
                  <Button onClick={() => confirmEvent(true)}>✅ Réussi</Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmEvent(false)}
                  >
                    ❌ Raté
                  </Button>
                </>
              ) : (
                <Button onClick={() => confirmEvent()}>Ajouter</Button>
              )}
              <Button variant="secondary" onClick={resetPending}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Historique */}
      {/* <EventHistory
        actions={actions}
        onDelete={(index) => {
          setActions((prev) => prev.filter((_, i) => i !== index));
        }}
        onSeekVideo={(time) => {
          if (videoRef.current) {
            videoRef.current.seekTo(time, "seconds");
          }
        }}
      /> */}
    </div>
  );
}
