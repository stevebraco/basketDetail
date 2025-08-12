"use client";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RadarChart as RChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { ChartConfig } from "@/components/ui/chart";

type competencesProps = {
  categorie: string;
  items: {
    nom: string;
    note: number;
  }[];
};

function RadarChart({ competences }: { competences: competencesProps[] }) {
  const moyenneParCategorie = competences.map((cat) => {
    console.log(cat);
    const total = cat.items.reduce((sum, item) => sum + item.note, 0);
    const moyenne = total / cat.items.length;
    return { categorie: cat.categorie, moyenne: Number(moyenne.toFixed(2)) };
  });

  const radarData = moyenneParCategorie.map((cat) => ({
    subject: cat.categorie,
    value: cat.moyenne,
  }));

  return (
    <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader>
        <CardTitle>Profil technique - Radar Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <RChart
          cx={150}
          cy={150}
          outerRadius={120}
          width={320}
          height={320}
          data={radarData}
        >
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: "#ffffff" }}
            stroke="#fffff"
          />
          <PolarRadiusAxis angle={30} domain={[0, 10]} />
          <Radar
            name="Profil du joueur"
            dataKey="value"
            stroke="#454587"
            fill="#454587"
            fillOpacity={0.2}
            dot={{ r: 4, fillOpacity: 1 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e1e2f", // fond
              borderRadius: "8px",
              color: "#fff", // texte
              fontSize: "14px",
              padding: "8px 12px",
            }}
            itemStyle={{
              color: "#ffffff", // couleur du texte des valeurs
            }}
            labelStyle={{
              color: "#ffffff", // couleur du label
              fontWeight: "bold",
            }}
          />
        </RChart>
      </CardContent>
    </Card>
  );
}

export default RadarChart;
