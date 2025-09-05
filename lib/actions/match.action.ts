"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMatch(params: any) {
  const { nom, videoId, versus, playerIds } = params;

  try {
    // 1️⃣ Créer le match sans playerMatches
    const match = await prisma.match.create({
      data: {
        nom,
        videoId,
        versus,
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

export async function AddStatsMatch(
  id: string,
  shots: any[],
  playersStats: { playerId: string; stats: any }[]
) {
  try {
    console.log("id", id);

    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      console.error(`Match avec id ${id} introuvable`);
      return;
    }

    // Ajouter les tirs
    const updatedTirs = [...(match.tirs || []), ...shots];

    await prisma.match.update({
      where: { id },
      data: { tirs: updatedTirs },
    });

    console.log(`Tirs ajoutés avec succès au match ${id}`);

    // Ajouter ou mettre à jour les stats des joueurs dans playerMatch
    for (const playerStat of playersStats) {
      try {
        await prisma.playerMatch.update({
          where: {
            playerId_matchId: {
              playerId: playerStat.playerId,
              matchId: id,
            },
          },
          data: {
            stats: playerStat.stats,
          },
        });
      } catch (error: any) {
        // Si la ligne n'existe pas, Prisma renvoie l'erreur P2025
        if (error.code === "P2025") {
          console.warn(
            `playerMatch pour playerId ${playerStat.playerId} et matchId ${id} n'existe pas`
          );
        } else {
          throw error;
        }
      }
    }

    console.log(`Stats des joueurs ajoutées/mises à jour pour le match ${id}`);
  } catch (error) {
    console.error("Erreur lors de l'ajout des tirs ou stats :", error);
    throw error;
  }
}
