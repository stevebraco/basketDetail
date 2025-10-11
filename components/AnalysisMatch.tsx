"use client";
import React, { useState } from "react";
import { Card } from "./ui/card";
import { User } from "lucide-react";
import YouTube from "react-youtube";
import { useYoutubePlayer } from "@/hooks/useYoutubePlayer";
import { EventHistory } from "./EventHistory";

export default function AnalysisMatch({ matchDetails }: { matchDetails: any }) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const {
    player,
    currentTime,
    playerRef,
    handleReady,
    seekTo,
    reset,
    getCurrentTime,
  } = useYoutubePlayer();

  // Actions filtrées selon le joueur sélectionné
  const filteredActions = selectedPlayer
    ? matchDetails.tirs.filter(
        (a: any) =>
          a.player === selectedPlayer ||
          a.passer === selectedPlayer ||
          (a.typeItem === "event" && a.player === selectedPlayer)
      )
    : matchDetails.tirs;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <Card className="w-full col-span-2 p-4 bg-[#1B1E2B] text-white">
        <h2 className="text-lg font-semibold mb-2">Joueurs</h2>
        <ul className="divide-y divide-gray-700">
          {matchDetails?.playerMatches.map((item: any, idx: number) => {
            const isSelected = selectedPlayer === item.player.nom;

            // Nombre d'événements pour ce joueur
            const eventCount = matchDetails.tirs.filter(
              (a: any) => a.player === item.player.nom
            ).length;

            return (
              <li
                key={idx}
                className={`flex items-center justify-between py-2 px-2 cursor-pointer ${
                  isSelected ? "bg-[#4F5BD5]/30" : ""
                }`}
                onClick={() =>
                  setSelectedPlayer(isSelected ? null : item.player.nom)
                }
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {item.player.prenom} {item.player.nom}
                  </span>
                </div>
                <span className="text-gray-400 text-sm">{eventCount}</span>
              </li>
            );
          })}
        </ul>
      </Card>
      <div className="col-span-10">
        <Card>
          <div className="relative w-[100%] pb-[33.25%]">
            <YouTube
              videoId={matchDetails.videoId}
              onReady={handleReady}
              opts={{
                height: "100%",
                width: "100%",
                playerVars: { autoplay: 0, rel: 0 },
              }}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
        </Card>

        <EventHistory
          actions={filteredActions}
          onSeekVideo={(time) => seekTo(Math.max(time - 5, 0))}
        />
      </div>
    </div>
  );
}
