import Link from "next/link";
import { notFound } from "next/navigation";

type Match = {
  id: string;
  date: string;
  opponent: string;
  score: string;
};

type Team = {
  id: string;
  name: string;
  category: string;
  coach: string;
  playerCount: number;
  stats: string;
  matches: Match[];
};

// Données mockées
const teams: Team[] = [
  {
    id: "1",
    name: "U15 Garçons A",
    category: "U15",
    coach: "Coach Lemaire",
    playerCount: 12,
    stats: "68 PTS / 9-3",
    matches: [
      { id: "m1", date: "2025-07-20", opponent: "Lions", score: "3-1" },
      { id: "m2", date: "2025-07-10", opponent: "Dragons", score: "2-2" },
    ],
  },
  {
    id: "2",
    name: "Seniors Filles",
    category: "Senior",
    coach: "Coach Nina",
    playerCount: 10,
    stats: "75 PTS / 11-1",
    matches: [
      { id: "m3", date: "2025-07-18", opponent: "Panthères", score: "4-0" },
    ],
  },
];

export default function TeamPage({ params }: { params: { id: string } }) {
  const team = teams.find((t) => t.id === params.id);

  if (!team) return notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{team.name}</h1>
      <p>
        <strong>Catégorie:</strong> {team.category}
      </p>
      <p>
        <strong>Coach:</strong> {team.coach}
      </p>
      <p>
        <strong>Joueurs:</strong> {team.playerCount}
      </p>
      <p>
        <strong>Stats:</strong> {team.stats}
      </p>

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-2">Matchs joués</h2>
        <Link
          href={`/equipes/${team.id}/matchs/ajouter`}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Ajouter un match
        </Link>
      </div>

      <table className="min-w-full table-auto border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Adversaire</th>
            <th className="px-4 py-2 text-left">Score</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {team.matches.map((match) => (
            <tr key={match.id} className="border-t">
              <td className="px-4 py-2">{match.date}</td>
              <td className="px-4 py-2">{match.opponent}</td>
              <td className="px-4 py-2">{match.score}</td>
              <td className="px-4 py-2">
                <Link
                  href={`/equipes/${team.id}/matchs/${match.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir les stats
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
