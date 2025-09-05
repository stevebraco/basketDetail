"use client";
import React, { useState } from "react";
import InfosMatch from "./InfosMatch";
import StatsMatch from "./StatsMatch";
import BasketballCourtSVG from "./BasketballCourtSVG";
import StatsAdvancedByPlayer from "./StatsAdvancedByPlayer";
import GeneratePDF from "./GeneratePDF";
import { Button } from "./ui/button";
import { AddStatsMatch } from "@/lib/actions/match.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AnalysisVideo({ matchDetails }: { matchDetails: any }) {
  const [playersStats, setPlayersStats] = useState(matchDetails.playerMatches);
  const [shots, setShots] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

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

  const stats = {
    fgPercent: 45,
    threePPercent: 33,
    tsPercent: 55,
    rebounds: 8,
    assists: 5,
    turnovers: 2,
  };

  const combineShots = [...matchDetails?.tirs, ...shots];

  const onClickSave = () => {
    AddStatsMatch(matchDetails.id, shots, playersStats);
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <div className="col-span-12">
        <InfosMatch />
      </div>

      <Button onClick={onClickSave}>Save</Button>

      <div className="col-span-12">
        <BasketballCourtSVG
          initialShots={matchDetails?.tirs}
          selectedPlayer={selectedPlayer}
          videoId={matchDetails?.videoId}
          onUpdateStats={handleUpdateStats}
        />
      </div>
      <div className="col-span-12"></div>
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
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>

      {/* <div className="col-span-12">
        <StatsAdvancedByPlayer players={playersStats} />
      </div> */}
      {/* <div className="col-span-3">
        <h1>Rapport Basket PDF</h1>
        <GeneratePDF
          shots={combineShots}
          stats={stats}
          terrainUrl="/balls.png" // mets ton image dans public/court.png
        />
      </div> */}
    </div>
  );
}
