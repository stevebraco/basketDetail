import { Shot } from "@/types/types";
import { motion } from "framer-motion";

type Props = {
  shot: Shot;
  isTooltipVisible: boolean;
  onShowTooltip: () => void;
  onHideTooltip: () => void;
  onClick: (timestamp: number) => void;
  onEdit?: () => void;
};

function getShotColor(shot: Shot): string {
  if (shot.type === "3PT") {
    return shot.made ? "#15FFAB" : "red"; // violet clair / foncé
  } else {
    return shot.made ? "#FF9315" : "red"; // bleu clair / foncé
  }
}

export default function ShotMarker({
  shot,
  isTooltipVisible,
  onShowTooltip,
  onHideTooltip,
  onClick,
  onEdit,
}: Props) {
  return (
    <motion.div
      className="absolute"
      style={{
        top: shot.y - 6,
        left: shot.x - 6,
        width: 7,
        height: 7,
        borderRadius: "50%",
        backgroundColor: getShotColor(shot),
        boxShadow: `0 -4px 8px ${getShotColor(shot)}, 0 4px 8px ${getShotColor(
          shot
        )}`, // effet de débordement haut/bas

        cursor: "pointer",
      }}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      {isTooltipVisible && (
        <div
          style={{
            position: "absolute",
            top: -60,
            left: 8,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: 8,
            borderRadius: 6,
            zIndex: 100,
            minWidth: 150,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div className="text-xs">
            <p>
              <strong>{shot.type}</strong> —{" "}
              {shot.made ? "✅ Réussi" : "❌ Raté"}
            </p>
            <p>
              Temps:{" "}
              {/* {new Date(shot.timestamp * 1000).toISOString().substr(11, 8)} */}
            </p>
            {shot.commentaire && <p>💬 {shot.commentaire}</p>}
            <div className="mt-1 flex gap-1">
              <button
                className="text-blue-600 text-xs underline"
                onClick={() => onClick(shot.timestamp)}
              >
                Aller à la vidéo
              </button>
              {onEdit && (
                <button
                  className="text-yellow-600 text-xs underline"
                  onClick={onEdit}
                >
                  ✏️ Modifier
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
