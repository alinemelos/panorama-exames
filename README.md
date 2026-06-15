# Panorama Exames

Sistema de gestão de plantões, exames, máquinas e ocorrências para o setor de imagem/diagnóstico de um hospital. Permite o cadastro de exames, máquinas, plantões (turnos de trabalho), problemas/ocorrências e coletas, além de um dashboard com indicadores.

## Sobre o projeto

Este projeto foi desenvolvido como trabalho da disciplina **Tópicos Avançados em Sistemas de Informação 4 (SI4)**.

## Stack

- **Backend**: Django 6 + Django REST Framework, autenticação via JWT (cookies), documentação OpenAPI (Swagger/ReDoc), banco PostgreSQL/PostGIS.
- **Frontend**: React 19 + Vite, React Router, Axios, Recharts (gráficos do dashboard).
- **Banco de dados**: PostgreSQL com extensão PostGIS, rodando em container Docker.

## Estrutura do repositório

```
panorama-exames/
├── backend/            # API Django REST (ver backend/README.md)
├── frontend/           # SPA React + Vite (ver frontend/README.md)
└── docker-compose.yml  # Orquestração do ambiente completo
```

## Como rodar o projeto completo (Docker Compose)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e Docker Compose.

1. Configure as variáveis de ambiente do backend copiando o arquivo de exemplo:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Ajuste os valores conforme necessário (ver detalhes em [`backend/README.md`](backend/README.md)).

2. Na raiz do repositório, suba todos os serviços:

   ```bash
   docker compose up --build
   ```

   Isso irá:
   - Subir o banco de dados PostgreSQL/PostGIS (`db`);
   - Rodar as migrations do Django (`migrate`);
   - Subir a API backend na porta **8000** (`backend`);
   - Subir o frontend (build de produção servido via Nginx) na porta **80** (`frontend`), que faz proxy de `/api` para o backend.

3. Acesse:
   - Frontend: http://localhost
   - API: http://localhost:8000/api
   - Documentação da API (Swagger): http://localhost:8000/api/docs/
   - Documentação da API (ReDoc): http://localhost:8000/api/redoc/

> **Nota (macOS x Linux)**: o `docker-compose.yml` e o `backend/docker-compose.dev.yml` usam por padrão a imagem `imresamu/postgis:17-3.5`, compatível com macOS. Em Linux, troque para `postgis/postgis:17-3.5` (linha já indicada nos arquivos via comentário).

## Como rodar em ambiente de desenvolvimento

Para desenvolver com hot-reload, é recomendado rodar o backend e o frontend separadamente (fora do Docker), usando apenas o banco de dados em container:

- Backend: instruções completas em [`backend/README.md`](backend/README.md)
- Frontend: instruções completas em [`frontend/README.md`](frontend/README.md)
