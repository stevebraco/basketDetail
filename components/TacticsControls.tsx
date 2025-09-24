// components/TacticsControls.tsx
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/input/TextArea";

interface TacticsControlsProps {
  // vitesse / slider
  replaySpeed: number;
  setReplaySpeed: (v: number) => void;

  // visibilité joueurs
  showBlackPlayers: boolean;
  toggleShowBlackPlayers: () => void;
  showGreyPlayers: boolean;
  toggleShowGreyPlayers: () => void;

  // enregistrement / replay
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  addStep: () => void;

  handleReplay: () => void;
  canReplay: boolean;

  // navigation étapes
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  stepProgress: string;

  // replay state
  isReplaying: boolean;
  isPaused: boolean;
  togglePause: () => void;

  // draw modes
  drawMode: string;
  setDrawMode: (mode: string) => void;

  // commentaire
  currentComment: string;
  setCurrentComment: (v: string) => void;
}

export function TacticsControls({
  replaySpeed,
  setReplaySpeed,
  showBlackPlayers,
  toggleShowBlackPlayers,
  showGreyPlayers,
  toggleShowGreyPlayers,
  recording,
  startRecording,
  stopRecording,
  addStep,
  handleReplay,
  canReplay,
  onPrev,
  onNext,
  canPrev,
  canNext,
  stepProgress,
  isReplaying,
  isPaused,
  togglePause,
  drawMode,
  setDrawMode,
  currentComment,
  setCurrentComment,
}: TacticsControlsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto p-3">
      {/* titre */}
      <h3 className="text-lg font-semibold mb-2 text-center">
        🎮 Contrôles — Tactics
      </h3>

      <Separator className="my-3" />

      {/* slider vitesse */}
      <div className="flex items-center gap-4 mb-3">
        <div className="min-w-[120px] text-sm">Vitesse lecture</div>
        <Input
          type="range"
          min={400}
          max={2000}
          step={100}
          value={replaySpeed}
          onChange={(e) =>
            setReplaySpeed(Number((e.target as HTMLInputElement).value))
          }
          className="flex-1"
        />
        <div className="w-[90px] text-right text-sm text-muted-foreground">
          {replaySpeed} ms
        </div>
      </div>

      {/* toggles visibilité joueurs */}
      <div className="flex gap-2 mb-3 flex-wrap justify-center">
        <Button
          variant={showBlackPlayers ? "secondary" : "default"}
          onClick={toggleShowBlackPlayers}
        >
          {showBlackPlayers
            ? "Masquer joueurs noirs"
            : "Afficher joueurs noirs"}
        </Button>

        <Button
          variant={showGreyPlayers ? "secondary" : "default"}
          onClick={toggleShowGreyPlayers}
        >
          {showGreyPlayers ? "Masquer joueurs gris" : "Afficher joueurs gris"}
        </Button>
      </div>

      <Separator className="my-3" />

      {/* enregistrement / controle replay / navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-3">
        <Button onClick={startRecording} disabled={recording}>
          ⏺️ Démarrer l'enregistrement
        </Button>
        <Button onClick={stopRecording} disabled={!recording}>
          ⏹️ Arrêter l'enregistrement
        </Button>

        <Button onClick={addStep} disabled={recording || isReplaying}>
          ➕ Ajouter une étape
        </Button>

        <Button onClick={handleReplay} disabled={!canReplay}>
          🔁 Lire l'enregistrement
        </Button>

        <Button onClick={onPrev} disabled={!canPrev}>
          ◀️ Étape précédente
        </Button>
        <Button onClick={onNext} disabled={!canNext}>
          ▶️ Étape suivante
        </Button>

        <Button onClick={togglePause} disabled={!isReplaying}>
          {isPaused ? "▶️ Reprendre" : "⏸ Pause"}
        </Button>
      </div>

      <div className="text-center text-sm text-gray-400 mb-3">
        {stepProgress}
      </div>

      <Separator className="my-3" />

      {/* modes de dessin */}
      <div className="flex gap-2 flex-wrap justify-center mb-3">
        <Button
          variant={drawMode === "arrow" ? "secondary" : "default"}
          onClick={() => setDrawMode("arrow")}
        >
          🏹 Flèche
        </Button>
        <Button
          variant={drawMode === "screen" ? "secondary" : "default"}
          onClick={() => setDrawMode("screen")}
        >
          🟦 Écran
        </Button>
        <Button
          variant={drawMode === "T" ? "secondary" : "default"}
          onClick={() => setDrawMode("T")}
        >
          🟨 T
        </Button>
        <Button
          variant={drawMode === "line" ? "secondary" : "default"}
          onClick={() => setDrawMode("line")}
        >
          ➖ Ligne
        </Button>
        <Button
          variant={drawMode === "erase" ? "secondary" : "default"}
          onClick={() => setDrawMode("erase")}
        >
          🗑️ Effacer
        </Button>
      </div>

      <Separator className="my-3" />

      {/* commentaire */}
      <div className="mb-3">
        <Textarea
          placeholder="Commentaire..."
          value={currentComment}
          onChange={(e) =>
            setCurrentComment((e.target as HTMLTextAreaElement).value)
          }
          className="w-full"
        />
      </div>
    </div>
  );
}

export default TacticsControls;
