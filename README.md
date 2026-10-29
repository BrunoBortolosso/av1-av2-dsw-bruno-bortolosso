# Aula em Dia

Aplicação full stack para organização de estudos. O usuário cadastra tarefas por disciplina, prazo, prioridade e situação, podendo relacionar uma tarefa a outras. A regra de negócio impede concluir uma tarefa enquanto houver dependências pendentes.

## Tecnologias

- Backend: Node.js, Express 5, JavaScript CommonJS, arquitetura MVC
- Banco: SQLite local e Prisma ORM `7.10.0`
- Segurança: JWT, bcryptjs, autorização por proprietário
- Frontend: React `19.1.0`, Vite `6.3.5`, Tailwind CSS `4.3.0`

## Executar localmente

Abra dois terminais na raiz:

```bash
npm install --prefix backend
Copy-Item backend/.env.example backend/.env
Push-Location backend
npx prisma migrate dev
npm run dev
Pop-Location
```

Em outro terminal:

```bash
npm install --prefix frontend
Copy-Item frontend/.env.example frontend/.env
npm run dev --prefix frontend
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3333`

Para Linux/macOS, substitua `Copy-Item` por `cp`.

## Variáveis de ambiente

Backend: `DATABASE_URL`, `JWT_SECRET`, `PORT` e `FRONTEND_URL`.  
Frontend: `VITE_API_URL`.

Os arquivos `.env` são locais e estão no `.gitignore`. Nunca publique segredos.

## API

- `POST /api/auth/register` cadastro
- `POST /api/auth/login` login e JWT
- `GET /api/tasks` consulta as próprias tarefas
- `POST /api/tasks` cria tarefa
- `GET /api/tasks/:id` consulta uma tarefa própria
- `PUT /api/tasks/:id` altera uma tarefa própria
- `DELETE /api/tasks/:id` exclui uma tarefa própria
- `GET /health` health check

Rotas de tarefas exigem `Authorization: Bearer <token>`. O backend valida autenticação, autorização, campos obrigatórios e dependências.

## Publicação

No deploy, configure o backend com um banco relacional acessível, `DATABASE_URL`, `JWT_SECRET`, `PORT` e a URL pública do frontend em `FRONTEND_URL`. No frontend, configure `VITE_API_URL` com a URL pública da API e execute `npm run build`. A plataforma escolhida deve executar `npm run start --prefix backend` e servir o diretório `frontend/dist`.

## Fontes de interface

A interface usa Tailwind CSS 4.3 e fontes DM Sans e Playfair Display disponibilizadas pelo Google Fonts. Os componentes foram desenvolvidos e adaptados especificamente para este projeto, sem dependência de um kit visual externo.
