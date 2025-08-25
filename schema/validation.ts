import { z } from "zod";

export const createPlayerSchema = z.object({
  name: z.string().min(2),
  lastName: z.string().min(2),
  poste: z.string().min(3),
  age: z.string().min(1),
  taille: z.string().min(1),
  poids: z.string().min(1),
  role: z.string().min(1),
  equipe: z.string().optional(),
  remarque: z.string().optional(),

  // Compétences
  tir_2pts: z.number().min(0).max(10),
  tir_3pts: z.number().min(0).max(10),
  lancers_francs: z.number().min(0).max(10),
  creation_tir: z.number().min(0).max(10),

  lecture_jeu: z.number().min(0).max(10),
  vision_jeu: z.number().min(0).max(10),
  prise_decision: z.number().min(0).max(10),
  leadership: z.number().min(0).max(10),

  vitesse: z.number().min(0).max(10),
  agilite: z.number().min(0).max(10),
  puissance: z.number().min(0).max(10),
  endurance: z.number().min(0).max(10),
  saut_vertical: z.number().min(0).max(10),

  defense_1v1: z.number().min(0).max(10),
  defense_collective: z.number().min(0).max(10),
  anticipation: z.number().min(0).max(10),
  contre: z.number().min(0).max(10),

  dribble: z.number().min(0).max(10),
  finition: z.number().min(0).max(10),
  jeu_sans_ballon: z.number().min(0).max(10),
  footwork: z.number().min(0).max(10),
  passe: z.number().min(0).max(10),

  travail: z.number().min(0).max(10),
  potentiel: z.number().min(0).max(10),
  concentration: z.number().min(0).max(10),
  resilience: z.number().min(0).max(10),
});

export const matchSchema = z.object({
  nom: z.string().min(1, "Nom du match requis"),
  dateHeure: z.string().min(1, "Date et heure requises"),
  equipeLocale: z.string().min(1, "Équipe locale requise"),
  equipeAdverse: z.string().min(1, "Équipe adverse requise"),
  lieu: z.string().min(1, "Lieu requis"),
  duree: z.string().min(1, "Durée du match requise"),
  videoUrl: z.string().optional().or(z.literal("")),
  joueurs: z
    .array(z.string())
    .min(1, "Sélectionnez au moins un joueur")
    .max(10, "Vous ne pouvez sélectionner que 10 joueurs au maximum"),
});
