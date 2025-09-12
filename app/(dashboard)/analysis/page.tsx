"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion"; // Import de framer-motion
import { Layer, Stage } from "react-konva";
import BasketBallHalfCourtKonva from "@/components/BasketBallHalfCourtKonva";
import BasketballCourtSVG from "@/components/BasketballCourtSVG";

const players = [
  {
    name: "John Doe",
    points: 12,
    shootingPct: 45,
    rebounds: 8,
    interceptions: 2,
    turnovers: 3,
    fouls: 4,
  },
  {
    name: "Mike Smith",
    points: 20,
    shootingPct: 55,
    rebounds: 10,
    interceptions: 1,
    turnovers: 2,
    fouls: 2,
  },
  {
    name: "Alex Johnson",
    points: 8,
    shootingPct: 38,
    rebounds: 4,
    interceptions: 3,
    turnovers: 1,
    fouls: 2,
  },
  {
    name: "Chris Brown",
    points: 15,
    shootingPct: 50,
    rebounds: 7,
    interceptions: 2,
    turnovers: 4,
    fouls: 3,
  },
  {
    name: "David Wilson",
    points: 6,
    shootingPct: 30,
    rebounds: 5,
    interceptions: 1,
    turnovers: 3,
    fouls: 1,
  },
  {
    name: "James Taylor",
    points: 18,
    shootingPct: 60,
    rebounds: 9,
    interceptions: 2,
    turnovers: 2,
    fouls: 4,
  },
  {
    name: "Brian Lee",
    points: 10,
    shootingPct: 42,
    rebounds: 6,
    interceptions: 0,
    turnovers: 5,
    fouls: 2,
  },
  {
    name: "Kevin Martin",
    points: 22,
    shootingPct: 48,
    rebounds: 11,
    interceptions: 4,
    turnovers: 3,
    fouls: 3,
  },
  {
    name: "Steven Clark",
    points: 14,
    shootingPct: 52,
    rebounds: 7,
    interceptions: 2,
    turnovers: 1,
    fouls: 2,
  },
  {
    name: "Daniel Evans",
    points: 9,
    shootingPct: 35,
    rebounds: 3,
    interceptions: 1,
    turnovers: 2,
    fouls: 1,
  },
];

export default function AnalysisPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-5">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Joueur</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>% Tir</TableHead>
                  <TableHead>Rebonds</TableHead>
                  <TableHead>Interceptions</TableHead>
                  <TableHead>Balles perdues</TableHead>
                  <TableHead>Fautes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.points}</TableCell>
                    <TableCell>{player.shootingPct}%</TableCell>
                    <TableCell>{player.rebounds}</TableCell>
                    <TableCell>{player.interceptions}</TableCell>
                    <TableCell>{player.turnovers}</TableCell>
                    <TableCell>{player.fouls}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="col-span-12">
          <Button>Faute</Button>
          <Button>Rebonds D</Button>
          <Button>Rebonds O</Button>
          <Button>Contre</Button>
          <Button>Interception</Button>
          <Button>Passe D</Button>
          <Button>Balle perdu</Button>
          <Button>Lancer réussi</Button>
          <Button>Lancer raté</Button>
        </div>
      </div>
      <div className="relative col-span-7 w-full h-full">
        {/* <Stage width={858} height={660}>
          <Layer> */}
        {/* <BasketBallHalfCourtKonva /> */}
        <BasketballCourtSVG />
        {/* </Layer> */}
        {/* </Stage> */}
      </div>
    </div>
  );
}
