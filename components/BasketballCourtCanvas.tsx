"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import de framer-motion

const isThreePointShot = (x: number, y: number): boolean => {
  // Est-ce qu’on est sur le côté gauche ou droit ?
  const basket = x < 250 ? { x: 75, y: 250 } : { x: 425, y: 250 };

  const dx = x - basket.x;
  const dy = y - basket.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const arcRadius = 237.5;
  const cornerDistance = 220;
  const cornerYMin = 115;
  const cornerYMax = 385;

  const inArc = distance > arcRadius;
  const inCorner =
    y >= cornerYMin &&
    y <= cornerYMax &&
    (x < basket.x - cornerDistance || x > basket.x + cornerDistance);

  return inArc || inCorner;
};

export default function BasketballCourtCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shots, setShots] = useState<
    { x: number; y: number; isThreePoint: boolean }[]
  >([]); // Ajout de isThreePoint pour chaque tir

  // Dessiner le terrain
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    // Dimensions du terrain
    const width = canvas!.width;
    const height = canvas!.height;

    // Dessiner le terrain (background)
    ctx.fillStyle = "#F4F4F4";
    ctx.fillRect(0, 0, width, height);

    // Dessiner la ligne médiane
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Dessiner la ligne des 3 points (cercle à 3 points)
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 150, Math.PI, 0, false); // Partie droite du cercle
    ctx.arc(width / 2, height / 2, 150, 0, Math.PI, false); // Partie gauche du cercle
    ctx.stroke();

    // Dessiner le cercle central (milieu du terrain)
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();

    // Dessiner les cercles des zones de lancer franc
    ctx.beginPath();
    ctx.arc(width / 2, height / 4, 75, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, (height / 4) * 3, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Dessiner les paniers
    ctx.beginPath();
    ctx.arc(width / 2 - 150, height / 2, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(width / 2 + 150, height / 2, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Dessiner les zones dans les coins (zones d'attaque)
    ctx.strokeRect(0, 0, width / 2, height / 2);
    ctx.strokeRect(width / 2, height / 2, width / 2, height / 2);
  };

  useEffect(() => {
    drawCanvas();
  }, [shots]); // Redessiner le terrain + tirs chaque fois que 'shots' change

  // Fonction pour gérer le clic et ajouter un point
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; // Position du clic en X
      const y = e.clientY - rect.top; // Position du clic en Y

      // Vérifier si c'est un tir à 3 points
      const isThreePoint = isThreePointShot(x, y);

      // Ajouter la nouvelle position des tirs dans le tableau 'shots'
      setShots((prevShots) => [...prevShots, { x, y, isThreePoint }]);
    }
  };

  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      <canvas ref={canvasRef} width={500} height={500} onClick={handleClick} />
      <div>
        {/* Animation des tirs avec motion.div */}
        {shots.map((shot, index) => (
          <motion.div
            key={index}
            style={{
              position: "absolute",
              top: shot.y - 5, // Position Y du tir
              left: shot.x - 5, // Position X du tir
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: shot.isThreePoint ? "blue" : "red", // Change la couleur selon si c'est un tir à 3 points
            }}
            animate={{
              scale: [0, 1.5, 1], // L'animation consiste à faire grossir et rétrécir le tir
              opacity: [0, 1], // Faire apparaître le tir
            }}
            transition={{
              duration: 0.5, // Durée de l'animation
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
