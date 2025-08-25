// ============================
// playerStats.ts
// ============================

// Interface adaptée à tes données
export interface PlayerStats {
  points: number; // Points marqués
  fgm: number; // Field Goals réussis
  fga: number; // Field Goals tentés
  threePM: number; // 3 points réussis
  threePA: number; // 3 points tentés
  ftm: number; // Lancers francs réussis
  fta: number; // Lancers francs tentés
  reboundsOff: number; // Rebonds offensifs
  reboundsDef: number; // Rebonds défensifs
  reboundsTotal: number; // Rebonds totaux (⚠️ à recalculer si besoin)
  assists: number; // Passes décisives
  turnovers: number; // Balles perdues
  steals: number; // Interceptions
  blocks: number; // Contres
  fautes: number; // Fautes commises
  minutes: number; // Minutes jouées
  plusMinus: number; // +/- du joueur
}

// ============================
// 📊 Fonctions de calcul
// ============================

// 1. Pourcentage de réussite aux tirs (FG%)
export const calculateFGPercent = (player: PlayerStats): number => {
  return player.fga > 0 ? +((player.fgm / player.fga) * 100).toFixed(1) : 0;
};

// 2. Pourcentage à 3 points (3P%)
export const calculate3PtPercent = (player: PlayerStats): number => {
  return player.threePA > 0
    ? +((player.threePM / player.threePA) * 100).toFixed(1)
    : 0;
};

// 3. Pourcentage aux lancers francs (FT%)
export const calculateFTPercent = (player: PlayerStats): number => {
  return player.fta > 0 ? +((player.ftm / player.fta) * 100).toFixed(1) : 0;
};

// 4. Rebonds totaux (recalcule à partir de Off + Def si besoin)
export const calculateTotalRebounds = (player: PlayerStats): number => {
  return player.reboundsOff + player.reboundsDef;
};

// 5. Ratio passes décisives / balles perdues (AST/TO)
export const calculateAstToRatio = (player: PlayerStats): number => {
  return player.turnovers > 0
    ? +(player.assists / player.turnovers).toFixed(2)
    : player.assists;
};

// 6. Effective Field Goal % (eFG%) : valorise les 3 points
export const calculateEFGPercent = (player: PlayerStats): number => {
  return player.fga > 0
    ? +(((player.fgm + 0.5 * player.threePM) / player.fga) * 100).toFixed(1)
    : 0;
};

// 7. True Shooting % (TS%) : efficacité globale au scoring
export const calculateTSPercent = (player: PlayerStats): number => {
  const denominator = 2 * (player.fga + 0.44 * player.fta);
  return denominator > 0
    ? +((player.points / denominator) * 100).toFixed(1)
    : 0;
};

// ============================
// Exemple d’utilisation
// ============================

const player: PlayerStats = {
  points: 34,
  fgm: 7,
  fga: 25,
  threePM: 2,
  threePA: 6,
  ftm: 8,
  fta: 8,
  reboundsOff: 4,
  reboundsDef: 0,
  reboundsTotal: 1, // ⚠️ incohérent avec reboundsOff+reboundsDef (tu peux recalculer)
  assists: 9,
  turnovers: 2,
  steals: 1,
  blocks: 2,
  fautes: 0,
  minutes: 32,
  plusMinus: -9,
};

console.log("FG% :", calculateFGPercent(player), "%");
console.log("3P% :", calculate3PtPercent(player), "%");
console.log("FT% :", calculateFTPercent(player), "%");
console.log("Rebonds totaux :", calculateTotalRebounds(player));
console.log("AST/TO ratio :", calculateAstToRatio(player));
console.log("eFG% :", calculateEFGPercent(player), "%");
console.log("TS% :", calculateTSPercent(player), "%");
