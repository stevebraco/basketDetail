import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import InfosMatch from "@/components/InfosMatch";
import StatsMatch from "@/components/StatsMatch";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function MatchPage() {
  const matchDetails = await prisma.match.findUnique({
    where: {
      id: "68968009cc23af2750edc2f4",
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
