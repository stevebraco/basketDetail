/**

La fonction shootingEfficiency calcule l’efficacité au tir d’un joueur.

Elle retourne 3 pourcentages importants en basket :

FG% (Field Goal %) : % de tirs réussis toutes zones confondues (2 pts + 3 pts)

3P% (Three Point %) : % de tirs réussis à 3 points

FT% (Free Throw %) : % de lancers francs réussis

Ces stats permettent de savoir à quel point un joueur est performant et précis au tir,

ce qui aide les coachs à analyser et améliorer son jeu offensif.

Exemples d’utilisation dans un site de stats de basket :

const stats = { fgm: 9, fga: 20, threePM: 2, threePA: 5, ftm: 4, fta: 5 };

const efficiency = shootingEfficiency(stats);

console.log(efficiency);

// Résultat : { FGPercent: 45, 3PPercent: 40, FTPercent: 80 }
*/

export function shootingEfficiency(stats) {
  function percentage(made, attempted) {
    if (attempted === 0) return null;
    return parseFloat(((made / attempted) * 100).toFixed(2));
  }

  return {
    FGPercent: percentage(stats.fgm, stats.fga),
    ThreePPercent: percentage(stats.threePM, stats.threePA),
    FTPercent: percentage(stats.ftm, stats.fta),
  };
}
