import { Group, Rect, Text } from "react-konva";
import { Html } from "react-konva-utils";
import { useState, useEffect } from "react";

export function CommentKonva({
  comment,
  updateText,
  removeComment,
  isRecordingOrReplay,
}: {
  comment: any;
  updateText: (id: number, text: string) => void;
  removeComment: (id: number) => void;
  isRecordingOrReplay: boolean;
}) {
  const [draftText, setDraftText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => setDraftText(comment.text), [comment.text]);

  const handleBlur = () => {
    setIsEditing(false);
    updateText(comment.id, draftText);
  };

  const contentWidth = comment.width || 160; // largeur utile pour le texte
  const contentHeight = 70; // hauteur utile pour le texte
  const border = 12; // épaisseur de la bordure cliquable
  const totalWidth = contentWidth + border * 2; // taille totale du groupe
  const totalHeight = contentHeight + border * 2;

  return (
    <Group
      x={comment.x}
      y={comment.y}
      width={totalWidth}
      height={totalHeight}
      draggable={!isRecordingOrReplay}
    >
      {/* fond du bloc */}
      <Rect
        x={0}
        y={0}
        width={totalWidth}
        height={totalHeight}
        fill="#2A2D3F"
        cornerRadius={6}
      />

      {/* ---- Zones de drag : 4 côtés ---- */}
      {!isRecordingOrReplay && (
        <>
          {/* haut */}
          <Rect
            x={0}
            y={0}
            width={totalWidth}
            height={border}
            fill="transparent"
          />
          {/* bas */}
          <Rect
            x={0}
            y={totalHeight - border}
            width={totalWidth}
            height={border}
            fill="transparent"
          />
          {/* gauche */}
          <Rect
            x={0}
            y={0}
            width={border}
            height={totalHeight}
            fill="transparent"
          />
          {/* droite */}
          <Rect
            x={totalWidth - border}
            y={0}
            width={border}
            height={totalHeight}
            fill="transparent"
          />
        </>
      )}

      {/* zone centrale : textarea ou texte */}
      {isRecordingOrReplay ? (
        <Text
          x={border + 5}
          y={border + 5}
          width={contentWidth - 10}
          height={contentHeight - 10}
          text={draftText}
          fill="white"
          fontSize={14}
          wrap="word"
        />
      ) : (
        <Html
          divProps={{
            style: {
              position: "absolute",
              left: "8px",
              top: "25px",
              width: contentWidth,
              height: contentHeight,
              pointerEvents: "auto",
            },
          }}
        >
          <textarea
            style={{
              width: "100%",
              height: "100%",
              padding: 5,
              background: "#2A2D3F",
              color: "white",
              border: "1px solid #4F5BD5",
              borderRadius: 4,
              resize: "none",
              fontSize: 14,
              boxSizing: "border-box",
            }}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
          />
        </Html>
      )}

      {/* bouton fermer */}
      {!isRecordingOrReplay && (
        <Text
          x={totalWidth - 20}
          y={4}
          width={16}
          height={16}
          text="✕"
          fontSize={14}
          fill="red"
          onClick={() => removeComment(comment.id)}
        />
      )}
    </Group>
  );
}
