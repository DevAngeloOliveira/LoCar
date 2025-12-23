import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ReservasController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let clienteId: string;
  let funcionarioId: string;
  let veiculoId: string;
  let categoriaId: string;
  let reservaId: string;

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

    // Criar dados necessários para testes
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Reserva Teste',
        cpf: '11111111111',
        endereco: 'Rua Teste',
        telefone: '11999999999',
        email: 'cliente.reserva@teste.com',
      },
    });
    clienteId = cliente.id;

    const funcionario = await prisma.funcionario.create({
      data: {
        nome: 'Funcionário Teste',
        matricula: 'FUNC001',
        cargo: 'Atendente',
        telefone: '11888888888',
      },
    });
    funcionarioId = funcionario.id;

    const categoria = await prisma.categoria.create({
      data: {
        nome: 'Cat Reserva Teste',
        descricao: 'Categoria teste',
      },
    });
    categoriaId = categoria.id;

    const veiculo = await prisma.veiculo.create({
      data: {
        placa: 'RES1234',
        marca: 'Fiat',
        modelo: 'Uno Reserva',
        ano: 2023,
        cor: 'Branco',
        valorDiaria: 120.0,
        tipo: 'CARRO',
        categoriaId: categoriaId,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    });
    veiculoId = veiculo.id;
  });

  afterAll(async () => {
    // Limpar dados
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

  describe('POST /api/reservas', () => {
    it('deve criar uma reserva com sucesso', () => {
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() + 1); // Amanhã
      const dataFim = new Date();
      dataFim.setDate(dataFim.getDate() + 3); // Daqui a 3 dias

      return request(app.getHttpServer())
        .post('/api/reservas')
        .send({
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
          clienteId: clienteId,
          funcionarioId: funcionarioId,
          veiculoIds: [veiculoId],
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.clienteId).toBe(clienteId);
          expect(response.body.funcionarioId).toBe(funcionarioId);
          expect(response.body.cancelada).toBe(false);
          expect(response.body.veiculos).toHaveLength(1);
          reservaId = response.body.id;
        });
    });

    it('deve retornar erro ao criar reserva com data de início no passado', () => {
      const dataPassado = new Date();
      dataPassado.setDate(dataPassado.getDate() - 1);
      const dataFim = new Date();
      dataFim.setDate(dataFim.getDate() + 1);

      return request(app.getHttpServer())
        .post('/api/reservas')
        .send({
          dataInicio: dataPassado.toISOString(),
          dataFim: dataFim.toISOString(),
          clienteId: clienteId,
          funcionarioId: funcionarioId,
          veiculoIds: [veiculoId],
        })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toContain('passado');
        });
    });

    it('deve retornar erro ao criar reserva com data de fim antes do início', () => {
      const dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() + 5);
      const dataFim = new Date();
      dataFim.setDate(dataFim.getDate() + 3);

      return request(app.getHttpServer())
        .post('/api/reservas')
        .send({
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
          clienteId: clienteId,
          funcionarioId: funcionarioId,
          veiculoIds: [veiculoId],
        })
        .expect(400);
    });
  });

  describe('GET /api/reservas', () => {
    it('deve retornar lista de reservas', () => {
      return request(app.getHttpServer())
        .get('/api/reservas')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });
  });

  describe('GET /api/reservas/:id', () => {
    it('deve retornar uma reserva específica', () => {
      return request(app.getHttpServer())
        .get(`/api/reservas/${reservaId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(reservaId);
          expect(response.body).toHaveProperty('cliente');
          expect(response.body).toHaveProperty('funcionario');
        });
    });
  });

  describe('PATCH /api/reservas/:id/cancelar', () => {
    it('deve cancelar uma reserva', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas/${reservaId}/cancelar`)
        .expect(200)
        .then((response) => {
          expect(response.body.cancelada).toBe(true);
        });
    });

    it('deve retornar erro ao tentar cancelar reserva já cancelada', () => {
      return request(app.getHttpServer())
        .patch(`/api/reservas/${reservaId}/cancelar`)
        .expect(400);
    });
  });
});
