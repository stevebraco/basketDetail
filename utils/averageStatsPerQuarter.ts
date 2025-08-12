// Si tu ne collectes pas les stats par quart-temps, il faudra modifier ta collecte pour ça. C’est la base pour analyser la constance ou les “explosions” dans certains moments du match.

type Stats = Record<string, number>;

type StatsParQuart = {
  q1: Stats;
  q2: Stats;
  q3: Stats;
  q4: Stats;
};

function averageStatsPerQuarter(data: { statsParQuart: StatsParQuart }[]) {
  const quarters = ["q1", "q2", "q3", "q4"] as const;
  const result: Record<(typeof quarters)[number], Record<string, number>> = {
    q1: {},
    q2: {},
    q3: {},
    q4: {},
  };

  const counts = data.length;

  for (const quarter of quarters) {
    // Récupérer toutes les clés de stats pour ce quarter
    const allKeys = new Set<string>();
    data.forEach((match) => {
      Object.keys(match.statsParQuart[quarter]).forEach((k) => allKeys.add(k));
    });

    // Initialiser les totaux
    allKeys.forEach((key) => {
      result[quarter][key] = 0;
    });

    // Additionner toutes les stats de ce quarter
    data.forEach((match) => {
      allKeys.forEach((key) => {
        result[quarter][key] += match.statsParQuart[quarter][key] ?? 0;
      });
    });

    // Moyenne
    allKeys.forEach((key) => {
      result[quarter][key] = parseFloat(
        (result[quarter][key] / counts).toFixed(2)
      );
    });
  }

  return result;
}
