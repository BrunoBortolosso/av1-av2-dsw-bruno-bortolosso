# API Aula em Dia

Backend da aplicação de organização de estudos. Cada usuário administra apenas as próprias tarefas.

## Comandos

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

A API fica em `http://localhost:3333`.

## Rotas principais

- `POST /api/auth/register` cadastro de usuário
- `POST /api/auth/login` login e emissão de JWT
- `GET /api/tasks` lista tarefas autenticadas
- `POST /api/tasks` cria tarefa
- `GET /api/tasks/:id` consulta uma tarefa do usuário
- `PUT /api/tasks/:id` atualiza tarefa
- `DELETE /api/tasks/:id` exclui tarefa
- `GET /health` health check

Envie o token nas rotas protegidas como `Authorization: Bearer <token>`.
A conclusão é bloqueada quando alguma tarefa vinculada ainda não está concluída.
