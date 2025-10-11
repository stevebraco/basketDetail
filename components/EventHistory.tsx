"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ClockIcon,
  Trash2Icon,
} from "lucide-react";

type MatchEventType = {
  typeItem: "shot" | "event";
  type?: "2PT" | "3PT";
  made?: boolean;
  player: string;
  passer?: string;
  commentaire?: string;
  timestamp: number;
  eventType?: string | null;
  x?: number;
  y?: number;
};

type EventHistoryProps = {
  actions: MatchEventType[];
  onDelete?: (index: number) => void;
  onSeekVideo: (time: number) => void;
};

export const EventHistory: React.FC<EventHistoryProps> = ({
  actions,
  onDelete,
  onSeekVideo,
}) => {
  const getActionText = (action: MatchEventType) => {
    if (action.typeItem === "shot") {
      const passerText = action.passer ? ` sur passe de ${action.passer}` : "";
      if (action.made) {
        return action.type === "3PT"
          ? `Panier à 3 points réussi par ${action.player}${passerText}`
          : `Panier à 2 points réussi par ${action.player}${passerText}`;
      } else {
        return action.type === "3PT"
          ? `Tir à 3 points manqué par ${action.player}${passerText}`
          : `Tir à 2 points manqué par ${action.player}${passerText}`;
      }
    } else if (action.eventType) {
      return `${action.eventType} par ${action.player}`;
    }
    return action.player;
  };

  const renderBadge = (action: MatchEventType) => {
    if (action.typeItem === "shot") {
      return action.made ? (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckIcon size={14} />
          {action.type === "3PT" ? "3 pts réussi" : "2 pts réussi"}
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XIcon size={14} />
          {action.type === "3PT" ? "3 pts manqué" : "2 pts manqué"}
        </Badge>
      );
    } else {
      switch (action.eventType) {
        case "Rebond Offensif":
          return (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowUpIcon size={14} /> Rebond Off.
            </Badge>
          );
        case "Rebond Défensif":
          return (
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowDownIcon size={14} /> Rebond Déf.
            </Badge>
          );
        case "Passe Décisive":
          return (
            <Badge variant="default" className="flex items-center gap-1">
              <StarIcon size={14} /> Passe D.
            </Badge>
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[450px] w-full rounded-xl border bg-[#1B1B2F] p-4">
        <div className="flex flex-col w-full">
          <AnimatePresence>
            {actions.map((action, index) => {
              const timestamp = secondsToHHMMSS(action.timestamp || 0);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex items-start gap-3 mb-4 group"
                >
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-white rounded-full mt-1 shadow-md" />
                    {index < actions.length - 1 && (
                      <div className="w-px bg-gray-600 flex-1" />
                    )}
                  </div>

                  {/* Contenu */}
                  <Card className="flex-1 bg-[#2A2A3F]/90 shadow-md hover:shadow-lg hover:translate-x-1 transition-all rounded-xl border border-transparent hover:border-blue-500/40">
                    <CardContent className="flex flex-col gap-2 p-3">
                      <div className="flex items-center justify-between">
                        {renderBadge(action)}
                        <button
                          className="p-1 rounded-md hover:bg-red-600/20 text-red-400 hover:text-red-500 transition"
                          onClick={() => onDelete && onDelete(index)}
                          title="Supprimer l'événement"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </div>

                      <span className="text-white font-semibold leading-snug">
                        {getActionText(action)}
                      </span>

                      {action.commentaire && (
                        <span className="text-gray-400 text-sm italic">
                          {action.commentaire}
                        </span>
                      )}

                      <button
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1 self-start transition"
                        onClick={() => onSeekVideo(action.timestamp)}
                      >
                        <ClockIcon size={14} />
                        {timestamp}
                      </button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};
