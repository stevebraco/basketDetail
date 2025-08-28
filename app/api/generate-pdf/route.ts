import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

export async function GET() {
  const doc = new PDFDocument({ size: [500, 650] });

  // Buffer pour stocker le PDF
  const chunks: Uint8Array[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  doc.text("Rapport Basket PDF", 50, 50);
  doc.end();

  await new Promise((resolve) => doc.on("end", resolve));

  const pdfBytes = Buffer.concat(chunks);

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="report.pdf"',
    },
  });
}
