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
export type ShotType = "2PT" | "3PT";
export type EventType = "rebond" | "perte_de_balle" | "interception";

export type ShotItemType = "shot" | "event";

export interface Shot {
  id: string; // Identifiant unique du tir ou de l'événement
  typeItem: ShotItemType; // "shot" ou "event"
  type?: ShotType; // uniquement si typeItem === "shot"
  made?: boolean; // uniquement si typeItem === "shot"
  eventType?: EventType; // uniquement si typeItem === "event"
  player?: string; // Nom du joueur
  x: number; // Position x sur le terrain (0-100 ou pixels)
  y: number; // Position y sur le terrain (0-100 ou pixels)
  timestamp: number; // Timestamp en secondes ou millisecondes
  commentaire?: string; // Commentaire optionnel
}

// Autres événements (rebonds, interceptions, etc.)
export type OtherEvent = BaseEvent & {
  eventType: string; // ex: "steal", "reboundOff", "reboundDef", "turnover", "assist", "block", "foul"
};

////new

type CompetenceItem = {
  nom: string;
  note: number;
};

type CompetenceCategorie = {
  categorie: string;
  items: CompetenceItem[];
};

export type JoueurType = {
  id: string;
  prenom: string;
  nom: string;
  age: bigint;
  taille: bigint;
  poids: bigint;
  poste: string;
  posteSecondaire: string;
  remarque: string;
  competences: CompetenceCategorie[];
};

export type AveragesType = {
  points?: number;
  reboundsOff?: number;
  reboundsDef?: number;
  reboundsTotal?: number;
  assists?: number;
  steals?: number;
  blocks?: number;
  turnovers?: number;
  fautes?: number;
  minutes?: number;
  plusMinus?: number;
};

export type MatchEventType = {
  x: number;
  y: number;
  type: string; // "3PT", "2PT", "FT"...
  player: string;
  timestamp: number;
  made: boolean;
  commentaire: string;
  typeItem: "shot";
};

export type CustomEventType = {
  x: number;
  y: number;
  timestamp: number;
  commentaire: string;
  eventType: string; // "rebond_def", "rebond_off", "interception", etc.
  player: string;
  typeItem: "event";
};

export type ActionItem = MatchEventType | CustomEventType;

export type SliderFieldType = {
  name: string;
  label: string;
};

export type SkillSectionType = {
  title: string;
  skills: SliderFieldType[];
};
