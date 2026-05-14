# Regras de Negócio

Identificadores BR-<MOD>-NNN referenciados nos use cases e nos testes.

## Clientes

- **BR-CLI-001** — CPF deve ser único no sistema.
  - Aplicada em: [cadastrar-cliente.use-case.ts](../src/modules/clientes/application/cadastrar-cliente.use-case.ts)
  - Lança `ConflictException` se CPF já existe.

- **BR-CLI-002** — Remoção de cliente é soft delete (`ativo = false`).
  - Aplicada em: [desativar-cliente.use-case.ts](../src/modules/clientes/application/desativar-cliente.use-case.ts)
  - `findAll` filtra `ativo = true`.

## Funcionários

- **BR-FUN-001** — Matrícula deve ser única.
- **BR-FUN-002** — Funcionário inativo não pode criar reserva.
  - Aplicada em: [validar-funcionario-ativo.use-case.ts](../src/modules/funcionarios/application/validar-funcionario-ativo.use-case.ts)
  - Consumida por `CriarReservaUseCase` antes de qualquer escrita.

## Categorias

- **BR-CAT-001** — Nome de categoria deve ser único.

## Veículos

- **BR-VEH-001** — Placa deve ser única.
- **BR-VEH-002** — Cadastro exige uma categoria existente.
  - Validado em [cadastrar-veiculo.use-case.ts](../src/modules/veiculos/application/cadastrar-veiculo.use-case.ts) via `BuscarCategoriaUseCase.garantirExistencia`.
- **BR-VEH-003** — Veículo com aluguéis ativos (`finalizado = false`) não pode ser removido.
  - Aplicada em [remover-veiculo.use-case.ts](../src/modules/veiculos/application/remover-veiculo.use-case.ts).
- **BR-VEH-004** — Veículo é marcado como `disponivel = false` quando vira aluguel ativo e `disponivel = true` quando o aluguel é finalizado.

## Reservas

- **BR-RES-001** — `dataInicio` deve ser anterior a `dataFim`.
- **BR-RES-002** — `dataInicio` não pode estar no passado.
- **BR-RES-003** — Cliente, funcionário e veículos devem existir; funcionário deve estar ativo.
- **BR-RES-004** — Não pode haver conflito de período para nenhum dos veículos solicitados.
  - Checagem dupla:
    1. `VerificarDisponibilidadeUseCase` na camada de aplicação (UX rápida).
    2. Re-checagem dentro de `prisma.$transaction` em [prisma-reserva.repository.ts](../src/modules/reservas/infra/prisma-reserva.repository.ts) para fechar a janela de race condition.
- **BR-RES-005** — Reserva já com aluguel associado não pode ser cancelada.
- **BR-RES-006** — Reserva cancelada não pode gerar aluguel.

## Aluguéis

- **BR-ALU-001** — Veículo só pode participar de um aluguel ativo por vez.
  - Validação dentro de `prisma.$transaction` em [prisma-aluguel.repository.ts](../src/modules/alugueis/infra/prisma-aluguel.repository.ts) (`criarComBloqueioDeVeiculo`).
- **BR-ALU-002** — Veículo do aluguel precisa estar na reserva original.
- **BR-ALU-003** — Aluguel só pode ser finalizado se já houver pagamento.
- **BR-ALU-004** — `dataFim` da finalização deve ser >= `dataInicio`.
- **BR-ALU-005** — `valorTotal = dias × veiculo.valorDiaria`, onde `dias = ceil((dataFim - dataInicio) / 24h)` calculado a partir das datas da reserva.

## Pagamentos

- **BR-PAG-001** — Cada aluguel tem no máximo um pagamento. O schema garante via `aluguelId @unique`; o use case valida antes para retornar 409 com mensagem clara.
- **BR-PAG-002** — Não é permitido pagar aluguel já finalizado.
- **BR-PAG-003** — `valor >= aluguel.valorTotal` (paga-se pelo menos o valor total; não há devolução de troco no domínio).

## Cobertura de testes

Os testes unitários em `*.use-case.spec.ts` cobrem os caminhos críticos:

- `cadastrar-cliente.spec` — BR-CLI-001
- `desativar-cliente.spec` — BR-CLI-002 + NotFound
- `cadastrar-veiculo.spec` — BR-VEH-001, BR-VEH-002
- `criar-reserva.spec` — BR-RES-001, BR-RES-002, conflito de disponibilidade, caminho feliz
- `finalizar-aluguel.spec` — BR-ALU-003 (RN02), BR-ALU-004, já finalizado, caminho feliz
- `registrar-pagamento.spec` — BR-PAG-001, BR-PAG-002, BR-PAG-003, caminho feliz
