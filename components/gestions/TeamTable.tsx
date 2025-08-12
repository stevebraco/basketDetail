"use client";
import { Eye, Pencil, Trash2, BarChart2 } from "lucide-react";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const TeamTable = ({ matchs }: any) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h2 className="text-xl font-semibold mb-4">Liste des matchs</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match</TableHead>
              <TableHead>Versus</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Résultat</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchs.map((match: any) => {
              // Calcul des points totaux, exemple ici sum des points dans playerMatches
              const totalPoints = match.playerMatches?.reduce(
                (acc: number, pm: any) => acc + (pm.points || 0),
                0
              );

              return (
                <TableRow key={match.id}>
                  <TableCell>{match.nom}</TableCell>
                  <TableCell>{match.versus}</TableCell>
                  <TableCell>{match.score}</TableCell>
                  <TableCell>{match.duration}</TableCell>
                  <TableCell>
                    {match.hasWon ? (
                      <span className="text-green-600 font-semibold">
                        Gagné
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">Perdu</span>
                    )}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Link href={`/matchs/${match.id}`}>
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
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
