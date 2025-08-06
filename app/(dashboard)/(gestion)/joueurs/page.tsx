import { CreatePlayerForm } from "@/components/forms/CreatePlayerForm";
import { PlayerList } from "@/components/gestions/PlayerList";
import { PlayersStats } from "@/components/PlayersStats";

export default function Joueurs() {
  return (
    <div>
      <CreatePlayerForm />
      <PlayerList />
      <PlayersStats />
    </div>
  );
}
