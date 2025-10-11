import AnalysisMatch from "@/components/AnalysisMatch";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function AnalysisPage({
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

  return <AnalysisMatch matchDetails={matchDetails} />;
}
