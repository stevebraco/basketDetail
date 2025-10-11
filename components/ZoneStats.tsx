"use client";

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "./ui/card";

interface Shot {
  x: number;
  y: number;
  type: "2PT" | "3PT";
  made: boolean;
  player: string;
  zone: string;
}

interface ZoneStatsProps {
  playerTirs: Shot[];
}

export default function ZoneStats({ playerTirs }: ZoneStatsProps) {
  const { statsParZone, totals } = useMemo(() => {
    const totalTirs = playerTirs.length;

    const zoneMap: Record<
      string,
      { pts: number; attempts: number; makes: number }
    > = {};

    // Calculer pts, tentatives et réussites par zone
    for (const s of playerTirs) {
      if (!s.zone) continue;

      if (!zoneMap[s.zone]) {
        zoneMap[s.zone] = { pts: 0, attempts: 0, makes: 0 };
      }

      const z = zoneMap[s.zone];
      z.attempts += 1;
      if (s.made) {
        z.makes += 1;
        z.pts += s.type === "3PT" ? 3 : 2;
      }
    }

    // Transformer en tableau pour le rendu
    const statsParZone = Object.entries(zoneMap).map(([zone, z]) => ({
      zone,
      pts: z.pts,
      sa: z.attempts,
      freq: ((z.attempts / totalTirs) * 100).toFixed(0) + " %",
      ts: z.attempts ? ((z.makes / z.attempts) * 100).toFixed(0) + " %" : "0 %",
    }));

    // Totaux
    const totalPts = statsParZone.reduce((sum, z) => sum + z.pts, 0);
    const totalAttempts = statsParZone.reduce((sum, z) => sum + z.sa, 0);
    const totalMakes = statsParZone.reduce(
      (sum, z) => sum + Math.round((parseInt(z.ts) * z.sa) / 100),
      0
    );

    const totals = {
      pts: totalPts,
      sa: totalAttempts,
      freq: "100 %",
      ts: totalAttempts
        ? ((totalMakes / totalAttempts) * 100).toFixed(0) + " %"
        : "0 %",
    };

    return { statsParZone, totals };
  }, [playerTirs]);

  return (
    <Card className="w-full bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl col-span-2">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/5 bg-[#161927]">
            <TableHead className="px-5 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Zone
            </TableHead>
            <TableHead className="px-5 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">
              PTS
            </TableHead>
            <TableHead className="px-5 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">
              SA
            </TableHead>
            <TableHead className="px-5 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">
              Freq
            </TableHead>
            <TableHead className="px-5 py-1 text-left text-xs font-semibold text-white uppercase tracking-wider">
              % Réussite
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-white/5">
          {statsParZone.map((z: any) => (
            <TableRow
              key={z.zone}
              className="text-sm text-white/90 transition-colors hover:bg-blue-500/10"
            >
              <TableCell className="px-5 py-1.5 font-medium">
                {z.zone}
              </TableCell>
              <TableCell className="px-5 py-1.5">{z.pts}</TableCell>
              <TableCell className="px-5 py-1.5">{z.sa}</TableCell>
              <TableCell className="px-5 py-1.5">{z.freq}</TableCell>
              <TableCell className="px-5 py-1.5">{z.ts}</TableCell>
            </TableRow>
          ))}

          {/* Ligne Total */}
          <TableRow className="font-semibold bg-white/5">
            <TableCell className="px-5 py-1.5">Total</TableCell>
            <TableCell className="px-5 py-1.5">{totals.pts}</TableCell>
            <TableCell className="px-5 py-1.5">{totals.sa}</TableCell>
            <TableCell className="px-5 py-1.5">{totals.freq}</TableCell>
            <TableCell className="px-5 py-1.5">{totals.ts}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
