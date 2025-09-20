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
  Group,
  Rect,
} from "react-konva";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./input/TextArea";
import { Card } from "./ui/card";
import BasketBallCourtKonva from "./BasketBallCourtKonva";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import { useTacticsBoard } from "@/hooks/useTacticsBoard";
import useImage from "./hooks/useImage";

export default function TacticBoard() {
  const image = useImage("/ball.png");

  const stageRef = useRef<Konva.Stage>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const [arrowPaths, setArrowPaths] = useState<
    { points: number[]; id: number }[]
  >([]);

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
    handleDragEnd,
    handleDragStart,
    handleCommentChange,
    PLAYER_RADIUS,
    BALL_RADIUS,
    stepProgress,
    goToStep,
    replayIndex,
    setCurrentComment,
    setDrawings,
  } = useTacticsBoard();

  useEffect(() => {
    if (!recording || !currentSystem) return;

    if (replayIndex === currentSystem.recording.length - 1) {
      const timeout = setTimeout(() => stopRecording(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [replayIndex, recording, currentSystem]);

  const startRecording = () => {
    if (!stageRef.current) return;

    const stage = stageRef.current.getStage();
    const canvas = stage.content.children[0] as HTMLCanvasElement;

    if (!canvas.captureStream) {
      console.error("captureStream n'est pas disponible");
      return;
    }

    const stream = canvas.captureStream(60);
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/mp4" });
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);

      const a = document.createElement("a");
      a.href = url;
      a.download = "tactic-video.mp4";
      a.click();
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);

    if (currentSystem && currentSystem.recording.length) {
      handleReplay();
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // 🔄 Replay avec flèche
  const replayDragPathsWithArrow = (
    paths: { [key: number]: { x: number; y: number }[] },
    onFinish: () => void
  ) => {
    const arrows: { points: number[]; id: number }[] = [];

    Object.keys(paths).forEach((idxStr) => {
      const idx = Number(idxStr);
      const path = paths[idx];
      if (!path || path.length < 2) return;
      const points: number[] = [];
      path.forEach((p) => points.push(p.x, p.y));
      arrows.push({ points, id: Date.now() + idx });
    });

    // Affiche les flèches
    setArrowPaths(arrows);

    setTimeout(() => {
      const frames = 40;
      let step = 0;

      const animate = () => {
        step++;
        const t = step / frames;
        if (t > 1) {
          setArrowPaths([]);
          onFinish();
          return;
        }

        setPlayers((players) => {
          const updated = [...players];
          Object.keys(paths).forEach((idxStr) => {
            const idx = Number(idxStr);
            const path = paths[idx];
            if (!path || path.length < 2) return;

            const pos = t * (path.length - 1);
            const i = Math.floor(pos);
            const nextIndex = Math.min(i + 1, path.length - 1);
            const p0 = path[i];
            const p1 = path[nextIndex];
            if (!p0 || !p1) return;

            const frac = pos - i;
            updated[idx] = {
              x: p0.x + (p1.x - p0.x) * frac,
              y: p0.y + (p1.y - p0.y) * frac,
            };
          });
          return updated;
        });

        requestAnimationFrame(animate);
      };

      animate();
    }, 300);
  };

  // 🔄 Hook replay pour chaque étape
  useEffect(() => {
    if (!isReplaying || isPaused || !currentSystem) return;

    const playStep = (index: number) => {
      const current = currentSystem.recording[index];
      const next = currentSystem.recording[index + 1];
      if (!next) {
        setIsReplaying(false);
        setCurrentComment("");
        return;
      }

      setCurrentComment(next.comment || "");
      setDrawings(next.drawings || []);
      const nextIndex = index + 1;

      if (next.dragPaths && Object.keys(next.dragPaths).length > 0) {
        replayDragPathsWithArrow(next.dragPaths, () => {
          setReplayIndex(nextIndex);
          playStep(nextIndex);
        });
      } else {
        // smoothTransition classique si pas de dragPaths
        const frames = 40;
        let step = 0;
        const animate = () => {
          step++;
          const t = step / frames;
          if (t > 1) {
            setReplayIndex(nextIndex);
            playStep(nextIndex);
            return;
          }
          setPlayers(() =>
            current.players.map((p: any, i: number) => ({
              x: p.x + (next.players[i].x - p.x) * t,
              y: p.y + (next.players[i].y - p.y) * t,
            }))
          );
          setBall({
            x: current.ball.x + (next.ball.x - current.ball.x) * t,
            y: current.ball.y + (next.ball.y - current.ball.y) * t,
          });
          requestAnimationFrame(animate);
        };
        animate();
      }
    };

    playStep(replayIndex);
  }, [isReplaying, isPaused, replaySpeed, currentSystem, replayIndex]);

  const getArrowHeadSize = (points: number[]) => {
    const dx = points[points.length - 2] - points[points.length - 4] || 1;
    const dy = points[points.length - 1] - points[points.length - 3] || 1;
    const length = Math.sqrt(dx * dx + dy * dy);
    return Math.min(10, length / 2); // jamais plus grand que la moitié de la flèche
  };
  const getStraightArrowPoints = (path: { x: number; y: number }[]) => {
    if (!path || path.length < 2) return [];
    const start = path[0];
    const end = path[path.length - 1];
    return [start.x, start.y, end.x, end.y];
  };

  return (
    <>
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
          <Button onClick={startRecording} disabled={recording}>
            ⏺️ Démarrer l'enregistrement
          </Button>
          <Button onClick={stopRecording} disabled={!recording}>
            ⏹️ Arrêter l'enregistrement
          </Button>
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
            ref={stageRef}
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
                  onDragStart={() => handleDragStart(i)}
                  onDragEnd={() => handleDragEnd(i)}
                  shadowColor={getPlayerColor(i)}
                  shadowBlur={10}
                  shadowOffsetX={0}
                  shadowOffsetY={0}
                  shadowOpacity={0.7}
                />
              ))}

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

              {arrowPaths.map((arrow) => (
                <Arrow
                  key={arrow.id}
                  points={arrow.points}
                  pointerLength={10}
                  pointerWidth={10}
                  fill="yellow"
                  stroke="yellow"
                  strokeWidth={3}
                />
              ))}

              {/* Dessins existants */}
              {drawings.map((shape) => {
                switch (shape.type) {
                  case "arrow":
                    return (
                      <Arrow
                        key={shape.id}
                        points={shape.points}
                        pointerLength={getArrowHeadSize(shape.points)}
                        pointerWidth={getArrowHeadSize(shape.points) / 2}
                        fill={shape.fill || "white"}
                        stroke={shape.stroke || "white"}
                        strokeWidth={shape.strokeWidth || 3}
                        tension={0} // 0 = droite, 0.5 = arrondi
                        lineCap={shape.lineCap || "round"}
                        lineJoin={shape.lineJoin || "round"}
                      />
                    );
                  case "screen":
                    return (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        stroke={shape.stroke || "blue"}
                        strokeWidth={shape.strokeWidth || 3}
                        dash={shape.dash || [10, 5]}
                        tension={shape.tension ?? 0.5}
                        lineCap={shape.lineCap || "round"}
                        lineJoin={shape.lineJoin || "round"}
                      />
                    );
                  case "line":
                    return (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        stroke={shape.stroke || "green"}
                        strokeWidth={shape.strokeWidth || 2}
                        tension={shape.tension ?? 0.5}
                        lineCap={shape.lineCap || "round"}
                        lineJoin={shape.lineJoin || "round"}
                      />
                    );
                  default:
                    return null;
                }
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
      </Card>
      <div className="col-span-4 h-full">
        <Textarea
          placeholder="Commentaire"
          value={currentComment}
          onChange={setCurrentComment}
          className="border px-2 py-1 h-full"
        />
      </div>
    </>
  );
}
