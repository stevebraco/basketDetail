import { CreatePlayerForm } from "@/components/forms/CreatePlayerForm";
import { PlayerList } from "@/components/gestions/PlayerList";
import { PlayersStats } from "@/components/PlayersStats";
import { prisma } from "@/lib/prisma";

export default async function Joueurs() {
  const players = await prisma.player.findMany();
  return (
    <div>
      <CreatePlayerForm />
      <PlayerList players={players} />
      {/* <PlayersStats /> */}
    </div>
  );
}
