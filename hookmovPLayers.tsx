import { useEffect, useRef, useState } from "react";

export function useTacticsBoard() {
  const PLAYER_COUNT = 10;
  const PLAYER_RADIUS = 15;
  const BALL_RADIUS = 10;
  const PROXIMITY_THRESHOLD = 50;

  const initialPositions = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
    x: 150 + i * 80,
    y: 15,
  }));

  const initialBallPosition = { x: 501, y: 250 };

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

  const [systems, setSystems] = useState([
    { id: "main", label: "Système Principal", recording: [] },
  ]);
  const [currentSystemId, setCurrentSystemId] = useState("main");
  const [players, setPlayers] = useState(initialPositions);
  const [ball, setBall] = useState(initialBallPosition);
  const [ballOffset, setBallOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(800);
  const [currentComment, setCurrentComment] = useState("");
  const [dragPath, setDragPath] = useState<{
    [key: number]: { x: number; y: number }[];
  }>({});
  const [lastDragTime, setLastDragTime] = useState<{ [key: number]: number }>(
    {}
  );
  const [currentDragPaths, setCurrentDragPaths] = useState<{
    [key: number]: { x: number; y: number }[];
  } | null>(null);

  const [replayIndex, setReplayIndex] = useState(0);
  const [playerWithBall, setPlayerWithBall] = useState<number | null>(null);
  const [playersDirection, setPlayersDirection] = useState(
    Array(PLAYER_COUNT).fill(false)
  );

  const [drawMode, setDrawMode] = useState(""); // "arrow", "screen", "line", "erase"
  const [drawing, setDrawing] = useState(false);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [newShapePoints, setNewShapePoints] = useState<number[]>([]);

  const intervalRef = useRef<any>(null);
  const playersRef = useRef(players);
  const ballRef = useRef(ball);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);
  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  const currentSystem = systems.find((s) => s.id === currentSystemId);

  const stepProgress = currentSystem
    ? `${replayIndex + 1} / ${currentSystem.recording.length}`
    : "0 / 0";

  const checkCollision = () => {
    for (let i = 0; i < players.length; i++) {
      const dx = ball.x - players[i].x;
      const dy = ball.y - players[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= PLAYER_RADIUS + BALL_RADIUS) {
        setPlayerWithBall(i);
        setBallOffset({ x: dx, y: dy });
        return;
      }
    }
    setPlayerWithBall(null);
    setBallOffset(null);
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

  const getPlayerColor = (i: number) => {
    if (playerWithBall === i) return "red";
    if (playersDirection[i]) return "blue";
    return i < 5 ? "#DE392E" : "#0062FF";
  };

  const handleDragStart = (index: number) => {
    setDragPath((prev) => ({ ...prev, [index]: [] }));
  };

  const handleDragMove = (index: number, e: any) => {
    if (isReplaying) return;
    const now = Date.now();
    const minDelay = 30;
    const last = lastDragTime[index] || 0;

    const newX = e.target.x();
    const newY = e.target.y();

    const dx = newX - players[index].x;
    const dy = newY - players[index].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (now - last > minDelay || dist > 4) {
      setPlayers((p) => {
        const copy = [...p];
        copy[index] = { x: newX, y: newY };
        return copy;
      });

      setDragPath((prev) => ({
        ...prev,
        [index]: [...(prev[index] || []), { x: newX, y: newY }],
      }));
      setLastDragTime((prev) => ({ ...prev, [index]: now }));
    }
  };

  const handleDragEnd = (index: number) => {
    console.log("Chemin complet du joueur", index, dragPath[index]);
    // Ne rien ajouter au recording ici
  };

  const handleBallDrag = (e: any) => {
    if (isReplaying) return;

    const node = e.target;
    if (!node || typeof node.x !== "function" || typeof node.y !== "function")
      return;

    const newX = node.x();
    const newY = node.y();

    setBall({ x: newX, y: newY });
    setPlayerWithBall(null);
    setBallOffset(null);
    checkCollision();
    checkProximity();
  };

  const addStep = () => {
    if (!currentSystem) return;
    setSystems((prev) =>
      prev.map((s) => {
        if (s.id !== currentSystemId) return s;

        const newStep = {
          time: Date.now(),
          players: [...players],
          ball: { ...ball },
          comment: currentComment,
          drawings: [...drawings],
          dragPaths: { ...dragPath },
        };

        let newRecording = [...s.recording];

        if (newRecording.length === 0) {
          newRecording = [newStep];
          setReplayIndex(0);
        } else if (replayIndex === newRecording.length - 1) {
          newRecording.push(newStep);
          setReplayIndex(newRecording.length - 1);
        } else {
          newRecording = [...newRecording.slice(0, replayIndex + 1), newStep];
          setReplayIndex(newRecording.length - 1);
        }

        return { ...s, recording: newRecording };
      })
    );

    setDragPath({});
    setCurrentComment("");
    setDrawMode("");
    setDrawings([]);
  };

  // 🔄 Fonction de transition lissée
  const smoothTransition = (
    start: any,
    end: any,
    duration = 800,
    onFinish?: () => void
  ) => {
    const frames = 40;
    const interval = duration / frames;
    let step = 0;

    const animate = () => {
      step++;
      const t = step / frames;
      if (t > 1) {
        onFinish?.();
        return;
      }

      const newPlayers = start.players.map((p: any, i: number) => ({
        x: p.x + (end.players[i].x - p.x) * t,
        y: p.y + (end.players[i].y - p.y) * t,
      }));
      const newBall = {
        x: start.ball.x + (end.ball.x - start.ball.x) * t,
        y: start.ball.y + (end.ball.y - start.ball.y) * t,
      };

      setPlayers(newPlayers);
      setBall(newBall);

      // 🔴 Recalculer collisions et proximité pendant le replay
      checkCollision();
      checkProximity();

      requestAnimationFrame(animate);
    };

    animate();
  };

  // 🔄 Nouvelle fonction pour replay avec flèche
  // 🔄 Replay des chemins avec flèches visibles avant le mouvement
  const replayDragPathsWithArrow = (
    paths: { [key: number]: { x: number; y: number }[] },
    onFinish: () => void
  ) => {
    const playerIndices = Object.keys(paths).map(Number);

    // Afficher d'abord les flèches
    setDrawings((prev) => [
      ...prev,
      ...playerIndices.map((idx) => ({
        type: "arrow",
        points: paths[idx].flatMap((p) => [p.x, p.y]),
        id: Date.now() + idx,
        tension: 0, // 0 = droite, 0.5 = arrondi
        lineCap: "round",
        lineJoin: "round",
        stroke: "white",
        strokeWidth: 3,
      })),
    ]);

    // Puis animer les joueurs le long du chemin
    const start = performance.now();
    const duration = 1500;

    const animate = (time: number) => {
      const t = Math.min((time - start) / duration, 1);

      setPlayers((players) => {
        const updated = [...players];
        playerIndices.forEach((idx) => {
          const path = paths[idx];
          if (!path || path.length === 0) return;
          if (path.length === 1) {
            updated[idx] = path[0];
            return;
          }

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

      if (t < 1) requestAnimationFrame(animate);
      else onFinish();
    };

    requestAnimationFrame(animate);
  };

  const handleReplay = () => {
    if (!currentSystem || !currentSystem.recording.length) return;
    setIsReplaying(true);
    setIsPaused(false);
    setReplayIndex(0);
  };

  useEffect(() => {
    if (!isReplaying || isPaused || !currentSystem) return;

    const playStep = (index: number) => {
      const current = currentSystem.recording[index];
      const next = currentSystem.recording[index + 1];

      if (!next) {
        setIsReplaying(false);
        setCurrentComment("");
        setDrawings([]);
        return;
      }

      setCurrentComment(next.comment || "");
      setDrawings([]); // reset des dessins précédents
      const nextIndex = index + 1;

      const animateStep = (
        start: any,
        end: any,
        duration: number,
        onFinish: () => void
      ) => {
        const frames = 40;
        let step = 0;

        const animate = () => {
          step++;
          const t = step / frames;
          if (t > 1) {
            onFinish();
            return;
          }

          // Calcul intermédiaire des positions des joueurs
          const newPlayers = start.players.map((p: any, i: number) => ({
            x: p.x + (end.players[i].x - p.x) * t,
            y: p.y + (end.players[i].y - p.y) * t,
          }));

          // Calcul intermédiaire de la position de la balle
          const newBall = {
            x: start.ball.x + (end.ball.x - start.ball.x) * t,
            y: start.ball.y + (end.ball.y - start.ball.y) * t,
          };

          setPlayers(newPlayers);
          setBall(newBall);

          // 🔴 Recalcul des collisions et de la proximité à chaque frame
          checkCollision();
          checkProximity();

          requestAnimationFrame(animate);
        };

        animate();
      };

      if (next.dragPaths && Object.keys(next.dragPaths).length > 0) {
        // Replay avec flèches visibles
        setCurrentDragPaths(next.dragPaths);
        replayDragPathsWithArrow(next.dragPaths, () => {
          setCurrentDragPaths(null);
          setReplayIndex(nextIndex);
          playStep(nextIndex);
        });
      } else {
        // Replay normal : mouvement joueurs + balle
        animateStep(current, next, replaySpeed, () => {
          setReplayIndex(nextIndex);
          playStep(nextIndex);
        });
      }
    };

    playStep(replayIndex);
  }, [isReplaying, isPaused, replaySpeed, currentSystem, replayIndex]);

  const togglePause = () => setIsPaused((prev) => !prev);

  const goToStep = (index: number, { truncate = false } = {}) => {
    if (!currentSystem) return;
    const steps = currentSystem.recording;
    if (index < 0 || index >= steps.length) return;

    const step = steps[index];
    setPlayers(step.players);
    setBall(step.ball);
    setCurrentComment(step.comment || "");
    setDrawings(step.drawings || []);
    setReplayIndex(index);

    if (truncate) {
      setSystems((prev) =>
        prev.map((s) =>
          s.id === currentSystemId
            ? { ...s, recording: s.recording.slice(0, index + 1) }
            : s
        )
      );
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

  const handleMouseDown = (e: any) => {
    if (isReplaying || isRecording) return;
    setDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setNewShapePoints([pos.x, pos.y]);
  };

  const handleMouseMove = (e: any) => {
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
        { type: drawMode, points: newShapePoints, id: Date.now() },
      ]);
    }

    setNewShapePoints([]);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentComment(e.target.value);
  };

  return {
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
    PLAYER_RADIUS,
    BALL_RADIUS,
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
    handleDragStart,
    handleDragEnd,
    goToStep,
    replayIndex,
    stepProgress,
    setCurrentComment,
    handleCommentChange,
    setDrawings,
    setPlayers,
    setBall,
    setIsReplaying,
  };
}
