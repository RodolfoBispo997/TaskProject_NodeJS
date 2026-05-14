# TaskProject_NodeJS

API de gerenciamento de projetos, tarefas, colaboradores e comentários, construída com **NestJS**, **Prisma**, **PostgreSQL** e **RabbitMQ**. O projeto também integra **Swagger**, **JWT**, **upload de avatar com Cloudinary** e **envio de e-mails assíncrono** para recuperação de senha.

## Visão geral

Este sistema foi estruturado para servir como base de uma API backend moderna e escalável. A aplicação é organizada por módulos e separa bem as responsabilidades entre autenticação, usuários, projetos, tarefas, colaboradores, comentários e e-mail.

### Principais módulos

- **Auth**: cadastro, login, recuperação e redefinição de senha.
- **Users**: gerenciamento de usuários e upload de avatar.
- **Projects**: CRUD de projetos.
- **Tasks**: CRUD de tarefas vinculadas a projetos.
- **Collaborators**: controle de colaboradores e papéis dentro de um projeto.
- **Comments**: CRUD de comentários vinculados a tarefas.
- **Mail**: envio assíncrono de e-mails de recuperação de senha via RabbitMQ.
- **Common**: guardas, interceptors, decorators, DTOs compartilhados, paginação e serviços auxiliares.

## Tecnologias

- NestJS
- Prisma ORM
- PostgreSQL
- JWT / Passport
- RabbitMQ
- Nodemailer / Handlebars
- Cloudinary
- Swagger
- class-validator / class-transformer
- bcrypt

## Estrutura do projeto

```bash
src/
├── common/
│   ├── decorators/
│   ├── dtos/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── swagger/
├── modules/
│   ├── auth/
│   ├── collaborators/
│   ├── comments/
│   ├── mail/
│   ├── projects/
│   ├── tasks/
│   └── users/
├── utils/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── consts.ts
├── main.ts
└── prisma.service.ts
```

## O que a API faz

### Autenticação
- Cadastro de usuário com senha criptografada
- Login com geração de token JWT
- Recuperação de senha por e-mail
- Redefinição de senha com token temporário

### Projetos
- Criar projetos
- Listar projetos do usuário autenticado
- Consultar projeto por ID
- Atualizar projeto
- Excluir projeto

Ao criar um projeto, o usuário logado é registrado automaticamente como **OWNER** na relação de colaboradores.

### Tarefas
- Listar tarefas de um projeto
- Consultar tarefa por ID
- Criar tarefa
- Atualizar tarefa
- Excluir tarefa

As tarefas podem ter:
- título
- descrição
- status
- prioridade
- data de vencimento
- usuário responsável

### Colaboradores
- Listar colaboradores de um projeto
- Adicionar colaborador
- Alterar papel do colaborador
- Remover colaborador

Papéis suportados:
- `VIEWER`
- `EDITOR`
- `OWNER`

### Comentários
- Listar comentários de uma tarefa
- Consultar comentário por ID
- Criar comentário
- Atualizar comentário
- Remover comentário

### Usuários
- Listar usuários
- Consultar usuário por ID
- Consultar usuário por e-mail
- Criar usuário
- Atualizar usuário
- Remover usuário
- Fazer upload de avatar

## Regras de autenticação e acesso

A maior parte das rotas está protegida por JWT. Para acessar essas rotas, envie o token no cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

O token é gerado no login e também no cadastro. O sistema usa um guard JWT e um strategy próprio para validar a sessão.

## Swagger

A documentação da API fica disponível em:

```bash
/api
```

O Swagger já está configurado com autenticação Bearer, então você pode testar os endpoints protegidos diretamente pela interface.

## Requisitos

