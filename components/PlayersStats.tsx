"use client";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

// Définition du type pour un joueur, avec les statistiques et le poste
type Player = {
  id: number;
  name: string;
  lastName: string;
  poste: string; // Poste du joueur
  points: number; // Points totaux
  points2: number; // Points en 2 points
  points3: number; // Points en 3 points
  freeThrows: number; // Lancers francs
  rebounds: number; // Rebonds
  assists: number; // Passes décisives
  evaluation: number; // Évaluation
  steals: number; // Vols (interceptions)
  blocks: number; // Contres
  fouls: number; // Fautes commises
  minutes: number; // Minutes jouées
};

// Exemple de données pour les joueurs, avec des statistiques et un poste
const players: Player[] = [
  {
    id: 1,
    name: "Steve",
    lastName: "Braco",
    poste: "Arrière",
    points: 25,
    points2: 15,
    points3: 6,
    freeThrows: 4,
    rebounds: 7,
    assists: 5,
    evaluation: 22.5,
    steals: 2,
    blocks: 1,
    fouls: 3,
    minutes: 35,
  },
  {
    id: 2,
    name: "John",
    lastName: "Doe",
    poste: "Meneur",
    points: 18,
    points2: 10,
    points3: 3,
    freeThrows: 5,
    rebounds: 6,
    assists: 8,
    evaluation: 20.4,
    steals: 1,
    blocks: 0,
    fouls: 2,
    minutes: 30,
  },
  {
    id: 3,
    name: "Alice",
    lastName: "Smith",
    poste: "Ailier",
    points: 14,
    points2: 8,
    points3: 2,
    freeThrows: 3,
    rebounds: 9,
    assists: 3,
    evaluation: 18.1,
    steals: 3,
    blocks: 2,
    fouls: 1,
    minutes: 28,
  },
];

export function PlayersStats() {
  return (
    <Table>
      <TableCaption>
        Liste des joueurs de basket avec leurs statistiques
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Prénom</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Poste</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Points 2pts</TableHead>
          <TableHead>Points 3pts</TableHead>
          <TableHead>Lancers francs</TableHead>
          <TableHead>Rebonds</TableHead>
          <TableHead>Passes</TableHead>
          <TableHead>Évaluation</TableHead>
          <TableHead>Vols</TableHead>
          <TableHead>Contres</TableHead>
          <TableHead>Fautes</TableHead>
          <TableHead>Minutes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell>{player.name}</TableCell>
            <TableCell>{player.lastName}</TableCell>
            <TableCell>{player.poste}</TableCell>
            <TableCell>{player.points}</TableCell>
            <TableCell>{player.points2}</TableCell>
            <TableCell>{player.points3}</TableCell>
            <TableCell>{player.freeThrows}</TableCell>
            <TableCell>{player.rebounds}</TableCell>
            <TableCell>{player.assists}</TableCell>
            <TableCell>{player.evaluation}</TableCell>
            <TableCell>{player.steals}</TableCell>
            <TableCell>{player.blocks}</TableCell>
            <TableCell>{player.fouls}</TableCell>
            <TableCell>{player.minutes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
