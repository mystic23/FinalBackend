// src/controllers/reservationController.js
const prisma = require('../prisma');

// Crear reserva
exports.createReservation = async (req, res) => {
  try {
    const { libroId } = req.body;

    if (!libroId) {
      return res.status(400).json({ message: 'libroId es obligatorio' });
    }

    // Verificar que el libro exista y no esté deshabilitado
    const libro = await prisma.book.findUnique({
      where: { id: Number(libroId) }
    });

    if (!libro || libro.isDisabled) {
      return res.status(404).json({ message: 'Libro no encontrado o deshabilitado' });
    }

    // (Opcional) verificar disponibilidad si usas ese campo
    if (libro.disponibilidad === false) {
      return res.status(400).json({ message: 'Libro no disponible para reserva' });
    }

    const reserva = await prisma.reservation.create({
      data: {
        usuarioId: req.user.id,          // 👈 MUY IMPORTANTE: coincide con schema.prisma
        libroId: Number(libroId)
      }
    });

    // (Opcional) marcar el libro como no disponible
    // await prisma.book.update({
    //   where: { id: Number(libroId) },
    //   data: { disponibilidad: false }
    // });

    res.status(201).json(reserva);
  } catch (error) {
    console.error('Error en createReservation:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Reservas del usuario autenticado
exports.getMyReservations = async (req, res) => {
  try {
    const reservas = await prisma.reservation.findMany({
      where: { usuarioId: req.user.id }, // 👈 usa usuarioId, no userId
      include: {
        libro: true
      }
    });

    res.json(reservas);
  } catch (error) {
    console.error('Error en getMyReservations:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Reservas por libro
exports.getReservationsByBook = async (req, res) => {
  try {
    const { id } = req.params;

    const reservas = await prisma.reservation.findMany({
      where: { libroId: Number(id) }, // 👈 usa libroId, no bookId
      include: {
        usuario: true
      }
    });

    res.json(reservas);
  } catch (error) {
    console.error('Error en getReservationsByBook:', error);
    res.status(500).json({ message: 'Error interno' });
  }
};
