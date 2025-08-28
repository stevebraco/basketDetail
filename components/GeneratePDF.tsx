"use client";
import React, { useRef, useState } from "react";
import { Layer, Group, Rect, Line, Arc, Stage } from "react-konva";
import { Html } from "react-konva-utils";

import {
  Document,
  Page,
  Image,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { useResponsiveCourt } from "@/hooks/useResponsiveCourt";
import BasketBallCourtKonva from "./BasketBallCourtKonva";

// Exemple de données de tirs
// 🎯 Exemple de mock de tirs & événements
const mockActions = [
  {
    x: 358,
    y: 109,
    type: "2PT",
    made: true,
    commentaire: "",
    typeItem: "shot",
    playerId: "p1",
    player: "Alex",
  },
  {
    x: 414,
    y: 169,
    commentaire: "",
    eventType: "perte_de_balle",
    typeItem: "event",
    playerId: "p2",
    player: "Maxime",
  },
  {
    x: 345,
    y: 98,
    type: "3PT",
    made: false,
    commentaire: "Tir manqué",
    typeItem: "shot",
    playerId: "p1",
    player: "Alex",
  },
  {
    x: 220,
    y: 250,
    type: "2PT",
    made: false,
    commentaire: "Contesté",
    typeItem: "shot",
    playerId: "p3",
    player: "Julien",
  },
  {
    x: 500,
    y: 300,
    type: "2PT",
    made: true,
    commentaire: "Layup réussi",
    typeItem: "shot",
    playerId: "p2",
    player: "Maxime",
  },
  {
    x: 280,
    y: 150,
    commentaire: "Faute offensive",
    eventType: "faute",
    typeItem: "event",
    playerId: "p3",
    player: "Julien",
  },
  {
    x: 390,
    y: 400,
    type: "3PT",
    made: true,
    commentaire: "Tir clutch",
    typeItem: "shot",
    playerId: "p1",
    player: "Alex",
  },
];

const CourtWithShotsPDF: React.FC = ({ shots }: any) => {
  console.log(shots);
  const stageRef = useRef<any>(null);
  const [terrainImage, setTerrainImage] = useState<string | null>(null);

  // 👉 ici tu pourras mettre tes vrais tirs

  // Export terrain en PNG
  const exportTerrain = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      setTerrainImage(dataURL);
    }
  };

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

  const { containerRef, stageSize } = useResponsiveCourt({
    sceneWidth: 1010,
    sceneHeight: 500,
    maxWidth: 1011,
    scale: 0.6,
  });

  // Styles PDF
  const styles = StyleSheet.create({
    page: {
      position: "relative",
      width: stageSize.width,
      height: stageSize.height,
    },
    terrain: { width: stageSize.width, height: stageSize.height },
    shot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  });

  const cornerLineXRight = 400;
  const arcsConfig = [
    { cx: 185, cy: 254, radius: 176, start: 281, end: 439 },
    { cx: 837, cy: 254, radius: 177, start: 101, end: 259 },
    { cx: 137, cy: 253, radius: 40, start: 280, end: 431 },
    { cx: 890, cy: 253, radius: 40, start: 101, end: 259 },
  ];

  const arcPointsList = arcsConfig.map(({ cx, cy, radius, start, end }) =>
    generateArcPoints(cx, cy, radius, start, end)
  );

  // Exemple d'accès :
  const [arcPoints, arcPoints2, arcPoints3, arcPoints4] = arcPointsList;
  return (
    <div>
      <div
        // ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          maxWidth: "50%",
        }}
      >
        <h2>Terrain + tirs en PDF</h2>

        {/* 🎨 Terrain Konva */}
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          scaleX={stageSize.scale}
          scaleY={stageSize.scale}
          opacity={1}
          // style={{
          //   position: "relative",
          //   top: 0,
          //   left: 0,
          //   zIndex: 0,
          //   width: "100%",
          //   height: "100%",
          // }}
        >
          <Layer listening={false}>
            <BasketBallCourtKonva
              lineColor={"black"}
              backgroundCourt={"white"}
            />
          </Layer>
        </Stage>
      </div>

      {/* Bouton */}
      <button
        className="text-white"
        onClick={exportTerrain}
        style={{ marginTop: "10px" }}
      >
        Exporter en PDF
      </button>

      {/* PDF */}
      {terrainImage && (
        <PDFDownloadLink
          fileName="terrain-avec-tirs.pdf"
          document={
            <Document>
              <Page
                size={{ width: stageSize.width, height: stageSize.height }}
                style={styles.page}
              >
                {/* Terrain en image */}
                <Image src={terrainImage} style={styles.terrain} />
                {/* Tirs par-dessus */}
                {shots.map((s: any, i: number) => (
                  <View
                    key={i}
                    style={{
                      ...styles.shot,
                      left: s.x * stageSize.scale - 6,
                      top: s.y * stageSize.scale - 6,
                      backgroundColor: s.made ? "green" : "red",
                    }}
                  />
                ))}
              </Page>
            </Document>
          }
        >
          {({ loading }) => (loading ? "Génération..." : "Télécharger le PDF")}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default CourtWithShotsPDF;
