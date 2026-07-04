import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, correo, telefono, fecha, hora, tratamiento, empleadoId } = body;

    // Validación básica de campos obligatorios
    if (!nombre || !correo || !fecha || !hora) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios (nombre, correo, fecha u hora)' }, 
        { status: 400 }
      );
    }

    // 1. Buscar si el paciente ya existe por su correo único
    let paciente = await prisma.paciente.findUnique({
      where: { correo: correo }
    });

    // Si no existe, lo creamos en la base de datos
    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: { 
          nombre, 
          correo, 
          telefono 
        }
      });
    }

    // 2. Crear la cita vinculada al paciente y al empleado (especialista) elegido
    const nuevaCita = await prisma.cita.create({
      data: {
        fecha: new Date(fecha),
        hora: hora,
        tratamiento: tratamiento || 'Consulta General',
        pacienteId: paciente.id,
        // Si enviaron un empleadoId válido, lo convertimos a entero, si no lo dejamos nulo
        empleadoId: empleadoId ? parseInt(empleadoId) : null,
      }
    });

    // Devolvemos la confirmación del éxito (Código 201: Creado)
    return NextResponse.json({ 
      mensaje: 'Cita agendada exitosamente', 
      cita: nuevaCita 
    }, { status: 201 });

  } catch (error) {
    console.error("Error al registrar la cita:", error);
    return NextResponse.json(
      { error: 'Hubo un error interno al procesar la cita' }, 
      { status: 500 }
    );
  }
}