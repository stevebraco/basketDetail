"use server";

import { prisma } from "@/lib/prisma";

const playerIds = [
  "689bb21fb513c6f3e5cf60f8",
  "689bb220b513c6f3e5cf60fb",
  "689bb220b513c6f3e5cf60f9",
  "689bb220b513c6f3e5cf60fc",
  "689bb220b513c6f3e5cf60fa",
];

export async function createMatch() {
  try {
    // 1️⃣ Créer le match sans playerMatches
    const match = await prisma.match.create({
      data: {
        nom: "test nom",
        videoId: "7NR6R8fne9s",
        versus: "Paris Basketball",
        score: "98-100",
        hasWon: true,
        location: "Paris",
        duration: "2025-08-19T17:47",
      },
    });

    // 2️⃣ Créer PlayerMatch et initialiser stats pour chaque joueur
    for (const playerId of playerIds) {
      await prisma.playerMatch.create({
        data: {
          player: { connect: { id: playerId } },
          match: { connect: { id: match.id } },
          stats: {
            // Ici on initialise tous les champs à 0
            points: 0,
            fgm: 0,
            fga: 0,
            threePM: 0,
            threePA: 0,
            ftm: 0,
            fta: 0,
            reboundsOff: 0,
            reboundsDef: 0,
            reboundsTotal: 0,
            assists: 0,
            turnovers: 0,
            steals: 0,
            blocks: 0,
            fautes: 0,
            minutes: 0,
            plusMinus: 0,
          },
        },
      });
    }

    // 3️⃣ Retourner le match avec les PlayerMatch et stats
    const result = await prisma.match.findUnique({
      where: { id: match.id },
      include: {
        playerMatches: {
          include: { player: true, stats: true },
        },
      },
    });

    return result;
  } catch (error) {
    console.error("Erreur création match:", error);
    throw new Error("Impossible de créer le match");
  }
}
