"use client";

import React, { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

interface CourtEventPopupProps {
  pendingEvent: { x: number; y: number } | null;
  eventType: string;
  commentaire: string;
  setEventType: (value: string) => void;
  setCommentaire: (value: string) => void;
  onConfirm: (made?: boolean) => void;
  onCancel: () => void;
}

export default function CourtEventPopup({
  pendingEvent,
  eventType,
  commentaire,
  setEventType,
  setCommentaire,
  onConfirm,
  onCancel,
}: CourtEventPopupProps) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  const eventOptions = [
    { value: "tir", label: "Tir", initial: "T" },
    { value: "assist", label: "Passe Décisive", initial: "PD" },
    { value: "faute", label: "Faute", initial: "F" },
    { value: "rebond_off", label: "Rebond Offensif", initial: "RO" },
    { value: "rebond_def", label: "Rebond Défensif", initial: "RD" },
    { value: "perte_de_balle", label: "Perte de balle", initial: "P" },
    { value: "interception", label: "Interception", initial: "I" },
    { value: "contre", label: "Contre", initial: "C" },
    { value: "LF0/1", label: "Lancer franc raté", initial: "LF0" },
    { value: "LF1/1", label: "Lancer franc réussi", initial: "LF1/1" },
  ];

  if (!pendingEvent) return null;

  const displayY = Math.min(
    Math.max(pendingEvent.y - 160, 10),
    window.innerHeight - 260
  );
  const displayX = Math.min(
    Math.max(pendingEvent.x - 130, 10),
    window.innerWidth - 280
  );

  // Fermer popup si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <Card
      ref={popupRef}
      className="absolute z-50 p-3 rounded-lg shadow-lg bg-[#1B1E2B] border border-white/10 gap-2"
      style={{
        top: displayY,
        left: displayX,
        transform: "translateX(-50%)",
        minWidth: 260,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <TooltipProvider>
        <div className="grid grid-cols-7 gap-1">
          {eventOptions.map((option) => (
            <Tooltip key={option.value}>
              <TooltipTrigger asChild>
                <Button
                  variant={eventType === option.value ? "default" : "outline"}
                  size="icon"
                  onClick={() => setEventType(option.value)}
                  onDoubleClick={() => onConfirm(true)}
                  className="h-8 w-10 p-0"
                >
                  {option.initial}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-[#05051F] text-white text-xs px-2 py-1 rounded-md shadow-lg"
              >
                {option.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <Textarea
        placeholder="Ajouter un commentaire..."
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        className="h-14 text-sm mt-2 mb-2"
      />

      <div className="flex gap-2 justify-end">
        {eventType === "tir" ? (
          <>
            <Button size="sm" onClick={() => onConfirm(true)}>
              ✅ Réussi
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onConfirm(false)}
            >
              ❌ Manqué
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => onConfirm()}>
            Ajouter
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </Card>
  );
}
