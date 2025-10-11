import AllShots from "@/components/AllShots";
import AverageStats from "@/components/AverageStats";
import PlayerDetail from "@/components/PlayerDetail";
import PointsAreaChart from "@/components/PointsAreaChart";
import RadarChart from "@/components/RadarChart";
import StatsMatch from "@/components/StatsMatch";
import ZoneStats from "@/components/ZoneStats";
import { prisma } from "@/lib/prisma";
import { getAverageStatsAndCount } from "@/utils/AveragesStats";
import React from "react";
import dynamic from "next/dynamic";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
              tirs: true,
            },
          },
        },
      },
    },
  });

  if (!playerDetail) {
    return (
      <div className="min-h-screen bg-[#0F111C] text-white p-6">
        <p>Joueur non trouvé.</p>
      </div>
    );
  }

  // Filtrer les tirs pour ne garder que ceux du joueur
  const playerTirs = playerDetail.playerMatches.flatMap((pm) =>
    pm.match.tirs.filter((tir) => tir.playerId === playerDetail.id)
  );

  const { averages, matchesPlayed } = getAverageStatsAndCount(
    playerDetail?.playerMatches
  );

  console.log(playerDetail?.playerMatches);

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {/* GRID PRINCIPALE */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* === COLONNE GAUCHE === */}
        <div className="col-span-12 xl:col-span-8 space-y-6">
          {/* 🧍‍♂️ Profil joueur + Stats moyennes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            <PlayerDetail player={playerDetail} />
            <AverageStats averages={averages} matchesPlayed={matchesPlayed} />
          </div>

          {/* 📈 Stats par match */}
          <StatsMatch matchPlayed={playerDetail.playerMatches} />

          {/* 📊 Détail par zones */}

          <ZoneStats playerTirs={playerTirs} />
          <PointsAreaChart playerStats={playerDetail?.playerMatches} />
        </div>

        {/* === COLONNE DROITE === */}
        <div className="col-span-12 xl:col-span-4 space-y-6">
          {/* 🧠 Radar de compétences */}
          <RadarChart competences={playerDetail.competences} />
          <AllShots playerTirs={playerTirs} />
        </div>
      </div>
    </div>
  );
}
