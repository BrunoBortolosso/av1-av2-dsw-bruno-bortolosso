const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

async function register({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    const error = new Error('Este e-mail já está cadastrado.');
    error.status = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, passwordHash }
  });
  return publicUser(user);
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  const valid = user && await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const error = new Error('E-mail ou senha inválidos.');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
  return { token, user: publicUser(user) };
}

module.exports = { register, login };
