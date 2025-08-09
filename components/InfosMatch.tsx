import React from "react";

function InfosMatch() {
  return (
    <div className="bg-white">
      <h2 className=" text-xl font-semibold mb-2">Statistiques d'équipe</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        <p>
          <strong>Points :</strong> 85
        </p>
        <p>
          <strong>Rebonds :</strong> 20
        </p>
        <p>
          <strong>Passes :</strong> 32
        </p>
        <p>
          <strong>Interceptions :</strong> 11
        </p>
        <p>
          <strong>Balles perdues :</strong> 17
        </p>
        <p>
          <strong>Fautes :</strong> 20
        </p>
        <p>
          <strong>% tirs :</strong> 33%
        </p>
        <p>
          <strong>% 3pts :</strong> 30%
        </p>
        <p>
          <strong>% LF :</strong> 72%
        </p>
      </div>
    </div>
  );
}

export default InfosMatch;
