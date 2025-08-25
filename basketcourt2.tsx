"use client";

import { act, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";
import { Stage, Layer } from "react-konva";
import { CustomEventType, PlayerStatsUpdate, Shot } from "@/types/types";
import ShotMarker from "./ui/ShotMaker";
import { useYoutubePlayer } from "@/hooks/useYoutubePlayer";
import { useBasketballCourt } from "@/hooks/useBasketballCourt";
import { getColorForEvent } from "@/utils/getColorEvent";
import { EventHistory } from "./EventHistory";
import { Card } from "./ui/card";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { relative } from "path";

export default function BasketballCourtSVG({
  initialShots = [],
  selectedPlayer,
  onUpdateStats,
  videoId,
}: {
  initialShots?: Shot[];
  selectedPlayer?: string;
  onUpdateStats: (
    update: PlayerStatsUpdate,
    shotOrEvent: Shot | CustomEventType
  ) => void;
  videoId?: string;
}) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const sceneWidth = 1010;
  const sceneHeight = 500;
  const maxStageWidth = 1011; // largeur max en pixels

  // const courtWidth = 28.65;
  // const courtHeight = 15.24;
  // const svgWidth = 500;

  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });

  // Reference to parent container
  const containerRef = useRef(null);

  // Function to handle resize
  const updateSize = () => {
    if (!containerRef.current) return;

    // Get container width
    let containerWidth = containerRef.current.offsetWidth;

    // Limite à la largeur max
    if (containerWidth > maxStageWidth) {
      containerWidth = maxStageWidth;
    }

    // Calculate scale
    const scale = containerWidth / sceneWidth;

    // Update state with new dimensions
    setStageSize({
      width: sceneWidth * scale,
      height: sceneHeight * scale,
      scale: scale,
    });
  };

  // Update on mount and when window resizes
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const courtWidth = 500;
  // const courtHeight = 250;
  // const svgWidth = 910;
  // const svgHeight = (250 / courtWidth) * svgWidth;
  const svgWidth = 930 * stageSize.scale;
  const svgHeight = (255 / courtWidth) * 910 * stageSize.scale;

  const basketLeft = { x: 168, y: 500 / 2 };
  const basketRight = { x: 811, y: 500 / 2 };
  // const threePointRadius = (93 / courtWidth) * svgWidth;
  const threePointRadius = (85.8 / courtWidth) * sceneWidth * stageSize.scale;

  const cornerThreeDistance = (-65 / 90) * 1;

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
  });
  const { player, currentTime, playerRef, handleReady, seekTo, reset } =
    useYoutubePlayer();

  const VIDEO_ID = videoId;

  // Dimensions du terrain

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (pendingEvent || !selectedPlayer || !player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const timestampSeconds = await player.getCurrentTime();
    handleCourtClick(x, y, timestampSeconds, stageSize.scale);
  };

  const originalSvgWidth = 930;
  const originalSvgHeight = (250 / courtWidth) * originalSvgWidth;

  // Récupère la largeur du conteneur
  const containerWidth = containerRef.current?.offsetWidth ?? originalSvgWidth;

  // Facteur d’échelle
  const scale = containerWidth / originalSvgWidth;

  // Dimensions du rect orange responsive
  const rectX = 55 * scale;
  const rectY = 35 * scale;
  const rectWidth = originalSvgWidth * scale; // ou svgWidth * scale
  const rectHeight = originalSvgHeight * scale; // ou svgHeight * scale

  return (
    <div className="">
      {/* Player YouTube */}
      <Card className="col-span-12">
        <div ref={playerRef} className="mt-4">
          <YouTube
            videoId={"UiyIFILA8do"}
            onReady={handleReady}
            opts={{
              height: "500",
              width: "100%",
              playerVars: { autoplay: 0, rel: 0 },
            }}
          />
          {currentTime !== null && (
            <Button variant="secondary" className="mt-2" onClick={reset}>
              Fermer la vidéo
            </Button>
          )}
        </div>
      </Card>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          maxWidth: `${maxStageWidth}px`,
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
          </Layer>
        </Stage>

        {/* Lignes à 3 points */}
        <svg
          width={svgWidth}
          height={svgHeight}
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
            x={55 * stageSize.scale}
            y={35 * stageSize.scale}
            width={sceneWidth * stageSize.scale} // svgWidthResponsive
            height={(250 / courtWidth) * sceneWidth * stageSize.scale} // svgHeightResponsive
            stroke="orange"
            strokeWidth={2 * stageSize.scale}
            fill="none"
          />

          {/* Zones corner */}
          {/* Left Top */}
          <rect
            x={cornerLeftTop.x}
            y={cornerLeftTop.y}
            width={cornerZoneWidth}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
          {/* Left Bottom */}
          <rect
            x={cornerLeftBottom.x}
            y={cornerLeftBottom.y}
            width={cornerZoneWidth}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
          {/* Right Top */}
          <rect
            x={cornerRightTop.x}
            y={cornerRightTop.y}
            width={cornerZoneWidth}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
          {/* Right Bottom */}
          <rect
            x={cornerRightBottom.x}
            y={cornerRightBottom.y}
            width={cornerZoneWidth}
            height={cornerZoneHeight}
            fill="red"
            opacity={0.5}
          />
        </svg>

        {/* Affichage des tirs */}
        {actions
          .filter(
            (a) =>
              a.typeItem === "shot" &&
              (!selectedPlayer || a.player === selectedPlayer)
          )
          .map((shot, i) => (
            <ShotMarker
              key={`shot-${i}`}
              shot={shot as Shot}
              isTooltipVisible={tooltipIndex === i}
              onShowTooltip={() => setTooltipIndex(i)}
              onHideTooltip={() => setTooltipIndex(null)}
              onClick={() => seekTo(Math.max(shot.timestamp - 5, 0))}
              scale={stageSize.scale}
            />
          ))}

        {/* Affichage des événements */}
        {actions
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
          ))}

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
      </div>

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
