function defensiveRating(
  pointsAllowed,
  playerMinutes,
  totalDefPossessions,
  totalGameMinutes = 48
) {
  if (playerMinutes === 0) return null;
  const playerDefPossessions =
    (playerMinutes / totalGameMinutes) * totalDefPossessions;
  if (playerDefPossessions === 0) return null;
  return parseFloat(((pointsAllowed * 100) / playerDefPossessions).toFixed(2));
}

// Exemple mock
const pointsAllowed = 50; // points encaissés quand joueur sur le terrain
const playerMinutes = 25;
const totalDefPossessions = 100; // possessions défensives totales de l'équipe

const drtg = defensiveRating(pointsAllowed, playerMinutes, totalDefPossessions);
console.log("Defensive Rating:", drtg); // 96.00
