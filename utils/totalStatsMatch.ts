export function totalStatsFromMatches(matchs) {
  return matchs.map((match) => {
    const allStats = match.playerMatches.map((pm) => pm.stats);

    const keys = allStats.length > 0 ? Object.keys(allStats[0]) : [];
    const totals = {};

    keys.forEach((key) => {
      totals[key] = 0;
    });

    allStats.forEach((stats) => {
      keys.forEach((key) => {
        const val = stats[key];
        if (typeof val === "number") {
          totals[key] += val;
        }
      });
    });

    return {
      matchId: match.id,
      totals,
    };
  });
}
