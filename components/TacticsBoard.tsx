"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Text, Line, Arrow } from "react-konva";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./input/TextArea";
import { Card } from "./ui/card";

const PLAYER_COUNT = 10;
const PLAYER_RADIUS = 15;
const BALL_RADIUS = 10;
const PROXIMITY_THRESHOLD = 50;

const initialPositions = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
  x: 50 + (i % 5) * 80, // 5 joueurs par ligne
  y: 100 + Math.floor(i / 5) * 100, // 2 lignes : 0 et 1
}));

const initialBallPosition = { x: 400, y: 250 };

// Preset simplifié
const presetSystem = [
  {
    time: 1745004451259,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 400, y: 250 },
    comment: "",
  },
];

export default function TacticBoard() {
  const [systems, setSystems] = useState([
    {
      id: "main",
      label: "Système Principal",
      recording: [],
    },
  ]);
  const [currentSystemId, setCurrentSystemId] = useState("main");
  const [players, setPlayers] = useState(initialPositions);
  const [ball, setBall] = useState(initialBallPosition);

  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(800);
  const [comment, setComment] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [replayIndex, setReplayIndex] = useState(0);
  const [playerWithBall, setPlayerWithBall] = useState(null);
  const [playersDirection, setPlayersDirection] = useState(
    Array(PLAYER_COUNT).fill(false)
  );

  const [drawMode, setDrawMode] = useState(""); // "arrow", "screen", "line", "erase"
  const [drawing, setDrawing] = useState(false);
  const [drawings, setDrawings] = useState([]);
  const [newShapePoints, setNewShapePoints] = useState([]);

  const intervalRef = useRef(null);
  const recordIntervalRef = useRef(null);
  const playersRef = useRef(players);
  const ballRef = useRef(ball);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  const currentSystem = systems.find((s) => s.id === currentSystemId);

  const checkCollision = () => {
    for (let i = 0; i < players.length; i++) {
      const dx = players[i].x - ball.x;
      const dy = players[i].y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= PLAYER_RADIUS + BALL_RADIUS) {
        setPlayerWithBall(i);
        return;
      }
    }
    setPlayerWithBall(null);
  };

  const checkProximity = () => {
    const updated = [...playersDirection];
    players.forEach((p, i) => {
      const dx = p.x - ball.x;
      const dy = p.y - ball.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      updated[i] = dist <= PROXIMITY_THRESHOLD;
    });
    setPlayersDirection(updated);
  };

  const getPlayerColor = (i) => {
    if (playerWithBall === i) return "red";
    if (playersDirection[i]) return "blue";
    return i < 5 ? "#DE392E" : "#0062FF";
  };

  const handleDragMove = (index, e) => {
    if (isReplaying) return;
    const newP = [...players];
    newP[index] = { x: e.target.x(), y: e.target.y() };
    setPlayers(newP);
    checkProximity();
  };

  const handleBallDrag = (e) => {
    if (isReplaying) return;
    setBall({ x: e.target.x(), y: e.target.y() });
    checkCollision();
    checkProximity();
  };

  const setRecordingForCurrentSystem = (newRecording) => {
    setSystems((prev) =>
      prev.map((s) =>
        s.id === currentSystemId ? { ...s, recording: newRecording } : s
      )
    );
  };

  const addStepAuto = () => {
    if (!currentSystem) return;
    setSystems((prev) =>
      prev.map((s) =>
        s.id === currentSystemId
          ? {
              ...s,
              recording: [
                ...s.recording,
                {
                  time: Date.now(),
                  players: [...playersRef.current],
                  ball: { ...ballRef.current },
                  comment: "",
                },
              ],
            }
          : s
      )
    );
  };

  const addStep = () => {
    if (!currentSystem) return;
    setSystems((prev) =>
      prev.map((s) =>
        s.id === currentSystemId
          ? {
              ...s,
              recording: [
                ...s.recording,
                {
                  time: Date.now(),
                  players: [...players],
                  ball: { ...ball },
                  comment,
                  drawings: [...drawings],
                },
              ],
            }
          : s
      )
    );
    setComment("");
    setDrawMode("");
    setDrawings([]);
  };

  const startRecording = () => {
    if (isRecording || isReplaying) return;
    setRecordingForCurrentSystem([]);
    setIsRecording(true);
    recordIntervalRef.current = setInterval(() => {
      addStepAuto();
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordIntervalRef.current);
  };

  const forkCurrentSystem = () => {
    if (!currentSystem) return;

    const newId = "branch-" + (systems.length + 1);
    const newLabel = prompt(
      "Nom du nouveau chemin (branche) ?",
      `Chemin ${systems.length}`
    );
    if (!newLabel) return;

    const clonedRecording = currentSystem.recording.map((step) => ({
      time: step.time,
      players: step.players.map((p) => ({ ...p })),
      ball: { ...step.ball },
      comment: step.comment,
    }));

    setSystems((prev) => [
      ...prev,
      {
        id: newId,
        label: newLabel,
        recording: clonedRecording,
      },
    ]);

    setCurrentSystemId(newId);

    if (clonedRecording.length > 0) {
      const lastStep = clonedRecording[clonedRecording.length - 1];
      setPlayers(lastStep.players);
      setBall(lastStep.ball);
      setCurrentComment(lastStep.comment || "");
      setReplayIndex(clonedRecording.length - 1);
    }
  };

  const smoothTransition = (start, end, duration = 800) => {
    const frames = 40;
    const interval = duration / frames;
    let step = 0;

    const animate = () => {
      step++;
      const t = step / frames;
      if (t > 1) return;
      setPlayers(() =>
        start.players.map((p, i) => ({
          x: p.x + (end.players[i].x - p.x) * t,
          y: p.y + (end.players[i].y - p.y) * t,
        }))
      );
      setBall({
        x: start.ball.x + (end.ball.x - start.ball.x) * t,
        y: start.ball.y + (end.ball.y - start.ball.y) * t,
      });
      if (t < 1) setTimeout(animate, interval);
    };

    animate();
  };

  const handleReplay = () => {
    if (!currentSystem || !currentSystem.recording.length) return;
    setIsReplaying(true);
    setIsPaused(false);
    setReplayIndex(0);
  };

  useEffect(() => {
    if (!isReplaying || isPaused) return;

    intervalRef.current = setInterval(() => {
      setReplayIndex((prevIndex) => {
        if (!currentSystem) {
          clearInterval(intervalRef.current);
          setIsReplaying(false);
          setCurrentComment("");
          return prevIndex;
        }
        const current = currentSystem.recording[prevIndex];
        const next = currentSystem.recording[prevIndex + 1];

        if (!next) {
          clearInterval(intervalRef.current);
          setIsReplaying(false);
          setCurrentComment("");
          return prevIndex;
        }

        smoothTransition(current, next, replaySpeed);
        setCurrentComment(next.comment || "");
        setDrawings(next.drawings || []); // <--- Mettre à jour dessins ici

        return prevIndex + 1;
      });
    }, replaySpeed + 50);

    return () => clearInterval(intervalRef.current);
  }, [isReplaying, isPaused, replaySpeed, currentSystem]);

  const togglePause = () => setIsPaused((prev) => !prev);

  const goToStep = (index) => {
    if (!currentSystem) return;
    if (index >= 0 && index < currentSystem.recording.length) {
      const step = currentSystem.recording[index];
      setPlayers(step.players);
      setBall(step.ball);
      setCurrentComment(step.comment || "");
      setReplayIndex(index);
    }
  };

  const playPresetSystem = () => {
    if (!presetSystem.length) return;

    let i = 0;
    setIsReplaying(true);
    setIsPaused(false);

    const run = () => {
      if (i >= presetSystem.length - 1) {
        setIsReplaying(false);
        return;
      }

      const current = presetSystem[i];
      const next = presetSystem[i + 1];

      smoothTransition(current, next, replaySpeed);
      setCurrentComment(next.comment || "");
      i++;
      setTimeout(run, replaySpeed + 100);
    };

    setPlayers(presetSystem[0].players);
    setBall(presetSystem[0].ball);
    setCurrentComment(presetSystem[0].comment || "");
    setTimeout(run, 300);
  };

  const handleMouseDown = (e) => {
    if (isReplaying || isRecording) return;
    setDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setNewShapePoints([pos.x, pos.y]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const pos = e.target.getStage().getPointerPosition();
    setNewShapePoints((prev) => [...prev, pos.x, pos.y]);
  };

  const handleMouseUp = () => {
    if (!drawing) return;
    setDrawing(false);

    if (drawMode === "erase") {
      setDrawings((prev) => prev.slice(0, -1));
    } else {
      setDrawings((prev) => [
        ...prev,
        {
          type: drawMode,
          points: newShapePoints,
          id: Date.now(),
        },
      ]);
    }

    setNewShapePoints([]);
  };

  return (
    <>
      {/* <div className="flex gap-2 flex-wrap">
        {systems.map((sys) => (
          <Button
            key={sys.id}
            onClick={() => {
              setCurrentSystemId(sys.id);
              if (sys.recording.length > 0) {
                const step = sys.recording[0];
                setPlayers(step.players);
                setBall(step.ball);
                setCurrentComment(step.comment || "");
                setReplayIndex(0);
              } else {
                setPlayers(initialPositions);
                setBall(initialBallPosition);
                setCurrentComment("");
                setReplayIndex(0);
              }
              setIsReplaying(false);
              setIsPaused(false);
              setIsRecording(false);
            }}
            variant={currentSystemId === sys.id ? "primary" : "default"}
          >
            {sys.label}
          </Button>
        ))}
      </div> */}

      {/* <div className="flex gap-2 flex-wrap">
        <Button onClick={startRecording} disabled={isRecording || isReplaying}>
          ▶️ Démarrer enregistrement
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording}>
          ⏹️ Arrêter
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
        <Button onClick={togglePause} disabled={!isReplaying}>
          {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
        </Button>
        <Button onClick={playPresetSystem}>
          🎮 Jouer le système prédéfini
        </Button>
        <Button onClick={forkCurrentSystem} disabled={isRecording}>
          🌿 Créer une branche (fork)
        </Button>
      </div> */}

      {/* <div className="flex gap-2 mt-2 flex-wrap justify-center">
        <Button
          onClick={() => goToStep(replayIndex - 1)}
          disabled={replayIndex <= 0}
        >
          ◀️ Étape précédente
        </Button>
        <Button
          onClick={() => goToStep(replayIndex + 1)}
          disabled={
            !currentSystem || replayIndex >= currentSystem.recording.length - 1
          }
        >
          ▶️ Étape suivante
        </Button>
      </div> */}

      {/* <div className="mt-4 text-center text-lg font-semibold">
        {currentComment}
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
      </div> */}

      <Card className="relative w-full min-w-full bg-[#252545] col-span-12 xl:col-end-9 overflow-hidden gap-0">
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={startRecording}
            disabled={isRecording || isReplaying}
          >
            ▶️ Démarrer enregistrement
          </Button>
          <Button onClick={stopRecording} disabled={!isRecording}>
            ⏹️ Arrêter
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
          <Button onClick={togglePause} disabled={!isReplaying}>
            {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
          </Button>
          <Button onClick={playPresetSystem}>
            🎮 Jouer le système prédéfini
          </Button>
          <Button onClick={forkCurrentSystem} disabled={isRecording}>
            🌿 Créer une branche (fork)
          </Button>
        </div>
        <div>
          <img
            src="/tactics_court.svg"
            alt="Court"
            className="absolute w-full z-0"
            style={{ pointerEvents: "none" }}
          />
          <Stage
            width={1010}
            height={500}
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
              {/* Joueurs */}
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
              <Circle
                x={ball.x}
                y={ball.y}
                radius={BALL_RADIUS}
                fill="orange"
                draggable={!isReplaying}
                onDragMove={handleBallDrag}
              />

              {/* Numéros */}
              {players.map((pos, i) => (
                <Text
                  key={"text-" + i}
                  x={pos.x - 5}
                  y={pos.y - 7}
                  text={`${i + 1}`}
                  fontSize={15}
                  fill="white"
                  listening={false}
                />
              ))}

              {/* Dessins existants */}
              {drawings.map((shape) => {
                if (shape.type === "arrow") {
                  return (
                    <Arrow
                      key={shape.id}
                      points={shape.points}
                      pointerLength={10}
                      pointerWidth={10}
                      fill="red"
                      stroke="red"
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
                  fill="red"
                  stroke="red"
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border px-2 py-1 h-full"
        />
      </div>
    </>
  );
}
