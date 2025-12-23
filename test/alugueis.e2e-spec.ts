import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AlugueisController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let clienteId: string;
  let funcionarioId: string;
  let veiculoId: string;
  let categoriaId: string;
  let reservaId: string;
  let aluguelId: string;

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
        nome: 'Cliente Aluguel Teste',
        cpf: '22222222222' + Math.random().toString().substring(2, 5),
        endereco: 'Rua Teste',
        telefone: '11999999999',
        email: 'cliente.aluguel@teste.com',
      },
    });
    clienteId = cliente.id;

    const funcionario = await prisma.funcionario.create({
      data: {
        nome: 'Funcionário Aluguel Teste',
        matricula: 'FUNC002' + Math.random().toString().substring(2, 5),
        cargo: 'Gerente',
        telefone: '11888888888',
      },
    });
    funcionarioId = funcionario.id;

    const categoria = await prisma.categoria.create({
      data: {
        nome: 'Cat Aluguel Teste' + Math.random().toString().substring(2, 5),
        descricao: 'Categoria teste',
      },
    });
    categoriaId = categoria.id;

    const veiculo = await prisma.veiculo.create({
      data: {
        placa: 'ALU' + Math.random().toString().substring(2, 6),
        marca: 'Chevrolet',
        modelo: 'Onix Aluguel',
        ano: 2023,
        cor: 'Preto',
        valorDiaria: 150.0,
        tipo: 'CARRO',
        categoriaId: categoriaId,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    });
    veiculoId = veiculo.id;

    // Criar reserva válida
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
          create: {
            veiculoId,
          },
        },
      },
    });
    reservaId = reserva.id;
  });

  afterAll(async () => {
    // Limpar dados
    if (aluguelId) {
      await prisma.pagamento.deleteMany({ where: { aluguelId } });
      await prisma.aluguel.delete({ where: { id: aluguelId } }).catch(() => {});
    }
    if (reservaId) {
      await prisma.reservaVeiculo.deleteMany({ where: { reservaId } });
      await prisma.reserva.delete({ where: { id: reservaId } }).catch(() => {});
    }
    await prisma.veiculo.delete({ where: { id: veiculoId } }).catch(() => {});
    await prisma.categoria.delete({ where: { id: categoriaId } }).catch(() => {});
    await prisma.funcionario.delete({ where: { id: funcionarioId } }).catch(() => {});
    await prisma.cliente.delete({ where: { id: clienteId } }).catch(() => {});
    await app.close();
  });

  describe('POST /api/alugueis', () => {
    it('deve criar um aluguel a partir de uma reserva', () => {
      return request(app.getHttpServer())
        .post('/api/alugueis')
        .send({
          reservaId: reservaId,
          veiculoId: veiculoId,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.reservaId).toBe(reservaId);
          expect(response.body.clienteId).toBe(clienteId);
          expect(response.body.veiculoId).toBe(veiculoId);
          expect(response.body.finalizado).toBe(false);
          expect(response.body.valorTotal).toBeGreaterThan(0);
          aluguelId = response.body.id;
        });
    });

    it('deve retornar erro ao tentar criar aluguel de reserva cancelada', async () => {
      // Criar nova reserva
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() + 10);
      const dataFim = new Date();
      dataFim.setDate(dataFim.getDate() + 12);

      const reservaCancelada = await prisma.reserva.create({
        data: {
          dataInicio,
          dataFim,
          clienteId,
          funcionarioId,
          cancelada: true,
          veiculos: {
            create: { veiculoId },
          },
        },
      });

      const response = await request(app.getHttpServer())
        .post('/api/alugueis')
        .send({
          reservaId: reservaCancelada.id,
          veiculoId: veiculoId,
        })
        .expect(400);

      expect(response.body.message).toContain('cancelada');

      // Limpar
      await prisma.reservaVeiculo.deleteMany({ where: { reservaId: reservaCancelada.id } });
      await prisma.reserva.delete({ where: { id: reservaCancelada.id } });
    });
  });

  describe('GET /api/alugueis', () => {
    it('deve retornar lista de aluguéis ativos', () => {
      return request(app.getHttpServer())
        .get('/api/alugueis')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('GET /api/alugueis/:id', () => {
    it('deve retornar um aluguel específico com relacionamentos', () => {
      return request(app.getHttpServer())
        .get(`/api/alugueis/${aluguelId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(aluguelId);
          expect(response.body).toHaveProperty('cliente');
          expect(response.body).toHaveProperty('veiculo');
          expect(response.body).toHaveProperty('reserva');
        });
    });
  });

  describe('PATCH /api/alugueis/:id/finalizar', () => {
    it('deve retornar erro ao tentar finalizar aluguel sem pagamento', () => {
      return request(app.getHttpServer())
        .patch(`/api/alugueis/${aluguelId}/finalizar`)
        .send({
          dataFim: new Date().toISOString(),
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('pagamento');
        });
    });
  });
});
