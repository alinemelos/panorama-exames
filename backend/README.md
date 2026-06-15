# Panorama Exames — Backend

API REST do projeto **Panorama Exames**, desenvolvida com Django + Django REST Framework. Para uma visão geral do projeto (e como rodar tudo com Docker Compose), veja o [README na raiz do repositório](../README.md).

## Requisitos

- [Python 3.13](https://www.python.org/)
- [uv](https://docs.astral.sh/uv/) (gerenciador de pacotes/ambiente Python)
- [Docker](https://docs.docker.com/get-docker/) (para rodar o banco PostgreSQL/PostGIS localmente)

## Configuração

1. Copie o arquivo de variáveis de ambiente de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Ajuste as variáveis em `.env` conforme necessário:

   | Variável | Descrição |
   | --- | --- |
   | `POSTGRES_DB` | Nome do banco de dados |
   | `POSTGRES_USER` | Usuário do banco |
   | `POSTGRES_PASSWORD` | Senha do banco |
   | `POSTGRES_HOST` | Host do banco (`localhost` em dev) |
   | `POSTGRES_PORT` | Porta do banco (`5432`) |
   | `SECRET_KEY` | Chave secreta do Django |
   | `DEBUG` | Modo debug (`True`/`False`) |
   | `ALLOWED_HOSTS` | Hosts permitidos, separados por vírgula |

## Rodando em modo desenvolvimento

1. Suba o banco de dados (PostgreSQL/PostGIS) localmente via Docker:

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

   > **macOS x Linux**: o arquivo usa por padrão a imagem `imresamu/postgis:17-3.5` (macOS). Em Linux, comente essa linha e descomente a imagem `postgis/postgis:17-3.5`.

2. Instale as dependências do projeto:

   ```bash
   uv sync
   ```

3. Aplique as migrations:

   ```bash
   uv run python manage.py migrate
   ```

4. (Opcional) Crie um usuário administrador:

   ```bash
   uv run python manage.py createsuperuser
   ```

5. Rode o servidor de desenvolvimento:

   ```bash
   uv run python manage.py runserver
   ```

A API ficará disponível em `http://localhost:8000`.

## Documentação da API

- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- Schema OpenAPI: `http://localhost:8000/api/schema/`
- Admin do Django: `http://localhost:8000/admin/`

## Apps

- `apps.authentication`: usuários, autenticação via JWT (cookies) e papéis (Enfermagem/Administrador).
- `apps.core`: regras de negócio principais — Exames, Máquinas, Plantões, Problemas e Coletas.

## Rodando com Docker (alternativa)

Para subir o backend já integrado ao banco e ao frontend, utilize o `docker-compose.yml` na raiz do repositório (veja o [README raiz](../README.md)).

## Integração com o frontend

O CORS já está configurado para aceitar requisições de `http://localhost:5173` (servidor de desenvolvimento do Vite). Para rodar e configurar o frontend, siga as instruções em [`../frontend/README.md`](../frontend/README.md).
