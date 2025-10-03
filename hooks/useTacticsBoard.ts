import { useEffect, useRef, useState } from "react";

export function useTacticsBoard() {
  const PLAYER_COUNT = 10;
  const PLAYER_RADIUS = 35;
  const BALL_RADIUS = 20;
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

  const [arrowProgress, setArrowProgress] = useState<{
    [playerId: string]: number; // 0 → 1
  }>({});

  const [previewArrows, setPreviewArrows] = useState<{
    [key: string]: { x: number; y: number }[];
  }>({});

  const [isRecording, setIsRecording] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState(1200);
  const [currentComment, setCurrentComment] = useState("");
  const [dragPath, setDragPath] = useState<{
    [key: number]: { x: number; y: number }[];
  }>({});
  const [lastDragTime, setLastDragTime] = useState<{ [key: number]: number }>(
    {}
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
    if (playerWithBall === i) return "orange";
    if (playersDirection[i]) return "blue";
    return i < 5 ? "#212121" : "grey";
  };

  const handleDragStart = (index: number) => {
    // setDragPath((prev) => ({ ...prev, [index]: [] }));
  };

  const handleDragMove = (index: number, e: any) => {
    if (isReplaying) return;

    const now = Date.now();
    const last = lastDragTime[index] || 0;

    const newX = e.target.x();
    const newY = e.target.y();

    const dx = newX - players[index].x;
    const dy = newY - players[index].y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (now - last > 30 || dist > 8) {
      // ✅ Déplacer le joueur
      setPlayers((p) => {
        const copy = [...p];
        copy[index] = { x: newX, y: newY };
        return copy;
      });

      // ✅ Si ce joueur a la balle, déplacer la balle avec lui
      if (playerWithBall === index && ballOffset) {
        setBall({
          x: newX + ballOffset.x,
          y: newY + ballOffset.y,
        });
      }

      // 🔹 Enregistrer le chemin du joueur (filtré)
      setDragPath((prev) => {
        const rawPath = [...(prev[index] || []), { x: newX, y: newY }];
        const filteredPath = rawPath.filter((point, i, arr) => {
          if (i === 0) return true;
          const dx = point.x - arr[i - 1].x;
          const dy = point.y - arr[i - 1].y;
          return Math.sqrt(dx * dx + dy * dy) > 8;
        });
        return { ...prev, [index]: filteredPath };
      });

      setLastDragTime((prev) => ({ ...prev, [index]: now }));
    }
  };

  const handlePlayerDoubleClick = (index: number) => {
    const player = players[index];
    if (!player) return;

    // Ajouter un dessin "T" sur le terrain à la position du joueur
    setDrawings((prev) => [
      ...prev,
      {
        type: "T", // Type de dessin : on pourra le gérer dans ton rendu
        x: player.x,
        y: player.y,
        id: Date.now(),
        temporary: true, // ✅ marquage temporaire
      },
    ]);
  };

  const handleDragEnd = (index: number, e?: any) => {
    let finalX = players[index].x;
    let finalY = players[index].y;
    if (e && e.target && typeof e.target.x === "function") {
      finalX = e.target.x();
      finalY = e.target.y();
    }
    setDragPath((prev) => ({
      ...prev,
      [index]: [...(prev[index] || []), { x: finalX, y: finalY }],
    }));
  };

  const handleBallDrag = (e: any) => {
    if (isReplaying) return;

    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    setBall({ x: newX, y: newY });

    // Filtrage du chemin de la balle
    setDragPath((prev) => {
      const rawPath = [...(prev.ball || []), { x: newX, y: newY }];
      const filteredPath = rawPath.filter((point, i, arr) => {
        if (i === 0) return true;
        const dx = point.x - arr[i - 1].x;
        const dy = point.y - arr[i - 1].y;
        return Math.sqrt(dx * dx + dy * dy) > 8;
      });
      return { ...prev, ball: filteredPath };
    });

    setPlayerWithBall(null);
    setBallOffset(null);
    checkCollision();
    // checkProximity();
  };

  const addStep = () => {
    if (!currentSystem) return;

    const dragPathsWithBall = { ...dragPath };

    const arrowPaths = Object.fromEntries(
      Object.entries(dragPathsWithBall).map(([key, path]) => {
        const points: number[] = [];
        path.forEach((p) => {
          points.push(p.x, p.y);
        });
        return [key, points];
      })
    );

    // On récupère les ids de tous les commentaires actuels
    const commentIds = drawings
      .filter((d) => d.type === "comment")
      .map((d) => d.id);

    const filteredDrawings = drawings.filter(
      (d) => !(d.type === "T" && d.temporary)
    );

    const newStep = {
      time: Date.now(),
      players: [...players],
      ball: { ...ball },
      playerWithBall,
      ballOffset,
      commentIds: filteredDrawings
        .filter((d) => d.type === "comment")
        .map((d) => d.id),
      drawings: filteredDrawings, // ✅ on enregistre les dessins sans les T temporaires
      dragPaths: dragPathsWithBall,
      arrowPaths,
    };

    let newRecording = [...currentSystem.recording];

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

    setSystems((prev) =>
      prev.map((s) =>
        s.id === currentSystemId ? { ...s, recording: newRecording } : s
      )
    );

    setDrawings(filteredDrawings);

    setDragPath({}); // ✅ réinitialise les chemins de drag
    setDrawMode(""); // ✅ réinitialise le mode de dessin
    // ❌ on ne vide plus les dessins pour garder les commentaires
    // ❌ setDrawings([]);
    // ❌ setCurrentComment(""); // le texte reste modifiable
  };

  // 🔄 Fonction de transition lissée
  const smoothTransition = (
    start: any,
    end: any,
    duration = replaySpeed,
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

      let newBall;
      if (playerWithBall !== null && ballOffset) {
        newBall = {
          x: newPlayers[playerWithBall].x + ballOffset.x,
          y: newPlayers[playerWithBall].y + ballOffset.y,
        };
      } else {
        newBall = {
          x: start.ball.x + (end.ball.x - start.ball.x) * t,
          y: start.ball.y + (end.ball.y - start.ball.y) * t,
        };
      }

      setPlayers(newPlayers);
      setBall(newBall);
      checkCollision();

      requestAnimationFrame(animate);
    };

    animate();
  };

  // 🔄 Nouvelle fonction pour replay avec flèche
  // 🔄 Replay des chemins avec flèches visibles avant le mouvement
  const replayDragPathsWithArrow = (
    paths: { [key: string]: { x: number; y: number }[] },
    playerWithBallInStep: number | null,
    ballOffsetInStep: { x: number; y: number } | null,
    onFinish: () => void
  ) => {
    const keys = Object.keys(paths);
    const startTime = performance.now();
    const duration = replaySpeed;

    const animate = (time: number) => {
      const t = Math.min((time - startTime) / duration, 1);

      setPlayers((prevPlayers) => {
        const updated = [...prevPlayers];

        keys.forEach((key) => {
          const path = paths[key];
          if (!path || path.length === 0) return;

          const pos = t * (path.length - 1);
          const i = Math.floor(pos);
          const nextIndex = Math.min(i + 1, path.length - 1);
          const p0 = path[i];
          const p1 = path[nextIndex];

          if (!p0 || !p1) return;

          const frac = pos - i;
          const interpolated = {
            x: p0.x + (p1.x - p0.x) * frac,
            y: p0.y + (p1.y - p0.y) * frac,
          };

          if (key !== "ball") {
            updated[parseInt(key)] = interpolated;
          }
        });

        // ✅ Si un joueur possède la balle, on colle la balle sur lui
        if (playerWithBallInStep !== null && ballOffsetInStep) {
          const p = updated[playerWithBallInStep];
          setBall({
            x: p.x + ballOffsetInStep.x,
            y: p.y + ballOffsetInStep.y,
          });
        } else if (paths.ball) {
          // Sinon, si c'est un déplacement direct de la balle (ex : passe)
          const path = paths.ball;
          const pos = t * (path.length - 1);
          const i = Math.floor(pos);
          const nextIndex = Math.min(i + 1, path.length - 1);
          const p0 = path[i];
          const p1 = path[nextIndex];
          if (p0 && p1) {
            const frac = pos - i;
            const interpolated = {
              x: p0.x + (p1.x - p0.x) * frac,
              y: p0.y + (p1.y - p0.y) * frac,
            };
            setBall(interpolated);
          }
        }

        return updated;
      });

      if (t < 1) requestAnimationFrame(animate);
      else {
        // Quand l'animation est terminée, coller la balle sur le joueur si nécessaire
        if (playerWithBallInStep !== null && ballOffsetInStep) {
          const p = playersRef.current[playerWithBallInStep];
          if (p) {
            setBall({
              x: p.x + ballOffsetInStep.x,
              y: p.y + ballOffsetInStep.y,
            });
          }
        }
        onFinish();
      }
    };

    requestAnimationFrame(animate);
  };

  const handleReplay = () => {
    if (!currentSystem || !currentSystem.recording.length) return;

    // 🔹 Commencer avec la première étape du recording
    const firstStep = currentSystem.recording[0];
    setPlayers(firstStep.players);
    setBall(firstStep.ball);
    setPlayerWithBall(firstStep.playerWithBall ?? null);
    setBallOffset(firstStep.ballOffset ?? null);
    setCurrentComment(firstStep.comment || "");
    setDrawings(firstStep.drawings || []);
    setReplayIndex(0);

    setIsReplaying(true);
    setIsPaused(false);
    setSelectedId(0);
  };

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
        // ✅ 1. On affiche les flèches immédiatement
        setPreviewArrows(next.dragPaths);

        // ✅ 2. On attend 1 seconde avant de lancer le déplacement
        setTimeout(() => {
          // ⛔️ NE PAS effacer ici ! (on veut la flèche pendant l'anim)

          // 3️⃣ Lancer l'animation du déplacement
          replayDragPathsWithArrow(
            next.dragPaths,
            next.playerWithBall ?? null,
            next.ballOffset ?? null,
            () => {
              // ✅ 4. Quand le déplacement est terminé → on retire la flèche
              setPreviewArrows({});

              setPlayerWithBall(next.playerWithBall ?? null);
              setBallOffset(next.ballOffset ?? null);
              setReplayIndex(nextIndex);
              playStep(nextIndex);
            }
          );
        }, 100);
      } else {
        // 🔹 Pas de déplacement → mise à jour immédiate
        setPlayers(next.players);
        setBall(next.ball);

        checkCollision();

        if (playerWithBall !== null && ballOffset) {
          setBall({
            x: next.players[playerWithBall].x + ballOffset.x,
            y: next.players[playerWithBall].y + ballOffset.y,
          });
        }

        setPlayerWithBall(next.playerWithBall ?? null);
        setBallOffset(next.ballOffset ?? null);
        setReplayIndex(nextIndex);
        playStep(nextIndex);
      }
    };

    playStep(replayIndex);
  }, [isReplaying, isPaused, currentSystem, replayIndex]);

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

  const handleCommentDragMove = (id: number, e: any) => {
    const node = e.target;
    const newX = node.x();
    const newY = node.y();

    setDrawings((prev) =>
      prev.map((d) => (d.id === id ? { ...d, x: newX, y: newY } : d))
    );
  };

  const handleMouseDown = (e: any) => {
    if (isReplaying || isRecording) return;
    const pos = e.target.getStage().getPointerPosition();

    if (drawMode === "comment") {
      setDrawings((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: "comment",
          x: pos.x,
          y: pos.y,
          text: "Double-cliquez pour éditer",
          fontSize: 16,
          draggable: true,
        },
      ]);
      setDrawMode("");
      return;
    }

    if (drawMode === "T") {
      setDrawings((prev) => [
        ...prev,
        {
          type: "T",
          id: Date.now(),
          x: pos.x,
          y: pos.y,
          rotation: 0,
          temporary: true, // ✅
        },
      ]);
      setDrawMode(""); // ❌ Désactive le mode T après placement
      return;
    }

    setDrawing(true);
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
    setDrawMode("");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentComment(e.target.value);
  };

  const updateCommentText = (id: number, text: string) => {
    setDrawings((prev) => prev.map((d) => (d.id === id ? { ...d, text } : d)));
  };

  // Crée un commentaire à une position x/y avec texte initial (vide)
  // si `attachTo` est 'player' et index fourni, on place le commentaire à côté du joueur
  function addCommentAt({
    x,
    y,
    text = "",
    attachTo = null,
    playerIndex = null,
  }: {
    x?: number;
    y?: number;
    text?: string;
    attachTo?: "player" | "ball" | null;
    playerIndex?: number | null;
  }) {
    // calculer position si on attache au joueur ou à la balle
    let cx = x ?? 100;
    let cy = y ?? 100;
    if (attachTo === "player" && typeof playerIndex === "number") {
      const p = players[playerIndex];
      if (p) {
        cx = p.x + 50; // offset à droite du joueur (ajuste selon taille)
        cy = p.y - 10;
      }
    } else if (attachTo === "ball") {
      cx = ball.x + 30;
      cy = ball.y - 10;
    }

    const newComment = {
      id: Date.now(),
      type: "comment",
      x: cx,
      y: cy,
      text: text || "Commentaire...",
      fontSize: 14,
      width: 140,
      draggable: true,
      visibleDuringReplay: true, // flag pour contrôle
      attachedTo: attachTo, // sauvegarde si on veut ré-attacher plus tard
      attachedIndex: playerIndex,
    };

    setDrawings((prev: any[]) => [...prev, newComment]);
    return newComment.id;
  }

  const removeDrawing = (id: number) => {
    setDrawings((prev) => prev.filter((d) => d.id !== id));
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
    selectedId,
    setSelectedId,
    previewArrows,
    playerWithBall,
    addCommentAt,
    removeDrawing,
    updateCommentText,
    handleCommentDragMove,
  };
}
