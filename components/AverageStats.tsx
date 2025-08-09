import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Averages = {
  points?: number;
  reboundsOff?: number;
  reboundsDef?: number;
  reboundsTotal?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fautes?: number;
  minutes?: number;
  plusMinus?: number;
};

type Props = {
  averages: Averages;
  matchesPlayed: number;
};

export default function AverageStats({ averages, matchesPlayed }: Props) {
  return (
    <Card className="bg-[#1A1C2C] border-none shadow-md">
      <CardHeader>
        <CardTitle>Statistiques moyennes</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex justify-between">
          <span className="text-white/60">Matchs joués</span>
          <span>{matchesPlayed}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Points par match</span>
          <span>{averages.points?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Rebonds offensifs / match</span>
          <span>{averages.reboundsOff?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Rebonds défensifs / match</span>
          <span>{averages.reboundsDef?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Rebonds totaux / match</span>
          <span>{averages.reboundsTotal?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Passes décisives / match</span>
          <span>{averages.assists?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Interceptions / match</span>
          <span>{averages.steals?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Contres / match</span>
          <span>{averages.blocks?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Ballons perdus / match</span>
          <span>{averages.turnovers?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Fautes / match</span>
          <span>{averages.fautes?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Minutes jouées / match</span>
          <span>{averages.minutes?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60">Plus/Moins moyen</span>
          <span>{averages.plusMinus?.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
