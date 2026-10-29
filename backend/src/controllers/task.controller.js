const { z } = require('zod');
const taskService = require('../services/task.service');

const taskFields = {
  title: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres.'),
  description: z.string().optional(),
  subject: z.string().trim().min(2, 'Informe a disciplina.'),
  dueDate: z.coerce.date({ message: 'Informe um prazo válido.' }),
  priority: z.enum(['BAIXA', 'MEDIA', 'ALTA']).default('MEDIA'),
  status: z.enum(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
  dependencyIds: z.array(z.string()).optional()
};
const createSchema = z.object(taskFields).required({ title: true, subject: true, dueDate: true });
const updateSchema = z.object(taskFields).partial();

async function list(req, res, next) {
  try { return res.json({ tasks: await taskService.list(req.user.sub, req.query) }); } catch (error) { return next(error); }
}
async function get(req, res, next) {
  try {
    const task = await taskService.findById(req.params.id, req.user.sub);
    return task ? res.json({ task }) : res.status(404).json({ error: 'Tarefa não encontrada.' });
  } catch (error) { return next(error); }
}
async function create(req, res, next) {
  try { return res.status(201).json({ task: await taskService.create(req.user.sub, createSchema.parse(req.body)) }); } catch (error) { return next(error); }
}
async function update(req, res, next) {
  try {
    const task = await taskService.update(req.params.id, req.user.sub, updateSchema.parse(req.body));
    return task ? res.json({ task }) : res.status(404).json({ error: 'Tarefa não encontrada.' });
  } catch (error) { return next(error); }
}
async function remove(req, res, next) {
  try {
    const removed = await taskService.remove(req.params.id, req.user.sub);
    return removed ? res.status(204).send() : res.status(404).json({ error: 'Tarefa não encontrada.' });
  } catch (error) { return next(error); }
}

module.exports = { list, get, create, update, remove };
