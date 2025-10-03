"use client";

import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { secondsToHHMMSS } from "@/utils/timeUtils";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XIcon,
  StarIcon,
  // LightningIcon,
} from "lucide-react";

type MatchEventType = {
  typeItem: "shot" | "event";
  type?: "2PT" | "3PT";
  made?: boolean;
  player: string;
  commentaire?: string;
  timestamp: number;
  eventType?: string;
  x?: number;
  y?: number;
};

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
  // Données factices si rien
  if (!actions || actions.length === 0) {
    actions = [
      {
        typeItem: "shot",
        type: "2PT",
        made: true,
        player: "LeBron James",
        commentaire: "Beau tir depuis la ligne",
        timestamp: 45,
        x: 120,
        y: 80,
      },
      {
        typeItem: "shot",
        type: "3PT",
        made: false,
        player: "Stephen Curry",
        commentaire: "Manqué à trois points",
        timestamp: 92,
        x: 300,
        y: 150,
      },
      {
        typeItem: "event",
        eventType: "Rebond Défensif",
        player: "Giannis Antetokounmpo",
        commentaire: "",
        timestamp: 100,
      },
      {
        typeItem: "event",
        eventType: "Passe Décisive",
        player: "Chris Paul",
        commentaire: "Super passe",
        timestamp: 120,
      },
    ];
  }

  const renderBadge = (action: MatchEventType) => {
    if (action.typeItem === "shot") {
      if (action.made) {
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckIcon size={14} /> {action.type}
          </Badge>
        );
      } else {
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XIcon size={14} /> {action.type}
          </Badge>
        );
      }
    } else {
      switch (action.eventType) {
        case "Rebond Offensif":
          return (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowUpIcon size={14} /> {action.eventType}
            </Badge>
          );
        case "Rebond Défensif":
          return (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowDownIcon size={14} /> {action.eventType}
            </Badge>
          );
        case "Passe Décisive":
          return (
            <Badge variant="default" className="flex items-center gap-1">
              <StarIcon size={14} /> {action.eventType}
            </Badge>
          );
        default:
          return;
        // (
        //   <Badge variant="outline" className="flex items-center gap-1">
        //     <LightningIcon size={14} /> {action.eventType}
        //   </Badge>
        // );
      }
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[450px] w-full rounded-xl border bg-[#1B1B2F] p-3">
        <div className="flex flex-col w-full">
          {actions.map((action, index) => {
            const timestamp = secondsToHHMMSS(action.timestamp || 0);

            return (
              <div
                key={index}
                className="relative flex items-start gap-3 mb-3 group"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-white rounded-full mt-1" />
                  {index < actions.length - 1 && (
                    <div className="w-px bg-gray-500 flex-1" />
                  )}
                </div>

                <Card className="flex-1 bg-[#2A2A3F] shadow-md hover:shadow-lg transition rounded-xl">
                  <CardContent className="flex flex-col gap-1 p-3">
                    <div className="flex items-center justify-between">
                      {renderBadge(action)}

                      <button
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                        onClick={() => onDelete(index)}
                      >
                        ✕
                      </button>
                    </div>

                    <span className="text-white font-semibold">
                      {action.player}
                    </span>

                    {action.commentaire && (
                      <span className="text-gray-400 text-sm italic">
                        {action.commentaire}
                      </span>
                    )}

                    <button
                      className="text-blue-400 text-xs underline mt-1 self-start"
                      onClick={() => onSeekVideo(action.timestamp)}
                    >
                      ⏱ {timestamp}
                    </button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
