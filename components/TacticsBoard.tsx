"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Circle, Text } from "react-konva";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const PLAYER_COUNT = 5;
const PLAYER_RADIUS = 15;
const BALL_RADIUS = 10;
const PROXIMITY_THRESHOLD = 50;

const initialPositions = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
  x: 100 + i * 80,
  y: 100,
}));

const initialBallPosition = { x: 400, y: 250 };

// ✅ Système prédéfini (remplacé par les données fournies)
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
  {
    time: 1745004458309,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 103, y: 116 },
    comment: "",
  },
  {
    time: 1745004460555,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 174, y: 116 },
    comment: "",
  },
  {
    time: 1745004463036,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 262, y: 104 },
    comment: "",
  },
  {
    time: 1745004465228,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 335, y: 105 },
    comment: "",
  },
  {
    time: 1745004468965,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 407, y: 106 },
    comment: "",
  },
  {
    time: 1745004469148,
    players: [
      { x: 100, y: 100 },
      { x: 180, y: 100 },
      { x: 260, y: 100 },
      { x: 340, y: 100 },
      { x: 420, y: 100 },
    ],
    ball: { x: 407, y: 106 },
    comment: "",
  },
];

export default function TacticBoard() {
  const [players, setPlayers] = useState(initialPositions);
  const [ball, setBall] = useState(initialBallPosition);
  const [recording, setRecording] = useState([]);
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
  const [savedSteps, setSavedSteps] = useState([]);
  const [finalSnapshot, setFinalSnapshot] = useState(null);

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

  const getPlayerColor = (i) =>
    playerWithBall === i ? "red" : playersDirection[i] ? "blue" : "gray";

  // bg-[#DE392E]";
  //   if (val < 7) return "bg-[#FF9315]";
  //   return "bg-[#15FFAB]

  const handleDragMove = (index, e) => {
    const newP = [...players];
    newP[index] = { x: e.target.x(), y: e.target.y() };
    setPlayers(newP);
    checkProximity();
  };

  const handleBallDrag = (e) => {
    setBall({ x: e.target.x(), y: e.target.y() });
    checkCollision();
    checkProximity();
  };

  const startRecording = () => {
    setRecording([]);
    setIsRecording(true);
    recordIntervalRef.current = setInterval(() => {
      setRecording((prev) => [
        ...prev,
        {
          time: Date.now(),
          players: [...playersRef.current],
          ball: { ...ballRef.current },
          comment: "",
        },
      ]);
    }, 100);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(recordIntervalRef.current);
  };

  const addStep = () => {
    setRecording((prev) => [
      ...prev,
      {
        time: Date.now(),
        players: [...players],
        ball: { ...ball },
        comment,
      },
    ]);
    setComment("");
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
    if (!recording.length) return;
    setIsReplaying(true);
    setIsPaused(false);
    setReplayIndex(0);
  };

  useEffect(() => {
    if (!isReplaying || isPaused) return;

    intervalRef.current = setInterval(() => {
      setReplayIndex((prevIndex) => {
        const current = recording[prevIndex];
        const next = recording[prevIndex + 1];

        if (!next) {
          clearInterval(intervalRef.current);
          setIsReplaying(false);
          setCurrentComment("");
          return prevIndex;
        }

        smoothTransition(current, next, replaySpeed);
        setCurrentComment(next.comment || "");
        return prevIndex + 1;
      });
    }, replaySpeed + 50);

    return () => clearInterval(intervalRef.current);
  }, [isReplaying, isPaused, replaySpeed, recording]);

  const togglePause = () => setIsPaused((prev) => !prev);

  const goToStep = (index) => {
    if (index >= 0 && index < recording.length) {
      const step = recording[index];
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

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={startRecording} disabled={isRecording || isReplaying}>
          ▶️ Démarrer enregistrement
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording}>
          ⏹️ Arrêter
        </Button>
        <input
          type="text"
          placeholder="Commentaire"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border px-2 py-1"
        />
        <Button onClick={addStep} disabled={isRecording || isReplaying}>
          ➕ Ajouter une étape
        </Button>
        <Button onClick={handleReplay} disabled={!recording.length}>
          🔁 Lire l'enregistrement
        </Button>
        <Button onClick={togglePause} disabled={!isReplaying}>
          {isPaused ? "▶️ Reprendre" : "⏸️ Pause"}
        </Button>
        <Button
          onClick={() => {
            if (recording.length) {
              setFinalSnapshot(recording[recording.length - 1]);
              setSavedSteps([...recording]);
              console.log("✅ Toutes les étapes enregistrées :", recording);
            }
          }}
          disabled={!recording.length}
        >
          💾 Enregistrer état final
        </Button>
        <Button onClick={playPresetSystem}>🎮 Jouer le système</Button>

        <label className="ml-4">
          Vitesse :
          <Input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={replaySpeed}
            onChange={(e) => setReplaySpeed(Number(e.target.value))}
            className="ml-2"
          />
        </label>
      </div>

      {recording.length > 0 && (
        <div className="flex items-center gap-2">
          <label>Étape :</label>
          <input
            type="range"
            min="0"
            max={recording.length - 1}
            value={replayIndex}
            onChange={(e) => goToStep(Number(e.target.value))}
            disabled={isRecording || isReplaying}
          />
          <span>
            {replayIndex + 1} / {recording.length}
          </span>
        </div>
      )}

      <div className="text-lg text-gray-700 h-6">
        {isReplaying && currentComment && `💬 ${currentComment}`}
      </div>

      <div className="relative w-[800px] h-[500px] border border-gray-300">
        <img
          src="/tactics_court.svg"
          alt="Court"
          className="absolute w-full h-full z-0"
          style={{ pointerEvents: "none" }}
        />
        <Stage width={800} height={500} className="absolute top-0 left-0 z-10">
          <Layer>
            {players.map((pos, i) => (
              <Circle
                key={i}
                x={pos.x}
                y={pos.y}
                radius={PLAYER_RADIUS}
                fill={getPlayerColor(i)}
                draggable={!isReplaying}
                onDragMove={(e) => handleDragMove(i, e)}
                stroke="white"
              />
            ))}
            {players.map((pos, i) => (
              <Text
                key={`label-${i}`}
                x={pos.x - 5}
                y={pos.y - 8}
                text={String(i + 1)}
                fill="white"
                fontSize={12}
                offsetX={-1} // moitié de la largeur estimée
                offsetY={-1} // moitié de la hauteur estimée
              />
            ))}
            <Circle
              x={ball.x}
              y={ball.y}
              radius={BALL_RADIUS}
              fill="orange"
              draggable={!isReplaying}
              onDragMove={handleBallDrag}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
