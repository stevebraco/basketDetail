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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Textarea } from "./input/TextArea";
import StatsMatch from "./StatsMatch";
import { EventHistory } from "./EventHistory";
import BasketBallHalfCourtKonva from "./BasketballHalfCourtKonva";
import { AddStatsMatch } from "@/lib/actions/match.action";
import BasketballCourt from "./BasketballCourt";
import { Car } from "lucide-react";
import { calculateTotalRebounds } from "@/utils/StatsByPlayer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function BasketballCourtSVG({
  videoId,
  matchDetails,
}: {
  matchDetails: any;
  videoId?: string;
}) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedEventFilter, setSelectedEventFilter] = useState<
    string | "all"
  >("all");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [passer, setPasser] = useState<string | null>(null);

  const [shots, setShots] = useState([]);
  const [playersStats, setPlayersStats] = useState(matchDetails?.playerMatches);

  const onClickSave = () => {
    AddStatsMatch(matchDetails.id, shots, playersStats);
    setShots([]);
  };

  const handleUpdateStats = (
    update: { player: string; statsUpdate: any },
    newShot: Shot
  ) => {
    setShots((prevShots) => [...prevShots, newShot]);

    setPlayersStats((prevStats) =>
      prevStats.map((p) => {
        // Joueur qui a tiré
        if (p.player.nom === update.name) {
          return {
            ...p,
            stats: {
              ...p.stats,
              points: p.stats.points + (update.points ?? 0),
              fgm:
                newShot.typeItem === "shot" && newShot.made
                  ? p.stats.fgm + 1
                  : p.stats.fgm,
              fga:
                newShot.typeItem === "shot" && newShot.type !== "FT"
                  ? p.stats.fga + 1
                  : p.stats.fga,
              threePM:
                newShot.typeItem === "shot" &&
                newShot.type === "3PT" &&
                newShot.made
                  ? p.stats.threePM + 1
                  : p.stats.threePM,
              threePA:
                newShot.typeItem === "shot" && newShot.type === "3PT"
                  ? p.stats.threePA + 1
                  : p.stats.threePA,
              ftm: p.stats.ftm + (update.ftm ?? 0),
              fta: p.stats.fta + (update.fta ?? 0),
              reboundsOff: p.stats.reboundsOff + (update.reboundsOff ?? 0),
              reboundsDef: p.stats.reboundsDef + (update.reboundsDef ?? 0),
              reboundsTotal:
                p.stats.reboundsTotal +
                (update.reboundsOff ?? 0) +
                (update.reboundsDef ?? 0),
              assists: p.stats.assists + (update.assists ?? 0),
              steals: p.stats.steals + (update.steals ?? 0),
              blocks: p.stats.blocks + (update.blocks ?? 0),
              turnovers: p.stats.turnovers + (update.turnovers ?? 0),
              fautes: p.stats.fautes + (update.fautes ?? 0),
              plusMinus: p.stats.plusMinus + (update.plusMinus ?? 0),
            },
          };
        }

        // Joueur qui a passé (si différent du tireur)
        if (newShot.passer && p.player.nom === newShot.passer) {
          return {
            ...p,
            stats: {
              ...p.stats,
              assists: p.stats.assists + 1, // incrémenter la passe
            },
          };
        }

        return p;
      })
    );
  };

  const handlePlayerClick = (name: string, id: string) => {
    setSelectedPlayer(
      (prev) => (prev?.id === id ? null : { name, id }) // si déjà sélectionné -> deselect
    );
  };

  const searchParams = useSearchParams();
  const isReadOnly = searchParams.get("view");
  console.log(matchDetails);

  const isHalfCourt = false;

  const sceneWidth = isHalfCourt ? 830 : 600;
  const sceneHeight = isHalfCourt ? 550 : 900;
  const maxWidth = isHalfCourt ? 850 : 1010;
  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth,
    sceneHeight,
    maxWidth: isHalfCourt ? 850 : 900,
  });

  const courtWidth = 500;

  const svgWidth = 935 * stageSize.scale;

  const basketLeft = {
    x: 300,
    y: 212 / 2,
  };
  const basketRight = { x: 300, y: 1588 / 2 };
  const threePointRadius = isHalfCourt
    ? (177 / courtWidth) * 875 * stageSize.scale
    : (130 / courtWidth) * 875 * stageSize.scale;

  const cornerZoneHeight = isHalfCourt ? 200 : 50;
  const cornerZoneWidth = isHalfCourt ? 120 : 90;

  // Zone gauche (haut et bas)
  const cornerLeftTop = {
    x: isHalfCourt ? 120 : 50,
    y: isHalfCourt ? 450 : 80,
  };
  const cornerLeftBottom = {
    x: isHalfCourt ? 620 : 50,
    y: isHalfCourt ? 450 : 360,
  };

  // Zone droite (haut et bas)
  const cornerRightTop = { x: 950 - cornerZoneWidth, y: 80 };
  const cornerRightBottom = {
    x: 860,
    y: 375,
  };

  const isThreePointShot = (x: number, y: number) => {
    const isLeft = y < stageSize.height / 2; // maintenant l'axe vertical détermine la moitié
    const basket = isLeft ? basketLeft : basketRight;

    // const courtFull =
    //   (isLeft &&
    //     ((x >= cornerLeftTop.x &&
    //       x <= cornerLeftTop.x + cornerZoneWidth &&
    //       y >= cornerLeftTop.y &&
    //       y <= cornerLeftTop.y + cornerZoneHeight) ||
    //       (x >= cornerLeftBottom.x &&
    //         x <= cornerLeftBottom.x + cornerZoneWidth &&
    //         y >= cornerLeftBottom.y &&
    //         y <= cornerLeftBottom.y + cornerZoneHeight))) ||
    //   (!isLeft &&
    //     ((x >= cornerRightTop.x &&
    //       x <= cornerRightTop.x + cornerZoneWidth &&
    //       y >= cornerRightTop.y &&
    //       y <= cornerRightTop.y + cornerZoneHeight) ||
    //       (x >= cornerRightBottom.x &&
    //         x <= cornerRightBottom.x + cornerZoneWidth &&
    //         y >= cornerRightBottom.y &&
    //         y <= cornerRightBottom.y + cornerZoneHeight)));

    // const inCornerZone = isHalfCourt
    //   ? (x >= cornerLeftTop.x &&
    //       x <= cornerLeftTop.x + cornerZoneWidth &&
    //       y >= cornerLeftTop.y &&
    //       y <= cornerLeftTop.y + cornerZoneHeight) ||
    //     (x >= cornerLeftBottom.x &&
    //       x <= cornerLeftBottom.x + cornerZoneWidth &&
    //       y >= cornerLeftBottom.y &&
    //       y <= cornerLeftBottom.y + cornerZoneHeight)
    //   : courtFull;

    // if (inCornerZone) return false; // 2 points

    // ✅ distance calculée par rapport au panier correct
    const dx = y - basket.y; // axe vertical du canvas devient horizontal pour le panier
    const dy = x - basket.x; // axe horizontal du canvas devient vertical
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance * stageSize.scale > threePointRadius;
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
    initialShots: matchDetails?.tirs,
    selectedPlayer,
    passer,
    setPasser,
    onUpdateStats: handleUpdateStats,
    isThreePointShot,
    getCurrentTime,
  });

  const diplayPopupY =
    pendingEvent?.y > 450 ? pendingEvent?.y - 500 : pendingEvent?.y - 160;

  const diplayPopupX =
    pendingEvent?.x > 218 ? pendingEvent?.x - 580 : pendingEvent?.x - 160;

  const originalSvgWidth = 930;

  // Actions filtrées selon le joueur sélectionné
  const filteredActionsForDisplay = React.useMemo(() => {
    console.log("ACTIONS", actions);
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

  const basketLeftX = basketLeft.x;
  const basketLeftY = basketLeft.y;
  const basketRightX = basketRight.x;
  const basketRightY = basketRight.y;

  const centerX = stageSize.width / 2;

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

  const midX = stageSize.width / 2; // limite entre les deux moitiés du terrain
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

    const midY = 475; // limite entre le haut et le bas du terrain
    if (!isHalfCourt) {
      // tirs déjà en haut → inchangés
      const topShots = filteredActionsForDisplay.filter(
        (s) => s.typeItem === "shot" && s.y <= midY
      );

      // tirs en bas → miroir vers le haut
      const bottomShotsMirroredToTop = filteredActionsForDisplay
        .filter((s) => s.typeItem === "shot" && s.y > midY)
        .map((s) => {
          const dx = s.x - basketRightX;
          const dy = s.y - basketRightY;
          return {
            ...s,
            x: basketLeftX - dx,
            y: basketLeftY - dy,
            hidden: false, // on veut qu'ils s'affichent sur le terrain du haut
          };
        });

      return [...topShots, ...bottomShotsMirroredToTop];
    } else {
      // Valeurs par défaut pour transformations (rotation, déplacement, spread)
      const defaultOffsetX = -126;
      const defaultOffsetY = 130;
      const defaultAngleDeg = -89;
      const spreadFactorX = 1.8;
      const spreadFactorY = 1.5;

      // tirs déjà en haut → transformation
      const topShots = filteredActionsForDisplay
        .filter((s) => s.typeItem === "shot" && s.y <= midY)
        .map((s) => {
          let newX = s.x;
          let newY = s.y;

          // Déplacement
          newX += defaultOffsetX;
          newY += defaultOffsetY;

          // Rotation autour du panier du haut
          const rotated = rotateAroundPoint(
            newX,
            newY,
            basketLeftX,
            basketLeftY,
            defaultAngleDeg
          );
          newX = rotated.x;
          newY = rotated.y;

          // Écartement
          newX = basketLeftX + (newX - basketLeftX) * spreadFactorX;
          newY = basketLeftY + (newY - basketLeftY) * spreadFactorY;

          return { ...s, x: newX, y: newY, rotated: true };
        });

      // tirs en bas → miroir + transformation
      const bottomShotsMirroredToTop = filteredActionsForDisplay
        .filter((s) => s.typeItem === "shot" && s.y > midY)
        .map((s) => {
          const dx = s.x - basketRightX;
          const dy = s.y - basketRightY;
          let newX = basketLeftX - dx;
          let newY = basketLeftY - dy;

          // Déplacement
          newX += defaultOffsetX;
          newY += defaultOffsetY;

          // Rotation
          const rotated = rotateAroundPoint(
            newX,
            newY,
            basketLeftX,
            basketLeftY,
            defaultAngleDeg
          );
          newX = rotated.x;
          newY = rotated.y;

          // Écartement
          newX = basketLeftX + (newX - basketLeftX) * spreadFactorX;
          newY = basketLeftY + (newY - basketLeftY) * spreadFactorY;

          return { ...s, x: newX, y: newY, rotated: true, hidden: false };
        });

      return [...topShots, ...bottomShotsMirroredToTop];
    }
  }, [
    filteredActionsForDisplay,
    isHalfCourt,
    basketLeftX,
    basketLeftY,
    basketRightX,
    basketRightY,
    stageSize.height,
  ]);

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
    { value: "LF0/1", label: "Lancer franc raté", initial: "LF0" },
    { value: "LF1/1", label: "Lancer franc réussi", initial: "LF1/1" },
    { value: "event", label: "Evenement", initial: "E" },
  ];

  const selectDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Si le clic est dans la popup, on ne ferme pas
      if (popupRef.current?.contains(target)) return;

      // Si le clic est dans le dropdown du Select, on ne ferme pas
      if (selectDropdownRef.current?.contains(target)) return;

      resetPending(); // ferme uniquement si clic à l'extérieur
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
      {videoId ? (
        <Card className="col-span-7">
          <Button onClick={onClickSave}>Save</Button>

          <div className="relative w-full pb-[56.25%]">
            <YouTube
              videoId={videoId}
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
      ) : null}

      <Card className="col-span-2">
        <div className="rounded-xl shadow-lg overflow-y-auto p-1 flex flex-col h-[500px] bg-[#2A2D3F]">
          {playersStats.map((item, idx) => {
            return (
              <div
                key={idx}
                onClick={() =>
                  handlePlayerClick(item.player.nom, item.player.id)
                }
                className={`group flex flex-col items-start w-full rounded-lg p-2 mb-2 cursor-pointer transition
                  ${
                    selectedPlayer?.name === item?.player?.nom
                      ? "bg-[#4F5BD5]/30 ring-1 ring-[#4F5BD5]"
                      : "bg-[#2F3148] hover:bg-[#3B3E5C]"
                  }`}
              >
                <div className="flex items-center w-full mb-1">
                  {/* Avatar ou numéro */}
                  <div className="bg-[#4F5BD5] text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                    0
                  </div>

                  {/* Nom & Prénom */}
                  <div className="ml-2 flex items-center w-full">
                    <span className="font-semibold text-white text-xs truncate">
                      {item.player.prenom}
                    </span>

                    {/* ✅ 5 petits cercles à droite */}
                    <div className="flex gap-1 ml-auto">
                      {Array.from({ length: item.stats.fautes }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-gray-400 bg-red-600"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full overflow-x-auto">
                  <div className="grid grid-flow-col auto-cols-[20px] gap-3 text-center text-[13px] text-white min-w-max">
                    <div>
                      <span className="text-gray-400">PTS</span>
                      <span className="block font-bold">
                        {item.stats.points}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">REB</span>
                      <span className="block font-bold">
                        {calculateTotalRebounds(item.stats)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">AST</span>
                      <span className="block font-bold">
                        {item.stats.assists}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">STL</span>
                      <span className="block font-bold">
                        {item.stats.steals}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">BLK</span>
                      <span className="block font-bold">
                        {item.stats.blocks}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">TO</span>
                      <span className="block font-bold">
                        {item.stats.turnovers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="col-span-3 w-full ">
        <div
          className="col-span-6 w-full flex items-center p-0"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            maxWidth: `100%`,
          }}
        >
          <BasketballCourt
            handleCourtClick={handleCourtClick}
            currentTime={currentTime}
            selectedPlayer={selectedPlayer}
            matchDetails={matchDetails}
            isReadOnly={isReadOnly}
            stageSize={stageSize}
            actions={actions}
            width={sceneWidth}
            height={sceneHeight}
          />
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

          {/* <svg
            width={stageSize.width}
            height={stageSize.height}
            stroke="red"
            fill="red"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
            }}
          >
            <rect
              x={0}
              y={0}
              width={stageSize.width / 2}
              height={stageSize.height}
              fill="rgba(0, 0, 255, 0.1)" // bleu clair = côté gauche
            />
            <rect
              x={stageSize.width / 2}
              y={0}
              width={stageSize.width / 2}
              height={stageSize.height}
              fill="rgba(255, 0, 0, 0.1)" // rouge clair = côté droit
            />
            <line
              x1={0} // début à gauche
              y1={stageSize.height / 2} // milieu vertical
              x2={stageSize.width} // fin à droite
              y2={stageSize.height / 2} // même y pour horizontal
              stroke="blue"
              strokeWidth={2}
              strokeDasharray="6 4" // optionnel pour pointillé
            />
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
            <rect
              x={isHalfCourt ? 24 * stageSize.scale : 0 * stageSize.scale}
              y={isHalfCourt ? 20 * stageSize.scale : 0 * stageSize.scale}
              width={stageSize.width}
              height={stageSize.height}
              // stroke="purple"
              strokeWidth={2 * stageSize.scale}
              fill="none"
            />

            <rect
              x={cornerLeftTop.x * stageSize.scale}
              y={cornerLeftTop.y * stageSize.scale}
              width={cornerZoneWidth * stageSize.scale}
              height={cornerZoneHeight}
              fill="red"
              opacity={0.5}
            />
            <rect
              x={cornerLeftBottom.x * stageSize.scale}
              y={cornerLeftBottom.y * stageSize.scale}
              width={cornerZoneWidth * stageSize.scale}
              height={cornerZoneHeight}
              fill="red"
              opacity={0.5}
            />
            <rect
              x={cornerRightTop.x * stageSize.scale}
              y={cornerRightTop.y * stageSize.scale}
              width={cornerZoneWidth * stageSize.scale}
              height={cornerZoneHeight * stageSize.scale}
              fill="red"
              opacity={0.5}
            />
            <rect
              x={cornerRightBottom.x * stageSize.scale}
              y={cornerRightBottom.y * stageSize.scale}
              width={cornerZoneWidth * stageSize.scale}
              height={cornerZoneHeight * stageSize.scale}
              fill="red"
              opacity={0.5}
            />
          </svg> */}

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
          <AnimatePresence>
            {pendingEvent && (
              <motion.div
                key="event-popup"
                ref={popupRef}
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: diplayPopupY,
                  left: diplayPopupX,
                  transform: "translateX(-50%)",
                  minWidth: 280,
                  zIndex: 50,
                }}
              >
                <Card
                  className="rounded-xl shadow-2xl p-3 gap-3 bg-[#1B1E2B]/95"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TooltipProvider>
                    <div className="grid grid-cols-7 gap-1.5">
                      {eventOptions.map((option) => (
                        <Tooltip key={option.value}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                eventType === option.value ? "default" : "ghost"
                              }
                              size="icon"
                              onClick={() => setEventType(option.value)}
                              onDoubleClick={() => confirmEvent(true)}
                              className="h-9 w-9 rounded-full transition-transform hover:scale-105"
                            >
                              {option.initial}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="bg-[#05051F] text-white text-xs rounded-md px-2 py-1 shadow-lg"
                          >
                            {option.label}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>

                  {eventType === "tir" && (
                    <>
                      <Select
                        value={passer ?? "none"}
                        onValueChange={setPasser}
                      >
                        <SelectTrigger className="w-[180px] border border-gray-700 rounded-md bg-[#1B1E2B] text-white hover:border-gray-500 focus:ring-1 focus:ring-[#4F5BD5] focus:outline-none">
                          <SelectValue placeholder="Passeur" />
                        </SelectTrigger>
                        <SelectContent
                          ref={selectDropdownRef}
                          className="bg-[#1B1E2B] text-white border border-gray-700 rounded-md shadow-lg"
                        >
                          <SelectGroup>
                            <SelectLabel className="text-gray-400">
                              Joueurs
                            </SelectLabel>
                            <SelectItem
                              value="none"
                              className="hover:bg-[#4F5BD5]/50 hover:text-white"
                            >
                              Aucun
                            </SelectItem>
                            {playersStats.map((item, idx) => {
                              const isSelectedPlayer =
                                selectedPlayer?.name === item.player.nom;

                              return (
                                <SelectItem
                                  key={idx}
                                  value={item.player.nom}
                                  disabled={isSelectedPlayer}
                                  className={`
                                    ${
                                      isSelectedPlayer
                                        ? "text-gray-500 cursor-not-allowed"
                                        : "hover:bg-[#4F5BD5]/50 hover:text-white"
                                    }
                                  `}
                                >
                                  {item.player.nom}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  <Textarea
                    placeholder="Ajouter un commentaire..."
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    className="h-14 text-sm rounded-md bg-[#2A2D3F] px-2 py-1 resize-none mt-2"
                  />

                  <div className="flex gap-1.5 justify-end mt-2">
                    {eventType === "tir" ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => confirmEvent(true)}
                        >
                          ✅ Réussi
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmEvent(false)}
                        >
                          ❌ Manqué
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => confirmEvent()}
                      >
                        Ajouter
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={resetPending}
                    >
                      Annuler
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      <div className="col-span-12">
        <Tabs defaultValue="stats" className="w-full bg-[#1B1E2B] rounded-lg">
          <TabsList className="bg-[#2A2D3F] rounded-t-lg">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <StatsMatch
              matchPlayed={playersStats}
              handlePlayerClick={handlePlayerClick}
              selectedPlayer={selectedPlayer?.name}
            />
          </TabsContent>
          <TabsContent value="password">
            <EventHistory
              actions={actions}
              onDelete={(index) => {
                setActions((prev) => prev.filter((_, i) => i !== index));
              }}
              onSeekVideo={(time) => seekTo(Math.max(time - 5, 0))}
            />
          </TabsContent>
        </Tabs>
      </div>
      {/* Historique */}
    </div>
  );
}
