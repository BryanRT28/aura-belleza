import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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