// src/controllers/bookController.js
const prisma = require('../prisma');

// Crear libro
exports.createBook = async (req, res) => {
  try {
    const { nombre, autor, genero, casaEditorial, fechaPublicacion } = req.body;

    if (!nombre || !autor) {
      return res.status(400).json({ message: 'nombre y autor son obligatorios' });
    }

    const book = await prisma.book.create({
      data: {
        nombre,
        autor,
        genero,
        casaEditorial,
        fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : null
      }
    });

    res.status(201).json(book);
    } catch (e) {
  console.error('Error en createBook:', e);
  res.status(500).json({ message: 'Error interno', error: e.message });
}

};

// Obtener libros con filtros, paginación y opción onlyNames
exports.getBooks = async (req, res) => {
  try {
    const {
      nombre,
      autor,
      genero,
      casaEditorial,
      disponibilidad,
      fechaDesde,
      fechaHasta,
      page = 1,
      limit = 10,
      onlyNames
    } = req.query;

    const where = {
      isDisabled: false
    };

    if (nombre) where.nombre = { contains: nombre, mode: 'insensitive' };
    if (autor) where.autor = { contains: autor, mode: 'insensitive' };
    if (genero) where.genero = { contains: genero, mode: 'insensitive' };
    if (casaEditorial) where.casaEditorial = { contains: casaEditorial, mode: 'insensitive' };

    if (disponibilidad !== undefined) {
      where.disponibilidad = disponibilidad === 'true';
    }

    if (fechaDesde || fechaHasta) {
      where.fechaPublicacion = {};
      if (fechaDesde) where.fechaPublicacion.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaPublicacion.lte = new Date(fechaHasta);
    }

    const pageNum = Number(page) || 1;
    const take = Number(limit) || 10;
    const skip = (pageNum - 1) * take;

    const [total, items] = await Promise.all([
      prisma.book.count({ where }),
      prisma.book.findMany({
        where,
        skip,
        take,
        select: onlyNames === 'true'
          ? { id: true, nombre: true }
          : undefined
      })
    ]);

    const totalPages = Math.ceil(total / take) || 1;

    res.json({
      page: pageNum,
      perPage: take,
      total,
      totalPages,
      items
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno' });
  }
};


// Obtener libro por ID
exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: Number(id) }
    });

    if (!book) return res.status(404).json({ message: 'Libro no encontrado' });

    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Actualizar libro
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const book = await prisma.book.update({
      where: { id: Number(id) },
      data
    });

    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno' });
  }
};

// Deshabilitar libro (soft delete)
exports.disableBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: {
        isDisabled: true,
        disabledAt: new Date()
      }
    });

    res.json({ message: 'Libro deshabilitado', book });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error interno' });
  }
};
