import {
  calculate3PtPercent,
  calculateAstToRatio,
  calculateEFGPercent,
  calculateFGPercent,
  calculateTotalRebounds,
} from "@/utils/StatsByPlayer";
import React from "react";

export default function StatsAdvancedByPlayer({ players }: any) {
  console.log(players);
  return (
    <div>
      {players.map((item, idx) => (
        <div className="text-white">
          <p>{item.player.nom} </p>
          <p>calculate3PtPercent : {calculate3PtPercent(item.stats)}%</p>
          <p>calculateFGPercent : {calculateFGPercent(item.stats)}%</p>
          <p>calculateTotalRebounds : {calculateTotalRebounds(item.stats)}</p>
          <p>calculateAstToRatio : {calculateAstToRatio(item.stats)} AST/TO</p>
          {/* <p>calculateEFGPercent : {calculateEFGPercent(item.stats)}</p> */}
        </div>
      ))}
    </div>
  );
}
