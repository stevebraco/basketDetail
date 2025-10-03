import React from "react";
import InfosMatch from "./InfosMatch";
import BasketballCourtSVG from "./BasketballCourtSVG";

export default function AnalysisVideo({ matchDetails }: { matchDetails: any }) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      {/* <div className="col-span-12">
        <InfosMatch />
      </div> */}
      <div className="col-span-12">
        <BasketballCourtSVG
          matchDetails={matchDetails}
          videoId={matchDetails?.videoId}
        />
      </div>
    </div>
  );
}
