import { SkillSectionType } from "@/types/types";

export const skillSections: SkillSectionType[] = [
  {
    title: "🔫 Tir",
    skills: [
      { name: "tir_2pts", label: "Tir à mi-distance (2 pts)" },
      { name: "tir_3pts", label: "Tir à 3 points" },
      { name: "lancers_francs", label: "Lancers francs" },
      { name: "creation_tir", label: "Création de tir" },
    ],
  },
  {
    title: "🧠 Q.I. Basket",
    skills: [
      { name: "lecture_jeu", label: "Lecture du jeu" },
      { name: "vision_jeu", label: "Vision de jeu" },
      { name: "prise_decision", label: "Prise de décision" },
      { name: "leadership", label: "Leadership" },
    ],
  },
  {
    title: "💪 Physique",
    skills: [
      { name: "vitesse", label: "Vitesse" },
      { name: "agilite", label: "Agilité" },
      { name: "puissance", label: "Puissance" },
      { name: "endurance", label: "Endurance" },
      { name: "saut_vertical", label: "Saut vertical" },
    ],
  },
  {
    title: "🛡️ Défense",
    skills: [
      { name: "defense_1v1", label: "Défense 1v1" },
      { name: "defense_collective", label: "Défense collective" },
      { name: "anticipation", label: "Anticipation / Interceptions" },
      { name: "contre", label: "Contre" },
    ],
  },
  {
    title: "✋ Techniques individuelles",
    skills: [
      { name: "dribble", label: "Dribble / Handle" },
      { name: "finition", label: "Finition proche du panier" },
      { name: "jeu_sans_ballon", label: "Jeu sans ballon" },
      { name: "footwork", label: "Pied de pivot / footwork" },
      { name: "passe", label: "Passe" },
    ],
  },
  {
    title: "🚀 Mentalité / Potentiel",
    skills: [
      { name: "travail", label: "Travail / Éthique" },
      { name: "potentiel", label: "Potentiel" },
      { name: "concentration", label: "Concentration" },
      { name: "resilience", label: "Résilience" },
    ],
  },
];
