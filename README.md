# LoCar

Backend NestJS para gestão de locação de veículos: clientes, funcionários, categorias, veículos, reservas, aluguéis e pagamentos.

## Stack

- **NestJS 10** + TypeScript 5
- **Prisma 5** + PostgreSQL 15
- **class-validator** para DTOs
- **zod** para validação de env no boot
- **Jest** para testes unitários e e2e

## Estrutura

```text
src/
├── main.ts
├── app.module.ts
├── health/                       # GET /api/health
├── shared/
│   ├── config/                   # env.schema (zod) + validateEnv
│   └── database/                 # PrismaModule + PrismaService
└── modules/
    ├── clientes/
    ├── funcionarios/
    ├── categorias/
    ├── veiculos/
    ├── reservas/
    ├── alugueis/
    └── pagamentos/
```

Cada módulo de domínio é dividido em quatro camadas — `domain/`, `application/`, `infra/`, `presentation/`. Detalhes em [docs/architecture.md](docs/architecture.md).

## Como rodar localmente

Pré-requisitos: Node.js 18+, Docker (para subir o PostgreSQL local).

```bash
git clone <repo>
cd LoCar

cp .env.example .env             # ajustar DATABASE_URL se necessário
docker compose up -d postgres    # PostgreSQL local na porta 5432

npm install
npx prisma generate
npx prisma migrate dev           # ou: npx prisma db push (dev rápido)
npm run start:dev
```

API disponível em `http://localhost:3000/api`. Healthcheck em `GET /api/health`.

## Scripts

| Script                  | Descrição                                      |
| ----------------------- | ---------------------------------------------- |
| `npm run start:dev`     | Servidor em watch mode                         |
| `npm run build`         | Compila para `dist/`                           |
| `npm test`              | Testes unitários (Jest)                        |
| `npm run test:e2e`      | Testes e2e (exige Postgres rodando)            |
| `npm run lint`          | ESLint read-only                               |
| `npm run lint:fix`      | ESLint com `--fix`                             |
| `npm run typecheck`     | `tsc --noEmit`                                 |
| `npm run prisma:studio` | Prisma Studio                                  |
| `npm run prisma:seed`   | Popula o banco com dados iniciais              |

## Endpoints

| Recurso       | Métodos                            |
| ------------- | ---------------------------------- |
| `/clientes`   | POST, GET, GET/:id, PATCH, DELETE  |
| `/funcionarios` | POST, GET, GET/:id, PATCH, DELETE |
| `/categorias` | POST, GET, GET/:id                 |
| `/veiculos`   | POST, GET (`?tipo`, `?disponivel`), GET/:id, PATCH, DELETE |
| `/reservas`   | POST, GET, GET/:id, PATCH/:id/cancelar |
| `/alugueis`   | POST, GET, GET/:id, PATCH/:id/finalizar |
| `/pagamentos` | POST, GET, GET/:id, GET/aluguel/:aluguelId |
| `/health`     | GET                                |

Todos prefixados com `/api`.

## Variáveis de ambiente

Validadas no boot via zod ([src/shared/config/env.schema.ts](src/shared/config/env.schema.ts)). Aplicação falha o startup se faltar variável obrigatória.

| Variável         | Obrigatória             | Default       |
| ---------------- | ----------------------- | ------------- |
| `NODE_ENV`       | não                     | `development` |
| `PORT`           | não                     | `3000`        |
| `DATABASE_URL`   | sim                     | —             |
| `FRONTEND_URL`   | sim quando `NODE_ENV=production` | — |

## Testes

```bash
npm test           # 19 testes unitários cobrindo regras críticas
npm run test:e2e   # exige Postgres ativo
```

Mapeamento das regras de negócio para testes em [docs/business-rules.md](docs/business-rules.md).

## CI

`.github/workflows/ci.yml` roda em push para `main`/`develop` e em PRs. Etapas:

1. `npm ci`
2. `npx prisma generate`
3. `npx prisma db push` (cria schema no Postgres efêmero do CI)
4. `npm run lint`
5. `npm run typecheck`
6. `npm test`
7. `npm run test:e2e`
8. `npm run build`

## Documentação

- [docs/architecture.md](docs/architecture.md) — camadas, decisões de framework, como criar novos módulos.
- [docs/business-rules.md](docs/business-rules.md) — todas as regras de negócio com `BR-*` IDs e referências aos use cases.
- [docs/database.md](docs/database.md) — entidades, relacionamentos, índices, migrations.
- [docs/roadmap.md](docs/roadmap.md) — melhorias futuras (Decimal para dinheiro, error filter global, OpenAPI, etc.).
