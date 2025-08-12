import { PlayerList } from "@/components/gestions/PlayerList";
import { PlayersStats } from "@/components/PlayersStats";
import { prisma } from "@/lib/prisma";
import React from "react";

export default async function PlayerListPage() {
  const players = await prisma.player.findMany();

  console.log(players);

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <PlayerList players={players} />
      </div>
    </div>
  );
}
