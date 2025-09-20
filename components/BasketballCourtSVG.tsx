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
  const [shots, setShots] = useState([]);
  const [playersStats, setPlayersStats] = useState(matchDetails?.playerMatches);

  const onClickSave = () => {
    AddStatsMatch(matchDetails.id, shots, playersStats);
  };

  const handleUpdateStats = (
    update: { player: string; statsUpdate: any },
    newShot: Shot
  ) => {
    setShots((prevShots) => [...prevShots, newShot]);

    setPlayersStats((prevStats) =>
      prevStats.map((p) => {
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

  const sceneWidth = matchDetails.isHalfCourt ? 850 : 1010;
  const sceneHeight = matchDetails.isHalfCourt ? 660 : 600;
  const maxWidth = matchDetails.isHalfCourt ? 850 : 1010;
  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth,
    sceneHeight,
    maxWidth: matchDetails.isHalfCourt ? 850 : 1010,
  });

  const courtWidth = 500;

  const svgWidth = 935 * stageSize.scale;

  const basketLeft = {
    x: matchDetails.isHalfCourt ? 430 : 185,
    y: matchDetails.isHalfCourt ? 850 / 2 : 508 / 2,
  };
  const basketRight = { x: 832, y: 508 / 2 };
  const threePointRadius = matchDetails.isHalfCourt
    ? (177 / courtWidth) * 875 * stageSize.scale
    : (100 / courtWidth) * 875 * stageSize.scale;

  const cornerZoneHeight = matchDetails.isHalfCourt ? 200 : 50;
  const cornerZoneWidth = matchDetails.isHalfCourt ? 120 : 90;

  // Zone gauche (haut et bas)
  const cornerLeftTop = {
    x: matchDetails.isHalfCourt ? 120 : 50,
    y: matchDetails.isHalfCourt ? 450 : 80,
  };
  const cornerLeftBottom = {
    x: matchDetails.isHalfCourt ? 620 : 50,
    y: matchDetails.isHalfCourt ? 450 : 360,
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

    const courtFull =
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

    const courtHalf =
      (x >= cornerLeftTop.x &&
        x <= cornerLeftTop.x + cornerZoneWidth &&
        y >= cornerLeftTop.y &&
        y <= cornerLeftTop.y + cornerZoneHeight) ||
      (x >= cornerLeftBottom.x &&
        x <= cornerLeftBottom.x + cornerZoneWidth &&
        y >= cornerLeftBottom.y &&
        y <= cornerLeftBottom.y + cornerZoneHeight);

    // Vérifie si le tir est dans l'une des zones de corner
    const inCornerZone = matchDetails.isHalfCourt ? courtHalf : courtFull;

    if (inCornerZone) return false; // 2 points

    // Sinon, distance au panier
    const dx = matchDetails.isHalfCourt ? x - basketLeft.x : x - basket.x;
    const dy = matchDetails.isHalfCourt ? y - basketLeft.y : y - basket.y;
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
    initialShots: matchDetails?.tirs,
    selectedPlayer,
    onUpdateStats: handleUpdateStats,
    isThreePointShot,
    getCurrentTime,
  });

  const originalSvgWidth = 930;

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
  console.log("stageSize.width", stageSize.width);
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
        <Card className="col-span-6">
          <div ref={playerRef} className="mt-4 relative pb-[56.25%] h-0">
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
      <Button onClick={onClickSave}>Save</Button>

      <Card className="col-span-6 w-full">
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
            <rect
              x={
                matchDetails.isHalfCourt
                  ? 24 * stageSize.scale
                  : 0 * stageSize.scale
              }
              y={
                matchDetails.isHalfCourt
                  ? 20 * stageSize.scale
                  : 0 * stageSize.scale
              }
              width={stageSize.width}
              height={stageSize.height}
              stroke="purple"
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
      <div className="col-span-12">
        <Tabs defaultValue="account" className="w-full bg-[#1B1E2B]">
          <TabsList>
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
              onSeekVideo={(time) => {
                if (videoRef.current) {
                  videoRef.current.seekTo(time, "seconds");
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
      {/* Historique */}
    </div>
  );
}
