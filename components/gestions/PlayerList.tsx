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
import Link from "next/link";

// Exemple de données pour les joueurs
const players = [
  {
    id: 1,
    name: "Steve",
    lastName: "Braco",
    poste: "Arrière",
    age: 34,
    taille: "1m83",
    poids: "73kg",
    role: "Shooteur",
    remarque: "Très bon joueur de 1c1",
  },
  {
    id: 2,
    name: "John",
    lastName: "Doe",
    poste: "Meneur",
    age: 28,
    taille: "1m80",
    poids: "80kg",
    role: "Passeur",
    remarque: "Excellent vision de jeu",
  },
  {
    id: 3,
    name: "Alice",
    lastName: "Smith",
    poste: "Ailier",
    age: 25,
    taille: "1m75",
    poids: "65kg",
    role: "Défenseur",
    remarque: "Bonne défense et récupération",
  },
];

export function PlayerList() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <Table>
        <TableCaption>Liste des joueurs de basket</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Prénom
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Nom
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Poste
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Âge
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Taille
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Poids
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Rôle
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Remarque
            </TableHead>
            <TableHead className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="px-4 py-3 text-red-500 text-start text-theme-sm dark:text-gray-400">
                {player.lastName}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.poste}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.age}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.taille}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.poids}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.role}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                {player.remarque}
              </TableCell>
              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                <Link
                  href={`/joueurs/${player.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Voir les stats
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
