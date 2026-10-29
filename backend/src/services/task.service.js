const prisma = require('../lib/prisma');

const taskInclude = {
  dependencies: {
    include: { dependency: { select: { id: true, title: true, status: true } } }
  }
};

async function ensureDependenciesBelongToUser(dependencyIds, ownerId, taskId) {
  const uniqueIds = [...new Set(dependencyIds || [])];
  if (taskId && uniqueIds.includes(taskId)) {
    const error = new Error('Uma tarefa não pode depender dela mesma.');
    error.status = 400;
    throw error;
  }
  if (!uniqueIds.length) return uniqueIds;
  const count = await prisma.task.count({ where: { id: { in: uniqueIds }, ownerId } });
  if (count !== uniqueIds.length) {
    const error = new Error('Todas as dependências precisam pertencer ao usuário.');
    error.status = 400;
    throw error;
  }
  return uniqueIds;
}

async function list(ownerId, filters = {}) {
  return prisma.task.findMany({
    where: {
      ownerId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.subject ? { subject: { contains: filters.subject } } : {})
    },
    include: taskInclude,
    orderBy: [{ status: 'asc' }, { dueDate: 'asc' }]
  });
}

async function findById(id, ownerId) {
  return prisma.task.findFirst({ where: { id, ownerId }, include: taskInclude });
}

async function create(ownerId, data) {
  const dependencyIds = await ensureDependenciesBelongToUser(data.dependencyIds, ownerId);
  return prisma.task.create({
    data: {
      title: data.title.trim(), description: data.description?.trim() || null,
      subject: data.subject.trim(), dueDate: new Date(data.dueDate), priority: data.priority,
      ownerId, dependencies: { create: dependencyIds.map((dependencyId) => ({ dependency: { connect: { id: dependencyId } } })) }
    }, include: taskInclude
  });
}

async function update(id, ownerId, data) {
  const current = await findById(id, ownerId);
  if (!current) return null;
  if (data.status === 'CONCLUIDA') {
    const pending = current.dependencies.filter(({ dependency }) => dependency.status !== 'CONCLUIDA');
    if (pending.length) {
      const error = new Error('Conclua as tarefas pendentes antes de finalizar esta tarefa.');
      error.status = 409;
      error.code = 'PENDING_DEPENDENCIES';
      throw error;
    }
  }

  const dependencyIds = data.dependencyIds === undefined ? current.dependencies.map(({ dependency }) => dependency.id) : await ensureDependenciesBelongToUser(data.dependencyIds, ownerId, id);
  return prisma.$transaction(async (transaction) => {
    await transaction.taskDependency.deleteMany({ where: { taskId: id } });
    return transaction.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.description !== undefined ? { description: data.description?.trim() || null } : {}),
        ...(data.subject !== undefined ? { subject: data.subject.trim() } : {}),
        ...(data.dueDate !== undefined ? { dueDate: new Date(data.dueDate) } : {}),
        ...(data.priority !== undefined ? { priority: data.priority } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        dependencies: { create: dependencyIds.map((dependencyId) => ({ dependency: { connect: { id: dependencyId } } })) }
      }, include: taskInclude
    });
  });
}

async function remove(id, ownerId) {
  const result = await prisma.task.deleteMany({ where: { id, ownerId } });
  return result.count > 0;
}

module.exports = { list, findById, create, update, remove };
