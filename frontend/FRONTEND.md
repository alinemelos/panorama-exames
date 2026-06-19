# Frontend — Panorama de Exames

Referência rápida da estrutura do frontend para evitar reexplorar os arquivos a cada tarefa.

## Stack

- React 19 + Vite, `react-router-dom` v6 para rotas, `axios` para HTTP, `recharts` para gráficos do dashboard.
- Sem biblioteca de UI (MUI, react-select etc.) — elementos HTML nativos (`<select>`, `<input>`) estilizados via CSS puro (BEM-like).
- Sem TypeScript (apenas `.jsx`/`.js`).

## Estrutura de pastas

```
src/
  App.jsx              # Define as rotas (BrowserRouter/Routes)
  main.jsx             # Entry point
  components/          # button.jsx e input.jsx existem mas estão VAZIOS (não usados) — páginas usam <button>/<input> nativos direto
  pages/
    Login.jsx
    SolicitarAcesso.jsx
    DefinirSenha.jsx
    RedefinirSenha.jsx
    Plantao.jsx
    Dashboard.jsx
    styles/             # CSS por página (Dashboard.css, Plantao.css); Login e afins usam App.css
  services/             # Wrappers axios por domínio, todos importam `api` de api.js
    api.js               # instância axios (baseURL = VITE_API_BASE_URL, withCredentials: true)
    auth.js               # login, logout, requestAccess, setPassword, requestReset, resetPassword
    dashboard.js          # getDashboard(params)
    duties.js             # getCurrent, openDuty, addCollection, closeDuty (fluxo de plantão)
    machines.js           # listMachines, listProblems
```

## Rotas (App.jsx)

| Path | Página | Observação |
|---|---|---|
| `/` | Login | tela inicial |
| `/solicitar-acesso` | SolicitarAcesso | |
| `/definir-senha` | DefinirSenha | fluxo de primeiro acesso (token por email) |
| `/redefinir-senha` | RedefinirSenha | "esqueci a senha" |
| `/plantao` | Plantao | tela operacional p/ role `nursing` |
| `/dashboard` | Dashboard | tela administrativa (gráficos/filtros) |

Não há rotas protegidas por router guard — o redirecionamento por role acontece manualmente após o login (ver abaixo). Não há `localStorage`/contexto de auth consultado nas demais páginas (cada página assume que o usuário já está autenticado via cookie de sessão, `withCredentials: true`).

## Padrão de autenticação

- `Login.jsx` chama `login(email, senha)` → guarda `{ role, name }` em `localStorage.user` e navega:
  - `role === 'nursing'` → `/plantao`
  - qualquer outra role → `/dashboard`
- Sessão real é via cookie (axios `withCredentials: true`), o `localStorage.user` é só para exibição/lógica de UI, não é um token.

## Padrão de página (state/data fetching)

Todas as páginas seguem o mesmo formato, sem Redux/Context/React Query:
- `useState` para campos de formulário, erro (`erro`) e loading (`loading`).
- `useEffect(() => { ... }, [])` para carregar dados no mount via `Promise.all` quando há múltiplas chamadas (ex: Dashboard carrega `exams` + `machines`; Plantao carrega `machines` + `problems`, depois tenta `getCurrent()` em try/catch separado pois pode não haver plantão aberto).
- Erros de API tratados com `err.response?.data?.detail || err.response?.data?.non_field_errors?.[0] || 'mensagem genérica'`.
- Navegação com `useNavigate()` de `react-router-dom`; botão padrão "← Voltar ao login" (`btn-voltar-login`) presente em Plantao e Dashboard.

## Dashboard.jsx (`/dashboard`)

- Filtros: `dataInicio`/`dataFim` (datas), `examId`, `machineId` — todos client-side state, recarregam `getDashboard(params)` via `useEffect` com dependência nesses 4 valores.
- `exames` (`/core/exams/`) e `machines` (`listMachines()` → `/core/machines/`) são carregados uma vez no mount e mantidos em memória; **não há novas chamadas de API ao mudar os filtros de exame/equipamento**, só refaz a chamada de `getDashboard`.
- Equipamento é filtrado por exame **no client**, via `filteredMachines = machines.filter(m => m.exam_type === Number(examId))` quando `examId` está setado. `machine.exam_type` é o id (inteiro) do exame relacionado (FK no backend), serializado como número puro pelo DRF — não confundir com `exam_type_name` (string, nome do exame, read-only).
- Ao trocar o exame, um `useEffect` separado reseta `machineId` para `''` se o equipamento selecionado não pertencer mais ao novo exame.
- Gráficos usam `recharts` (`LineChart`, `BarChart`) renderizando `examePorMes`, `problemasPorMes`, `faturamento` retornados por `getDashboard`.

## Plantao.jsx (`/plantao`)

- Fluxo com 3 "views" controladas por state `view`: `'plantao' | 'motivo' | 'concluido'` (não usa rotas separadas, é renderização condicional dentro do mesmo componente).
- Dropdown de equipamento é uma implementação customizada (botão + lista condicional), não um `<select>` nativo — não tem filtro dependente de exame (lista todos os `machines`).
- `duty` (plantão atual) vem de `getCurrent()`; se não houver plantão aberto, a chamada falha silenciosamente (catch vazio com comentário "sem plantão aberto, ok").
- Registrar 0 coletas (`qtd === 0`) força o usuário para a view `'motivo'` (motivo obrigatório de não ter feito exames).

## Convenções de nomenclatura

- Variáveis/estado em português quando relacionado a domínio de negócio (`erro`, `senha`, `quantidade`, `motivo`, `machineSelecionada`), em inglês quando é dado vindo direto da API (`machines`, `exames`, `examId`, `machineId`, `duty`).
- Classes CSS em kebab-case prefixadas pelo contexto da página (`plantao-*`, `dashboard-*`, `login-*`, `btn-*`).

## Variáveis de ambiente

- `VITE_API_BASE_URL` — base URL da API Django (consumida em `services/api.js`). Configurar em `.env` na raiz do frontend.

## Pontos de atenção / dívidas conhecidas

- `components/button.jsx` e `components/input.jsx` estão vazios — não usar como referência, são placeholders não implementados.
- Não há testes automatizados no frontend.
- Não há guard de rota por role/autenticação no `react-router` — qualquer rota é acessível diretamente pela URL, a separação por role só ocorre no redirecionamento pós-login.

## Fluxo de verificação de mudanças visuais/CSS

- Não montar harness de teste isolado (HTML/Playwright/scripts ad-hoc) para validar visualmente um ajuste de CSS/layout — isso consome tempo sem necessidade.
- Após fazer a alteração, perguntar ao usuário e deixar ele avaliar visualmente (ele roda o frontend e olha no navegador). Só rodar `npm run build`/lint para garantir que não quebrou nada.
