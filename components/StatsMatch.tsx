"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { calculateTotalRebounds } from "@/utils/StatsByPlayer";

export default function StatsMatch({
  matchPlayed,
  handlePlayerClick,
  selectedPlayer,
}: any) {
  console.log(matchPlayed);
  return (
    <Card className="w-full  bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl col-span-2">
      <CardHeader>
        <CardTitle>Derniers matchs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-white/60">
              {/* <TableHead className="whitespace-nowrap">Match</TableHead> */}
              <TableHead className="whitespace-nowrap">Joueur</TableHead>
              <TableHead className="whitespace-nowrap">Points</TableHead>
              <TableHead className="whitespace-nowrap">Passes</TableHead>
              <TableHead className="whitespace-nowrap">Rebonds</TableHead>
              <TableHead className="whitespace-nowrap">Interceptions</TableHead>
              <TableHead className="whitespace-nowrap">Tirs réussis</TableHead>
              <TableHead className="whitespace-nowrap">Tirs tentés</TableHead>
              <TableHead className="whitespace-nowrap">3 pts réussis</TableHead>
              <TableHead className="whitespace-nowrap">3 pts tentés</TableHead>
              <TableHead className="whitespace-nowrap">
                Lancers francs réussis
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Lancers francs tentés
              </TableHead>
              <TableHead className="whitespace-nowrap">Fautes</TableHead>
              <TableHead className="whitespace-nowrap">Minutes</TableHead>
              <TableHead className="whitespace-nowrap">+/-</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchPlayed.map((item, idx) => {
              if (!item.stats) return;
              return (
                <TableRow key={idx} className="text-sm text-white/90">
                  <TableCell
                    className={`${
                      selectedPlayer === item?.player?.nom ? "bg-blue-100" : ""
                    }`}
                    onClick={() =>
                      handlePlayerClick(item.player.nom, item.player.id)
                    }
                  >
                    {item.player?.nom
                      ? `${item.player.prenom} ${item.player.nom}`
                      : `${item.match?.nom}`}
                  </TableCell>
                  <TableCell>{item.stats.points}</TableCell>
                  <TableCell>{item.stats.assists}</TableCell>
                  <TableCell>{calculateTotalRebounds(item.stats)}</TableCell>
                  <TableCell>{item.stats.steals}</TableCell>
                  <TableCell>{item.stats.fgm}</TableCell>
                  <TableCell>{item.stats.fga}</TableCell>
                  <TableCell>{item.stats.threePM}</TableCell>
                  <TableCell>{item.stats.threePA}</TableCell>
                  <TableCell>{item.stats.ftm}</TableCell>
                  <TableCell>{item.stats.fta}</TableCell>
                  <TableCell>{item.stats.fautes}</TableCell>
                  <TableCell>{item.stats.minutes}</TableCell>
                  <TableCell>{item.stats.plusMinus}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
