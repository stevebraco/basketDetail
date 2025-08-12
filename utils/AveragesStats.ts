type StatKeys =
  | "points"
  | "fgm"
  | "fga"
  | "threePM"
  | "threePA"
  | "ftm"
  | "fta"
  | "reboundsOff"
  | "reboundsDef"
  | "reboundsTotal"
  | "assists"
  | "turnovers"
  | "steals"
  | "blocks"
  | "fautes"
  | "minutes"
  | "plusMinus";

export function getAverageStatsAndCount(
  data: { stats: Record<StatKeys, number> }[]
): { averages: Record<StatKeys, number>; matchesPlayed: number } {
  const keys: StatKeys[] = [
    "points",
    "fgm",
    "fga",
    "threePM",
    "threePA",
    "ftm",
    "fta",
    "reboundsOff",
    "reboundsDef",
    "reboundsTotal",
    "assists",
    "turnovers",
    "steals",
    "blocks",
    "fautes",
    "minutes",
    "plusMinus",
  ];

  const totals = keys.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<StatKeys, number>);

  const matchesPlayed = data.length;

  for (const match of data) {
    for (const key of keys) {
      totals[key] += match.stats[key] ?? 0;
    }
  }

  const averages = {} as Record<StatKeys, number>;
  for (const key of keys) {
    averages[key] = parseFloat((totals[key] / matchesPlayed).toFixed(2));
  }

  return { averages, matchesPlayed };
}
