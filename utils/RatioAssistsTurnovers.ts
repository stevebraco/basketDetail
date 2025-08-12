function assistToTurnoverRatio(
  assists: number,
  turnovers: number
): number | null {
  if (turnovers === 0) return assists > 0 ? Infinity : null; // Pas de pertes = ratio infini si au moins 1 passe
  return parseFloat((assists / turnovers).toFixed(2));
}
