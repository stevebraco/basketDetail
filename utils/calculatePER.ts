// Interface pour définir les stats d’un joueur sur un match
interface PlayerStats {
  minutes: number; // Minutes jouées
  fg: number; // Field Goals réussis
  fga: number; // Field Goals tentés
  ft: number; // Lancers francs réussis
  fta: number; // Lancers francs tentés
  threePt: number; // 3 points réussis
  ast: number; // Passes décisives
  reb: number; // Rebonds totaux
  stl: number; // Interceptions
  blk: number; // Contres
  tov: number; // Balles perdues
  pf: number; // Fautes
  pts: number; // Points marqués
}

// Fonction simplifiée de calcul du PER
export const calculatePER = (player: PlayerStats): number => {
  if (player.minutes === 0) return 0;

  // Contributions positives
  const positives =
    player.pts +
    player.reb * 1.2 +
    player.ast * 1.5 +
    player.stl * 2 +
    player.blk * 2 +
    player.threePt; // petit bonus pour le tir à 3 points

  // Pénalités
  const negatives =
    player.fga -
    player.fg + // tirs ratés
    (player.fta - player.ft) * 0.5 + // LF ratés
    player.tov * 2 + // pertes de balle
    player.pf * 0.5; // fautes

  // Score brut
  const rawPER = positives - negatives;

  // Normalisation par minutes jouées (comme dans le vrai PER)
  const per = rawPER * (48 / player.minutes);

  return Math.round(per * 100) / 100; // arrondi à 2 décimales
};
