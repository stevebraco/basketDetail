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
    <div className="col-span-full mt-4 overflow-x-auto">
      <Table className="min-w-full border border-gray-700 text-white">
        <TableHeader>
          <TableRow>
            <TableHead className="border px-2 py-1">Zone</TableHead>
            <TableHead className="border px-2 py-1">PTS</TableHead>
            <TableHead className="border px-2 py-1">SA</TableHead>
            <TableHead className="border px-2 py-1">Freq</TableHead>
            {/* <TableHead className="border px-2 py-1">TS%</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsParZone.map((z: any) => (
            <TableRow key={z.zone}>
              <TableCell className="border px-2 py-1">{z.zone}</TableCell>
              <TableCell className="border px-2 py-1">{z.pts}</TableCell>
              <TableCell className="border px-2 py-1">{z.sa}</TableCell>
              <TableCell className="border px-2 py-1">{z.freq}</TableCell>
              {/* <TableCell className="border px-2 py-1">{z.ts}</TableCell> */}
            </TableRow>
          ))}
          <TableRow className="font-bold border-t border-gray-700">
            <TableCell className="border px-2 py-1">Total</TableCell>
            <TableCell className="border px-2 py-1">{totals.pts}</TableCell>
            <TableCell className="border px-2 py-1">{totals.sa}</TableCell>
            <TableCell className="border px-2 py-1">{totals.freq}</TableCell>
            {/* <TableCell className="border px-2 py-1">{totals.ts}</TableCell> */}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
