"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";
import { Stage, Layer, Group, Rect, Text, Circle, Shape } from "react-konva";
import { CustomEventType, PlayerStatsUpdate, Shot } from "@/types/types";
import ShotMarker from "./ui/ShotMaker";
import { useYoutubePlayer } from "@/hooks/useYoutubePlayer";
import { useBasketballCourt } from "@/hooks/useBasketballCourt";
import { Card } from "./ui/card";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import { useSearchParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Textarea } from "./input/TextArea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BasketballCourtSVG({
  initialShots = [],
  selectedPlayer,
  onUpdateStats,
  videoId,
}: {
  initialShots?: Shot[];
  selectedPlayer?: any;
  onUpdateStats: (
    update: PlayerStatsUpdate,
    shotOrEvent: Shot | CustomEventType
  ) => void;
  videoId?: string;
}) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const refs = useRef<{ [key: string]: Konva.Shape | null }>({});
  const popupRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState<
    string | "all"
  >("all");

  const [clickInfo, setClickInfo] = useState<string>("");

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

  const basketLeft = { x: 185, y: 508 / 2 };
  const basketRight = { x: 832, y: 508 / 2 };
  const threePointRadius = (100 / courtWidth) * 875 * stageSize.scale;

  const cornerZoneHeight = 50;
  const cornerZoneWidth = 90;

  // Zone gauche (haut et bas)
  const cornerLeftTop = { x: 50, y: 80 };
  const cornerLeftBottom = {
    x: 50,
    y: 360,
  };

  // Zone droite (haut et bas)
  const cornerRightTop = { x: 950 - cornerZoneWidth, y: 80 };
  const cornerRightBottom = {
    x: 860,
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

    return distance * stageSize.scale > threePointRadius; // true = 3 points
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

  const zonesData: any = [
    {
      id: "paint",
      label: "Raquette",
      x: 75,
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
      shapeProps: {
        width: 200,
        height: 100,
        cornerRadius: [0, 0, 45, 0], // coin en bas à gauche arrondi
      },
    },
    {
      id: "mid_right",
      label: "Mid-range droit",
      x: 75,
      y: 80,
      type: "rect",
      shapeProps: {
        width: 200,
        height: 100,
        cornerRadius: [0, 45, 0, 0], // coin en bas à gauche arrondi
      },
    },
    {
      id: "corner_right",
      label: "Corner droit",
      x: 75,
      y: 40,
      type: "rect",
      shapeProps: {
        width: 130,
        height: 40,
        // cornerRadius: [0, 60, 0, 0], // coin en bas à gauche arrondi
      },
    },
    {
      id: "corner_left",
      label: "Corner gauche",
      x: 75,
      y: 430,
      type: "rect",
      shapeProps: {
        width: 130,
        height: 40,
        // cornerRadius: [0, 60, 0, 0], // coin en bas à gauche arrondi
      },
    },
    {
      id: "three_right",
      label: "3-points Droite",
      x: 440,
      y: 100,
      type: "concave",
      shapeProps: {
        x: 450,
        y: 100,
        rotation: 90,
        offsetX: 150,
        offsetY: 115,
        rectX: 92,
        rectY: 88,
        rectW: 91,
        rectH: 260,
        centerX: 300,
        centerY: 367,
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
        rotation: -90, // on inverse la rotation
        offsetX: 460,
        offsetY: 327,
        rectX: 92,
        rectY: 92,
        rectW: 94.5,
        rectH: 260,
        centerX: 303,
        centerY: 75, // cercle juste au-dessus
        radius: 173,
        arcStart: 3.08, // inversé
        arcEnd: 1.955, // inversé
      },
    },
    {
      id: "three_center",
      label: "3-points axe",
      x: 170,
      // x: 160,
      y: 205,
      type: "arc",
      shapeProps: {
        x: 10, // centre de l'arc
        y: 50,
        innerRadius: 173, // rayon intérieur
        outerRadius: 305, // rayon extérieur
        angle: 47, // angle total en degrés
        rotation: -11.61, // rotation de l’arc
        fill: "rgba(0,150,255,0.5)", // couleur de remplissage
        // stroke: "blue", // contour
        strokeWidth: 3,
      },
    },
  ];

  // Fonction générique pour vérifier si un point est dans la zone
  const containsPoint = (zone: any, px: number, py: number, ref: any) => {
    if (!ref) return false;
    const transform = ref.getTransform().copy().invert();
    const local = transform.point({ x: px, y: py });
    const s = zone.shapeProps;

    if (zone.type === "rect") {
      console.log("rect");
      return (
        local.x >= 0 &&
        local.x <= s.width &&
        local.y >= 0 &&
        local.y <= s.height
      );
    } else if (zone.type === "concave") {
      const path = new Path2D();
      path.moveTo(s.rectX, s.rectY + s.rectH);
      path.lineTo(s.rectX, s.rectY);
      path.lineTo(s.rectX + s.rectW, s.rectY);
      path.arc(s.centerX, s.centerY, s.radius, s.arcStart, s.arcEnd, true);
      path.lineTo(s.rectX + s.rectW, s.rectY + s.rectH);
      path.lineTo(s.rectX, s.rectY + s.rectH);
      path.closePath();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      return context.isPointInPath(path, local.x, local.y);
    } else if (zone.type === "arc") {
      const path = new Path2D();

      const scaleX = s.scaleX ?? 1;
      const scaleY = s.scaleY ?? 1;

      // Fonction helper pour transformer les coordonnées selon le scale
      const transformPoint = (x: number, y: number) => {
        return {
          x: s.x + (x - s.x) * scaleX,
          y: s.y + (y - s.y) * scaleY,
        };
      };

      // On calcule l'arc extérieur avec le scale appliqué
      const outerStartAngle = (s.rotation * Math.PI) / 180;
      const outerEndAngle = ((s.rotation + s.angle) * Math.PI) / 180;

      const innerStartAngle = outerEndAngle;
      const innerEndAngle = outerStartAngle;

      const steps = 50; // nombre de points pour approximer l’arc
      for (let i = 0; i <= steps; i++) {
        const angle =
          outerStartAngle + ((outerEndAngle - outerStartAngle) * i) / steps;
        const x = s.x + s.outerRadius * Math.cos(angle);
        const y = s.y + s.outerRadius * Math.sin(angle);
        const { x: tx, y: ty } = transformPoint(x, y);
        if (i === 0) path.moveTo(tx, ty);
        else path.lineTo(tx, ty);
      }

      for (let i = 0; i <= steps; i++) {
        const angle =
          innerStartAngle + ((innerEndAngle - innerStartAngle) * i) / steps;
        const x = s.x + s.innerRadius * Math.cos(angle);
        const y = s.y + s.innerRadius * Math.sin(angle);
        const { x: tx, y: ty } = transformPoint(x, y);
        path.lineTo(tx, ty);
      }

      path.closePath();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d")!;
      return context.isPointInPath(path, local.x, local.y);
    }

    return false;
  };

  // Fonction générique pour dessiner une zone selon son type
  const drawZone = (context: CanvasRenderingContext2D, zone: any) => {
    const s = zone.shapeProps;
    context.beginPath();

    if (zone.type === "rect") {
      const [tl, tr, br, bl] = s.cornerRadius || [0, 0, 0, 0];
      context.moveTo(0 + tl, 0);
      context.lineTo(s.width - tr, 0);
      context.quadraticCurveTo(s.width, 0, s.width, tr);
      context.lineTo(s.width, s.height - br);
      context.quadraticCurveTo(s.width, s.height, s.width - br, s.height);
      context.lineTo(bl, s.height);
      context.quadraticCurveTo(0, s.height, 0, s.height - bl);
      context.lineTo(0, tl);
      context.quadraticCurveTo(0, 0, tl, 0);
    } else if (zone.type === "concave") {
      context.moveTo(s.rectX, s.rectY + s.rectH);
      context.lineTo(s.rectX, s.rectY);
      context.lineTo(s.rectX + s.rectW, s.rectY);
      context.arc(s.centerX, s.centerY, s.radius, s.arcStart, s.arcEnd, true);
      context.lineTo(s.rectX + s.rectW, s.rectY + s.rectH);
      context.lineTo(s.rectX, s.rectY + s.rectH);
    } else if (zone.type === "arc") {
      const scaleX = s.scaleX ?? 1;
      const scaleY = s.scaleY ?? 1;

      const outerStartAngle = (s.rotation * Math.PI) / 180;
      const outerEndAngle = ((s.rotation + s.angle) * Math.PI) / 180;

      const innerStartAngle = outerEndAngle;
      const innerEndAngle = outerStartAngle;

      const steps = 50; // nombre de segments pour approximer l’arc

      // Helper pour appliquer le scale par rapport au centre
      const transformPoint = (x: number, y: number) => {
        return {
          x: s.x + (x - s.x) * scaleX,
          y: s.y + (y - s.y) * scaleY,
        };
      };

      context.beginPath();

      // Arc extérieur
      for (let i = 0; i <= steps; i++) {
        const angle =
          outerStartAngle + ((outerEndAngle - outerStartAngle) * i) / steps;
        const x = s.x + s.outerRadius * Math.cos(angle);
        const y = s.y + s.outerRadius * Math.sin(angle);
        const { x: tx, y: ty } = transformPoint(x, y);
        if (i === 0) context.moveTo(tx, ty);
        else context.lineTo(tx, ty);
      }

      // Arc intérieur (en sens inverse)
      for (let i = 0; i <= steps; i++) {
        const angle =
          innerStartAngle + ((innerEndAngle - innerStartAngle) * i) / steps;
        const x = s.x + s.innerRadius * Math.cos(angle);
        const y = s.y + s.innerRadius * Math.sin(angle);
        const { x: tx, y: ty } = transformPoint(x, y);
        context.lineTo(tx, ty);
      }

      context.closePath();
    }

    context.closePath();
  };

  function calculateZoneStats(
    actions: Action[],
    zones: Zone[],
    refs: { [key: string]: any }
  ) {
    // On garde seulement les tirs
    const shots = actions.filter((a) => a.typeItem === "shot");
    console.log(shots);

    return zones.map((zone) => {
      const attempts = shots.filter((s) =>
        containsPoint(zone, s.x, s.y, refs[zone.id])
      ).length;

      const makes = shots.filter(
        (s) => s.made && containsPoint(zone, s.x, s.y, refs[zone.id])
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
    // clamp entre 0 et 100
    const clamped = Math.max(0, Math.min(100, pct));

    // Couleur cible : #6495ED (100,149,237)
    const baseR = 100,
      baseG = 149,
      baseB = 237;

    // Mix entre blanc (255,255,255) et la couleur
    const t = clamped / 100; // 0% = blanc, 100% = bleu
    const r = Math.round(255 + (baseR - 255) * t);
    const g = Math.round(255 + (baseG - 255) * t);
    const b = Math.round(255 + (baseB - 255) * t);

    // Opacité : 0% → 0.1, 100% → 0.5
    const alpha = 0.1 + t * (0.5 - 0.1);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // const stats = calculateZoneStats(actions, zonesData, refs.current);

  // // Fusionner les stats dans zonesData pour le rendu
  // const zonesWithStats = zonesData.map((zone) => {
  //   const stat = stats.find((s) => s.id === zone.id);
  //   return {
  //     ...zone,
  //     percentage: stat?.percentage ?? 0,
  //   };
  // });

  // Actions filtrées selon le joueur sélectionné
  const filteredActionsForDisplay = React.useMemo(() => {
    let filtered = actions;

    // Filtrer par joueur si nécessaire
    if (selectedPlayer?.name) {
      filtered = filtered.filter((a) => a.player === selectedPlayer.name);
    }

    // Filtrer par type d’action si un filtre est sélectionné
    if (selectedEventFilter !== "all") {
      filtered = filtered.filter((a) => a.eventType === selectedEventFilter);
    }

    return filtered;
  }, [actions, selectedPlayer, selectedEventFilter]);

  const filteredActions = React.useMemo(() => {
    if (!selectedPlayer?.name) {
      // ✅ Pas de joueur sélectionné → on prend toutes les actions (stats équipe)
      return actions;
    }
    // ✅ Joueur sélectionné → uniquement ses actions
    return actions.filter((a) => a.player === selectedPlayer.name);
  }, [actions, selectedPlayer]);

  // Calcul des stats uniquement pour ces actions
  const stats = React.useMemo(() => {
    return calculateZoneStats(filteredActions, zonesData, refs.current);
  }, [filteredActions, zonesData, refs.current]);

  // Fusionner stats avec zonesData pour l'affichage
  const zonesWithStats = zonesData.map((zone) => {
    const stat = stats.find((s) => s.id === zone.id);
    return {
      ...zone,
      percentage: stat?.percentage ?? 0,
      attempts: stat?.attempts ?? 0,
      makes: stat?.makes ?? 0,
    };
  });

  const eventOptions = [
    { value: "tir", label: "Tir", initial: "T" },
    { value: "assist", label: "Passe Décisive", initial: "PD" },
    { value: "faute", label: "Faute", initial: "F" },
    { value: "rebond_off", label: "Rebond Offensif", initial: "RO" },
    { value: "rebond_def", label: "Rebond Défensif", initial: "RD" },
    { value: "perte_de_balle", label: "Perte de balle", initial: "P" },
    { value: "interception", label: "Interception", initial: "I" },
    { value: "contre", label: "Contre", initial: "C" },
    // Lancers francs
    { value: "LF0/1", label: "Lancer franc 0/1", initial: "LF0" },
    { value: "LF0/2", label: "Lancer franc 0/2", initial: "LF0/2" },
    { value: "LF0/3", label: "Lancer franc 0/3", initial: "LF0/3" },
    { value: "LF1/2", label: "Lancer franc 1/2", initial: "LF1/2" },
    { value: "LF2/2", label: "Lancer franc 2/2", initial: "LF2/2" },
    { value: "LF1/3", label: "Lancer franc 1/3", initial: "LF1/3" },
    { value: "LF2/3", label: "Lancer franc 2/3", initial: "LF2/3" },
    { value: "LF3/3", label: "Lancer franc 3/3", initial: "LF3/3" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        resetPending(); // ferme la popup
      }
    }

    if (pendingEvent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pendingEvent]);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      {/* <div className="mb-2">
        <label className="mr-2 text-sm font-medium">Filtrer par action :</label>
        <Select
          value={selectedEventFilter}
          onValueChange={(value) => setSelectedEventFilter(value)}
        >
          <SelectTrigger className="w-[180px] border border-gray-300 rounded-md bg-[#05051F] text-white hover:border-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent className="bg-[#05051F] text-white border border-gray-700 rounded-md shadow-lg">
            <SelectItem
              value="all"
              className="hover:bg-blue-600 hover:text-white"
            >
              Toutes
            </SelectItem>
            {eventOptions
              .filter((option) => !option.value.startsWith("LF"))
              .map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="hover:bg-blue-600 hover:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div> */}

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
      <Card className="col-span-6 w-full">
        <div
          className="col-span-6 w-full flex items-center p-0"
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
            // x={-20}
            // y={-5}
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
              if (!selectedPlayer.name || !player) return;
              if (e.target !== e.target.getStage()) return;

              const stage = e.target.getStage();
              console.log(stage);
              const pointerPosition = stage!.getPointerPosition();
              console.log("Pointer raw:", pointerPosition);

              if (!pointerPosition) return;

              // 🔥 corriger les coordonnées en fonction du scale
              const realX = pointerPosition.x / stageSize.scale;
              const realY = pointerPosition.y / stageSize.scale;
              console.log("Pointer corrected:", realX, realY);
              const info = zonesData
                .map((zone) =>
                  containsPoint(zone, realX, realY, refs.current[zone.id])
                    ? zone.id
                    : null
                )
                .filter(Boolean)
                .join(", ");
              console.log(info);

              if (pointerPosition) {
                // handleCourtClick(realX, realY, currentTime, stageSize.scale);
                handleCourtClick(
                  pointerPosition.x,
                  pointerPosition.y,
                  currentTime,
                  stageSize.scale
                );
              }

              setClickInfo(info || "none");
              console.log("Zone détectée:", info);
            }}
          >
            <Layer listening={false}>
              <BasketBallCourtKonva />
            </Layer>
            <Layer>
              {zonesWithStats.map((zone) => {
                const s = zone.shapeProps;

                // Calcul du centre de la zone selon le type
                let centerX = zone.x;
                let centerY = zone.y;

                if (zone.type === "rect") {
                  centerX += 85;
                  centerY += s.height / 2;
                } else if (zone.type === "concave") {
                  if (zone.id === "three_left_inverted") {
                    centerX = 380 ?? zone.x + (s.rectW || 0) / 2;
                    centerY = s.centerY + 300 ?? zone.y + (s.rectH || 0) / 2;
                  }
                  // approximation: centre du rectangle de référence
                  else {
                    centerX = 380 ?? zone.x + (s.rectW || 0) / 2;
                    centerY = s.centerY - 280 ?? zone.y + (s.rectH || 0) / 2;
                  }
                } else if (zone.type === "arc") {
                  // pour l'arc, on place le texte au milieu du rayon extérieur
                  centerX = s.x + 390;
                  centerY = s.y + 200;
                }

                return (
                  <Group key={zone.id}>
                    <Shape
                      ref={(el) => (refs.current[zone.id] = el)}
                      x={zone.x}
                      y={zone.y}
                      rotation={zone.shapeProps.rotation || 0}
                      offsetX={zone.shapeProps.offsetX || 0}
                      offsetY={zone.shapeProps.offsetY || 0}
                      sceneFunc={(context, shape) => {
                        drawZone(context, zone);
                        context.fillStyle = getColorFromPercentage(
                          zone.percentage,
                          0.3
                        );
                        context.fill();
                        // context.stroke();
                      }}
                    />
                    <Text
                      text={`${zone.percentage}%`}
                      x={centerX}
                      y={centerY}
                      fontSize={16}
                      fill="yellow"
                      width={s.width || 100} // largeur du texte / zone approximative
                      height={s.height || 50} // hauteur du texte / zone approximative
                      align="center"
                      verticalAlign="middle"
                      rotation={s.rotation || 0} // rotation si nécessaire
                      offsetX={(s.width || 100) / 2} // centre horizontal
                      offsetY={(s.height || 50) / 2} // centre vertical
                      listening={false}
                    />
                  </Group>
                );
              })}
            </Layer>
          </Stage>
          {/* Lignes à 3 points */}

          {/* Affichage des tirs */}
          {filteredActionsForDisplay
            .filter((a) => a.typeItem === "shot" || a.typeItem === "event")
            .map((shot, i) => (
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
            ))}

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
              x={75 * stageSize.scale}
              y={39 * stageSize.scale}
              width={875 * stageSize.scale} // svgWidthResponsive
              height={0.425 * sceneWidth * stageSize.scale} // svgHeightResponsive
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
            <Card
              ref={popupRef}
              className="absolute z-50 border p-3 rounded shadow-md gap-0"
              style={{
                top: pendingEvent.y - 160,
                left: pendingEvent.x,
                transform: "translateX(-50%)",
                minWidth: 260,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <TooltipProvider>
                <div className="grid grid-cols-7 gap-1.5">
                  {eventOptions.map((option) => {
                    return (
                      <div key={option.value} className="flex justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                eventType === option.value
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              onClick={() => setEventType(option.value)}
                              onDoubleClick={() => confirmEvent(true)}
                              onMouseDown={
                                option.initial === "T"
                                  ? () => {
                                      console.log("ICI");
                                      pressTimer.current = setTimeout(
                                        () => confirmEvent(false),
                                        600
                                      );
                                    }
                                  : undefined
                              }
                              onMouseUp={
                                option.initial === "T"
                                  ? () => {
                                      if (pressTimer.current) {
                                        clearTimeout(pressTimer.current);
                                        pressTimer.current = null; // on reset proprement
                                      }
                                    }
                                  : undefined
                              }
                              className="px-3 h-8 w-11 border border-white/10"
                            >
                              {option.initial}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="bg-[#05051F] text-white text-xs px-2 py-1 rounded-md shadow-lg"
                          >
                            {option.label}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>

              <Textarea
                placeholder="Ajouter un commentaire..."
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                className="h-16 text-sm"
              />

              {/* <Input
              type="text"
              value={pendingTimestamp ?? ""}
              onChange={(e) => setPendingTimestamp(e.target.value)}
              placeholder="00:00:00"
              className="mb-2"
            /> */}

              <div className="flex gap-2 justify-end">
                {eventType === "tir" ? (
                  <>
                    <Button onClick={() => confirmEvent(true)}>
                      ✅ Réussi
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => confirmEvent(false)}
                    >
                      ❌ Manqué
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => confirmEvent()}>Ajouter</Button>
                )}
                <Button variant="secondary" onClick={resetPending}>
                  Annuler
                </Button>
              </div>
            </Card>
          )}
        </div>
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
