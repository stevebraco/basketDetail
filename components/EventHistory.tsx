import React from "react";
import { Shot, CustomEventType, MatchEventType } from "@/types";
import { secondsToHHMMSS } from "@/utils/timeUtils";

type EventHistoryProps = {
  actions: MatchEventType[];
  onDelete: (index: number) => void;
  onSeekVideo: (time: number) => void;
};

export const EventHistory: React.FC<EventHistoryProps> = ({
  actions,
  onDelete,
  onSeekVideo,
}) => {
  if (actions.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">Aucun événement enregistré</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {actions.map((action, index) => {
        const isShot = action.typeItem === "shot";
        const timestamp = secondsToHHMMSS(action.timestamp);

        return (
          <div
            key={action.timestamp + "-" + action.player + "-" + index}
            className="flex items-center justify-between border p-2 rounded-lg bg-white shadow-sm"
          >
            <div className="flex flex-col">
              <span className="font-medium">
                {isShot
                  ? `${action.type} - ${action.made ? "✅ Réussi" : "❌ Raté"}`
                  : action.eventType}
              </span>
              <span className="text-sm text-gray-600">{action.player}</span>
              {action.commentaire && (
                <span className="text-xs text-gray-500 italic">
                  {action.commentaire}
                </span>
              )}
              <button
                className="text-xs text-blue-600 underline mt-1"
                onClick={() => onSeekVideo(action.timestamp)}
              >
                ⏱ {timestamp}
              </button>
            </div>
            <button
              className="text-red-500 hover:text-red-700 font-bold text-sm"
              onClick={() => onDelete(index)}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
};
