"use client";
import { ArrowBigDown, GroupIcon, Trash2Icon } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Team = {
  id: string;
  name: string;
  playerCount: number;
  stats: string;
  isWin: boolean;
};

const teams: Team[] = [
  {
    id: "1",
    name: "OKC",
    playerCount: 12,
    stats: "68 PTS",
    isWin: true,
  },
  {
    id: "2",
    name: "Charlotte Hornets",
    playerCount: 10,
    stats: "75 PTS",
    isWin: false,
  },
];

export const TeamTable = ({ matchs }: any) => {
  console.log(matchs);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des équipes</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Équipe</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Joueurs</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.category}</TableCell>
                <TableCell>{team.coach}</TableCell>
                <TableCell>{team.playerCount}</TableCell>
                <TableCell>{team.stats}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Link href={`/matchs/${1}`}>
                    <Button size="icon" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="icon" variant="outline">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive">
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}
    </div>
  );
};
