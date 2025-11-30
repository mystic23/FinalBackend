const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

// Generar JWT incluyendo permisos
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      canCreateBooks: user.canCreateBooks,
      canUpdateBooks: user.canUpdateBooks,
      canDisableBooks: user.canDisableBooks,
      canUpdateUsers: user.canUpdateUsers,
      canDisableUsers: user.canDisableUsers
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

// ------------------------------
// REGISTRO (público)
// ------------------------------
exports.register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'nombre, email y password son obligatorios' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Por defecto el usuario NO tiene permisos administrativos
    const user = await prisma.user.create({
      data: {
        nombre,
        email,
        passwordHash,   // 👈 importante
        canCreateBooks: false,
        canUpdateBooks: false,
        canDisableBooks: false,
        canUpdateUsers: false,
        canDisableUsers: false
      }
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};

// ------------------------------
// LOGIN (público)
// ------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (user.isDisabled) {
      return res.status(403).json({ message: 'Usuario deshabilitado' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login exitoso',
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ message: 'Error interno' });
  }
};
