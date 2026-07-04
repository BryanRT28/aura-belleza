import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando la siembra de datos...')

  // Insertar Empleados (Especialistas de Aura Belleza)
  // Mantenemos la estructura limpia con el nombre y el rol separados
  const especialista1 = await prisma.empleado.create({
    data: {
      nombre: 'Dra. Valeria Montes',
      rol: 'Dermatóloga Clínica',
    },
  })

  const especialista2 = await prisma.empleado.create({
    data: {
      nombre: 'Dr. Roberto Sánchez',
      rol: 'Especialista en Armonización Facial',
    },
  })

  // Insertar un Paciente de prueba
  const paciente1 = await prisma.paciente.create({
    data: {
      nombre: 'Camila Rojas',
      correo: 'camila.rojas@ejemplo.com',
      telefono: '987654321',
    },
  })

  console.log('✅ Base de datos poblada exitosamente.')
  console.log(`Especialistas añadidos: ${especialista1.nombre} y ${especialista2.nombre}`)
}

main()
  .catch((e) => {
    console.error('Error al insertar datos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })