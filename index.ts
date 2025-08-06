import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Lire tous les joueurs
  const allPlayers = await prisma.player.findMany();
  console.log("Tous les joueurs:", allPlayers);

  // 2. Créer un joueur
  const newPlayer = await prisma.player.create({
    data: {
      prenom: "Jean",
      nom: "Dupont",
      age: 22,
      taille: 190,
      poids: 85,
      poste: "Meneur",
      posteSecondaire: "Arrière",
      equipeId: 3,
      remarque: "Bon potentiel",
      matchIds: [101, 102, 103], // ← plusieurs ID de matchs associés
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 5 },
            { nom: "tir_3pts", note: 5 },
            { nom: "lancers_francs", note: 5 },
            { nom: "creation_tir", note: 5 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 5 },
            { nom: "vision_jeu", note: 5 },
            { nom: "prise_decision", note: 5 },
            { nom: "leadership", note: 5 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 5 },
            { nom: "agilite", note: 5 },
            { nom: "puissance", note: 5 },
            { nom: "endurance", note: 5 },
            { nom: "saut_vertical", note: 5 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 5 },
            { nom: "defense_collective", note: 5 },
            { nom: "anticipation", note: 5 },
            { nom: "contre", note: 5 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 5 },
            { nom: "finition", note: 5 },
            { nom: "jeu_sans_ballon", note: 5 },
            { nom: "footwork", note: 5 },
            { nom: "passe", note: 5 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 5 },
            { nom: "potentiel", note: 5 },
            { nom: "concentration", note: 5 },
            { nom: "resilience", note: 5 },
          ],
        },
      ],
    },
  });
  console.log("Joueur créé:", newPlayer);

  // 3. Requête avancée : récupérer les joueurs qui ont "Meneur" comme poste
  const meneurs = await prisma.player.findMany({
    where: {
      poste: "Meneur",
    },
  });
  console.log("Meneurs:", meneurs);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
