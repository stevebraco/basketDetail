import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AveragesType } from "@/types/types";

type Props = {
  averages: AveragesType;
  matchesPlayed: number;
};

export default function AverageStats({ averages, matchesPlayed }: Props) {
  const stats = [
    { label: "Matchs joués", value: matchesPlayed },
    { label: "Points / match", value: averages.points?.toFixed(2) },
    {
      label: "Rebonds offensifs / match",
      value: averages.reboundsOff?.toFixed(2),
    },
    {
      label: "Rebonds défensifs / match",
      value: averages.reboundsDef?.toFixed(2),
    },
    {
      label: "Rebonds totaux / match",
      value: averages.reboundsTotal?.toFixed(2),
    },
    { label: "Passes décisives / match", value: averages.assists?.toFixed(2) },
    { label: "Interceptions / match", value: averages.steals?.toFixed(2) },
    { label: "Contres / match", value: averages.blocks?.toFixed(2) },
    { label: "Ballons perdus / match", value: averages.turnovers?.toFixed(2) },
    { label: "Fautes / match", value: averages.fautes?.toFixed(2) },
    { label: "Minutes jouées / match", value: averages.minutes?.toFixed(2) },
    { label: "Plus/Moins moyen", value: averages.plusMinus?.toFixed(2) },
  ];

  return (
    <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader className="border-b border-white/5 bg-[#161927] px-5 py-1">
        <CardTitle className="text-white text-lg font-semibold tracking-wide">
          Statistiques moyennes
        </CardTitle>
      </CardHeader>

      <CardContent className="divide-y divide-white/5 p-0">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between px-5 py-1.5 text-sm ${
              idx % 2 === 1 ? "bg-white/[0.02]" : ""
            }`}
          >
            <span className="text-white">{stat.label}</span>
            <span className="text-white/90 font-medium">
              {stat.value ?? "-"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
