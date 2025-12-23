import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('PagamentosController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let clienteId: string;
  let funcionarioId: string;
  let veiculoId: string;
  let categoriaId: string;
  let reservaId: string;
  let aluguelId: string;
  let pagamentoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Criar dados necessários
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Pagamento Teste',
        cpf: '33333333333' + Math.random().toString().substring(2, 5),
        endereco: 'Rua Teste',
        telefone: '11999999999',
        email: 'cliente.pagamento@teste.com',
      },
    });
    clienteId = cliente.id;

    const funcionario = await prisma.funcionario.create({
      data: {
        nome: 'Funcionário Pagamento',
        matricula: 'FUNC003' + Math.random().toString().substring(2, 5),
        cargo: 'Atendente',
        telefone: '11888888888',
      },
    });
    funcionarioId = funcionario.id;

    const categoria = await prisma.categoria.create({
      data: {
        nome: 'Cat Pagamento Teste' + Math.random().toString().substring(2, 5),
        descricao: 'Categoria teste',
      },
    });
    categoriaId = categoria.id;

    const veiculo = await prisma.veiculo.create({
      data: {
        placa: 'PAG' + Math.random().toString().substring(2, 6),
        marca: 'Volkswagen',
        modelo: 'Gol Pagamento',
        ano: 2023,
        cor: 'Vermelho',
        valorDiaria: 100.0,
        tipo: 'CARRO',
        categoriaId: categoriaId,
        numeroPortas: 2,
        possuiArCondicionado: false,
      },
    });
    veiculoId = veiculo.id;

    // Criar reserva e aluguel
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() + 1);
    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + 3);

    const reserva = await prisma.reserva.create({
      data: {
        dataInicio,
        dataFim,
        clienteId,
        funcionarioId,
        veiculos: {
          create: { veiculoId },
        },
      },
    });
    reservaId = reserva.id;

    const aluguel = await prisma.aluguel.create({
      data: {
        dataInicio: dataInicio,
        valorTotal: 200.0,
        clienteId,
        veiculoId,
        reservaId,
      },
    });
    aluguelId = aluguel.id;
  });

  afterAll(async () => {
    // Limpar dados
    if (pagamentoId) {
      await prisma.pagamento.delete({ where: { id: pagamentoId } }).catch(() => {});
    }
    await prisma.aluguel.delete({ where: { id: aluguelId } }).catch(() => {});
    await prisma.reservaVeiculo.deleteMany({ where: { reservaId } });
    await prisma.reserva.delete({ where: { id: reservaId } }).catch(() => {});
    await prisma.veiculo.delete({ where: { id: veiculoId } }).catch(() => {});
    await prisma.categoria.delete({ where: { id: categoriaId } }).catch(() => {});
    await prisma.funcionario.delete({ where: { id: funcionarioId } }).catch(() => {});
    await prisma.cliente.delete({ where: { id: clienteId } }).catch(() => {});
    await app.close();
  });

  describe('POST /api/pagamentos', () => {
    it('deve criar um pagamento com sucesso', () => {
      return request(app.getHttpServer())
        .post('/api/pagamentos')
        .send({
          aluguelId: aluguelId,
          valor: 200.0,
          tipo: 'PIX',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.aluguelId).toBe(aluguelId);
          expect(response.body.valor).toBe(200.0);
          expect(response.body.tipo).toBe('PIX');
          expect(response.body.dataPagamento).toBeDefined();
          pagamentoId = response.body.id;
        });
    });

    it('deve retornar erro ao tentar criar segundo pagamento para mesmo aluguel', () => {
      return request(app.getHttpServer())
        .post('/api/pagamentos')
        .send({
          aluguelId: aluguelId,
          valor: 100.0,
          tipo: 'DINHEIRO',
        })
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('já possui pagamento');
        });
    });

    it('deve retornar erro ao criar pagamento com valor menor que o total', async () => {
      // Criar nova reserva para segundo aluguel (relação 1:1)
      const novaReserva = await prisma.reserva.create({
        data: {
          dataInicio: new Date(),
          dataFim: new Date(),
          clienteId,
          funcionarioId,
          veiculos: {
            create: { veiculoId },
          },
        },
      });

      // Criar novo aluguel sem pagamento
      const novoAluguel = await prisma.aluguel.create({
        data: {
          dataInicio: new Date(),
          valorTotal: 300.0,
          clienteId,
          veiculoId,
          reservaId: novaReserva.id,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/api/pagamentos')
        .send({
          aluguelId: novoAluguel.id,
          valor: 100.0, // Menor que valorTotal
          tipo: 'DINHEIRO',
        })
        .expect(400);

      expect(response.body.message).toContain('inferior');

      // Limpar
      await prisma.aluguel.delete({ where: { id: novoAluguel.id } });
      await prisma.reservaVeiculo.deleteMany({ where: { reservaId: novaReserva.id } });
      await prisma.reserva.delete({ where: { id: novaReserva.id } });
    });
  });

  describe('GET /api/pagamentos', () => {
    it('deve retornar lista de pagamentos', () => {
      return request(app.getHttpServer())
        .get('/api/pagamentos')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('GET /api/pagamentos/:id', () => {
    it('deve retornar um pagamento específico', () => {
      return request(app.getHttpServer())
        .get(`/api/pagamentos/${pagamentoId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(pagamentoId);
          expect(response.body).toHaveProperty('aluguel');
        });
    });
  });
});
