import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('ClientesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdClienteId: string;

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
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (createdClienteId) {
      await prisma.cliente.delete({ where: { id: createdClienteId } }).catch(() => {});
    }
    await app.close();
  });

  describe('POST /api/clientes', () => {
    it('deve criar um novo cliente com sucesso', () => {
      return request(app.getHttpServer())
        .post('/api/clientes')
        .send({
          nome: 'João Silva Teste',
          cpf: '12345678901',
          endereco: 'Rua Teste, 123',
          telefone: '11987654321',
          email: 'joao.teste@email.com',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.nome).toBe('João Silva Teste');
          expect(response.body.cpf).toBe('12345678901');
          expect(response.body.ativo).toBe(true);
          createdClienteId = response.body.id;
        });
    });

    it('deve retornar erro ao tentar criar cliente com CPF duplicado', () => {
      return request(app.getHttpServer())
        .post('/api/clientes')
        .send({
          nome: 'Maria Silva',
          cpf: '12345678901', // CPF duplicado
          endereco: 'Rua Teste, 456',
          telefone: '11987654322',
          email: 'maria.teste@email.com',
        })
        .expect(409)
        .then((response) => {
          expect(response.body.message).toContain('CPF já cadastrado');
        });
    });

    it('deve retornar erro ao enviar CPF inválido', () => {
      return request(app.getHttpServer())
        .post('/api/clientes')
        .send({
          nome: 'Pedro Santos',
          cpf: '123', // CPF inválido
          endereco: 'Rua Teste, 789',
          telefone: '11987654323',
          email: 'pedro.teste@email.com',
        })
        .expect(400);
    });

    it('deve retornar erro ao enviar email inválido', () => {
      return request(app.getHttpServer())
        .post('/api/clientes')
        .send({
          nome: 'Ana Santos',
          cpf: '98765432100',
          endereco: 'Rua Teste, 101',
          telefone: '11987654324',
          email: 'email-invalido', // Email inválido
        })
        .expect(400);
    });
  });

  describe('GET /api/clientes', () => {
    it('deve retornar lista de clientes', () => {
      return request(app.getHttpServer())
        .get('/api/clientes')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });
  });

  describe('GET /api/clientes/:id', () => {
    it('deve retornar um cliente específico', () => {
      return request(app.getHttpServer())
        .get(`/api/clientes/${createdClienteId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdClienteId);
          expect(response.body.nome).toBe('João Silva Teste');
        });
    });

    it('deve retornar 404 para cliente inexistente', () => {
      return request(app.getHttpServer())
        .get('/api/clientes/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/clientes/:id', () => {
    it('deve atualizar dados do cliente', () => {
      return request(app.getHttpServer())
        .patch(`/api/clientes/${createdClienteId}`)
        .send({
          telefone: '11999999999',
          email: 'joao.atualizado@email.com',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.telefone).toBe('11999999999');
          expect(response.body.email).toBe('joao.atualizado@email.com');
        });
    });
  });

  describe('DELETE /api/clientes/:id', () => {
    it('deve desativar (soft delete) um cliente', () => {
      return request(app.getHttpServer())
        .delete(`/api/clientes/${createdClienteId}`)
        .expect(204);
    });
  });
});
