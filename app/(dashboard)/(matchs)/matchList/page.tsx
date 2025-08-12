import { TeamTable } from "@/components/gestions/TeamTable";
import { prisma } from "@/lib/prisma";
import { totalStatsFromMatches } from "@/utils/totalStatsMatch";
import React from "react";

export default async function MatchListPage() {
  const matchs = await prisma.match.findMany({
    include: {
      playerMatches: true,
    },
  });
  const averagesMatch = totalStatsFromMatches(matchs);
  console.log(matchs);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      MATCHS
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <TeamTable matchs={matchs} />
      </div>
    </div>
  );
}
