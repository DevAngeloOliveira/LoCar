# Roadmap

Itens deixados fora da refatoração inicial intencionalmente, em ordem aproximada de prioridade.

## Migrar valores monetários para Decimal

`valorDiaria`, `valorTotal` e `valor` estão como `Float`. Para produção financeira, migrar para `Decimal(10, 2)`.

Mudanças necessárias:

- `prisma/schema.prisma` — trocar `Float` por `Decimal @db.Decimal(10, 2)`.
- TypeScript — `Decimal` (de `Prisma.Decimal`) não aceita `*` com `number` direto. Ajustar:
  - [criar-aluguel.use-case.ts](../src/modules/alugueis/application/criar-aluguel.use-case.ts): `diasAluguel * veiculo.valorDiaria` vira `new Prisma.Decimal(diasAluguel).times(veiculo.valorDiaria)`.
  - [registrar-pagamento.use-case.ts](../src/modules/pagamentos/application/registrar-pagamento.use-case.ts): comparação `valor < aluguel.valorTotal` vira `aluguel.valorTotal.greaterThan(dto.valor)`.
- DTOs (`valorDiaria: number` em CreateVeiculoDto, `valor: number` em CreatePagamentoDto) podem permanecer como `number` no payload; Prisma aceita number como entrada para Decimal.
- Testes — atualizar os mocks que retornam `valorTotal: number` para `new Prisma.Decimal(...)`.

## Filtro global de exceções

Em produção, evitar vazamento de stack trace. Criar `src/shared/filters/http-exception.filter.ts` com `@Catch()` que:

- Em `NODE_ENV !== 'production'`: retorna mensagem e stack.
- Em produção: retorna mensagem genérica + status + path + timestamp.

Registrar globalmente em `main.ts` via `app.useGlobalFilters(...)`.

## Logger estruturado

Hoje há um `Logger` simples em `main.ts`. Para produção, considerar `pino` ou similar com saída JSON para integração com observabilidade (Grafana Loki, CloudWatch, Datadog).

## Rate limiting

`@nestjs/throttler` global em rotas públicas. Decidir limites por endpoint quando houver tráfego real.

## E2E tests

Os 5 arquivos `*.e2e-spec.ts` em `test/` continuam apontando para o `PrismaService` correto após o move para `shared/database`, mas precisam de um Postgres rodando (`docker compose up -d postgres` + `prisma db push`). Adicionar no CI já está coberto pelo `services.postgres` em `.github/workflows/ci.yml`. Localmente, rodar `npm run test:e2e` exige o compose ativo.

## Domínio para erros

Atualmente os use cases lançam `BadRequestException`/`ConflictException`/`NotFoundException` direto do `@nestjs/common`. Isso acopla regra de negócio à camada HTTP. Em projetos maiores vale criar:

```
shared/exceptions/
├── domain.exception.ts          # classe base
├── conflito-de-dominio.ex.ts
├── recurso-nao-encontrado.ex.ts
└── regra-invalida.ex.ts
```

Mais um filter global que traduza para a resposta HTTP. Para o escopo atual, o ganho não justifica a indireção.

## Documentação OpenAPI

Adicionar `@nestjs/swagger` para gerar OpenAPI a partir dos DTOs com `class-validator`. Útil quando houver frontend ou parceiros consumindo.

## Versionamento da API

`app.setGlobalPrefix('api')` poderia virar `api/v1`. Necessário apenas quando houver clientes externos que precisem garantir contrato estável.
