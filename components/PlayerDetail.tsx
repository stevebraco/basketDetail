import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { JoueurType } from "@/types/types";

function PlayerDetail({ player }: { player: JoueurType }) {
  const details = [
    { label: "Age", value: player.age },
    { label: "Taille", value: player.taille },
    { label: "Poids", value: player.poids ? `${player.poids}kg` : "-" },
    { label: "Equipe", value: player.equipeId ?? "-" },
    { label: "Poste", value: `${player.poste}/${player.posteSecondaire}` },
    { label: "Matchs joués", value: 42 }, // à remplacer par la valeur réelle
  ];

  return (
    <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader className="flex flex-col items-center bg-[#161927] px-5 py-1">
        <Image
          src="/james-harden.webp"
          alt="Player"
          width={160}
          height={160}
          className="rounded-xl object-cover"
        />
        <CardTitle className="text-white text-2xl font-semibold mt-4">
          {player.prenom} {player.nom}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0 w-full">
        {details.map((detail, idx) => (
          <div
            key={idx}
            className={`flex justify-between px-5 py-3 text-sm text-white/90 ${
              idx % 2 === 1 ? "bg-white/[0.02]" : ""
            }`}
          >
            <span className="text-white/60">{detail.label}</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default PlayerDetail;
