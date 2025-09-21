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
import TShape from "./TShape";
import useImage from "@/hooks/useImage";

export default function TacticBoard() {
  const image = useImage("/ball.png");
  const courtImage = useImage("/halfcourt.png");

  const stageRef = useRef<Konva.Stage>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [arrowProgress, setArrowProgress] = useState<{
    [playerId: string]: number;
  }>({});
  const [animatedArrowProgress, setAnimatedArrowProgress] = useState<{
    [playerId: string]: number;
  }>({});

  const [showBlackPlayers, setShowBlackPlayers] = useState(true);
  const [showGreyPlayers, setShowGreyPlayers] = useState(true);

  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth: 950,
    sceneHeight: 700,
    maxWidth: 1010,
  });

  function createWavyArrow(
    start: { x: number; y: number },
    end: { x: number; y: number },
    amplitude = 8,
    wavelength = 20
  ) {
    const points: { x: number; y: number }[] = [];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const steps = Math.floor(length / 2); // plus de steps = plus lisse

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * length;
      const y = Math.sin((x / wavelength) * 2 * Math.PI) * amplitude;
      // rotation pour aligner avec la direction
      const rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
      const rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
      points.push({ x: start.x + rotatedX, y: start.y + rotatedY });
    }

    return points;
  }

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
    selectedId,
    setSelectedId,
    previewArrows,
    playerWithBall,
  } = useTacticsBoard();

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

  function getPointAtProgress(path: { x: number; y: number }[], t: number) {
    // t entre 0 et 1
    const totalLen = path.reduce(
      (len, p, i) => (i > 0 ? len + distance(path[i - 1], p) : 0),
      0
    );
    let target = t * totalLen;
    for (let i = 1; i < path.length; i++) {
      const segLen = distance(path[i - 1], path[i]);
      if (target <= segLen) {
        const ratio = target / segLen;
        return {
          x: path[i - 1].x + ratio * (path[i].x - path[i - 1].x),
          y: path[i - 1].y + ratio * (path[i].y - path[i - 1].y),
        };
      }
      target -= segLen;
    }
    return path[path.length - 1];
  }

  function distance(
    a: { x: number; y: number } | undefined,
    b: { x: number; y: number } | undefined
  ) {
    if (!a || !b) return 0;
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  // 🔄 Hook replay pour chaque étape

  const getArrowHeadSize = (points: number[]) => {
    const dx = points[points.length - 2] - points[points.length - 4] || 1;
    const dy = points[points.length - 1] - points[points.length - 3] || 1;
    const length = Math.sqrt(dx * dx + dy * dy);
    return Math.min(10, length / 2); // jamais plus grand que la moitié de la flèche
  };
  const getArrowPointsFromPath = (path: { x: number; y: number }[]) => {
    if (!path || path.length < 2) return [];
    const points: number[] = [];
    for (let i = 0; i < path.length; i++) {
      points.push(path[i].x, path[i].y);
    }
    return points;
  };

  function createZigZagPath(
    path: { x: number; y: number }[],
    amplitude = 10,
    frequency = 0.2
  ) {
    return path.map((p, i) => {
      const offsetX = Math.sin(i * frequency) * amplitude;
      const offsetY = Math.cos(i * frequency) * amplitude;
      return { x: p.x + offsetX, y: p.y + offsetY };
    });
  }

  return (
    <>
      <Card className="col-span-4">
        <div className="flex gap-2 flex-wrap">
          <Input
            type="range"
            min={400} // vitesse la plus lente
            max={2000} // vitesse la plus rapide
            step={100}
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            className="ml-2"
          />
          <div className="flex gap-2 mb-2">
            <Button
              variant={showBlackPlayers ? "secondary" : "default"}
              onClick={() => setShowBlackPlayers(!showBlackPlayers)}
            >
              {showBlackPlayers
                ? "Masquer joueurs noirs"
                : "Afficher joueurs noirs"}
            </Button>

            <Button
              variant={showGreyPlayers ? "secondary" : "default"}
              onClick={() => setShowGreyPlayers(!showGreyPlayers)}
            >
              {showGreyPlayers
                ? "Masquer joueurs gris"
                : "Afficher joueurs gris"}
            </Button>
          </div>
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
      </Card>
      <Card className="col-span-8 h-full">
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "80vh",
            background: "purple",
          }}
        >
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={stageSize.scale}
            scaleY={stageSize.scale}
            style={{
              position: "relative",
              zIndex: 1,
              // background: "red",
              cursor: drawing ? "crosshair" : "default",
              width: "100%",
              height: "100%",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {courtImage && (
                <KonvaImage
                  image={courtImage}
                  x={0}
                  y={0}
                  width={stageSize.width / stageSize.scale}
                  height={stageSize.height / stageSize.scale}
                />
              )}
              {/* <BasketBallCourtKonva /> */}

              {players.map((pos, i) => {
                const color = getPlayerColor(i);

                if (
                  (color === "#212121" && !showBlackPlayers) ||
                  (color === "grey" && !showGreyPlayers)
                ) {
                  return null; // joueur masqué
                }

                return (
                  <Circle
                    key={`circle-${i}`}
                    x={pos.x}
                    y={pos.y}
                    radius={PLAYER_RADIUS}
                    fill={color}
                    draggable={!isReplaying}
                    onDragMove={(e) => handleDragMove(i, e)}
                    onDragStart={() => handleDragStart(i)}
                    onDragEnd={() => handleDragEnd(i)}
                    shadowColor={color}
                    shadowBlur={10}
                    shadowOffsetX={0}
                    shadowOffsetY={0}
                    shadowOpacity={0.7}
                  />
                );
              })}

              {players.map((pos, i) => {
                const color = getPlayerColor(i);

                if (
                  (color === "#212121" && !showBlackPlayers) ||
                  (color === "grey" && !showGreyPlayers)
                ) {
                  return null; // texte masqué
                }

                return (
                  <Text
                    key={`text-${i}`}
                    x={pos.x - 5}
                    y={pos.y - 7}
                    text={`${i + 1}`}
                    fontSize={15}
                    fill="white"
                    listening={false}
                  />
                );
              })}

              {image && (
                <KonvaImage
                  image={image}
                  x={ball.x}
                  y={ball.y}
                  radius={BALL_RADIUS}
                  draggable={!isReplaying}
                  onDragMove={handleBallDrag}
                  width={30}
                  height={30}
                />
              )}

              {/* {Object.entries(previewArrows).map(([key, path]) => {
                if (!path || path.length < 2) return null;

                let arrowPoints: { x: number; y: number }[] = path;

                // Joueur avec la balle → zig-zag wavy
                if (playerWithBall === parseInt(key)) {
                  arrowPoints = createWavyArrow(
                    path[0],
                    path[path.length - 1],
                    8,
                    20
                  );
                }

                return (
                  <Arrow
                    key={`preview-${key}`}
                    points={arrowPoints.flatMap((p) => [p.x, p.y])}
                    pointerLength={10}
                    pointerWidth={6}
                    stroke={key === "ball" ? "orange" : "black"}
                    fill={key === "ball" ? "orange" : "black"}
                    strokeWidth={3}
                    lineCap="round"
                    lineJoin="round"
                    dash={key === "ball" ? [15, 10] : []}
                  />
                );
              })} */}

              {Object.entries(previewArrows).map(([key, path]) => {
                if (!path || path.length < 2) return null;

                // 👉 ne filtre que si ce n’est PAS la balle
                if (key !== "ball") {
                  const playerIndex = parseInt(key);
                  const color = getPlayerColor(playerIndex);

                  if (
                    (color === "#212121" && !showBlackPlayers) ||
                    (color === "grey" && !showGreyPlayers)
                  ) {
                    return null; // flèche du joueur masquée
                  }
                }

                // Lissage
                const smoothPath = (
                  pts: { x: number; y: number }[],
                  windowSize = 5
                ) => {
                  if (pts.length <= windowSize) return pts;
                  return pts.map((p, i, arr) => {
                    const slice = arr.slice(
                      Math.max(0, i - windowSize),
                      Math.min(arr.length, i + windowSize)
                    );
                    const avgX =
                      slice.reduce((a, b) => a + b.x, 0) / slice.length;
                    const avgY =
                      slice.reduce((a, b) => a + b.y, 0) / slice.length;
                    return { x: avgX, y: avgY };
                  });
                };

                const smooth = smoothPath(path);

                // Portion déjà parcourue / restante
                let traveledPoints: number[] = [];
                let remainingPoints: number[] = [];

                if (key === "ball") {
                  remainingPoints = smooth.flatMap((p) => [p.x, p.y]);
                } else {
                  const playerIndex = parseInt(key);
                  const playerPos = players[playerIndex];
                  let traveledIndex = 0;

                  for (let i = 1; i < smooth.length; i++) {
                    if (
                      distance(smooth[i], playerPos) <
                      distance(smooth[i - 1], playerPos)
                    ) {
                      traveledIndex = i;
                    } else break;
                  }

                  traveledPoints = smooth
                    .slice(0, traveledIndex + 1)
                    .flatMap((p) => [p.x, p.y]);
                  remainingPoints = smooth
                    .slice(traveledIndex)
                    .flatMap((p) => [p.x, p.y]);
                }

                return (
                  <Group key={`preview-${key}`}>
                    {traveledPoints.length >= 4 && key !== "ball" && (
                      <Line
                        points={traveledPoints}
                        stroke="black"
                        strokeWidth={5}
                        opacity={0.2}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                      />
                    )}
                    {remainingPoints.length >= 4 && (
                      <Arrow
                        points={remainingPoints}
                        pointerLength={10}
                        pointerWidth={5}
                        stroke={key === "ball" ? "orange" : "black"}
                        fill={key === "ball" ? "orange" : "black"}
                        strokeWidth={5}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        dash={key === "ball" ? [15, 10] : []} // pointillé si balle
                      />
                    )}
                  </Group>
                );
              })}

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
                      />
                    );
                  case "line":
                    return (
                      <Line
                        key={shape.id}
                        points={shape.points}
                        stroke={shape.stroke || "green"}
                        strokeWidth={shape.strokeWidth || 2}
                      />
                    );
                  case "T":
                    return (
                      <TShape
                        key={shape.id}
                        shapeProps={shape}
                        isSelected={shape.id === selectedId}
                        onSelect={() => setSelectedId(shape.id)}
                        onChange={(newAttrs) => {
                          setDrawings((prev) =>
                            prev.map((s) => (s.id === shape.id ? newAttrs : s))
                          );
                        }}
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

      {/* <div className="col-span-4 h-full">
        <Textarea
          placeholder="Commentaire"
          value={currentComment}
          onChange={setCurrentComment}
          className="border px-2 py-1 h-full"
        />
      </div> */}
    </>
  );
}
