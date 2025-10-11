"use client";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import React from "react";

import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import ShotMarker from "./ui/ShotMaker";
import useImage from "@/hooks/useImage";
import BasketBallCourtKonva2 from "./BasketBallCourtKonva2";
import { Card } from "./ui/card";

export default function AllShots({ playerTirs }: any) {
  const image = useImage("/lilcourt.png");

  const sceneWidth = 350;
  const sceneHeight = 390;
  const maxWidth = 350;

  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth,
    sceneHeight,
    maxWidth,
  });

  const allShotsForDisplay = React.useMemo(() => {
    function rotateAroundPoint(
      x: number,
      y: number,
      cx: number,
      cy: number,
      angleDeg: number
    ) {
      const angleRad = (angleDeg * Math.PI) / 180;
      const dx = x - cx;
      const dy = y - cy;
      const rotatedX = cx + dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
      const rotatedY = cy + dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
      return { x: rotatedX, y: rotatedY };
    }

    // Valeurs par défaut
    const defaultOffsetX = 130; // déplacement X
    const defaultOffsetY = -260; // déplacement Y
    const defaultAngleDeg = -180; // rotation en degrés
    const spreadFactorX = 0.75; // écartement horizontal
    const spreadFactorY = 1; // écartement vertical

    const basketLeftX = 300;
    const basketLeftY = 212 / 2;
    const basketRightX = 300;
    const basketRightY = 1588 / 2;

    // Définir la moitié haute/basse pour terrain vertical
    const midY = 450;

    // tirs côté « haut » → inchangés mais transformation appliquée
    const topShots = playerTirs
      .filter((s) => s.typeItem === "shot" && s.y <= midY)
      .map((s) => {
        let newX = s.x;
        let newY = s.y;

        // --- Déplacement ---
        newX += defaultOffsetX;
        newY += defaultOffsetY;

        // --- Rotation autour du panier haut (basketLeft) ---
        const rotated = rotateAroundPoint(
          newX,
          newY,
          basketLeftX,
          basketLeftY,
          defaultAngleDeg
        );
        newX = rotated.x;
        newY = rotated.y;

        // --- Écartement séparé X et Y ---
        newX = basketLeftX + (newX - basketLeftX) * spreadFactorX;
        newY = basketLeftY + (newY - basketLeftY) * spreadFactorY;

        return { ...s, x: newX, y: newY, rotated: true };
      });

    // tirs côté « bas » → miroir vers le haut
    const bottomShotsMirroredToTop = playerTirs
      .filter((s) => s.typeItem === "shot" && s.y > midY)
      .map((s) => {
        // --- Miroir vers le panier haut ---
        const dx = s.x - basketRightX;
        const dy = s.y - basketRightY;
        let newX = basketLeftX - dx;
        let newY = basketLeftY - dy;

        // --- Déplacement ---
        newX += defaultOffsetX;
        newY += defaultOffsetY;

        // --- Rotation autour du panier haut ---
        const rotated = rotateAroundPoint(
          newX,
          newY,
          basketLeftX,
          basketLeftY,
          defaultAngleDeg
        );
        newX = rotated.x;
        newY = rotated.y;

        // --- Écartement séparé X et Y ---
        newX = basketLeftX + (newX - basketLeftX) * spreadFactorX;
        newY = basketLeftY + (newY - basketLeftY) * spreadFactorY;

        return { ...s, x: newX, y: newY, rotated: true, hidden: true };
      });

    // Combinaison finale
    return [...topShots, ...bottomShotsMirroredToTop];
  }, [playerTirs]);

  return (
    <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          background: "red",
        }}
      >
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          opacity={1}
          style={{
            position: "relative",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
            background: "#1C1E2B",
          }}
        >
          <Layer listening={false}>
            {/* {image && (
            <KonvaImage image={image} width={370} height={500} y={-65} />
          )}
          <Rect
            x={0}
            y={0}
            width={368}
            height={500}
            opacity={1}
            stroke={"white"}
            fill="transparent"
          /> */}
            <BasketBallCourtKonva2 />
          </Layer>
        </Stage>
        {allShotsForDisplay
          .filter((a) => a.typeItem === "shot" || a.typeItem === "event")
          .map((shot, i) => (
            <ShotMarker
              key={`shot-${i}`}
              shot={shot as any}
              sizeIcon={18}
              // isTooltipVisible={tooltipIndex === i}
              // onShowTooltip={() => setTooltipIndex(i)}
              // onHideTooltip={() => setTooltipIndex(null)}
              // onClick={() => seekTo(Math.max(shot.timestamp - 5, 0))}
              scale={stageSize.scale}
              // getCurrentTime={getCurrentTime}
            />
          ))}
      </div>
    </Card>
  );
}
