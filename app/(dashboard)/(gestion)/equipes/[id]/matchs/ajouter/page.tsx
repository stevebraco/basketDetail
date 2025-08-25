"use client";

import { useState } from "react";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import { PlayerStats, PlayerStatsUpdate, Shot } from "@/types/types";

// Conversion de mm:ss vers minutes décimales
function minutesToDecimal(mins: string) {
  const [m, s] = mins.split(":").map(Number);
  return m + s / 60;
}

const playersStatsMock = [
  {
    stats: {
      points: 34,
      fgm: 7,
      fga: 25,
      threePM: 2,
      threePA: 6,
      ftm: 8,
      fta: 8,
      reboundsOff: 4,
      reboundsDef: 0,
      reboundsTotal: 4,
      assists: 9,
      turnovers: 2,
      steals: 1,
      blocks: 2,
      fautes: 0,
      minutes: 32,
      plusMinus: -9,
    },
    id: "689bb220b513c6f3e5cf60ff",
    playerId: "689bb21fb513c6f3e5cf60f8",
    matchId: "689bb220b513c6f3e5cf60fd",
    player: {
      competences: "[{…}, {…}, {…}, {…}, {…}, {…}]",
      id: "689bb21fb513c6f3e5cf60f8",
      age: "33n",
      nom: "Harden",
      poids: "100n",
      poste: "Arrière",
      posteSecondaire: "Meneur",
      prenom: "James",
      remarque: "Excellent scoreur et passeur",
      taille: "196n",
    },
  },
  {
    stats: {
      points: 28,
      fgm: 10,
      fga: 20,
      threePM: 2,
      threePA: 5,
      ftm: 6,
      fta: 7,
      reboundsOff: 3,
      reboundsDef: 5,
      reboundsTotal: 8,
      assists: 7,
      turnovers: 3,
      steals: 2,
      blocks: 1,
      fautes: 1,
      minutes: 35,
      plusMinus: 5,
    },
    id: "689bb220b513c6f3e5cf6100",
    playerId: "689bb21fb513c6f3e5cf60f9",
    matchId: "689bb220b513c6f3e5cf60fd",
    player: {
      competences: "[{…}, {…}]",
      id: "689bb21fb513c6f3e5cf60f9",
      age: "36n",
      nom: "James",
      poids: "113n",
      poste: "Ailier",
      posteSecondaire: "Arrière",
      prenom: "LeBron",
      remarque: "Polyvalent et expérimenté",
      taille: "203n",
    },
  },
  {
    stats: {
      points: 30,
      fgm: 11,
      fga: 22,
      threePM: 5,
      threePA: 10,
      ftm: 3,
      fta: 4,
      reboundsOff: 1,
      reboundsDef: 2,
      reboundsTotal: 3,
      assists: 8,
      turnovers: 1,
      steals: 1,
      blocks: 0,
      fautes: 2,
      minutes: 30,
      plusMinus: 7,
    },
    id: "689bb220b513c6f3e5cf6101",
    playerId: "689bb21fb513c6f3e5cf60fa",
    matchId: "689bb220b513c6f3e5cf60fd",
    player: {
      competences: "[{…}, {…}]",
      id: "689bb21fb513c6f3e5cf60fa",
      age: "35n",
      nom: "Curry",
      poids: "86n",
      poste: "Meneur",
      posteSecondaire: "Arrière",
      prenom: "Stephen",
      remarque: "Excellent tireur à 3 points",
      taille: "191n",
    },
  },
];

export default function AddMatch() {
  const [playersStats, setPlayersStats] = useState<any[]>(playersStatsMock);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [shots, setShots] = useState<Shot[]>([]);

  const handleUpdateStats = (update: PlayerStatsUpdate, newShot: Shot) => {
    setShots((prevShots) => [...prevShots, newShot]);

    setPlayersStats((prevStats) =>
      prevStats.map((p) => {
        if (p.player.nom === update.name) {
          const points = newShot.made ? (newShot.type === "3PT" ? 3 : 2) : 0;

          return {
            ...p,
            stats: {
              ...p.stats,
              points: p.stats.points + points,
              fgm: newShot.made ? p.stats.fgm + 1 : p.stats.fgm,
              fga: p.stats.fga + 1,
              threePM:
                newShot.type === "3PT" && newShot.made
                  ? p.stats.threePM + 1
                  : p.stats.threePM,
              threePA:
                newShot.type === "3PT" ? p.stats.threePA + 1 : p.stats.threePA,
              ftm:
                newShot.type === "FT" && newShot.made
                  ? p.stats.ftm + 1
                  : p.stats.ftm,
              fta: newShot.type === "FT" ? p.stats.fta + 1 : p.stats.fta,
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
              <th>Points</th>
              <th>Passes</th>
              <th>Rebonds</th>
              <th>Interceptions</th>
              <th>Tirs réussis</th>
              <th>Tirs tentés</th>
              <th>3 pts réussis</th>
              <th>3 pts tentés</th>
              <th>Lancers francs réussis</th>
              <th>Lancers francs tentés</th>
              <th>Fautes</th>
              <th>Minutes</th>
              <th>+/-</th>
            </tr>
          </thead>

          <tbody>
            {playersStats.map((player) => {
              const reboundsTotal =
                player.stats.reboundsOff + player.stats.reboundsDef;
              return (
                <tr
                  key={player.id}
                  className={`border-t cursor-pointer ${
                    selectedPlayer === player.player.nom ? "bg-red-800" : ""
                  }`}
                  onClick={() => handlePlayerClick(player.player.nom)}
                >
                  <td className="px-3 py-2 text-white">{player.player.nom}</td>
                  <td className="text-center text-white">
                    {player.stats.points}
                  </td>
                  <td className="text-center text-white">
                    {player.stats.assists}
                  </td>
                  <td className="text-center text-white">{reboundsTotal}</td>
                  <td className="text-center text-white">
                    {player.stats.steals}
                  </td>
                  <td className="text-center text-white">{player.stats.fgm}</td>
                  <td className="text-center text-white">{player.stats.fga}</td>
                  <td className="text-center text-white">
                    {player.stats.threePM}
                  </td>
                  <td className="text-center text-white">
                    {player.stats.threePA}
                  </td>
                  <td className="text-center text-white">{player.stats.ftm}</td>
                  <td className="text-center text-white">{player.stats.fta}</td>
                  <td className="text-center text-white">
                    {player.stats.fautes}
                  </td>
                  <td className="text-center text-white">
                    {player.stats.minutes}
                  </td>
                  <td className="text-center text-white">
                    {player.stats.plusMinus}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
