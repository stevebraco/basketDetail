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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

export function PlayerList({ players }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white text-xl">Liste des joueurs</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Joueur
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Poste
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Âge
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Taille
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Poids
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Remarque
              </TableHead>
              <TableHead className="px-5 py-3 font-medium text-gray-500 dark:text-gray-400 text-start text-theme-xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="px-4 py-3 text-red-500 text-start text-theme-sm dark:text-gray-400">
                  {player.prenom} {player.nom}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
                  {player.poste}/{player.posteSecondaire}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
                  {player.age}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
                  {player.taille}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
                  {player.poids}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
                  {player.remarque}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 dark:text-gray-400 text-start text-theme-sm">
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
      </CardContent>
    </Card>
  );
}