- Node.js instalado
- pnpm instalado
- PostgreSQL disponível
- RabbitMQ disponível
- SMTP configurado para envio de e-mails
- Variáveis de ambiente corretamente definidas

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
PORT=3000
DATABASE_URL="postgresql://USER:SENHA@localhost:5432/NOME_DO_BANCO"
SECRET_KEY="sua_chave_secreta_jwt"
RABBITMQ_URL="amqp://localhost:5672"
SMTP_HOST="smtp.seuprovedor.com"
SMTP_PORT=587
SMTP_USER="seu_email@dominio.com"
SMTP_PASS="sua_senha_ou_token"
```

> Observação: o projeto também utiliza integração com Cloudinary. Configure as credenciais exigidas pela sua implementação no arquivo `.env`, caso já estejam sendo consumidas pelo serviço correspondente.

## Instalação

```bash
pnpm install
```

## Banco de dados

Gere os arquivos do Prisma e aplique as migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

Se você estiver iniciando do zero, também pode precisar conferir se o schema do Prisma está apontando para o banco correto por meio de `DATABASE_URL`.

## Executando o projeto

### Desenvolvimento

```bash
pnpm start:dev
```

### Produção

```bash
pnpm build
pnpm start:prod
```

## Testes

```bash
pnpm test
pnpm test:watch
pnpm test:cov
pnpm test:e2e
```

## Fluxo de uso recomendado

1. Configure o `.env`.
2. Suba PostgreSQL e RabbitMQ.
3. Instale as dependências.
4. Rode as migrations do Prisma.
5. Inicie a aplicação com `pnpm start:dev`.
6. Abra o Swagger em `/api`.
7. Faça cadastro ou login.
8. Copie o token JWT retornado.
9. Use o token nas rotas protegidas.
10. Crie um projeto, adicione tarefas, colaboradores e comentários.

## Fluxo de negócio

### 1. Cadastro e login
- O usuário cria uma conta.
- A senha é armazenada com hash bcrypt.
- O login retorna um JWT.

### 2. Projeto
- O usuário autenticado cria um projeto.
- Ele é registrado automaticamente como colaborador com papel de **OWNER**.

### 3. Tarefas
- Cada projeto pode receber tarefas.
- Uma tarefa pode ser atribuída a um usuário.
- A tarefa pode receber comentários.

### 4. Colaboração
- Outros usuários podem ser adicionados como colaboradores.
- O papel define o nível de acesso no projeto.

### 5. Recuperação de senha
- O usuário solicita redefinição.
- A API gera um token temporário.
- O e-mail é enviado de forma assíncrona via RabbitMQ.
- O link aponta para a rota de redefinição de senha.

## Endpoints principais

### Auth
- `POST /v1/auth/signup`
- `POST /v1/auth/signin`
- `POST /v1/auth/forgot-password`
- `POST /v1/auth/reset-password`

### Projects
- `GET /v1/projects`
- `GET /v1/projects/:projectId`
- `POST /v1/projects`
- `PUT /v1/projects/:projectId`
- `DELETE /v1/projects/:projectId`

### Tasks
- `GET /v1/projects/:projectId/tasks`
- `GET /v1/projects/:projectId/tasks/:taskId`
- `POST /v1/projects/:projectId/tasks`
- `PUT /v1/projects/:projectId/tasks/:taskId`
- `DELETE /v1/projects/:projectId/tasks/:taskId`

### Collaborators
- `GET /v1/projects/:projectId/collaborators`
- `POST /v1/projects/:projectId/collaborators`
- `PUT /v1/projects/:projectId/collaborators/:userId`
- `DELETE /v1/projects/:projectId/collaborators/:userId`

### Comments
- `GET /v1/projects/:projectId/tasks/:taskId/comments`
- `GET /v1/projects/:projectId/tasks/:taskId/comments/:commentId`
- `POST /v1/projects/:projectId/tasks/:taskId/comments`
- `PUT /v1/projects/:projectId/tasks/:taskId/comments/:commentId`
- `DELETE /v1/projects/:projectId/tasks/:taskId/comments/:commentId`

### Users
- `GET /v1/users`
- `GET /v1/users/:userId`
- `GET /v1/users/:email`
- `POST /v1/users`
- `PUT /v1/users/:userId`
- `DELETE /v1/users/:userId`
- `POST /v1/users/avatar`

## Modelagem do banco

### User
- nome
- e-mail
- senha
- avatar
- papel (`USER` ou `ADMIN`)

### Project
- nome
- descrição
- autor da criação
- colaboradores
- tarefas

### ProjectCollaborator
- usuário
- projeto
- papel do colaborador

### Task
- título
- descrição
- status
- prioridade
- data de vencimento
- responsável
- comentários

### Comment
- conteúdo
- autor
- tarefa

## Observações importantes

- O projeto já está preparado para uso com Swagger e validação de DTOs.
- O CORS está liberado para o frontend local em `http://localhost:5173` e `http://127.0.0.1:5173`.
- O banco utilizado é PostgreSQL.
- A aplicação inicia os microserviços RabbitMQ junto com o servidor HTTP.

## Licença

Projeto acadêmico / portfólio, sem licença declarada.
