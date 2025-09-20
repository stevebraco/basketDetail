import AverageStats from "@/components/AverageStats";
import PlayerDetail from "@/components/PlayerDetail";
import RadarChart from "@/components/RadarChart";
import StatsMatch from "@/components/StatsMatch";
import { prisma } from "@/lib/prisma";
import { getAverageStatsAndCount } from "@/utils/AveragesStats";
import React from "react";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ on attend params

  const playerDetail = await prisma.player.findUnique({
    where: { id },
    include: {
      playerMatches: {
        take: 5,
        select: {
          id: true,
          stats: true,
          matchId: true,
          match: {
            select: {
              id: true,
              nom: true,
              tirs: true, // récupère tous les tirs du match
            },
          },
        },
      },
    },
  });

  // Filtrer les tirs pour ne garder que ceux du joueur
  const playerTirs = playerDetail.playerMatches.flatMap((pm) =>
    pm.match.tirs.filter((tir) => tir.playerId === playerDetail.id)
  );

  console.log(playerTirs);

  const { averages, matchesPlayed } = getAverageStatsAndCount(
    playerDetail?.playerMatches
  );

  if (!playerDetail) {
    return (
      <div className="min-h-screen bg-[#0F111C] text-white p-6">
        <p>Joueur non trouvé.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0F111C] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT - PLAYER CARD */}
        <PlayerDetail player={playerDetail} />

        {/* RIGHT - GRID SECTIONS */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* PERFORMANCE */}
          <StatsMatch matchPlayed={playerDetail.playerMatches} />

          {/* PROFIL TECHNIQUE */}
          <RadarChart competences={playerDetail.competences} />

          {/* STATISTICS */}
          <AverageStats averages={averages} matchesPlayed={matchesPlayed} />
        </div>
      </div>
    </div>
  );
}
