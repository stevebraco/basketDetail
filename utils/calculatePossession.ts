export function calculatePossessions(
  fga: number, // tirs tentés (FGA)
  tov: number, // pertes de balle (TOV)
  fta: number, // lancers francs tentés (FTA)
  oreb: number // rebonds offensifs (OREB)
): number {
  return fga + tov + 0.44 * fta - oreb;
}
