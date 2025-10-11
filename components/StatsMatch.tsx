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
  return (
    <Card className="w-full bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle>Derniers matchs</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/5 bg-[#161927]">
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Joueur
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Points
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Passes
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Rebonds
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Interceptions
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Tirs réussis
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Tirs tentés
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                3 pts réussis
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                3 pts tentés
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                LF réussis
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                LF tentés
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Fautes
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                Minutes
              </TableHead>
              <TableHead className="px-5 py-1.5text-left text-xs font-semibold text-white uppercase tracking-wider">
                +/-
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-white/5">
            {matchPlayed?.map((item, idx) => {
              if (!item.stats) return null;

              const isSelected = selectedPlayer === item?.player?.nom;

              return (
                <TableRow
                  key={idx}
                  className={`text-sm text-white/90 transition-colors hover:bg-blue-500/10 ${
                    isSelected
                      ? "bg-white/5" // ligne sélectionnée = fond clair
                      : "hover:bg-blue-500/10" // hover = bleu foncé léger
                  }`}
                >
                  <TableCell
                    className="px-5 py-1.5 cursor-pointer whitespace-nowrap font-medium"
                    onClick={() =>
                      handlePlayerClick(item.player.nom, item.player.id)
                    }
                  >
                    {item.player?.nom
                      ? `${item.player.prenom} ${item.player.nom}`
                      : `${item.match?.nom}`}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.points}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.assists}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {calculateTotalRebounds(item.stats)}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.steals}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.fgm}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.fga}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.threePM}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.threePA}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.ftm}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.fta}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.fautes}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.minutes}
                  </TableCell>
                  <TableCell className="px-5 py-1.5">
                    {item.stats.plusMinus}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
