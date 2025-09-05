import { useEffect, useRef, useState } from "react";

export function useTacticsBoard() {
  const PLAYER_COUNT = 10;
  const PLAYER_RADIUS = 15;
  const BALL_RADIUS = 10;
  const PROXIMITY_THRESHOLD = 50;

  const initialPositions = Array.from({ length: PLAYER_COUNT }, (_, i) => ({
    x: 150 + i * 80, // chaque joueur est espacé de 80px en X
    y: 15, // tous sur la même ligne
  }));

  const initialBallPosition = { x: 501, y: 250 };

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
  const [ballOffset, setBallOffset] = useState<{ x: number; y: number } | null>(
    null
  );

  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(800);
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
      const dx = ball.x - players[i].x;
      const dy = ball.y - players[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= PLAYER_RADIUS + BALL_RADIUS) {
        setPlayerWithBall(i);
        setBallOffset({ x: dx, y: dy }); // 👈 on garde la distance relative
        return;
      }
    }
    setPlayerWithBall(null);
    setBallOffset(null);
  };

  const stepProgress = currentSystem
    ? `${replayIndex + 1} / ${currentSystem.recording.length}`
    : "0 / 0";

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
    const newX = e.target.x();
    const newY = e.target.y();
    newP[index] = { x: newX, y: newY };
    setPlayers(newP);

    if (playerWithBall === index && ballOffset) {
      setBall({
        x: newX + ballOffset.x,
        y: newY + ballOffset.y,
      });
    }

    checkProximity();
  };

  const handleBallDrag = (e) => {
    if (isReplaying) return;

    setBall({ x: e.target.x(), y: e.target.y() });
    setPlayerWithBall(null);
    setBallOffset(null); // 👈 plus de lien
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
          comment: currentComment, // 👈 ici c’est comment
          drawings: [...drawings],
        };

        let newRecording = [...s.recording];

        if (newRecording.length === 0) {
          // Cas 1 : aucune étape → on crée la première
          newRecording = [newStep];
          setReplayIndex(0);
        } else if (replayIndex === newRecording.length - 1) {
          // Cas 2 : on est sur la dernière étape → on ajoute à la fin
          newRecording.push(newStep);
          setReplayIndex(newRecording.length - 1);
        } else {
          // Cas 3 : on est au milieu → on remplace et on coupe tout ce qu’il y a après
          newRecording = [
            ...newRecording.slice(0, replayIndex + 1), // garde tout avant + courant
            newStep, // remplace
          ];
          setReplayIndex(newRecording.length - 1);
        }

        return { ...s, recording: newRecording };
      })
    );

    console.log(systems);

    setCurrentComment("");
    setDrawMode("");
    setDrawings([]);
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

  const goToStep = (index, { truncate = false } = {}) => {
    if (!currentSystem) return;

    const steps = currentSystem.recording;
    if (index < 0 || index >= steps.length) return;

    const step = steps[index];

    // Replacer l’état complet
    setPlayers(step.players);
    setBall(step.ball);
    setCurrentComment(step.comment || "");
    setDrawings(step.drawings || []);
    setReplayIndex(index);

    // Si on veut repartir de cet état => on coupe l’historique après index
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

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentComment(e.target.value); // 👈 ok, on passe juste le string
  };

  return {
    // states
    handleCommentChange,
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

    // setters
    setDrawMode,
    setDrawing,
    setNewShapePoints,
    setReplaySpeed,

    // helpers
    getPlayerColor,

    // handlers
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

    goToStep,
    replayIndex,
    stepProgress,
    setCurrentComment,
  };
}
