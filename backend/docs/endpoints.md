# Endpoints da API

Prefixo base: `/api/v1/`

Documentação interativa sempre atualizada (gerada via drf_spectacular):
- Schema OpenAPI: `GET /api/v1/schema/`
- Swagger UI: `GET /api/schema/swagger-ui/`
- ReDoc: `GET /api/v1/redoc/`

Permissões usadas:
- **Pública** — sem autenticação.
- **IsAuthenticated** — qualquer usuário autenticado (enfermagem ou administrador).
- **IsAdmin** — apenas usuários com `role = administrator`.

---

## Authentication (`/api/v1/auth/`)

Tags no Swagger: **Autenticação** (login/logout), **Solicitações de Acesso**, **Solicitações de Redefinição de Senha**, **Usuários**.

### Login / Logout

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| POST | `login/` | Pública | Autentica com `email` e `password`; em caso de sucesso seta cookies HTTP-only com access/refresh JWT. |
| POST | `logout/` | Pública | Limpa os cookies de JWT, efetivando o logout. |

### Solicitações de acesso

Fluxo de cadastro: novo usuário pede acesso, fica inativo (`is_active=False`) até um admin aprovar.

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| POST | `request-access/` | Pública | Cria solicitação de acesso (`email`, `name`); usuário criado fica inativo aguardando aprovação. |
| GET | `access-requests/` | IsAdmin | Lista usuários inativos com solicitação de acesso pendente. |
| POST | `access-requests/<pk>/approve/` | IsAdmin | Aprova a solicitação: ativa o usuário e define a senha inicial. |
| DELETE | `access-requests/<pk>/reject/` | IsAdmin | Rejeita a solicitação, excluindo o usuário pendente. |

### Solicitações de redefinição de senha

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| POST | `request-reset/` | Pública | Usuário ativo solicita redefinição de senha (`email`); marca `password_reset_requested=True`. |
| GET | `reset-requests/` | IsAdmin | Lista usuários ativos com redefinição de senha pendente. |
| POST | `reset-requests/<pk>/approve/` | IsAdmin | Aprova a redefinição, define a nova senha e limpa `password_reset_requested`. |
| DELETE | `reset-requests/<pk>/reject/` | IsAdmin | Rejeita a solicitação, apenas limpando `password_reset_requested`. |

### Usuários

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| GET | `users/` | IsAdmin | Lista todos os usuários cadastrados (`id`, `name`, `email`, `created_at`, `password_reset_requested`, `is_active`), ordenados por data de criação desc. |

---

## Core (`/api/v1/core/`)

### Exames

Tipos de exame disponíveis (ex.: hemograma, glicemia).

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| GET, POST | `exams/` | IsAuthenticated | Lista todos os tipos de exame ou cria um novo (`name`). |
| GET, PUT, PATCH, DELETE | `exams/<pk>/` | IsAuthenticated | Detalha, atualiza ou remove um tipo de exame específico. |

### Máquinas

Máquinas/equipamentos usados para realizar exames, vinculadas a um tipo de exame.

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| GET, POST | `machines/` | IsAuthenticated | Lista todas as máquinas ou cria uma nova (`exam_type`, `cost`). |
| GET, PUT, PATCH, DELETE | `machines/<pk>/` | IsAuthenticated | Detalha, atualiza ou remove uma máquina específica. |

### Problemas

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| GET, POST | `problems/` | IsAuthenticated | Lista os motivos pré-cadastrados usados ao encerrar um plantão sem coletas, ou cria um novo (`name`). |
| GET, PUT, PATCH, DELETE | `problems/<pk>/` | IsAuthenticated | Detalha, atualiza ou remove um motivo específico. |

### Plantões (duties)

Representa o turno de trabalho de um enfermeiro em uma máquina, com registro de coletas realizadas.

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| POST | `duties/` | IsAuthenticated | Abre um novo plantão para o usuário autenticado em uma máquina (`machine`). |
| GET | `duties/current/` | IsAuthenticated | Retorna o plantão em aberto do usuário autenticado, se houver. |
| POST | `duties/<pk>/collections/` | IsAuthenticated | Registra uma coleta (contagem de exames) dentro do plantão. |
| PATCH | `duties/<pk>/close/` | IsAuthenticated | Encerra o plantão; se nenhuma coleta foi registrada, é obrigatório informar um `problem`. |

### Dashboard

| Método | Path | Permissão | Descrição |
|---|---|---|---|
| GET | `dashboard/` | IsAdmin | Retorna métricas agregadas (exames por mês, problemas, receita). Filtros via query params: `date_from`, `date_to`, `exam_id`, `machine_id`. |
