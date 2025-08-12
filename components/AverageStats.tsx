import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AveragesType } from "@/types/types";

type Props = {
  averages: AveragesType;
  matchesPlayed: number;
};

export default function AverageStats({ averages, matchesPlayed }: Props) {
  return (
    <Card>
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
