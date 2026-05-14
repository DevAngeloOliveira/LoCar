# Banco de Dados

PostgreSQL via Prisma. Schema em [prisma/schema.prisma](../prisma/schema.prisma).

## Entidades e relacionamentos

```
Cliente 1───n Reserva n───n Veiculo (via ReservaVeiculo)
   │                │           │
   └─1───n Aluguel ─┘           │
              │                  │
              n──────────────────┘
              │
              1───1 Pagamento
```

- **Cliente**: dados pessoais; soft delete via `ativo`.
- **Funcionário**: opera reservas; soft delete via `ativo`.
- **Categoria**: classificação dos veículos.
- **Veículo**: discriminado por `tipo` (`CARRO` / `MOTO` / `CAMINHAO`) com campos opcionais por tipo.
- **Reserva**: associação cliente + funcionário + N veículos por período.
- **ReservaVeiculo**: tabela de junção; `@@unique([reservaId, veiculoId])` impede duplicação.
- **Aluguel**: derivado de uma reserva (`@unique reservaId`); um aluguel por veículo por reserva.
- **Pagamento**: 1-1 com Aluguel (`@unique aluguelId`).

## Índices

Adicionados em [prisma/schema.prisma](../prisma/schema.prisma) para suportar as queries dos repositórios:

| Tabela              | Índice                                | Justificativa                                          |
| ------------------- | ------------------------------------- | ------------------------------------------------------ |
| `clientes`          | `ativo`                               | Filtra `findAll` apenas ativos                         |
| `funcionarios`      | `ativo`                               | Idem                                                   |
| `veiculos`          | `tipo`                                | Filtro do `listar`                                     |
| `veiculos`          | `disponivel`                          | Filtro do `listar`                                     |
| `veiculos`          | `categoriaId`                         | Join `include: categoria`                              |
| `reservas`          | `cancelada`                           | Conflito de período exclui canceladas                  |
| `reservas`          | `dataInicio`                          | Conflito de período cruza intervalos                   |
| `reservas`          | `dataFim`                             | Idem                                                   |
| `reservas`          | `clienteId`, `funcionarioId`          | FKs consultadas em listagens (Postgres + Prisma não criam índice automático em FK) |
| `reserva_veiculos`  | `veiculoId`                           | Filtro `some: { veiculoId }`                           |
| `alugueis`          | `finalizado`                          | Conta de aluguéis ativos                               |
| `alugueis`          | `(veiculoId, finalizado)` composto    | Check de aluguel ativo por veículo                     |
| `alugueis`          | `clienteId`                           | Listagens por cliente                                  |

## Migrations

`prisma/migrations/` é versionado a partir desta refatoração (antes estava no `.gitignore`).

Para a primeira execução em um banco limpo:

```bash
npx prisma migrate dev --name init_with_indexes
```

Em CI e produção use `prisma migrate deploy` (apenas aplica migrations existentes, não cria novas).

## Decisões abertas

- **Valores monetários como `Float`** — `valorDiaria`, `valorTotal` e `valor` continuam como `Float`. Migração para `Decimal(10, 2)` está em [roadmap.md](roadmap.md) e exige ajustes em toda a aritmética do domínio (Decimal não suporta `*` direto com `number`).

- **Soft delete por entidade** — apenas Cliente e Funcionário usam `ativo`. Veículo usa hard delete (com bloqueio se houver aluguel ativo). Reserva usa `cancelada` em vez de exclusão.
