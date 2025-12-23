# LoCar - Sistema de Gestão de Reservas e Aluguel de Veículos

Sistema completo desenvolvido com **NestJS** (backend) e **PostgreSQL** para gerenciamento de locação de veículos.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Início Rápido](#-início-rápido)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [API Endpoints](#-api-endpoints)
- [Modelo de Dados](#-modelo-de-dados)
- [Testes](#-testes)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Regras de Negócio](#-regras-de-negócio)

---

## 📋 Sobre o Projeto

Sistema completo para gestão de locadora de veículos com as seguintes funcionalidades:

- ✅ **Gestão de Clientes e Funcionários**: Cadastro completo com validações
- ✅ **Gestão de Veículos**: Carros, motos e caminhões com atributos específicos
- ✅ **Sistema de Categorias**: Classificação de veículos por tipo
- ✅ **Reservas**: Agendamento de veículos por período
- ✅ **Aluguéis**: Efetivação de reservas com cálculo automático de valores
- ✅ **Pagamentos**: Registro e controle de pagamentos
- ✅ **Controle de Disponibilidade**: Gestão automática de veículos disponíveis
- ✅ **Validações de Negócio**: Regras implementadas conforme especificação
- ✅ **Testes Completos**: 36 testes (7 unitários + 29 E2E) com 100% de aprovação

---

## 🚀 Início Rápido

### Pré-requisitos

- ✅ **Node.js** 18 ou superior
- ✅ **PostgreSQL** 15 ou superior
- ✅ **npm** ou **yarn**

### Instalação em 5 Passos

#### 1️⃣ Clone e Instale Dependências

```bash
git clone <url-do-repositório>
cd LoCar
npm install
```

#### 2️⃣ Configure o Banco de Dados

Crie o banco PostgreSQL:

```sql
CREATE DATABASE locar;
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/locar?schema=public"
PORT=3000
NODE_ENV=development
```

#### 3️⃣ Execute as Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 4️⃣ (Opcional) Popule o Banco com Dados de Exemplo

```bash
npm run prisma:seed
```

Isso criará:
- 5 clientes
- 3 funcionários
- 5 categorias
- 11 veículos (6 carros, 3 motos, 2 caminhões)
- 6 reservas
- 2 aluguéis
- 1 pagamento

#### 5️⃣ Inicie o Servidor

```bash
npm run start:dev
```

✅ Servidor rodando em `http://localhost:3000/api`

### Teste Rapidamente

```bash
# Criar um cliente
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678900",
    "endereco": "Rua das Flores, 123",
    "telefone": "(11) 98765-4321",
    "email": "joao@email.com"
  }'

# Listar veículos disponíveis
curl http://localhost:3000/api/veiculos?disponivel=true
```

---

## 🏗️ Arquitetura

### Stack Tecnológica

- **Framework**: NestJS 10 com TypeScript 5
- **ORM**: Prisma 5
- **Banco de Dados**: PostgreSQL 15+
- **Validação**: class-validator e class-transformer
- **Testes**: Jest (unitários e E2E com Supertest)
- **Arquitetura**: Modular com Clean Architecture

### Estrutura do Projeto

```
LoCar/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   ├── migrations/            # Migrations do Prisma
│   └── seed.ts                # Dados de exemplo
├── src/
│   ├── prisma/                # Serviço Prisma (global)
│   ├── clientes/              # Módulo de clientes
│   │   ├── clientes.controller.ts
│   │   ├── clientes.service.ts
│   │   ├── clientes.service.spec.ts
│   │   ├── dto/
│   │   └── clientes.module.ts
│   ├── funcionarios/          # Módulo de funcionários
│   ├── categorias/            # Módulo de categorias
│   ├── veiculos/              # Módulo de veículos
│   ├── reservas/              # Módulo de reservas
│   ├── alugueis/              # Módulo de aluguéis
│   ├── pagamentos/            # Módulo de pagamentos
│   ├── app.module.ts
│   └── main.ts
├── test/                      # Testes E2E
│   ├── clientes.e2e-spec.ts
│   ├── veiculos.e2e-spec.ts
│   ├── reservas.e2e-spec.ts
│   ├── alugueis.e2e-spec.ts
│   └── pagamentos.e2e-spec.ts
└── README.md
```

### Arquitetura de Domínio

#### Entidades Principais

**Cliente**
- Representa os clientes que alugam veículos
- Atributos: id, nome, cpf (único), endereço, telefone, email, ativo
- Relacionamentos: N Reservas, N Aluguéis

**Funcionário**
- Representa funcionários que atendem clientes
- Atributos: id, nome, matrícula (única), cargo, telefone, ativo
- Relacionamentos: N Reservas

**Categoria**
- Classifica veículos em categorias
- Atributos: id, nome (único), descrição
- Relacionamentos: N Veículos

**Veículo** (com herança por tipo)
- Classe base para todos os veículos
- Atributos comuns: id, placa (única), marca, modelo, ano, cor, valorDiaria, disponível, tipo
- Tipos específicos:
  - **Carro**: numeroPortas, possuiArCondicionado
  - **Moto**: cilindradas, bau
  - **Caminhão**: capacidadeCarga

**Reserva**
- Agendamento de veículos
- Atributos: id, dataReserva, dataInicio, dataFim, cancelada
- Relacionamentos: 1 Cliente, 1 Funcionário, N Veículos, 0..1 Aluguel

**Aluguel**
- Efetivação da locação
- Atributos: id, dataInicio, dataFim, valorTotal, finalizado
- Relacionamentos: 1 Reserva, 1 Cliente, 1 Veículo, 0..1 Pagamento

**Pagamento**
- Registro de pagamento do aluguel
- Atributos: id, tipo (PIX, DINHEIRO, etc), valor, dataPagamento
- Relacionamentos: 1 Aluguel

---

## 🚀 Tecnologias

### Backend
- **NestJS** 10 - Framework Node.js progressivo
- **TypeScript** 5 - JavaScript com tipagem
- **Prisma** 5 - ORM moderno
- **PostgreSQL** 15+ - Banco de dados relacional
- **class-validator** - Validação de DTOs
- **class-transformer** - Transformação de objetos

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes HTTP
- **ts-node** - Execução TypeScript

---

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 👥 Clientes

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/clientes` | Criar cliente | `{ nome, cpf, endereco, telefone, email }` |
| GET | `/clientes` | Listar clientes ativos | - |
| GET | `/clientes/:id` | Buscar cliente por ID | - |
| PATCH | `/clientes/:id` | Atualizar cliente | `{ nome?, telefone?, email?, endereco? }` |
| DELETE | `/clientes/:id` | Desativar cliente (soft delete) | - |

**Exemplo - Criar Cliente:**
```bash
POST /api/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "12345678900",
  "endereco": "Rua das Flores, 123",
  "telefone": "(11) 98765-4321",
  "email": "joao@email.com"
}
```

### 👔 Funcionários

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/funcionarios` | Criar funcionário | `{ nome, matricula, cargo, telefone }` |
| GET | `/funcionarios` | Listar funcionários ativos | - |
| GET | `/funcionarios/:id` | Buscar por ID | - |
| PATCH | `/funcionarios/:id` | Atualizar funcionário | `{ nome?, cargo?, telefone? }` |
| DELETE | `/funcionarios/:id` | Desativar funcionário | - |

### 📋 Categorias

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/categorias` | Criar categoria | `{ nome, descricao }` |
| GET | `/categorias` | Listar todas | - |
| GET | `/categorias/:id` | Buscar por ID | - |

### 🚗 Veículos

| Método | Endpoint | Descrição | Query Params |
|--------|----------|-----------|--------------|
| POST | `/veiculos` | Criar veículo | - |
| GET | `/veiculos` | Listar veículos | `?tipo=CARRO&disponivel=true` |
| GET | `/veiculos/:id` | Buscar por ID | - |
| PATCH | `/veiculos/:id` | Atualizar veículo | - |
| DELETE | `/veiculos/:id` | Remover veículo | - |

**Exemplo - Criar Carro:**
```json
{
  "placa": "ABC1234",
  "marca": "Fiat",
  "modelo": "Uno",
  "ano": 2023,
  "cor": "Branco",
  "valorDiaria": 80.00,
  "tipo": "CARRO",
  "categoriaId": "uuid-da-categoria",
  "numeroPortas": 4,
  "possuiArCondicionado": true
}
```

**Exemplo - Criar Moto:**
```json
{
  "placa": "MOT1234",
  "marca": "Honda",
  "modelo": "CG 160",
  "ano": 2023,
  "cor": "Vermelho",
  "valorDiaria": 60.00,
  "tipo": "MOTO",
  "categoriaId": "uuid-da-categoria",
  "cilindradas": 160,
  "bau": false
}
```

**Exemplo - Criar Caminhão:**
```json
{
  "placa": "CAM1234",
  "marca": "Mercedes",
  "modelo": "Accelo",
  "ano": 2022,
  "cor": "Branco",
  "valorDiaria": 200.00,
  "tipo": "CAMINHAO",
  "categoriaId": "uuid-da-categoria",
  "capacidadeCarga": 5000
}
```

### 📅 Reservas

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/reservas` | Criar reserva | `{ clienteId, funcionarioId, dataInicio, dataFim, veiculoIds[] }` |
| GET | `/reservas` | Listar reservas | - |
| GET | `/reservas/:id` | Buscar por ID | - |
| PATCH | `/reservas/:id/cancelar` | Cancelar reserva | - |

### 🚗 Aluguéis

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/alugueis` | Criar aluguel | `{ reservaId, veiculoId }` |
| GET | `/alugueis` | Listar aluguéis | - |
| GET | `/alugueis/:id` | Buscar por ID | - |
| PATCH | `/alugueis/:id/finalizar` | Finalizar aluguel | `{ dataFim }` |

### 💰 Pagamentos

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| POST | `/pagamentos` | Registrar pagamento | `{ aluguelId, valor, tipo }` |
| GET | `/pagamentos` | Listar pagamentos | - |
| GET | `/pagamentos/:id` | Buscar por ID | - |
| GET | `/pagamentos/aluguel/:aluguelId` | Buscar por aluguel | - |

**Tipos de Pagamento**: `PIX`, `DINHEIRO`, `CARTAO_CREDITO`, `CARTAO_DEBITO`

---

## 🗃️ Modelo de Dados

### Diagrama ER Simplificado

```
Cliente (1) ─────< (N) Reserva (1) ────── (1) Funcionário
                         │
                         │ (N)
                         │
                   ReservaVeiculo
                         │
                         │ (1)
                         ▼
                      Veículo (N) ───── (1) Categoria
                         │
                         │ (1)
                         │
Pagamento (1) ────── (1) Aluguel
```

### Schema Prisma Principal

```prisma
model Cliente {
  id        String   @id @default(uuid())
  nome      String
  cpf       String   @unique
  endereco  String
  telefone  String
  email     String
  ativo     Boolean  @default(true)
  reservas  Reserva[]
  alugueis  Aluguel[]
}

model Veiculo {
  id                   String      @id @default(uuid())
  placa                String      @unique
  marca                String
  modelo               String
  ano                  Int
  cor                  String
  valorDiaria          Float
  disponivel           Boolean     @default(true)
  tipo                 TipoVeiculo
  
  // Campos específicos por tipo
  numeroPortas         Int?        // Carro
  possuiArCondicionado Boolean?    // Carro
  cilindradas          Int?        // Moto
  bau                  Boolean?    // Moto
  capacidadeCarga      Float?      // Caminhão
  
  categoria            Categoria   @relation(...)
  reservaVeiculos      ReservaVeiculo[]
  alugueis             Aluguel[]
}

model Aluguel {
  id         String    @id @default(uuid())
  dataInicio DateTime
  dataFim    DateTime?
  valorTotal Float
  finalizado Boolean   @default(false)
  
  reserva    Reserva   @relation(...)
  cliente    Cliente   @relation(...)
  veiculo    Veiculo   @relation(...)
  pagamento  Pagamento?
}
```

---

## 🧪 Testes

### Status Atual: ✅ 36/36 testes passando (100%)

#### Testes Unitários (7)
- ClientesService - Todas operações CRUD com validações

#### Testes E2E (29)
- **Clientes** (9 testes): CRUD completo, validações de CPF e email
- **Veículos** (9 testes): Criação de carros, motos e caminhões, validações
- **Reservas** (7 testes): Criação, cancelamento, validações de período
- **Aluguéis** (4 testes): Criação, finalização, validações
- **Pagamentos** (4 testes): Registro, validações de valor e unicidade

### Executar Testes

```bash
# Testes unitários (rápidos - sem banco de dados)
npm test

# Testes E2E (requer banco configurado)
npm run test:e2e

# Com cobertura de código
npm run test:cov

# Modo watch (reexecuta ao salvar)
npm run test:watch
```

### Exemplo de Saída

```bash
Test Suites: 6 passed, 6 total
Tests:       36 passed, 36 total
Snapshots:   0 total
Time:        34.428 s
```

---

## 📝 Scripts Disponíveis

### Desenvolvimento

```bash
npm run start          # Inicia servidor
npm run start:dev      # Inicia com hot reload
npm run start:debug    # Inicia em modo debug
```

### Build e Produção

```bash
npm run build          # Compila TypeScript
npm run start:prod     # Inicia versão de produção
```

### Prisma

```bash
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:studio    # Abre interface visual
npm run prisma:seed      # Popula banco com dados
```

### Testes

```bash
npm test               # Testes unitários
npm run test:e2e       # Testes E2E
npm run test:cov       # Cobertura de código
npm run test:watch     # Modo watch
```

### Qualidade de Código

```bash
npm run format         # Formata código com Prettier
npm run lint           # Executa ESLint
```

---

## 🎯 Regras de Negócio

### Implementadas e Validadas

✅ **RN01**: Um veículo não pode participar de mais de um aluguel ativo simultaneamente  
✅ **RN02**: Um aluguel só pode ser finalizado após o pagamento ser registrado  
✅ **RN03**: Uma reserva cancelada não pode gerar aluguel  
✅ **RN04**: Não é permitido criar reservas com conflito de período para o mesmo veículo  
✅ **RN05**: Validação de unicidade do CPF do cliente  
✅ **RN06**: Validação de unicidade da matrícula do funcionário  
✅ **RN07**: Apenas funcionários ativos podem realizar operações  
✅ **RN08**: Validação de unicidade da placa do veículo  
✅ **RN09**: Controle automático de disponibilidade de veículos  
✅ **RN10**: Cálculo automático do valor total do aluguel baseado na diária e período  
✅ **RN11**: Exatamente um pagamento por aluguel  
✅ **RN12**: Validação de quitação (valor correto) antes da finalização do aluguel  
✅ **RN13**: Soft delete para clientes e funcionários (não remove fisicamente)  
✅ **RN14**: Veículo volta a ficar disponível após finalização do aluguel

### Validações de Entrada

- ✅ CPF com 11 dígitos numéricos
- ✅ Email em formato válido
- ✅ Campos obrigatórios verificados
- ✅ Tipos de dados validados (DTOs com class-validator)
- ✅ Relacionamentos verificados (IDs válidos)

---

## 🔒 Segurança e Boas Práticas

- ✅ Validação de entrada em todos os endpoints
- ✅ Soft delete para dados sensíveis
- ✅ Transações do Prisma para operações críticas
- ✅ Tratamento de erros com exceções personalizadas
- ✅ Logs de operações importantes
- ✅ Separação de responsabilidades (Controller → Service → Repository)
- ✅ DTOs para entrada e saída de dados
- ✅ Variáveis de ambiente para configurações sensíveis

---

## 🔄 Roadmap

### Próximas Funcionalidades

- [ ] Autenticação e autorização com JWT
- [ ] Documentação interativa com Swagger/OpenAPI
- [ ] Frontend em Next.js com TypeScript
- [ ] Sistema de notificações (email/SMS)
- [ ] Relatórios e dashboard analítico
- [ ] Integração com gateway de pagamento
- [ ] Sistema de logs e monitoramento (Winston/Morgan)
- [ ] Rate limiting e proteção contra ataques
- [ ] Cache com Redis
- [ ] Upload de fotos de veículos

### Melhorias Técnicas

- [ ] CI/CD com GitHub Actions
- [ ] Docker e Docker Compose
- [ ] Testes de carga (K6/Artillery)
- [ ] Documentação de arquitetura (C4 Model)
- [ ] Healthcheck endpoints
- [ ] Versionamento de API

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👥 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Padrões de Código

- Siga as convenções do NestJS e TypeScript
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de código acima de 80%
- Use commits semânticos (feat, fix, docs, etc)

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação acima
2. Consulte os testes E2E para exemplos de uso
3. Abra uma issue no repositório
4. Execute `npm run prisma:studio` para visualizar os dados

---

## 🙏 Agradecimentos

Desenvolvido com ❤️ utilizando:

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados avançado
- [TypeScript](https://www.typescriptlang.org/) - JavaScript com superpoderes

---

**LoCar v1.0.0** | **Status**: ✅ Backend Completo e Testado | **Próximo**: Frontend Next.js
