import { Shot } from "@/types/types";
import { motion } from "framer-motion";
import { Circle, X } from "lucide-react";

type Props = {
  shot: Shot;
  isTooltipVisible: boolean;
  onShowTooltip: () => void;
  onHideTooltip: () => void;
  onClick: (timestamp: number) => void;
  onEdit?: () => void;
  scale: number;
};

function getMarkerColor(shot?: Shot): string {
  if (!shot) return "#888";

  if (shot.typeItem === "shot") {
    if (shot.type === "3PT") return shot.made ? "#15FFAB" : "red"; // vert ou rouge
    if (shot.type === "2PT") return shot.made ? "#FF9315" : "red"; // orange ou rouge
    return shot.made ? "#FFF" : "red";
  }

  // événements (rebond, interception...) si besoin
  switch (shot.eventType) {
    case "rebond":
      return "#FFA500";
    case "perte_de_balle":
      return "#FF0000";
    case "interception":
      return "#00BFFF";
    default:
      return "#888";
  }
}

export default function ShotMarker({
  shot,
  isTooltipVisible,
  onShowTooltip,
  onHideTooltip,
  onClick,
  onEdit,
  scale,
}: Props) {
  const color = getMarkerColor(shot);
  const tooltipOffset = 60;

  // Choisir icône Circle si réussi, X si raté
  const Icon = shot.typeItem === "shot" ? (shot.made ? Circle : X) : Circle;

  console.log("shot", shot);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        top: shot.y * scale - 2,
        left: shot.x * scale - 2,
      }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1] }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
      onClick={() => onClick(shot.timestamp)}
    >
      {/* Icone Circle ou X */}
      <Icon
        size={22 * scale}
        color={color}
        className="shadow-[0_-4px_8px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.2)]"
        style={{ transform: "translate(-50%, -50%)" }}
      />

      {/* Tooltip */}
      {isTooltipVisible && (
        <div
          className="absolute left-2 bg-white border border-gray-300 p-2 rounded-md z-50 min-w-[150px] shadow-md text-xs"
          style={{ top: -tooltipOffset }}
        >
          <div>
            {shot.typeItem === "shot" ? (
              <p>
                <strong>{shot.type}</strong> —{" "}
                {shot.made ? "✅ Réussi" : "❌ Raté"}
              </p>
            ) : (
              <p>
                <strong>{shot.eventType}</strong>
              </p>
            )}
            {shot.player && (
              <p>
                👤 <strong>{shot.player}</strong>
              </p>
            )}
            <p>
              Temps:{" "}
              {new Date(shot.timestamp * 1000).toISOString().substr(11, 8)}
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
