# Panorama Exames — Frontend

SPA do projeto **Panorama Exames**, desenvolvida com React + Vite. Para uma visão geral do projeto (e como rodar tudo com Docker Compose), veja o [README na raiz do repositório](../README.md).

## Requisitos

- [Node.js](https://nodejs.org/) 20+
- npm

## Configuração e execução (modo desenvolvimento)

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Rode o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

A aplicação ficará disponível em `http://localhost:5173`.

## Configuração da API

A URL base da API está definida em [`src/services/api.js`](src/services/api.js):

```js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})
```

Para que o frontend funcione corretamente, o backend precisa estar rodando em `http://localhost:8000` (instruções em [`../backend/README.md`](../backend/README.md)). O CORS do backend já está configurado para aceitar requisições de `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/` e são servidos via Nginx (ver `Dockerfile` e `nginx.conf`), que faz proxy das rotas `/api` para o backend.

## Lint

```bash
npm run lint
```
