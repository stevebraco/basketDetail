import PlayerDetail from "@/components/PlayerDetail";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { PlayerType } from "@/types/types";
import Image from "next/image";
import React from "react";

export default async function PlayerDetailPage() {
  const playerDetail = await prisma.player.findUnique({
    where: {
      id: "6893d11c7a664a22861dbec5",
    },
  });

  if (!playerDetail) {
    return (
      <div className="min-h-screen bg-[#0F111C] text-white p-6">
        <p>Joueur non trouvé.</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#0F111C] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT - PLAYER CARD */}
        <PlayerDetail player={playerDetail} />

        {/* RIGHT - GRID SECTIONS */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* PERFORMANCE */}
          {/* <Card className="bg-[#1A1C2C] border-none shadow-md col-span-2">
            <CardHeader>
              <CardTitle>Derniers matchs</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-white/60">
                    <TableHead className="whitespace-nowrap">Match</TableHead>
                    <TableHead className="whitespace-nowrap">Points</TableHead>
                    <TableHead className="whitespace-nowrap">Passes</TableHead>
                    <TableHead className="whitespace-nowrap">Rebonds</TableHead>
                    <TableHead className="whitespace-nowrap">
                      Interceptions
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Tir 2pts
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Tir 3pts
                    </TableHead>
                    <TableHead className="whitespace-nowrap">
                      Évaluation
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPlayer.statsParMatch.map((stat, idx) => (
                    <TableRow key={idx} className="text-sm text-white/90">
                      <TableCell>{stat.match}</TableCell>
                      <TableCell>{stat.points}</TableCell>
                      <TableCell>{stat.passes}</TableCell>
                      <TableCell>{stat.rebonds}</TableCell>
                      <TableCell>{stat.interceptions}</TableCell>
                      <TableCell>{stat.tir2pts}</TableCell>
                      <TableCell>{stat.tir3pts}</TableCell>
                      <TableCell>{stat.evaluation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card> */}

          {/* PROFIL TECHNIQUE */}
          {/* <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle>Profil technique - Radar Chart</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <RadarChart
                cx={150}
                cy={150}
                outerRadius={120}
                width={320}
                height={320}
                data={radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Profil du joueur"
                  dataKey="value"
                  stroke="rgba(59, 130, 246, 1)"
                  fill="rgba(59, 130, 246, 0.3)"
                  fillOpacity={0.6}
                  dot={{ r: 4, fillOpacity: 1 }}
                />
                <Tooltip />
              </RadarChart>
            </CardContent>
          </Card> */}

          {/* STATISTICS */}
          {/* <Card className="bg-[#1A1C2C] border-none shadow-md">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Match joués</span>
                <span>72</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Points par match</span>
                <span>21.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Rebonds par match</span>
                <span>17</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Passes par match</span>
                <span>14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Contre / match</span>
                <span>32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Minutes / match</span>
                <span>2</span>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
