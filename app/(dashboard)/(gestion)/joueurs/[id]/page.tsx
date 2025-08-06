"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Line } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const STAT_TYPES = [
  "points",
  "passes",
  "rebonds",
  "interceptions",
  "tir2pts",
  "tir3pts",
  "evaluation",
];

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

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
    statsParMatch: [
      {
        match: "Match 1",
        points: 20,
        passes: 5,
        rebonds: 3,
        interceptions: 2,
        tir2pts: 6,
        tir3pts: 2,
        evaluation: 18,
      },
      {
        match: "Match 2",
        points: 18,
        passes: 6,
        rebonds: 4,
        interceptions: 1,
        tir2pts: 5,
        tir3pts: 2,
        evaluation: 17,
      },
      {
        match: "Match 3",
        points: 22,
        passes: 4,
        rebonds: 5,
        interceptions: 3,
        tir2pts: 7,
        tir3pts: 3,
        evaluation: 21,
      },
      {
        match: "Match 4",
        points: 20,
        passes: 5,
        rebonds: 3,
        interceptions: 2,
        tir2pts: 6,
        tir3pts: 2,
        evaluation: 18,
      },
      {
        match: "Match 5",
        points: 20,
        passes: 5,
        rebonds: 3,
        interceptions: 2,
        tir2pts: 6,
        tir3pts: 2,
        evaluation: 18,
      },
    ],
    statsTotales: { points: 60, passes: 15, rebonds: 12, interceptions: 6 },
    infosSup: "Joueur expérimenté, très bon en un contre un.",
    tirs: [
      {
        x: 40,
        y: 20,
        result: "made",
        type: "2pts",
        commentaire: "Bon tir après écran",
      },
      {
        x: 60,
        y: 50,
        result: "missed",
        type: "3pts",
        commentaire: "Tir précipité",
      },
    ],
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
    statsParMatch: [
      {
        match: "Match 1",
        points: 12,
        passes: 10,
        rebonds: 2,
        interceptions: 0,
        tir2pts: 4,
        tir3pts: 1,
        evaluation: 15,
      },
      {
        match: "Match 2",
        points: 15,
        passes: 12,
        rebonds: 3,
        interceptions: 1,
        tir2pts: 5,
        tir3pts: 1,
        evaluation: 18,
      },
      {
        match: "Match 3",
        points: 14,
        passes: 8,
        rebonds: 4,
        interceptions: 2,
        tir2pts: 4,
        tir3pts: 2,
        evaluation: 17,
      },
    ],
    statsTotales: { points: 41, passes: 30, rebonds: 9, interceptions: 3 },
    infosSup: "Très bon distributeur et leader sur le terrain.",
    tirs: [
      {
        x: 30,
        y: 40,
        result: "made",
        type: "2pts",
        commentaire: "Lay-up facile",
      },
    ],
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
    statsParMatch: [
      {
        match: "Match 1",
        points: 8,
        passes: 3,
        rebonds: 7,
        interceptions: 4,
        tir2pts: 3,
        tir3pts: 0,
        evaluation: 12,
      },
      {
        match: "Match 2",
        points: 10,
        passes: 2,
        rebonds: 9,
        interceptions: 5,
        tir2pts: 4,
        tir3pts: 0,
        evaluation: 15,
      },
      {
        match: "Match 3",
        points: 9,
        passes: 4,
        rebonds: 8,
        interceptions: 3,
        tir2pts: 3,
        tir3pts: 1,
        evaluation: 14,
      },
    ],
    statsTotales: { points: 27, passes: 9, rebonds: 24, interceptions: 12 },
    infosSup: "Joueuse clé en défense, excellente récupération.",
    tirs: [],
  },
];

export default function PlayerDetailPage() {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0].id);
  const selectedPlayer = players.find((p) => p.id === selectedPlayerId)!;

  const [selectedStatType, setSelectedStatType] = useState("points");

  const chartData = {
    labels: selectedPlayer.statsParMatch.map((m) => m.match),
    datasets: [
      {
        label: `Évolution des ${selectedStatType}`,
        data: selectedPlayer.statsParMatch.map((m) => m[selectedStatType]),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
      },
    ],
  };

  const radarData = [
    { subject: "Tir", value: 85 },
    { subject: "Q.I. Basket", value: 78 },
    { subject: "Physique", value: 70 },
    { subject: "Défense", value: 74 },
    { subject: "Techniques individuelles", value: 80 },
    { subject: "Mentalité / Potentiel", value: 90 },
  ];

  return (
    <div className="min-h-screen bg-[#0F111C] text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT - PLAYER CARD */}
        <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
          <CardHeader className="items-center">
            <Image
              src=""
              alt="Player"
              width={160}
              height={160}
              className="rounded-lg object-cover"
            />
            <CardTitle className="text-xl mt-4">Steve Braco</CardTitle>
            {/* <p className="text-sm text-white/60">23</p> */}
          </CardHeader>

          <CardContent className="w-full flex flex-col items-center">
            {/* <div className="flex gap-2 mt-2">
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                🇬🇧 England
              </span>
              <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
                🟥 Man United
              </span>
            </div> */}

            <div className="mt-6 w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Age</span>
                <span>32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Taille</span>
                <span>185cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Poids</span>
                <span>72kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Equipe</span>
                <span>Miami Heat</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Poste</span>
                <span>Arrière/Meneur</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Match joués</span>
                <span>42</span>
              </div>
            </div>

            <Button className="w-full mt-6">Voir plus</Button>
          </CardContent>
        </Card>

        {/* RIGHT - GRID SECTIONS */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* PERFORMANCE */}
          <Card className="bg-[#1A1C2C] border-none shadow-md col-span-2">
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
          </Card>

          {/* PRICE CHART */}
          {/* PROFIL TECHNIQUE */}
          <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
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
          </Card>

          {/* STATISTICS */}
          <Card className="bg-[#1A1C2C] border-none shadow-md">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
