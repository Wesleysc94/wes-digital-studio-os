# Wes Digital Studio OS

Sistema interno operacional para a micro-agencia `Wes Digital Studio`, construido a partir da base visual/estrutural do `aura-odontologia-premium` e evoluido para um painel de operacao com CRM, orcamentos, funil, manual e tarefas.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS + shadcn/ui + Radix
- Framer Motion
- React Router
- React Hook Form + Zod
- Zustand
- React Query
- Vercel Functions
- Google Sheets API
- Google Calendar API

## Modulos atuais

- `/dashboard`
- `/crm`
- `/orcamentos`
- `/funil`
- `/manual`
- `/tarefas`
- `/configuracoes`

## Arquitetura

### Front-end

- `src/components/os/`: shell do sistema e blocos reutilizaveis do painel
- `src/pages/`: paginas principais do sistema
- `src/store/`: estado local persistido com Zustand
- `src/hooks/use-os-sync.ts`: sincronizacao entre front, React Query e API
- `src/lib/api/`: cliente HTTP do painel

### Back-end serverless

- `api/os/bootstrap.ts`: carrega dados da operacao
- `api/os/leads.ts`: registra leads e cria follow-up no Calendar quando configurado
- `api/os/proposals.ts`: salva propostas
- `api/os/tasks.ts`: salva tarefas
- `api/_lib/`: integracao Google, helpers de planilha e mocks server-side

## Modo de funcionamento

O sistema trabalha em tres modos:

- `local`: quando o front nao consegue falar com `/api`, normalmente em `npm run dev`
- `mock`: quando a API existe, mas as credenciais Google ainda nao foram configuradas
- `google`: quando a service account, a planilha e o calendar estao configurados corretamente

No modo `local` ou `mock`, o painel continua funcional usando estado local persistido no navegador.

## Variaveis de ambiente

Copie `.env.example` para `.env.local` ao configurar deploy local ou Vercel:

```bash
GOOGLE_PROJECT_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_CALENDAR_ID=
```

## Configuracao do Google Sheets

Crie uma planilha no Google Sheets e compartilhe com o email da service account.

Crie estas abas:

- `Leads`
- `Propostas`
- `Tarefas`

Os headers sao criados automaticamente pela API quando a aba existir e estiver vazia.

## Configuracao do Google Calendar

- Compartilhe o calendario desejado com a service account
- Defina `GOOGLE_CALENDAR_ID`
- Ao cadastrar um lead com `nextContact`, a API cria um evento de follow-up

## Desenvolvimento local

Instalar dependencias:

```bash
npm install
```

Subir apenas o front Vite:

```bash
npm run dev
```

Subir front + functions Vercel localmente:

```bash
npm run dev:vercel
```

## Validacao

```bash
npm run lint
npm run typecheck:api
npm test
npm run build
```

## Deploy

Como o CLI da Vercel ja esta autenticado nesta maquina, o fluxo esperado sera:

```bash
vercel
```

Antes do deploy final, configure no projeto da Vercel:

- `GOOGLE_PROJECT_ID`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_CALENDAR_ID`

## Proximos passos naturais

- conectar dashboard aos dados reais do Sheets
- criar autenticao do painel
- adicionar Playwright para fluxo E2E
- publicar preview na Vercel
