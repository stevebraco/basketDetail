"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import { MatchStats, Shot } from "@/types/types";

const mockMatchData: MatchStats[] = [
  {
    id: "m1",
    teamId: "1",
    date: "2025-07-20",
    opponent: "Lions",
    score: "85 - 78",
    coachComment:
      "Bonne agressivité défensive, mais trop de pertes de balle en seconde période. Il faut mieux contrôler le rythme en fin de match.",
    teamStats: {
      points: 85,
      rebounds: 34,
      assists: 18,
      steals: 9,
      turnovers: 12,
      fouls: 14,
      fgPercentage: 47,
      threePtPercentage: 32,
      ftPercentage: 75,
    },
    playerStats: [
      {
        id: "p1",
        name: "Léo Dupont",
        minutes: 32,
        points: 18,
        reboundsOff: 2,
        reboundsDef: 4,
        assists: 4,
        steals: 2,
        blocks: 0,
        turnovers: 3,
        fouls: 2,
      },
      {
        id: "p2",
        name: "Hugo Martin",
        minutes: 25,
        points: 12,
        reboundsOff: 1,
        reboundsDef: 4,
        assists: 6,
        steals: 1,
        blocks: 1,
        turnovers: 1,
        fouls: 1,
      },
    ],
  },
];

const mockShots: Shot[] = [
  {
    x: 100,
    y: 120,
    type: "2PT",
    player: "Léo Dupont",
    made: true,
    timestamp: 30,
    commentaire: "Super tir sous pression",
  },
  {
    x: 420,
    y: 80,
    type: "3PT",
    player: "Hugo Martin",
    made: false,
    timestamp: 50,
    commentaire: "Super tir sous pression",
  },
  {
    x: 300,
    y: 110,
    type: "3PT",
    player: "Léo Dupont",
    made: true,
    timestamp: 85,
    commentaire: "Super tir sous pression",
  },
];

export default function MatchDetailPage({
  params,
}: {
  params: { id: string; matchId: string };
}) {
  const match = mockMatchData.find(
    (m) => m.id === params.matchId && m.teamId === params.id
  );

  // Défaut : null signifie "tous les joueurs"
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  if (!match) return notFound();

  const handlePlayerClick = (name: string) => {
    setSelectedPlayer((prev) => (prev === name ? null : name));
  };

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Match contre {match.opponent} - {match.score}
        </h1>
        <p className="text-sm text-gray-500">Date : {match.date}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Statistiques d'équipe</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <p>
            <strong>Points :</strong> {match.teamStats.points}
          </p>
          <p>
            <strong>Rebonds :</strong> {match.teamStats.rebounds}
          </p>
          <p>
            <strong>Passes :</strong> {match.teamStats.assists}
          </p>
          <p>
            <strong>Interceptions :</strong> {match.teamStats.steals}
          </p>
          <p>
            <strong>Balles perdues :</strong> {match.teamStats.turnovers}
          </p>
          <p>
            <strong>Fautes :</strong> {match.teamStats.fouls}
          </p>
          <p>
            <strong>% tirs :</strong> {match.teamStats.fgPercentage}%
          </p>
          <p>
            <strong>% 3pts :</strong> {match.teamStats.threePtPercentage}%
          </p>
          <p>
            <strong>% LF :</strong> {match.teamStats.ftPercentage}%
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Stats individuelles</h2>
        <div className="overflow-auto">
          <table className="min-w-full table-auto text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Joueur</th>
                <th>MIN</th>
                <th>PTS</th>
                <th>REB O/D</th>
                <th>AST</th>
                <th>STL</th>
                <th>BLK</th>
                <th>TO</th>
                <th>F</th>
              </tr>
            </thead>
            <tbody>
              {match.playerStats.map((player) => (
                <tr
                  key={player.id}
                  className={`border-t cursor-pointer ${
                    selectedPlayer === player.name ? "bg-blue-100" : ""
                  }`}
                  onClick={() => handlePlayerClick(player.name)}
                >
                  <td className="px-3 py-2">{player.name}</td>
                  <td className="text-center">{player.minutes}</td>
                  <td className="text-center">{player.points}</td>
                  <td className="text-center">
                    {player.reboundsOff}/{player.reboundsDef}
                  </td>
                  <td className="text-center">{player.assists}</td>
                  <td className="text-center">{player.steals}</td>
                  <td className="text-center">{player.blocks}</td>
                  <td className="text-center">{player.turnovers}</td>
                  <td className="text-center">{player.fouls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Zones de tir</h2>
        <BasketballCourtSVG
          initialShots={mockShots}
          selectedPlayer={selectedPlayer}
        />
      </div>

      {match.coachComment && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Résumé du coach</h2>
          <div className="bg-gray-100 rounded p-4 text-sm text-gray-800 border border-gray-300 whitespace-pre-line">
            {match.coachComment}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Ce résumé est privé et visible uniquement par le staff.
          </p>
        </div>
      )}
    </div>
  );
}
