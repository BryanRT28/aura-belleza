import { NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

type PdfRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type ImageAsset = {
  bytes: Uint8Array;
  mimeType: string;
};

async function fetchImageAsset(url: string): Promise<ImageAsset> {
  const response = await fetch(url, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`No se pudo descargar la imagen: ${response.status}`);
  }

  const mimeType = response.headers.get('content-type') ?? '';
  const arrayBuffer = await response.arrayBuffer();

  return {
    bytes: new Uint8Array(arrayBuffer),
    mimeType,
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Lima',
  }).format(date);
}

function drawTextLine(
  page: import('pdf-lib').PDFPage,
  text: string,
  x: number,
  y: number,
  options: {
    font: import('pdf-lib').PDFFont;
    size: number;
    color?: ReturnType<typeof rgb>;
    maxWidth?: number;
  },
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  const maxWidth = options.maxWidth ?? 500;

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;
    const width = options.font.widthOfTextAtSize(nextLine, options.size);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    page.drawText(line, {
      x,
      y: y - index * (options.size + 4),
      size: options.size,
      font: options.font,
      color: options.color ?? rgb(0.18, 0.16, 0.15),
    });
  });

  return lines.length * (options.size + 4);
}

async function embedImage(pdfDoc: PDFDocument, asset: ImageAsset | null) {
  if (!asset) {
    return null;
  }

  if (asset.mimeType.includes('png')) {
    return pdfDoc.embedPng(asset.bytes);
  }

  return pdfDoc.embedJpg(asset.bytes);
}

async function drawImagePanel(
  pdfDoc: PDFDocument,
  page: import('pdf-lib').PDFPage,
  title: string,
  asset: ImageAsset | null,
  x: number,
  y: number,
  width: number,
  height: number,
  fonts: {
    bold: import('pdf-lib').PDFFont;
    regular: import('pdf-lib').PDFFont;
  },
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    borderColor: rgb(0.89, 0.84, 0.78),
    borderWidth: 1,
    color: rgb(1, 1, 1),
  });

  page.drawText(title, {
    x: x + 14,
    y: y + height - 28,
    size: 13,
    font: fonts.bold,
    color: rgb(0.18, 0.16, 0.15),
  });

  const imageX = x + 14;
  const imageY = y + 14;
  const imageWidth = width - 28;
  const imageHeight = height - 56;
  const embeddedImage = await embedImage(pdfDoc, asset);

  if (!embeddedImage) {
    page.drawRectangle({
      x: imageX,
      y: imageY,
      width: imageWidth,
      height: imageHeight,
      color: rgb(0.97, 0.95, 0.93),
    });
    page.drawText('Imagen no disponible', {
      x: imageX + 44,
      y: imageY + imageHeight / 2,
      size: 10,
      font: fonts.regular,
      color: rgb(0.55, 0.49, 0.45),
    });
    return;
  }

  const scaled = embeddedImage.scaleToFit(imageWidth, imageHeight);
  page.drawImage(embeddedImage, {
    x: imageX + (imageWidth - scaled.width) / 2,
    y: imageY + (imageHeight - scaled.height) / 2,
    width: scaled.width,
    height: scaled.height,
  });
}

async function createPdfBytes(simulacion: {
  id: number;
  tratamiento: string;
  imagenOriginalUrl: string;
  imagenProcesadaUrl: string;
  fechaSimulacion: Date;
  paciente: {
    nombre: string;
    correo: string;
  };
}) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fonts = { regular, bold };

  const [beforeImage, afterImage] = await Promise.all([
    fetchImageAsset(simulacion.imagenOriginalUrl).catch(() => null),
    fetchImageAsset(simulacion.imagenProcesadaUrl).catch(() => null),
  ]);

  page.drawRectangle({
    x: 0,
    y: 725,
    width: 595.28,
    height: 116,
    color: rgb(0.18, 0.16, 0.15),
  });

  page.drawText('Aura Belleza', {
    x: 42,
    y: 782,
    size: 24,
    font: bold,
    color: rgb(0.85, 0.69, 0.17),
  });
  page.drawText('Reporte de simulacion estetica con IA', {
    x: 42,
    y: 758,
    size: 11,
    font: regular,
    color: rgb(1, 0.97, 0.93),
  });

  page.drawText('Resumen de la simulacion', {
    x: 42,
    y: 684,
    size: 18,
    font: bold,
    color: rgb(0.18, 0.16, 0.15),
  });

  drawTextLine(
    page,
    'Este documento es una referencia visual generada por IA. No reemplaza una evaluacion medica profesional.',
    42,
    660,
    {
      font: regular,
      size: 10,
      color: rgb(0.37, 0.34, 0.31),
      maxWidth: 500,
    },
  );

  page.drawRectangle({
    x: 42,
    y: 530,
    width: 511,
    height: 104,
    color: rgb(0.97, 0.95, 0.93),
    borderColor: rgb(0.89, 0.84, 0.78),
    borderWidth: 1,
  });

  const details = [
    ['ID de simulacion', String(simulacion.id)],
    ['Paciente', simulacion.paciente.nombre],
    ['Correo', simulacion.paciente.correo],
    ['Tratamiento', simulacion.tratamiento],
    ['Fecha', formatDate(simulacion.fechaSimulacion)],
  ];

  let detailY = 608;
  details.forEach(([label, value]) => {
    page.drawText(label.toUpperCase(), {
      x: 60,
      y: detailY,
      size: 8.5,
      font: bold,
      color: rgb(0.55, 0.49, 0.45),
    });
    page.drawText(value, {
      x: 190,
      y: detailY,
      size: 10,
      font: regular,
      color: rgb(0.18, 0.16, 0.15),
    });
    detailY -= 17;
  });

  await drawImagePanel(pdfDoc, page, 'Antes', beforeImage, 42, 195, 240, 300, fonts);
  await drawImagePanel(pdfDoc, page, 'Despues', afterImage, 313, 195, 240, 300, fonts);

  page.drawText('Generado automaticamente por Aura Belleza', {
    x: 190,
    y: 50,
    size: 9,
    font: regular,
    color: rgb(0.55, 0.49, 0.45),
  });

  return pdfDoc.save();
}

export async function GET(_request: Request, context: PdfRouteContext) {
  try {
    const { id } = await context.params;
    const simulationId = Number(id);

    if (!Number.isInteger(simulationId) || simulationId <= 0) {
      return NextResponse.json(
        { ok: false, error: 'ID de simulacion invalido' },
        { status: 400 },
      );
    }

    const simulacion = await prisma.simulacion.findUnique({
      where: { id: simulationId },
      include: {
        paciente: true,
      },
    });

    if (!simulacion) {
      return NextResponse.json(
        { ok: false, error: 'No se encontro la simulacion' },
        { status: 404 },
      );
    }

    const pdfBytes = await createPdfBytes(simulacion);
    const filename = `aura-simulacion-${simulacion.id}.pdf`;

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    return NextResponse.json(
      { ok: false, error: 'No fue posible generar el PDF' },
      { status: 500 },
    );
  }
}
