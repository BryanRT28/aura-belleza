import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const DEMO_PATIENT_EMAIL = 'demo@aura-belleza.local';

export async function GET(request: Request) {
  try {
    // Extraemos los parámetros de la URL (por si quieren filtrar por un paciente específico)
    const { searchParams } = new URL(request.url);
    const pacienteIdParam = searchParams.get('pacienteId');

    // Construimos la condición de búsqueda
    const donde = pacienteIdParam 
      ? { pacienteId: parseInt(pacienteIdParam) } 
      : {};

    // Consultamos la tabla Simulacion en SQLite
    const simulaciones = await prisma.simulacion.findMany({
      where: donde,
      orderBy: {
        fechaSimulacion: 'desc' // Traemos las simulaciones más recientes primero
      }
    });

    // Devolvemos el arreglo de simulaciones en formato JSON
    return NextResponse.json(simulaciones, { status: 200 });
  } catch (error) {
    console.error("Error al obtener el historial de simulaciones:", error);
    return NextResponse.json(
      { error: 'Hubo un error interno al cargar el historial' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      treatment?: unknown;
      originalImageUrl?: unknown;
      resultImageUrl?: unknown;
      pacienteId?: unknown;
    };

    const treatment = typeof body.treatment === 'string' ? body.treatment.trim() : '';
    const originalImageUrl =
      typeof body.originalImageUrl === 'string' ? body.originalImageUrl.trim() : '';
    const resultImageUrl =
      typeof body.resultImageUrl === 'string' ? body.resultImageUrl.trim() : '';
    const pacienteId = typeof body.pacienteId === 'number' ? body.pacienteId : null;

    if (!treatment || !originalImageUrl || !resultImageUrl) {
      return NextResponse.json(
        { ok: false, error: 'Faltan datos de la simulacion' },
        { status: 400 },
      );
    }

    if (!/^https?:\/\//i.test(originalImageUrl) || !/^https?:\/\//i.test(resultImageUrl)) {
      return NextResponse.json(
        { ok: false, error: 'Las imagenes deben ser URLs publicas' },
        { status: 400 },
      );
    }

    const paciente = pacienteId
      ? await prisma.paciente.findUnique({ where: { id: pacienteId } })
      : await prisma.paciente.upsert({
          where: { correo: DEMO_PATIENT_EMAIL },
          update: {},
          create: {
            nombre: 'Paciente Demo',
            correo: DEMO_PATIENT_EMAIL,
          },
        });

    if (!paciente) {
      return NextResponse.json(
        { ok: false, error: 'No se encontro el paciente' },
        { status: 404 },
      );
    }

    const simulacion = await prisma.simulacion.create({
      data: {
        tratamiento: treatment,
        imagenOriginalUrl: originalImageUrl,
        imagenProcesadaUrl: resultImageUrl,
        pacienteId: paciente.id,
      },
    });

    return NextResponse.json({ ok: true, simulacion }, { status: 201 });
  } catch (error) {
    console.error('Error al guardar la simulacion:', error);
    return NextResponse.json(
      { ok: false, error: 'Hubo un error interno al guardar la simulacion' },
      { status: 500 },
    );
  }
}
