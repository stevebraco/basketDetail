import { Shot, CustomEventType } from "@/types/types";
import { motion } from "framer-motion";

type MarkerProps = {
  shot?: Shot;
  event?: CustomEventType;
  isTooltipVisible: boolean;
  onShowTooltip: () => void;
  onHideTooltip: () => void;
  onClick: (timestamp: number) => void;
  onEdit?: () => void;
  scale: number;
};

function getMarkerColor(shot?: Shot, event?: CustomEventType): string {
  if (shot) {
    return shot.type === "3PT"
      ? shot.made
        ? "#15FFAB"
        : "red"
      : shot.made
      ? "#FF9315"
      : "red";
  } else if (event) {
    switch (event.eventType) {
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
  return "#000"; // fallback
}

export default function MapMarker({
  shot,
  event,
  isTooltipVisible,
  onShowTooltip,
  onHideTooltip,
  onClick,
  onEdit,
  scale,
}: MarkerProps) {
  if (!shot && !event) return null;

  const x = shot?.x ?? event?.x!;
  const y = shot?.y ?? event?.y!;
  const timestamp = shot?.timestamp ?? event?.timestamp!;
  const commentaire = shot?.commentaire ?? event?.commentaire;
  const label = shot
    ? `${shot.type} — ${shot.made ? "✅ Réussi" : "❌ Raté"}`
    : event?.eventType;

  return (
    <motion.div
      className="absolute"
      style={{
        top: y * scale - 6,
        left: x * scale - 6,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: getMarkerColor(shot, event),
        cursor: "pointer",
      }}
      animate={{
        scale: [0, 1.5, 1],
        opacity: [0, 1],
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
      }}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      {isTooltipVisible && (
        <div
          style={{
            position: "absolute",
            top: -60,
            left: 14,
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
              <strong>{label}</strong>
            </p>
            <p>Temps: {/* formater timestamp si nécessaire */}</p>
            {commentaire && <p>💬 {commentaire}</p>}
            <div className="mt-1 flex gap-1">
              <button
                className="text-blue-600 text-xs underline"
                onClick={() => onClick(timestamp)}
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
