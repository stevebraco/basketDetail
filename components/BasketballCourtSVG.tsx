"use client";

import { act, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";
import { Event, PlayerStat, PlayerStatsUpdate, Shot } from "@/types/types";
import { HHMMSSToSeconds, secondsToHHMMSS } from "@/utils/timeUtils";
import ShotMarker from "./ui/ShotMaker";
import { useYoutubePlayer } from "@/hooks/useYoutubePlayer";

export default function BasketballCourtSVG({
  initialShots = [],
  selectedPlayer,
  onUpdateStats,
  videoId,
}: {
  initialShots?: Shot[];
  selectedPlayer?: string;
  onUpdateStats: (update: PlayerStatsUpdate, shotOrEvent: Shot | Event) => void;
  playerStats?: PlayerStat;
}) {
  type ActionItem =
    | (Shot & { typeItem: "shot" })
    | (Event & { typeItem: "event" });

  const [actions, setActions] = useState<ActionItem[]>(
    initialShots.map((s) => ({ ...s, typeItem: "shot" }))
  );
  const [pendingEvent, setPendingEvent] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [pendingTimestamp, setPendingTimestamp] = useState<string | null>(null);
  const [commentaire, setCommentaire] = useState("");
  const [eventType, setEventType] = useState("tir");
  const [reboundType, setReboundType] = useState<"off" | "def">("def");
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const { player, currentTime, playerRef, handleReady, seekTo, reset } =
    useYoutubePlayer();

  const VIDEO_ID = videoId;
  console.log(VIDEO_ID);

  // Dimensions du terrain
  const courtWidth = 28.65;
  const courtHeight = 15.24;
  const svgWidth = 500;
  const svgHeight = (courtHeight / courtWidth) * svgWidth;

  const basketLeft = { x: 59, y: svgHeight / 2 };
  const basketRight = { x: 439, y: svgHeight / 2 };
  const threePointRadiusR = 105;
  const threePointRadiusL = (5.9 / courtWidth) * svgWidth;
  const cornerThreeDistance = (7 / courtWidth) * svgWidth;

  const isThreePointShot = (x: number, y: number) => {
    const isLeft = x < svgWidth / 2;
    const basket = isLeft ? basketLeft : basketRight;
    const dx = x - basket.x;
    const dy = y - basket.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const arcLimit = isLeft
      ? basket.x + cornerThreeDistance
      : basket.x - cornerThreeDistance;

    const inCorner =
      y < basket.y + cornerThreeDistance &&
      ((isLeft && x > arcLimit) || (!isLeft && x < arcLimit));

    return (
      (distance > threePointRadiusR && !inCorner) ||
      (distance > threePointRadiusL && !inCorner) ||
      inCorner
    );
  };

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (pendingEvent || !selectedPlayer || !player) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPendingEvent({ x, y });
    const timestampSeconds = Math.floor(await player.getCurrentTime());
    setPendingTimestamp(secondsToHHMMSS(timestampSeconds));
    setCommentaire("");
    setEventType("tir");
  };

  const confirmShotOrEvent = (made?: boolean) => {
    if (!pendingEvent || pendingTimestamp === null || !selectedPlayer) return;
    const seconds = HHMMSSToSeconds(pendingTimestamp);

    if (eventType === "tir" && typeof made === "boolean") {
      const type: Shot["type"] = isThreePointShot(
        pendingEvent.x,
        pendingEvent.y
      )
        ? "3PT"
        : "2PT";
      const points = made ? (type === "3PT" ? 3 : 2) : 0;

      const newShot: ActionItem = {
        x: pendingEvent.x,
        y: pendingEvent.y,
        type,
        player: selectedPlayer,
        timestamp: seconds,
        made,
        commentaire,
        typeItem: "shot",
      };

      const update: PlayerStatsUpdate = {
        id: selectedPlayer,
        name: selectedPlayer,
        points,
        points2PT: made && type === "2PT" ? 2 : 0,
        points3PT: made && type === "3PT" ? 3 : 0,
        shotsMade: made ? 1 : 0,
        shotsAttempted: 1,
      };

      onUpdateStats(update, newShot);
      setActions((prev) => [...prev, newShot]);
      console.log(actions);
    } else {
      const newEvent: ActionItem = {
        x: pendingEvent.x,
        y: pendingEvent.y,
        timestamp: seconds,
        commentaire,
        eventType: eventType === "rebond" ? `rebond_${reboundType}` : eventType,
        player: selectedPlayer,
        typeItem: "event",
      };

      const update: PlayerStatsUpdate = {
        id: selectedPlayer,
        name: selectedPlayer,
      };

      if (eventType === "rebond") {
        if (reboundType === "off") update.reboundsOff = 1;
        if (reboundType === "def") update.reboundsDef = 1;
      } else if (eventType === "interception") {
        update.steals = 1;
      } else if (eventType === "perte_de_balle") {
        update.turnovers = 1;
      }

      onUpdateStats(update, newEvent);
      setActions((prev) => [...prev, newEvent]);
    }

    setPendingEvent(null);
    setPendingTimestamp(null);
    setCommentaire("");
  };

  const getColorForEvent = (eventType: string) => {
    switch (eventType) {
      case "rebond_off":
        return "orange";
      case "rebond_def":
        return "lightblue";
      case "interception":
        return "green";
      case "perte_de_balle":
        return "red";
      default:
        return "purple";
    }
  };

  const allPoints = [...actions].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="space-y-4">
      <div
        className="border border-black relative"
        style={{ width: svgWidth, height: svgHeight }}
      >
        <motion.img
          src="/basketball_court123.svg"
          alt="Basketball Court"
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
        <div onClick={handleClick} style={{ width: "100%", height: "100%" }} />

        {/* Lignes à 3 points */}
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <circle
            cx={basketLeft.x}
            cy={basketLeft.y}
            r={threePointRadiusL}
            stroke="red"
            strokeWidth={1}
            fill="none"
          />
          <circle
            cx={basketRight.x}
            cy={basketRight.y}
            r={threePointRadiusR}
            stroke="red"
            strokeWidth={1}
            fill="none"
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
                fill={getColorForEvent((event as Event).eventType)}
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
                  <Button onClick={() => confirmShotOrEvent(true)}>
                    ✅ Réussi
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmShotOrEvent(false)}
                  >
                    ❌ Raté
                  </Button>
                </>
              ) : (
                <Button onClick={() => confirmShotOrEvent()}>Ajouter</Button>
              )}
              <Button
                variant="secondary"
                onClick={() => {
                  setPendingEvent(null);
                  setCommentaire("");
                }}
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Historique */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Historique</h2>
        <ul className="max-h-60 overflow-auto border p-3 rounded bg-gray-50 text-sm list-disc pl-5">
          {allPoints.length === 0 && <p>Aucun événement</p>}
          {allPoints.map((item, i) => {
            const time = secondsToHHMMSS(item.timestamp);
            if (item.typeItem === "shot") {
              const shot = item as Shot;
              return (
                <li key={`shot-${i}`}>
                  <strong>{shot.player}</strong> — {shot.type} —{" "}
                  {shot.made ? "✅" : "❌"} — {time} — {shot.commentaire}
                </li>
              );
            } else {
              const event = item as Event;
              return (
                <li key={`event-${i}`} className="text-gray-700">
                  <strong>{event.player}</strong> — {event.eventType} — {time} —{" "}
                  {event.commentaire}
                </li>
              );
            }
          })}
        </ul>
      </div>

      {/* Player YouTube */}
      <div ref={playerRef} className="mt-4">
        <YouTube
          videoId={VIDEO_ID}
          onReady={handleReady}
          opts={{
            height: "390",
            width: "640",
            playerVars: { autoplay: 0, rel: 0 },
          }}
        />
        {currentTime !== null && (
          <Button variant="secondary" className="mt-2" onClick={reset}>
            Fermer la vidéo
          </Button>
        )}
      </div>
    </div>
  );
}
