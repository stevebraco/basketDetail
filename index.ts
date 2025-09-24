import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Lire tous les joueurs
  const allPlayers = await prisma.player.findMany();
  console.log("Tous les joueurs:", allPlayers);

  // 2. Créer un joueur (James Harden avec compétences détaillées)
  const playersData = [
    {
      prenom: "James",
      nom: "Harden",
      age: BigInt(33),
      taille: BigInt(196),
      poids: BigInt(100),
      poste: "Arrière",
      posteSecondaire: "Meneur",
      remarque: "Excellent scoreur et passeur",
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 9 },
            { nom: "tir_3pts", note: 8 },
            { nom: "lancers_francs", note: 9 },
            { nom: "creation_tir", note: 10 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 10 },
            { nom: "vision_jeu", note: 10 },
            { nom: "prise_decision", note: 9 },
            { nom: "leadership", note: 8 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 7 },
            { nom: "agilite", note: 8 },
            { nom: "puissance", note: 7 },
            { nom: "endurance", note: 7 },
            { nom: "saut_vertical", note: 6 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 6 },
            { nom: "defense_collective", note: 6 },
            { nom: "anticipation", note: 7 },
            { nom: "contre", note: 5 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 10 },
            { nom: "finition", note: 9 },
            { nom: "jeu_sans_ballon", note: 8 },
            { nom: "footwork", note: 9 },
            { nom: "passe", note: 10 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 9 },
            { nom: "potentiel", note: 8 },
            { nom: "concentration", note: 8 },
            { nom: "resilience", note: 9 },
          ],
        },
      ],
    },
    {
      prenom: "Kyrie",
      nom: "Irving",
      age: BigInt(31),
      taille: BigInt(188),
      poids: BigInt(84),
      poste: "Meneur",
      posteSecondaire: "Arrière",
      remarque: "Dribble exceptionnel et finition au cercle incroyable",
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 9 },
            { nom: "tir_3pts", note: 8 },
            { nom: "lancers_francs", note: 9 },
            { nom: "creation_tir", note: 10 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 9 },
            { nom: "vision_jeu", note: 9 },
            { nom: "prise_decision", note: 8 },
            { nom: "leadership", note: 7 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 8 },
            { nom: "agilite", note: 10 },
            { nom: "puissance", note: 6 },
            { nom: "endurance", note: 8 },
            { nom: "saut_vertical", note: 7 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 6 },
            { nom: "defense_collective", note: 6 },
            { nom: "anticipation", note: 7 },
            { nom: "contre", note: 4 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 10 },
            { nom: "finition", note: 10 },
            { nom: "jeu_sans_ballon", note: 8 },
            { nom: "footwork", note: 8 },
            { nom: "passe", note: 9 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 8 },
            { nom: "potentiel", note: 8 },
            { nom: "concentration", note: 8 },
            { nom: "resilience", note: 8 },
          ],
        },
      ],
    },
    {
      prenom: "Anthony",
      nom: "Edwards",
      age: BigInt(22),
      taille: BigInt(193),
      poids: BigInt(102),
      poste: "Arrière",
      posteSecondaire: "Ailier",
      remarque: "Scoreur explosif et athlétique",
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 8 },
            { nom: "tir_3pts", note: 8 },
            { nom: "lancers_francs", note: 8 },
            { nom: "creation_tir", note: 9 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 7 },
            { nom: "vision_jeu", note: 7 },
            { nom: "prise_decision", note: 7 },
            { nom: "leadership", note: 8 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 9 },
            { nom: "agilite", note: 9 },
            { nom: "puissance", note: 9 },
            { nom: "endurance", note: 8 },
            { nom: "saut_vertical", note: 10 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 7 },
            { nom: "defense_collective", note: 7 },
            { nom: "anticipation", note: 8 },
            { nom: "contre", note: 6 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 8 },
            { nom: "finition", note: 9 },
            { nom: "jeu_sans_ballon", note: 8 },
            { nom: "footwork", note: 8 },
            { nom: "passe", note: 7 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 9 },
            { nom: "potentiel", note: 10 },
            { nom: "concentration", note: 8 },
            { nom: "resilience", note: 9 },
          ],
        },
      ],
    },
    {
      prenom: "Kevin",
      nom: "Durant",
      age: BigInt(35),
      taille: BigInt(208),
      poids: BigInt(109),
      poste: "Ailier",
      posteSecondaire: "Ailier fort",
      remarque: "Scoreur élite toutes zones",
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 10 },
            { nom: "tir_3pts", note: 9 },
            { nom: "lancers_francs", note: 9 },
            { nom: "creation_tir", note: 10 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 9 },
            { nom: "vision_jeu", note: 9 },
            { nom: "prise_decision", note: 9 },
            { nom: "leadership", note: 8 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 7 },
            { nom: "agilite", note: 8 },
            { nom: "puissance", note: 8 },
            { nom: "endurance", note: 8 },
            { nom: "saut_vertical", note: 8 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 7 },
            { nom: "defense_collective", note: 8 },
            { nom: "anticipation", note: 8 },
            { nom: "contre", note: 7 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 8 },
            { nom: "finition", note: 9 },
            { nom: "jeu_sans_ballon", note: 9 },
            { nom: "footwork", note: 9 },
            { nom: "passe", note: 8 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 9 },
            { nom: "potentiel", note: 9 },
            { nom: "concentration", note: 8 },
            { nom: "resilience", note: 8 },
          ],
        },
      ],
    },
    {
      prenom: "LeBron",
      nom: "James",
      age: BigInt(39),
      taille: BigInt(206),
      poids: BigInt(113),
      poste: "Ailier",
      posteSecondaire: "Meneur",
      remarque: "Polyvalent, leader et passeur d’exception",
      competences: [
        {
          categorie: "tir",
          items: [
            { nom: "tir_2pts", note: 9 },
            { nom: "tir_3pts", note: 8 },
            { nom: "lancers_francs", note: 7 },
            { nom: "creation_tir", note: 9 },
          ],
        },
        {
          categorie: "qi_basket",
          items: [
            { nom: "lecture_jeu", note: 10 },
            { nom: "vision_jeu", note: 10 },
            { nom: "prise_decision", note: 10 },
            { nom: "leadership", note: 10 },
          ],
        },
        {
          categorie: "physique",
          items: [
            { nom: "vitesse", note: 8 },
            { nom: "agilite", note: 8 },
            { nom: "puissance", note: 10 },
            { nom: "endurance", note: 9 },
            { nom: "saut_vertical", note: 9 },
          ],
        },
        {
          categorie: "defense",
          items: [
            { nom: "defense_1v1", note: 8 },
            { nom: "defense_collective", note: 9 },
            { nom: "anticipation", note: 9 },
            { nom: "contre", note: 8 },
          ],
        },
        {
          categorie: "techniques",
          items: [
            { nom: "dribble", note: 8 },
            { nom: "finition", note: 9 },
            { nom: "jeu_sans_ballon", note: 9 },
            { nom: "footwork", note: 9 },
            { nom: "passe", note: 10 },
          ],
        },
        {
          categorie: "potentiel",
          items: [
            { nom: "travail", note: 9 },
            { nom: "potentiel", note: 10 },
            { nom: "concentration", note: 9 },
            { nom: "resilience", note: 10 },
          ],
        },
      ],
    },
  ];

  // Créer les joueurs et récupérer leurs IDs
  const createdPlayers = [];
  for (const p of playersData) {
    const player = await prisma.player.create({ data: p });
    createdPlayers.push(player);
  }

  // 2. Créer 2 matchs
  const matchesData = [
    {
      nom: "Match 1",
      videoId: "video_match_1",
      createdAt: new Date(), // date courante
      versus: `Los angeles Lakers`,
      isHalfCourt: true,
      tirs: [
        {
          x: 358,
          y: 109,
          type: "2PT",
          made: true,
          commentaire: "",
          typeItem: "shot",
          playerId: createdPlayers[0].id,
          player: createdPlayers[0].prenom,
          zone: "3-points Gauche Inversé",
        },
        {
          x: 414,
          y: 169,
          commentaire: "",
          eventType: "perte_de_balle",
          typeItem: "event",
          playerId: createdPlayers[1].id,
          player: createdPlayers[1].prenom,
          zone: "3-points Gauche Inversé",
        },
        {
          x: 345,
          y: 98,
          type: "3PT",
          made: false,
          commentaire: "Tir manqué",
          typeItem: "shot",
          playerId: createdPlayers[0].id,
          player: createdPlayers[0].prenom,
          zone: "3-points Gauche Inversé",
        },
      ],
    },
    {
      nom: "Match 2",
      videoId: "video_match_2",
      createdAt: new Date(), // date courante
      versus: `Los angeles clippers`,
      isHalfCourt: true,
      tirs: [
        {
          x: 441,
          y: 71,
          type: "2PT",
          made: true,
          commentaire: "",
          typeItem: "shot",
          playerId: createdPlayers[1].id,
          player: createdPlayers[1].prenom,
          zone: "3-points Gauche Inversé",
        },
        {
          x: 100,
          y: 174,
          commentaire: "Faute offensive",
          eventType: "faute",
          typeItem: "event",
          playerId: createdPlayers[0].id,
          player: createdPlayers[0].prenom,
          zone: "3-points Gauche Inversé",
        },
      ],
    },
  ];

  const matches = [];
  for (const m of matchesData) {
    const match = await prisma.match.create({ data: m });
    matches.push(match);
  }

  // 3. Créer les stats pour chaque joueur sur chaque match (2 matchs chacun)
  for (const player of createdPlayers) {
    for (const match of matches) {
      await prisma.playerMatch.create({
        data: {
          playerId: player.id,
          matchId: match.id,
          stats: {
            points: Math.floor(Math.random() * 30) + 10, // ex: entre 10 et 39 points
            fgm: Math.floor(Math.random() * 15),
            fga: Math.floor(Math.random() * 25) + 15,
            threePM: Math.floor(Math.random() * 5),
            threePA: Math.floor(Math.random() * 10),
            ftm: Math.floor(Math.random() * 10),
            fta: Math.floor(Math.random() * 12),
            reboundsOff: Math.floor(Math.random() * 5),
            reboundsDef: Math.floor(Math.random() * 10),
            reboundsTotal: Math.floor(Math.random() * 14),
            assists: Math.floor(Math.random() * 10),
            turnovers: Math.floor(Math.random() * 5),
            steals: Math.floor(Math.random() * 5),
            blocks: Math.floor(Math.random() * 5),
            fautes: Math.floor(Math.random() * 5),
            minutes: Math.floor(Math.random() * 40),
            plusMinus: Math.floor(Math.random() * 20) - 10,
          },
        },
      });
    }
  }

  console.log("Création terminée : 5 joueurs avec 2 matchs chacun");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
