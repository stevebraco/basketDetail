import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import InfosMatch from "@/components/InfosMatch";
import StatsMatch from "@/components/StatsMatch";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function MatchPage() {
  const matchDetails = await prisma.match.findUnique({
    where: {
      id: "689bb220b513c6f3e5cf60fd",
    },
    include: {
      playerMatches: {
        include: {
          player: true,
        },
      },
    },
  });

  return (
    <div>
      <InfosMatch />
      <StatsMatch matchPlayed={matchDetails?.playerMatches} />
      <BasketballCourtSVG
        initialShots={matchDetails?.tirs}
        selectedPlayer={null}
        videoId={matchDetails?.videoId}
      />
    </div>
  );
}
