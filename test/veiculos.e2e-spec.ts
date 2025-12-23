import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('VeiculosController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let categoriaId: string;
  let veiculoId: string;

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

    // Criar categoria para testes
    const categoria = await prisma.categoria.create({
      data: {
        nome: 'Teste E2E Veículos',
        descricao: 'Categoria para testes',
      },
    });
    categoriaId = categoria.id;
  });

  afterAll(async () => {
    // Limpar dados de teste
    if (veiculoId) {
      await prisma.veiculo.delete({ where: { id: veiculoId } }).catch(() => {});
    }
    await prisma.categoria.delete({ where: { id: categoriaId } }).catch(() => {});
    await app.close();
  });

  describe('POST /api/veiculos (Carro)', () => {
    it('deve criar um carro com sucesso', () => {
      return request(app.getHttpServer())
        .post('/api/veiculos')
        .send({
          placa: 'TEST123',
          marca: 'Fiat',
          modelo: 'Uno Teste',
          ano: 2023,
          cor: 'Branco',
          valorDiaria: 120.0,
          tipo: 'CARRO',
          categoriaId: categoriaId,
          numeroPortas: 4,
          possuiArCondicionado: true,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.placa).toBe('TEST123');
          expect(response.body.tipo).toBe('CARRO');
          expect(response.body.numeroPortas).toBe(4);
          expect(response.body.possuiArCondicionado).toBe(true);
          expect(response.body.disponivel).toBe(true);
          veiculoId = response.body.id;
        });
    });

    it('deve retornar erro ao criar veículo com placa duplicada', () => {
      return request(app.getHttpServer())
        .post('/api/veiculos')
        .send({
          placa: 'TEST123', // Placa duplicada
          marca: 'Chevrolet',
          modelo: 'Onix',
          ano: 2023,
          cor: 'Preto',
          valorDiaria: 130.0,
          tipo: 'CARRO',
          categoriaId: categoriaId,
          numeroPortas: 4,
          possuiArCondicionado: true,
        })
        .expect(409);
    });
  });

  describe('POST /api/veiculos (Moto)', () => {
    it('deve criar uma moto com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/veiculos')
        .send({
          placa: 'MOTO456',
          marca: 'Honda',
          modelo: 'CG 160 Teste',
          ano: 2023,
          cor: 'Vermelho',
          valorDiaria: 80.0,
          tipo: 'MOTO',
          categoriaId: categoriaId,
          cilindradas: 160,
          bau: true,
        })
        .expect(201);

      expect(response.body.tipo).toBe('MOTO');
      expect(response.body.cilindradas).toBe(160);
      expect(response.body.bau).toBe(true);

      // Limpar
      await prisma.veiculo.delete({ where: { id: response.body.id } });
    });
  });

  describe('POST /api/veiculos (Caminhão)', () => {
    it('deve criar um caminhão com sucesso', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/veiculos')
        .send({
          placa: 'CAM7890',
          marca: 'Mercedes',
          modelo: 'Accelo Teste',
          ano: 2022,
          cor: 'Branco',
          valorDiaria: 350.0,
          tipo: 'CAMINHAO',
          categoriaId: categoriaId,
          capacidadeCarga: 5.5,
        })
        .expect(201);

      expect(response.body.tipo).toBe('CAMINHAO');
      expect(response.body.capacidadeCarga).toBe(5.5);

      // Limpar
      await prisma.veiculo.delete({ where: { id: response.body.id } });
    });
  });

  describe('GET /api/veiculos', () => {
    it('deve retornar lista de veículos', () => {
      return request(app.getHttpServer())
        .get('/api/veiculos')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
        });
    });

    it('deve filtrar veículos por tipo', () => {
      return request(app.getHttpServer())
        .get('/api/veiculos?tipo=CARRO')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          if (response.body.length > 0) {
            expect(response.body[0].tipo).toBe('CARRO');
          }
        });
    });

    it('deve filtrar veículos disponíveis', () => {
      return request(app.getHttpServer())
        .get('/api/veiculos?disponivel=true')
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          if (response.body.length > 0) {
            expect(response.body[0].disponivel).toBe(true);
          }
        });
    });
  });

  describe('GET /api/veiculos/:id', () => {
    it('deve retornar um veículo específico', () => {
      return request(app.getHttpServer())
        .get(`/api/veiculos/${veiculoId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(veiculoId);
          expect(response.body.placa).toBe('TEST123');
        });
    });
  });

  describe('PATCH /api/veiculos/:id', () => {
    it('deve atualizar dados do veículo', () => {
      return request(app.getHttpServer())
        .patch(`/api/veiculos/${veiculoId}`)
        .send({
          valorDiaria: 150.0,
          cor: 'Prata',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.valorDiaria).toBe(150.0);
          expect(response.body.cor).toBe('Prata');
        });
    });
  });
});
