// Types des joueurs avec stats détaillées
export type PlayerStats = {
  id: string;
  name: string;
  minutes: number; // en minutes (ou secondes, à définir clairement)
  points: number;
  points2PT: number;
  points3PT: number;
  reboundsOff: number;
  reboundsDef: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  evaluation?: number; // note d’évaluation facultative
};

// Type pour les mises à jour partielles des stats joueur
export type PlayerStatsUpdate = Partial<
  Pick<
    PlayerStats,
    | "points"
    | "points2PT"
    | "points3PT"
    | "reboundsOff"
    | "reboundsDef"
    | "assists"
    | "steals"
    | "blocks"
    | "turnovers"
    | "fouls"
  >
> & {
  id: string;
  name: string;
  shotsMade?: number;
  shotsAttempted?: number;
};

// Match simplifié (informations de base)
export type Match = {
  id: string;
  date: string;
  opponent: string;
  score: string;
};

// Match avec stats complètes (équipe + joueurs)
export type MatchStats = Match & {
  teamId: string;
  coachComment?: string;
  teamStats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    turnovers: number;
    fouls: number;
    fgPercentage: number;
    threePtPercentage: number;
    ftPercentage: number;
  };
  playerStats: PlayerStats[];
};

// Équipe
export type Team = {
  id: string;
  name: string;
  category: string;
  coach: string;
  playerCount: number;
  stats: string;
  matches: Match[];
};

// Événement de base sur le terrain (position, temps, joueur et commentaire)
export type BaseEvent = {
  x: number;
  y: number;
  timestamp: number;
  commentaire?: string;
  player?: string;
};

// Tir = événement spécialisé
export type Shot = BaseEvent & {
  type: "2PT" | "3PT";
  made: boolean;
};

// Autres événements (rebonds, interceptions, etc.)
export type OtherEvent = BaseEvent & {
  eventType: string; // ex: "steal", "reboundOff", "reboundDef", "turnover", "assist", "block", "foul"
};

////new

type CompetenceItem = {
  nom: string;
  note: number;
};

type CompetenceCategorie =
  | "tir"
  | "qi_basket"
  | "physique"
  | "defense"
  | "techniques"
  | "potentiel";

type Competence = {
  categorie: CompetenceCategorie;
  items: CompetenceItem[];
};

export type PlayerType = {
  id: string;
  prenom: string;
  nom: string;
  age: number;
  taille: number;
  poids: number;
  poste: string;
  posteSecondaire?: string | null; // ← modifier ici
  equipeId: number;
  remarque?: string | null; // ← modifier ici aussi
  matchIds: number[];
  competences: Competence[];
};
