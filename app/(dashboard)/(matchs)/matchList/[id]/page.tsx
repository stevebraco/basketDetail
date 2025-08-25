import AnalysisVideo from "@/components/AnalysisVideo";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import InfosMatch from "@/components/InfosMatch";
import StatsMatch from "@/components/StatsMatch";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ on attend params

  const matchDetails = await prisma.match.findUnique({
    where: {
      id,
    },
    include: {
      playerMatches: {
        include: {
          player: true,
        },
      },
    },
  });

  console.log(matchDetails);

  return <AnalysisVideo matchDetails={matchDetails} />;
}
