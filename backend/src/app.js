require('dotenv/config');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'aula-em-dia-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((error, _req, res, _next) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({ error: 'Dados inválidos.', details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) });
  }
  if (error.code === 'P2002') return res.status(409).json({ error: 'Já existe um registro com esses dados.' });
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ error: error.message || 'Erro interno do servidor.', ...(error.code ? { code: error.code } : {}) });
});

module.exports = app;
