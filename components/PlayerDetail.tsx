import { PlayerType } from "@/types/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

function PlayerDetail({ player }: { player: PlayerType }) {
  console.log(player);
  return (
    <Card className="w-full max-w-4xl bg-[#1B1E2B] border border-white/10 text-[#CFCFE0] shadow-xl rounded-xl">
      <CardHeader className="items-center">
        <Image
          src="/james-harden.webp"
          alt="Player"
          width={160}
          height={160}
          className="rounded-lg object-cover"
        />
        <CardTitle className="text-xl mt-4">
          {player.prenom} {player.nom}
        </CardTitle>
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
            <span>{player.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Taille</span>
            <span>{player.taille}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Poids</span>
            <span>{player.poids}kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Equipe</span>
            <span>{player.equipeId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Poste</span>
            <span>
              {player.poste}/{player.posteSecondaire}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Match joués</span>
            <span>42</span>
          </div>
        </div>

        <Button className="w-full mt-6">Voir plus</Button>
      </CardContent>
    </Card>
  );
}

export default PlayerDetail;
