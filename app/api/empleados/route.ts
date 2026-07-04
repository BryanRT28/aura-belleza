import { NextResponse } from 'next/server';
// Asegúrate de que la ruta apunte correctamente a tu archivo lib/prisma.ts
// Si usas el alias de Next.js, suele ser '@/lib/prisma'
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    // Le pedimos a Prisma que traiga todos los registros de la tabla Empleado
    const especialistas = await prisma.empleado.findMany();
    
    // Devolvemos los datos en formato JSON con un código de éxito (200)
    return NextResponse.json(especialistas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    return NextResponse.json(
      { error: 'Hubo un problema al cargar los especialistas' }, 
      { status: 500 }
    );
  }
}