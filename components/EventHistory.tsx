import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
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
      <p className="text-sm text-gray-400 italic">Aucun événement enregistré</p>
    );
  }

  return (
    <div className="w-full">
      <ScrollArea className="h-[400px] w-full max-w-full rounded-xl border bg-[#1B1B2F] p-3">
        <div className="flex flex-col w-full">
          {actions.map((action, index) => {
            const isShot = action.typeItem === "shot";
            const timestamp = secondsToHHMMSS(action.timestamp);

            return (
              <div key={action.timestamp + "-" + action.player + "-" + index}>
                <Card className="w-full bg-[#2A2A3F] shadow-md hover:shadow-lg transition rounded-xl">
                  <CardContent className="flex items-center justify-between p-3 w-full">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {isShot
                          ? `${action.type} - ${
                              action.made ? "✅ Réussi" : "❌ Raté"
                            }`
                          : action.eventType}
                      </span>
                      <span className="text-sm text-white">
                        {action.player}
                      </span>
                      {action.commentaire && (
                        <span className="text-xs text-gray-400 italic">
                          {action.commentaire}
                        </span>
                      )}
                      <button
                        className="text-xs text-blue-500 underline mt-1"
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
                  </CardContent>
                </Card>

                {/* Séparateur */}
                {index < actions.length - 1 && (
                  <hr className="my-2 border-t border-gray-600" />
                )}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
