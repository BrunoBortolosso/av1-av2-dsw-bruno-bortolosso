const priorityLabel = { ALTA: 'Alta', MEDIA: 'Média', BAIXA: 'Baixa' };
const statusLabel = { PENDENTE: 'Pendente', EM_ANDAMENTO: 'Em andamento', CONCLUIDA: 'Concluída' };

export function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const date = new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const pending = task.dependencies?.filter(({ dependency }) => dependency.status !== 'CONCLUIDA') || [];
  return <article className={`task-card ${task.status === 'CONCLUIDA' ? 'is-done' : ''}`}><div className="task-accent" data-priority={task.priority} /><div className="task-content"><div className="task-heading"><span className="subject-tag">{task.subject}</span><span className={`priority priority-${task.priority.toLowerCase()}`}>{priorityLabel[task.priority]}</span></div><h3>{task.title}</h3>{task.description && <p>{task.description}</p>}<div className="task-meta"><span>◷ {date}</span>{pending.length > 0 && <span className="dependency-warning">↳ {pending.length} pendência{pending.length > 1 ? 's' : ''}</span>}</div></div><div className="task-actions"><select aria-label="Status da tarefa" value={task.status} onChange={(e) => onStatus(task, e.target.value)}><option value="PENDENTE">Pendente</option><option value="EM_ANDAMENTO">Em andamento</option><option value="CONCLUIDA">Concluída</option></select><button title="Editar tarefa" onClick={() => onEdit(task)}>Editar</button><button className="delete-button" title="Excluir tarefa" onClick={() => onDelete(task.id)}>Excluir</button></div></article>;
}
