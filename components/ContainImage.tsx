import useImage from "@/hooks/useImage";
import { Image as KonvaImage } from "react-konva";

interface Props {
  url: string;
  width: number;
  height: number;
}

export default function ContainImage({ url, width, height }: Props) {
  const image = useImage(url);
  if (!image) return null;

  // ---- Logique "contain" ----
  const imgRatio = image.width / image.height;
  const containerRatio = width / height;

  let drawWidth: number;
  let drawHeight: number;

  if (imgRatio > containerRatio) {
    // image plus "large" => on limite par la largeur
    drawWidth = width;
    drawHeight = width / imgRatio;
  } else {
    // image plus "haute" => on limite par la hauteur
    drawHeight = height;
    drawWidth = height * imgRatio;
  }

  const offsetX = (width - drawWidth) / 2;
  const offsetY = (height - drawHeight) / 2;

  return (
    <KonvaImage
      image={image}
      x={offsetX}
      y={offsetY}
      width={drawWidth}
      height={drawHeight}
    />
  );
}
