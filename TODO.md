# Ecommerce Moder Pro

Aplicação **full-stack** de e-commerce composta por uma API **Laravel** (PHP) e um **cliente SPA** em **React 18 + TypeScript + Vite**. O front consome a API via Axios/TanStack Query, com UI baseada em **shadcn/ui** (Radix + Tailwind), roteamento com **React Router**, formulários com **react-hook-form + zod**, animações com **framer-motion** e gráficos com **Recharts**.

---

## Sumário

- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Setup — Backend (Laravel)](#setup--backend-laravel)
- [Setup — Cliente (React + Vite)](#setup--cliente-react--vite)
- [Rodando os dois em paralelo](#rodando-os-dois-em-paralelo)
- [Scripts principais](#scripts-principais)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Testes](#testes)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Stack

### Backend (`backend/`)
- **Laravel** (PHP) com **Artisan**, migrations e seeders
- **SQLite** por padrão (`database/database.sqlite`)
- **Laravel Boost**, **Pail** (logs), **Pint** (formatação PHP)
- **Pest 4** para testes
- **Vite 8** + **Tailwind CSS v4** para assets do lado do Laravel (via `laravel-vite-plugin`)

### Cliente (`client/`)
- **React 18** + **TypeScript 5.8**
- **Vite 5** com `@vitejs/plugin-react-swc`
- **Tailwind CSS v3** + `tailwindcss-animate` + `@tailwindcss/typography`
- **shadcn/ui** sobre **Radix UI** (accordion, dialog, dropdown, tabs, tooltip, etc.)
- **React Router v6** para navegação
- **TanStack Query v5** + **Axios** para data-fetching
- **react-hook-form** + **zod** (via `@hookform/resolvers`)
- **framer-motion**, **recharts**, **embla-carousel**, **cmdk**, **sonner**, **vaul**
- **next-themes** (dark/light)
- **Vitest** + **@testing-library/react** + **jsdom**

---

## Estrutura do repositório

```
Ecommerce-moder-pro/
├── backend/                      # API Laravel (PHP)
│   ├── app/                      # Models, Controllers, etc.
│   ├── routes/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── database.sqlite       # criado no primeiro setup
│   ├── config/
│   ├── resources/
│   ├── tests/                    # Pest
│   ├── artisan
│   ├── composer.json
│   ├── package.json              # Vite + Tailwind para assets do Laravel
│   └── vite.config.js
├── client/                       # SPA React + Vite
│   ├── src/
│   │   ├── api/                  # Cliente Axios e chamadas HTTP
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ecommerce/        # Componentes específicos da loja
│   │   ├── contexts/             # React Contexts
│   │   ├── data/                 # Constantes e dados estáticos
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/                # Rotas / páginas
│   │   ├── services/
│   │   ├── test/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
├── client copy/                  # Duplicata legada — pode ser removida
├── TINKER_SEED_CLIENT_DEMO.txt   # Snippet para Laravel Tinker (seed manual)
├── TODO.md                       # Lista de melhorias pendentes
└── README.md
```

> A pasta `client copy/` é uma duplicata histórica do cliente; considere removê-la para evitar confusão.

---

## Pré-requisitos

| Ferramenta         | Versão sugerida  |
|--------------------|------------------|
| PHP                | 8.2+             |
| Composer           | 2.x              |
| Node.js            | 20+              |
| npm                | 10+              |
| SQLite             | qualquer (embutido no PHP em geral) |

Opcional: `git`, extensão PHP do VS Code, e o **Laravel Boost** já vem como dependência de dev.

---

## Setup — Backend (Laravel)

```bash
cd backend

# 1. Dependências PHP e configuração inicial (tudo em um script)
composer setup
```

O script `composer setup` (definido no `composer.json`) executa:

1. `composer install`
2. Copia `.env.example` para `.env` (se não existir)
3. `php artisan key:generate`
4. `php artisan migrate --force`
5. `npm install --ignore-scripts`
6. `npm run build` (Vite dos assets do Laravel)

Se precisar rodar manualmente:

```bash
cp .env.example .env
php artisan key:generate
touch database/database.sqlite      # se ainda não existir
php artisan migrate
php artisan db:seed                 # opcional, se houver seeders
```

### Servir o backend em desenvolvimento

O jeito mais completo (server + queue + logs + vite) é o script `composer dev`, que roda tudo em paralelo com `concurrently`:

```bash
composer dev
```

Isso sobe:

- `php artisan serve` — API em `http://127.0.0.1:8000`
- `php artisan queue:listen` — worker de filas
- `php artisan pail` — logs em tempo real
- `npm run dev` — HMR do Vite para assets do Laravel

Alternativa mínima:

```bash
php artisan serve
```

### Seed de demonstração

O arquivo `TINKER_SEED_CLIENT_DEMO.txt` contém snippets para popular dados via `php artisan tinker`. Abra o Tinker e cole os trechos:

```bash
php artisan tinker
```

---

## Setup — Cliente (React + Vite)

```bash
cd client
npm install
npm run dev
```

O Vite sobe por padrão em [http://localhost:8080](http://localhost:8080) (ou 5173, dependendo da config). A URL da API é lida de variáveis de ambiente — veja [abaixo](#variáveis-de-ambiente).

Build de produção:

```bash
npm run build       # gera /dist
npm run preview     # serve /dist localmente
```

Lint:

```bash
npm run lint
```

---

## Rodando os dois em paralelo

Abra **dois terminais**:

**Terminal 1 — backend**
```bash
cd backend && composer dev
```

**Terminal 2 — cliente**
```bash
cd client && npm run dev
```

Configure o cliente para apontar `VITE_API_URL` para `http://127.0.0.1:8000/api`.

---

## Scripts principais

### Backend (`backend/composer.json`)

| Comando              | Ação                                                       |
|----------------------|------------------------------------------------------------|
| `composer setup`     | Bootstrap completo (install, key, migrate, npm build)      |
| `composer dev`       | Server + queue + logs + Vite em paralelo                   |
| `composer test`      | `php artisan config:clear` + `php artisan test` (Pest)     |

### Backend Vite (`backend/package.json`)

| Comando         | Ação                          |
|-----------------|-------------------------------|
| `npm run dev`   | HMR dos assets do Laravel     |
| `npm run build` | Build dos assets do Laravel   |

### Cliente (`client/package.json`)

| Comando          | Ação                          |
|------------------|-------------------------------|
| `npm run dev`    | Vite dev server (HMR)         |
| `npm run build`  | Build de produção             |
| `npm run preview`| Preview do build              |
| `npm run lint`   | ESLint                        |
| `npm run test`   | Vitest                        |

> Os scripts exatos do cliente podem variar; confira `client/package.json` se algum comando não existir.

---

## Variáveis de ambiente

### Backend

Copiado a partir de `backend/.env.example`. Chaves relevantes:

```dotenv
APP_NAME="Ecommerce Moder Pro"
APP_ENV=local
APP_KEY=                          # gerado por artisan key:generate
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=sqlite
# DB_DATABASE=/caminho/absoluto/database.sqlite   # opcional

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

Para produção, ajuste `APP_ENV=production`, `APP_DEBUG=false` e considere trocar SQLite por MySQL/Postgres.

### Cliente

Crie `client/.env`:

```dotenv
VITE_API_URL=http://127.0.0.1:8000/api
```

Use `import.meta.env.VITE_API_URL` no código.

---

## Testes

- **Backend (Pest 4):**
  ```bash
  cd backend
  composer test
  # ou
  php artisan test
  ```
- **Cliente (Vitest + Testing Library):**
  ```bash
  cd client
  npm test
  ```

---

## Contribuindo

1. Faça um fork.
2. Crie uma branch: `git checkout -b feat/minha-feature`.
3. Rode formatação/lint antes do push:
   - Backend: `./vendor/bin/pint` (Laravel Pint)
   - Cliente: `npm run lint`
4. Commits seguindo Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
5. Abra um Pull Request descrevendo o que muda e por quê.

Bugs e sugestões: [Issues](https://github.com/Kobayashi24730/Ecommerce-moder-pro/issues).

Consulte também o arquivo [`TODO.md`](./TODO.md) para tarefas em aberto.

---

## Licença

Distribuído sob a licença **MIT**. Veja o arquivo [`LICENSE`](./LICENSE) para o texto completo.
