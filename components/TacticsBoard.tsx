"use client";

import { useEffect, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Circle,
  Text,
  Line,
  Arrow,
  Rect,
  Arc,
  Group,
} from "react-konva";

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

  const [isHovered, setIsHovered] = useState(false);

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

  const courtWidth = 500;
  const courtHeight = 400;

  // Position et taille du U (arc)
  const arcCenterX = courtWidth / 2;
  const arcCenterY = 250;
  const innerRadius = 140;
  const outerRadius = 150;

  // Largeur des lignes droites sur les côtés
  const cornerLineHeight = 100;
  const cornerLineXLeft = arcCenterX - outerRadius;
  const cornerLineXRight = arcCenterX + outerRadius;

  // Fonction pour générer les points d’un arc (juste la courbe, sans ligne droite)
  function generateArcPoints(
    cx,
    cy,
    radius,
    startAngle,
    endAngle,
    numPoints = 50
  ) {
    const points = [];
    const angleStep = (endAngle - startAngle) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const angle = startAngle + i * angleStep;
      // Convertir degrés en radians
      const rad = (angle * Math.PI) / 180;
      const x = cx + radius * Math.cos(rad);
      const y = cy + radius * Math.sin(rad);
      points.push(x, y);
    }

    return points;
  }

  const arcsConfig = [
    { cx: 185, cy: 254, radius: 176, start: 281, end: 439 },
    { cx: 835, cy: 254, radius: 177, start: 101, end: 259 },
    { cx: 137, cy: 253, radius: 40, start: 285, end: 431 },
    { cx: 887, cy: 253, radius: 40, start: 101, end: 259 },
  ];

  const arcPointsList = arcsConfig.map(({ cx, cy, radius, start, end }) =>
    generateArcPoints(cx, cy, radius, start, end)
  );

  // Exemple d'accès :
  const [arcPoints, arcPoints2, arcPoints3, arcPoints4] = arcPointsList;

  const sceneWidth = 1010;
  const sceneHeight = 500;

  // State to track current scale and dimensions
  const [stageSize, setStageSize] = useState({
    width: sceneWidth,
    height: sceneHeight,
    scale: 1,
  });

  // Reference to parent container
  const containerRef = useRef(null);

  // Function to handle resize
  const updateSize = () => {
    if (!containerRef.current) return;

    // Get container width
    const containerWidth = containerRef.current.offsetWidth;

    // Calculate scale
    const scale = containerWidth / sceneWidth;

    // Update state with new dimensions
    setStageSize({
      width: sceneWidth * scale,
      height: sceneHeight * scale,
      scale: scale,
    });
  };

  // Update on mount and when window resizes
  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

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

      <Card className="relative w-full min-w-full bg-[#1C1E2B] col-span-12 xl:col-end-9 overflow-hidden gap-0">
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
        <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
          {/* <img
            src="/tactics_court.svg"
            alt="Court"
            className="absolute w-full z-0"
            style={{ pointerEvents: "none" }}
          /> */}
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
              <Group
                // opacity={isHovered ? 1 : 0.3}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Fond terrain */}
                <Rect
                  x={75}
                  y={40}
                  width={875}
                  height={430}
                  opacity={1}
                  stroke={"white"}
                />
                {/* Ligne centrale */}
                <Line
                  points={[500, 50, 500, 480]}
                  x={12}
                  y={-10}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* ligne tps mort tf*/}
                <Line
                  points={[500, 50, 500, 15]}
                  x={-163}
                  y={24}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* ligne tps mort bf*/}
                <Line
                  points={[500, 50, 500, 15]}
                  x={-163}
                  y={420}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait corner */}
                <Line
                  points={[0, 50, 10, 50]} // même Y (50)
                  x={75}
                  y={111}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait corner */}
                <Line
                  points={[0, 50, 10, 50]} // même Y (50)
                  x={75}
                  y={298}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={51}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={64}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={96.5}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={130}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={154}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={120}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={88}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* rect bas raquette */}
                <Rect
                  x={150} // position horizontale
                  y={307} // position verticale
                  width={12} // largeur
                  height={6} // hauteur
                  fill="white" // couleur de remplissage
                  stroke="white" // couleur de bordure
                  strokeWidth={2} // épaisseur de bordure
                />

                {/* rect haut raquette */}
                <Rect
                  x={150} // position horizontale
                  y={190} // position verticale
                  width={12} // largeur
                  height={6} // hauteur
                  fill="white" // couleur de remplissage
                  stroke="white" // couleur de bordure
                  strokeWidth={2} // épaisseur de bordure
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={154}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={120}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={88}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={51}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={64}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={96.5}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={130}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* Cercle raq */}
                <Group>
                  <Arc
                    x={276}
                    y={253}
                    innerRadius={0} // pour un arc plein (pas un anneau)
                    outerRadius={55} // rayon du cercle
                    angle={180} // angle en degrés (180° pour un demi-cercle)
                    rotation={270} // angle de départ en degrés (0 = à droite)
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Arc
                    x={275}
                    y={253}
                    innerRadius={0} // pour un arc plein (pas un anneau)
                    outerRadius={55} // rayon du cercle
                    angle={180} // angle en degrés (180° pour un demi-cercle)
                    rotation={90} // angle de départ en degrés (0 = à droite)
                    stroke="white"
                    strokeWidth={2}
                    dash={[12, 5]}
                  />
                  <Rect
                    x={75}
                    y={180}
                    width={200}
                    height={145}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Rect
                    x={75}
                    y={198}
                    width={200}
                    height={109}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Group>
                    <Line
                      points={[cornerLineXRight, 50, 255, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={-180}
                      y={377}
                    />

                    {/* Lignes droites côtés droite */}
                    <Line
                      points={[cornerLineXRight, 50, 255, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={-180}
                      y={31}
                      // rotation={80}
                    />

                    {/* Arc en forme de U */}
                    {/*  */}
                    <Line
                      points={arcPoints}
                      stroke="white"
                      strokeWidth={3}
                      tension={0} // tension à 0 pour avoir une courbe lisse de type arc
                      closed={false} // ligne ouverte, pas fermée
                    />
                  </Group>
                  <Group>
                    <Line
                      points={[cornerLineXRight, 50, 370, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={-250}
                      y={165}
                    />

                    {/* Lignes droites côtés droite */}
                    <Line
                      points={[cornerLineXRight, 50, 370, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={-250}
                      y={240}
                      // rotation={80}
                    />

                    {/* Arc en forme de U */}
                    {/*  */}
                    <Line
                      points={arcPoints3}
                      stroke="white"
                      strokeWidth={3}
                      tension={0} // tension à 0 pour avoir une courbe lisse de type arc
                      closed={false} // ligne ouverte, pas fermée
                    />
                  </Group>
                </Group>

                {/* coté g */}
                <Line
                  points={[500, 50, 500, 15]}
                  x={186}
                  y={24}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* ligne tps mort bf*/}
                <Line
                  points={[500, 50, 500, 15]}
                  x={186}
                  y={420}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait corner */}
                <Line
                  points={[0, 50, 10, 50]} // même Y (50)
                  x={935}
                  y={111}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait corner */}
                <Line
                  points={[0, 50, 10, 50]} // même Y (50)
                  x={935}
                  y={298}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={771}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={758}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={725}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={691}
                  y={324}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={733.5}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={701}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette bas raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={667}
                  y={306}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* rect bas raquette */}
                <Rect
                  x={860} // position horizontale
                  y={307} // position verticale
                  width={12} // largeur
                  height={6} // hauteur
                  fill="white" // couleur de remplissage
                  stroke="white" // couleur de bordure
                  strokeWidth={2} // épaisseur de bordure
                />

                {/* rect haut raquette */}
                <Rect
                  x={860} // position horizontale
                  y={190} // position verticale
                  width={12} // largeur
                  height={6} // hauteur
                  fill="white" // couleur de remplissage
                  stroke="white" // couleur de bordure
                  strokeWidth={2} // épaisseur de bordure
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={667}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={733.5}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut raquette */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={701}
                  y={190}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={771}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={758}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={725}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* trait raquette haut */}
                <Line
                  points={[100, 0, 100, 10]} // même X (100)
                  x={691}
                  y={170}
                  stroke="white"
                  strokeWidth={2}
                />
                {/* Cercle raq */}
                <Group>
                  <Group>
                    <Arc
                      x={750}
                      y={253}
                      innerRadius={0} // pour un arc plein (pas un anneau)
                      outerRadius={55} // rayon du cercle
                      angle={180} // angle en degrés (180° pour un demi-cercle)
                      rotation={270} // angle de départ en degrés (0 = à droite)
                      stroke="white"
                      strokeWidth={2}
                      dash={[12, 5]}
                      opacity={0.2}
                    />
                    <Arc
                      x={750}
                      y={253}
                      innerRadius={0} // pour un arc plein (pas un anneau)
                      outerRadius={55} // rayon du cercle
                      angle={180} // angle en degrés (180° pour un demi-cercle)
                      rotation={90} // angle de départ en degrés (0 = à droite)
                      stroke="white"
                      strokeWidth={2}
                    />
                  </Group>
                  <Rect
                    x={750}
                    y={180}
                    width={200}
                    height={145}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Rect
                    x={750}
                    y={198}
                    width={200}
                    height={109}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <Group>
                    <Line
                      points={[cornerLineXRight, 50, 255, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={545}
                      y={377}
                    />

                    {/* Lignes droites côtés droite */}
                    <Line
                      points={[cornerLineXRight, 50, 255, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={545}
                      y={31}
                      // rotation={80}
                    />

                    {/* Arc en forme de U */}
                    {/*  */}
                    <Line
                      points={arcPoints2}
                      stroke="white"
                      strokeWidth={3}
                      tension={0} // tension à 0 pour avoir une courbe lisse de type arc
                      closed={false} // ligne ouverte, pas fermée
                    />
                  </Group>
                  <Group>
                    <Line
                      points={[cornerLineXRight, 50, 370, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={502}
                      y={165}
                    />

                    {/* Lignes droites côtés droite */}
                    <Line
                      points={[cornerLineXRight, 50, 370, 50]}
                      stroke="white"
                      strokeWidth={3}
                      x={502}
                      y={240}
                      // rotation={80}
                    />

                    {/* Arc en forme de U */}
                    {/*  */}
                    <Line
                      points={arcPoints4}
                      stroke="white"
                      strokeWidth={3}
                      tension={0} // tension à 0 pour avoir une courbe lisse de type arc
                      closed={false} // ligne ouverte, pas fermée
                    />
                  </Group>
                </Group>

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
              </Group>
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
