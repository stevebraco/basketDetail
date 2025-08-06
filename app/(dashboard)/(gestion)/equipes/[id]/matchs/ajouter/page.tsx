"use client";

import { useState } from "react";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import { PlayerStats, PlayerStatsUpdate, Shot } from "@/types/types";

// Conversion de mm:ss vers minutes décimales
function minutesToDecimal(mins: string) {
  const [m, s] = mins.split(":").map(Number);
  return m + s / 60;
}

export default function AddMatch() {
  const [playersStats, setPlayersStats] = useState<PlayerStats[]>([
    {
      id: "1",
      name: "Luka Doncic",
      minutes: minutesToDecimal("10:00"),
      points: 0,
      points2PT: 0,
      points3PT: 0,
      reboundsOff: 0,
      reboundsDef: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      evaluation: 0,
    },
    {
      id: "2",
      name: "LeBron James",
      minutes: minutesToDecimal("12:30"),
      points: 0,
      points2PT: 0,
      points3PT: 0,
      reboundsOff: 0,
      reboundsDef: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      evaluation: 0,
    },
    {
      id: "3",
      name: "Stephen Curry",
      minutes: minutesToDecimal("08:45"),
      points: 0,
      points2PT: 0,
      points3PT: 0,
      reboundsOff: 0,
      reboundsDef: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      evaluation: 0,
    },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);

  const calculateEvaluation = (player: PlayerStats, shots: Shot[]) => {
    const shotsForPlayer = shots.filter((shot) => shot.player === player.name);
    const shotsMade = shotsForPlayer.filter((shot) => shot.made).length;
    const shotsAttempted = shotsForPlayer.length;
    const shootingAccuracy = shotsAttempted ? shotsMade / shotsAttempted : 0;

    const totalRebounds = player.reboundsOff + player.reboundsDef;
    const baseEval =
      player.points +
      totalRebounds * 1.2 +
      player.assists * 1.5 +
      player.steals * 2 +
      player.blocks * 2 -
      player.turnovers * 2 -
      player.fouls * 0.5 +
      shootingAccuracy * 10;

    const weightedEval =
      player.minutes > 0 ? (baseEval * player.minutes) / 20 : 0;

    return Math.max(0, weightedEval);
  };

  const handleUpdateStats = (update: PlayerStatsUpdate, newShot: Shot) => {
    setShots((prevShots) => [...prevShots, newShot]);

    setPlayersStats((prevStats) =>
      prevStats.map((p) => {
        if (p.name === update.name) {
          const points = update.points ?? 0;

          const add2pt = newShot.type === "2PT" && newShot.made ? points : 0;
          const add3pt = newShot.type === "3PT" && newShot.made ? points : 0;

          const updatedPlayer: PlayerStats = {
            ...p,
            points: p.points + points,
            points2PT: p.points2PT + add2pt,
            points3PT: p.points3PT + add3pt,
            reboundsOff: p.reboundsOff + (update.reboundsOff ?? 0),
            reboundsDef: p.reboundsDef + (update.reboundsDef ?? 0),
            assists: p.assists + (update.assists ?? 0),
            steals: p.steals + (update.steals ?? 0),
            blocks: p.blocks + (update.blocks ?? 0),
            turnovers: p.turnovers + (update.turnovers ?? 0),
            fouls: p.fouls + (update.fouls ?? 0),
          };

          const newEval = calculateEvaluation(updatedPlayer, [
            ...shots,
            newShot,
          ]);
          return { ...updatedPlayer, evaluation: newEval };
        }
        return p;
      })
    );
  };

  const handlePlayerClick = (name: string) => {
    setSelectedPlayer((prev) => (prev === name ? null : name));
  };

  return (
    <div className="flex gap-6">
      <div className="w-2/3">
        <BasketballCourtSVG
          initialShots={shots}
          selectedPlayer={selectedPlayer ?? undefined}
          onUpdateStats={handleUpdateStats}
        />
      </div>

      <div className="w-1/3">
        <h2 className="text-lg font-semibold mb-2">Statistiques joueurs</h2>
        <table className="min-w-full table-auto text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Joueur</th>
              <th>MIN</th>
              <th>PTS</th>
              <th>2PTS</th>
              <th>3PTS</th>
              <th>REB O/D</th>
              <th>AST</th>
              <th>STL</th>
              <th>BLK</th>
              <th>TO</th>
              <th>F</th>
              <th>Eval</th>
            </tr>
          </thead>
          <tbody>
            {playersStats.map((player) => (
              <tr
                key={player.id}
                className={`border-t cursor-pointer ${
                  selectedPlayer === player.name ? "bg-blue-100" : ""
                }`}
                onClick={() => handlePlayerClick(player.name)}
              >
                <td className="px-3 py-2">{player.name}</td>
                <td className="text-center">
                  {Math.floor(player.minutes)}:
                  {String(Math.round((player.minutes % 1) * 60)).padStart(
                    2,
                    "0"
                  )}
                </td>
                <td className="text-center">{player.points}</td>
                <td className="text-center">{player.points2PT}</td>
                <td className="text-center">{player.points3PT}</td>
                <td className="text-center">
                  {player.reboundsOff}/{player.reboundsDef}
                </td>
                <td className="text-center">{player.assists}</td>
                <td className="text-center">{player.steals}</td>
                <td className="text-center">{player.blocks}</td>
                <td className="text-center">{player.turnovers}</td>
                <td className="text-center">{player.fouls}</td>
                <td className="text-center font-semibold">
                  {player.evaluation?.toFixed(1) ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
