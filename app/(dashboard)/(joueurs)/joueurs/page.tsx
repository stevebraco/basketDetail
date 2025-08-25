import { CreatePlayerForm } from "@/components/forms/CreatePlayerForm";
import { PlayerList } from "@/components/gestions/PlayerList";
import { PlayersStats } from "@/components/PlayersStats";
import { prisma } from "@/lib/prisma";

export default async function Joueurs() {
  const players = await prisma.player.findMany();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CreatePlayerForm />
      </div>
      <div className="col-span-12">
        <PlayerList players={players} />
        {/* <PlayersStats /> */}
      </div>
    </div>
  );
}
