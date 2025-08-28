"use server";

import { prisma } from "@/lib/prisma";

export async function createPlayer(params: any) {
  console.log("Formulaire reçu:", params);

  try {
    const player = await prisma.player.create({
      data: {
        prenom: params.name,
        nom: params.lastName,
        age: BigInt(params.age),
        taille: BigInt(params.taille),
        poids: BigInt(params.poids),
        poste: params.poste,
        posteSecondaire: "null", // ou params.posteSecondaire si disponible
        remarque: params.remarque,
        competences: [
          {
            categorie: "tir",
            items: [
              { nom: "tir_2pts", note: params.tir_2pts },
              { nom: "tir_3pts", note: params.tir_3pts },
              { nom: "lancers_francs", note: params.lancers_francs },
              { nom: "creation_tir", note: params.creation_tir },
            ],
          },
          {
            categorie: "qi_basket",
            items: [
              { nom: "lecture_jeu", note: params.lecture_jeu },
              { nom: "vision_jeu", note: params.vision_jeu },
              { nom: "prise_decision", note: params.prise_decision },
              { nom: "leadership", note: params.leadership },
            ],
          },
          {
            categorie: "physique",
            items: [
              { nom: "vitesse", note: params.vitesse },
              { nom: "agilite", note: params.agilite },
              { nom: "puissance", note: params.puissance },
              { nom: "endurance", note: params.endurance },
              { nom: "saut_vertical", note: params.saut_vertical },
            ],
          },
          {
            categorie: "defense",
            items: [
              { nom: "defense_1v1", note: params.defense_1v1 },
              { nom: "defense_collective", note: params.defense_collective },
              { nom: "anticipation", note: params.anticipation },
              { nom: "contre", note: params.contre },
            ],
          },
          {
            categorie: "techniques",
            items: [
              { nom: "dribble", note: params.dribble },
              { nom: "finition", note: params.finition },
              { nom: "jeu_sans_ballon", note: params.jeu_sans_ballon },
              { nom: "footwork", note: params.footwork },
              { nom: "passe", note: params.passe },
            ],
          },
          {
            categorie: "potentiel",
            items: [
              { nom: "travail", note: params.travail },
              { nom: "potentiel", note: params.potentiel },
              { nom: "concentration", note: params.concentration },
              { nom: "resilience", note: params.resilience },
            ],
          },
        ],
      },
    });
    return player;
  } catch (error) {
    console.error("Erreur création joueur:", error);
    throw new Error("Impossible de créer le joueur");
  }
}
