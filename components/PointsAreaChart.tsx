"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TooltipProps } from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

interface PlayerMatch {
  id: string;
  stats: {
    points: number;
    reboundsTotal: number;
    steals: number;
  };
  match: {
    id: string;
    nom: string;
  };
}

interface PointsAreaChartProps {
  playerStats: PlayerMatch[];
}

// --- Tooltip personnalisé ---
function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) {
  if (!active || !payload || !payload.length) return null;
  const val = payload[0].value as number;

  return (
    <div className="bg-[#0B0D12] border border-white/5 text-white text-sm px-3 py-2 rounded-lg shadow-lg">
      <div className="font-semibold">{label}</div>
      <div className="mt-1">
        Valeur : <span className="font-medium">{val}</span>
      </div>
    </div>
  );
}

export default function PointsAreaChart({ playerStats }: PointsAreaChartProps) {
  const [statType, setStatType] = useState<
    "points" | "rebonds" | "interceptions"
  >("points");

  // Transformer playerStats en données pour le graphique
  const data = playerStats.map((match) => ({
    match: match.match.nom,
    value:
      statType === "points"
        ? match.stats.points
        : statType === "rebonds"
        ? match.stats.reboundsTotal
        : match.stats.steals,
  }));

  const avg = data.reduce((s, d) => s + d.value, 0) / data.length;

  const labelMap: Record<typeof statType, string> = {
    points: "Points marqués",
    rebonds: "Rebonds",
    interceptions: "Interceptions",
  };

  return (
    <Card className="w-full bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader className="border-b border-white/5 bg-[#161927] px-5 py-3 flex justify-between items-center">
        <CardTitle className="text-white text-lg font-semibold">
          {labelMap[statType]} — derniers matchs
        </CardTitle>

        {/* Sélecteur de statistique */}
        <Select
          value={statType}
          onValueChange={(val) => setStatType(val as any)}
        >
          <SelectTrigger className="w-40 bg-[#1B1E2B] border-white/10 text-white text-sm">
            <SelectValue placeholder="Choisir une stat" />
          </SelectTrigger>
          <SelectContent className="bg-[#1B1E2B] border-white/10 text-white">
            <SelectItem value="points">Points</SelectItem>
            <SelectItem value="rebonds">Rebonds</SelectItem>
            <SelectItem value="interceptions">Interceptions</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="p-4">
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 16, left: -10, bottom: 6 }}
            >
              <defs>
                <linearGradient id="colorStat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#ffffff10"
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="match"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#E6E6F0", fontSize: 12 }}
                padding={{ left: 8, right: 8 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#E6E6F0", fontSize: 12 }}
                allowDecimals={false}
                domain={[
                  0,
                  (dataMax: number) =>
                    Math.ceil(Math.max(5, dataMax + 2) / 5) * 5,
                ]}
              />

              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ outline: "none" }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#colorLine)"
                strokeWidth={3}
                fill="url(#colorStat)"
                activeDot={{
                  r: 5,
                  stroke: "#fff",
                  strokeWidth: 2,
                  fill: "#3B82F6",
                }}
                dot={{ r: 3, fill: "#fff" }}
                isAnimationActive={true}
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-white/60">
            Nombre de matchs : {data.length}
          </span>
          <span className="text-white font-semibold">
            Moyenne : {avg.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
