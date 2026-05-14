# Arquitetura

## Por que NestJS

NestJS foi escolhido como framework porque:

- Estrutura modular nativa (`@Module`, `@Injectable`) que mapeia bem para a organização em domínios da aplicação.
- DI container robusto, facilita injeção de tokens (`@Inject(SYMBOL)`) usada nos contratos de repositório.
- Integração madura com `class-validator` para validar DTOs declarativamente.
- Suporte a testes via `@nestjs/testing` com `TestingModule`, que torna trivial substituir providers por mocks.

## Por que Prisma

- Cliente tipado em TypeScript, sem necessidade de manter tipos manuais.
- Schema único como fonte da verdade do banco.
- Suporte direto a `$transaction` com callback (`tx`) para operações multi-statement atômicas — usado nos fluxos de criação/finalização de aluguel e criação de reserva.

## Camadas

Cada módulo de domínio (`src/modules/<nome>/`) é dividido em quatro pastas:

```
modules/<nome>/
├── domain/         # contrato puro (entity + repository interface + tokens)
├── application/    # use cases (regras de negócio orquestradas)
├── infra/          # implementação técnica do repositório (prisma-*.ts)
└── presentation/   # controllers + DTOs HTTP
```

### domain

Contém as estruturas e contratos que descrevem o domínio sem depender de framework ou banco:

- **Entity** (`<nome>.entity.ts`): tipo TypeScript da entidade e tipos auxiliares para criação/atualização.
- **Repository interface** (`<nome>.repository.ts`): contrato + `Symbol` para injeção.

A camada `domain` não importa nada de Prisma nem de NestJS além de tipos.

### application

Contém os use cases. Cada use case é uma classe `@Injectable` com método `executar(...)` e uma responsabilidade única.

- Orquestra repositórios e outros use cases.
- Aplica regras de negócio (validações, cálculos).
- Lança exceções HTTP do NestJS (`BadRequestException`, `ConflictException`, `NotFoundException`) — pragmaticamente, sem domínio de erros customizados.

### infra

Contém a implementação concreta do contrato de repositório, usando Prisma.

- `prisma-<nome>.repository.ts` implementa a interface do `domain/`.
- É aqui que vivem chamadas a `prisma.<tabela>.findMany`, `prisma.$transaction`, etc.

Operações com múltiplas escritas são envelopadas em `prisma.$transaction` dentro do repositório, mantendo a camada de aplicação livre de detalhes do ORM.

### presentation

Contém o controller HTTP e os DTOs.

- Sem lógica de negócio — apenas roteamento + delegação para o use case.
- DTOs separados em `dto/create-<nome>.dto.ts` e `dto/update-<nome>.dto.ts`.

## Shared

```
src/shared/
├── config/         # env.schema (zod) + validateEnv usado no boot
└── database/       # PrismaModule global + PrismaService
```

`PrismaModule` é `@Global()` para não precisar ser importado em cada módulo.

`validateEnv` é chamado pelo `ConfigModule.forRoot({ validate })` em `app.module.ts`, falhando o boot com mensagem clara se faltar `DATABASE_URL` ou se `NODE_ENV=production` sem `FRONTEND_URL`.

## Health

`GET /api/health` retorna `{ status, service, timestamp }`. Endpoint dedicado, sem lógica.

## Como criar um novo módulo

1. Criar `src/modules/<nome>/{domain,application,infra,presentation}`.
2. Definir `<nome>.entity.ts` e `<nome>.repository.ts` em `domain/`.
3. Implementar `prisma-<nome>.repository.ts` em `infra/`.
4. Escrever um use case por operação em `application/<verbo>-<nome>.use-case.ts`.
5. Criar controller e DTOs em `presentation/`.
6. Registrar tudo em `<nome>.module.ts` (incluindo o provider do repositório via `{ provide: <NOME>_REPOSITORY, useClass: Prisma<Nome>Repository }`).
7. Importar o módulo em `src/app.module.ts`.

Use cases que precisem ser consumidos por outros módulos devem ser exportados via `exports` do `@Module`.

## Decisões abertas

Ver [roadmap.md](roadmap.md) para itens deixados de fora intencionalmente (Decimal para valores monetários, error filter global, logger estruturado, etc.).
