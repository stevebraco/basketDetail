"use client";

import { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Circle,
  Text,
  Line,
  Arrow,
  Image as KonvaImage,
} from "react-konva";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./input/TextArea";
import { Card } from "./ui/card";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import { useTacticsBoard } from "@/hooks/useTacticsBoard";

function useImage(url: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);

  return image;
}

export default function TacticBoard() {
  const image = useImage("/ball.png"); // chemin de l'image dans public/

  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth: 1010,
    sceneHeight: 500,
    maxWidth: 1011,
  });

  const {
    players,
    ball,
    drawings,
    newShapePoints,
    drawMode,
    drawing,
    replaySpeed,
    currentComment,
    isRecording,
    isReplaying,
    isPaused,
    setDrawMode,
    setDrawing,
    setNewShapePoints,
    setReplaySpeed,
    getPlayerColor,
    handleDragMove,
    handleBallDrag,
    addStep,
    handleReplay,
    currentSystem,
    togglePause,
    playPresetSystem,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCommentChange,
    PLAYER_RADIUS,
    BALL_RADIUS,
    stepProgress,
    goToStep,
    replayIndex,
    setCurrentComment,
  } = useTacticsBoard();

  return (
    <>
      <div className="flex gap-2 mt-2 flex-wrap justify-center"></div>

      <div className="mt-4 text-center text-lg font-semibold">
        {currentComment}
      </div>

      <Card className="relative w-full min-w-full bg-[#1C1E2B] col-span-12 xl:col-end-9 overflow-hidden gap-0">
        <div className="flex gap-2 flex-wrap">
          <Input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            className="ml-2"
          />
          <div className="mt-2 text-center text-sm text-gray-300">
            Étape {stepProgress}
          </div>

          <Button onClick={addStep} disabled={isRecording || isReplaying}>
            ➕ Ajouter une étape
          </Button>
          <Button
            onClick={handleReplay}
            disabled={!currentSystem || !currentSystem.recording.length}
          >
            🔁 Lire l'enregistrement
          </Button>
          <Button
            onClick={() => goToStep(replayIndex - 1)}
            disabled={replayIndex <= 0}
          >
            ◀️ Étape précédente
          </Button>
          <Button
            onClick={() => goToStep(replayIndex + 1)}
            disabled={
              !currentSystem ||
              replayIndex >= currentSystem.recording.length - 1
            }
          >
            ▶️ Étape suivante
          </Button>
        </div>
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            scaleX={stageSize.scale}
            scaleY={stageSize.scale}
            style={{
              position: "relative",
              zIndex: 1,
              cursor: drawing ? "crosshair" : "default",
              width: "100%",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              <BasketBallCourtKonva />
              {players.map((pos, i) => (
                <Circle
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  radius={PLAYER_RADIUS}
                  fill={getPlayerColor(i)}
                  draggable={!isReplaying}
                  onDragMove={(e) => handleDragMove(i, e)}
                  shadowColor={getPlayerColor(i)}
                  shadowBlur={10}
                  shadowOffsetX={0}
                  shadowOffsetY={0}
                  shadowOpacity={0.7}
                />
              ))}

              {/* Balle */}
              {/* <Circle
                x={ball.x}
                y={ball.y}
                radius={BALL_RADIUS}
                fill="orange"
                draggable={!isReplaying}
                onDragMove={handleBallDrag}
              /> */}

              {image && (
                <KonvaImage
                  image={image}
                  x={ball.x}
                  y={ball.y}
                  radius={BALL_RADIUS}
                  draggable={!isReplaying}
                  onDragMove={handleBallDrag}
                  width={20}
                  height={20}
                />
              )}

              {/* Numéros */}
              {players.map((pos, i) => {
                if (i + 1 === 10)
                  return (
                    <Text
                      key={"text-" + i}
                      x={pos.x - 8}
                      y={pos.y - 7}
                      text={`${i + 1}`}
                      fontSize={15}
                      fill="white"
                      listening={false}
                    />
                  );

                return (
                  <Text
                    key={"text-" + i}
                    x={pos.x - 4}
                    y={pos.y - 7}
                    text={`${i + 1}`}
                    fontSize={15}
                    fill="white"
                    listening={false}
                  />
                );
              })}

              {/* Dessins existants */}
              {drawings.map((shape) => {
                if (shape.type === "arrow") {
                  return (
                    <Arrow
                      key={shape.id}
                      points={shape.points}
                      pointerLength={10}
                      pointerWidth={10}
                      fill="white"
                      stroke="white"
                      strokeWidth={3}
                    />
                  );
                }
                if (shape.type === "screen") {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke="blue"
                      strokeWidth={3}
                      dash={[10, 5]}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                    />
                  );
                }
                if (shape.type === "line") {
                  return (
                    <Line
                      key={shape.id}
                      points={shape.points}
                      stroke="green"
                      strokeWidth={2}
                      tension={0.5}
                      lineCap="round"
                      lineJoin="round"
                    />
                  );
                }
                return null;
              })}

              {/* Dessin en cours */}
              {drawing && drawMode === "arrow" && (
                <Arrow
                  points={newShapePoints}
                  pointerLength={10}
                  pointerWidth={10}
                  fill="white"
                  stroke="white"
                  strokeWidth={3}
                />
              )}
              {drawing && drawMode === "screen" && (
                <Line
                  points={newShapePoints}
                  stroke="blue"
                  strokeWidth={3}
                  dash={[10, 5]}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
              {drawing && drawMode === "line" && (
                <Line
                  points={newShapePoints}
                  stroke="green"
                  strokeWidth={2}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                />
              )}
            </Layer>
          </Stage>
        </div>
        <div className="mt-4 flex gap-4 flex-wrap justify-center">
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
      </Card>
      <div className="col-span-4 h-full">
        <Textarea
          placeholder="Commentaire"
          value={currentComment}
          onChange={setCurrentComment} //
          className="border px-2 py-1 h-full"
        />
      </div>
    </>
  );
}
