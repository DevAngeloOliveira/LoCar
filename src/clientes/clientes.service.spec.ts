import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ClientesService', () => {
  let service: ClientesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    cliente: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ClientesService>(ClientesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      const createClienteDto = {
        nome: 'João Silva',
        cpf: '12345678900',
        endereco: 'Rua Teste, 123',
        telefone: '11987654321',
        email: 'joao@email.com',
      };

      const clienteCriado = {
        id: '1',
        ...createClienteDto,
        ativo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.cliente.findUnique.mockResolvedValue(null);
      mockPrismaService.cliente.create.mockResolvedValue(clienteCriado);

      const result = await service.create(createClienteDto);

      expect(mockPrismaService.cliente.findUnique).toHaveBeenCalledWith({
        where: { cpf: createClienteDto.cpf },
      });
      expect(mockPrismaService.cliente.create).toHaveBeenCalledWith({
        data: createClienteDto,
      });
      expect(result).toEqual(clienteCriado);
    });

    it('deve lançar ConflictException se CPF já existe', async () => {
      const createClienteDto = {
        nome: 'João Silva',
        cpf: '12345678900',
        endereco: 'Rua Teste, 123',
        telefone: '11987654321',
        email: 'joao@email.com',
      };

      mockPrismaService.cliente.findUnique.mockResolvedValue({ id: '1', cpf: createClienteDto.cpf });

      await expect(service.create(createClienteDto)).rejects.toThrow(ConflictException);
      expect(mockPrismaService.cliente.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de clientes ativos', async () => {
      const clientes = [
        {
          id: '1',
          nome: 'João Silva',
          cpf: '12345678900',
          ativo: true,
          endereco: 'Rua A',
          telefone: '11111111111',
          email: 'joao@email.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.cliente.findMany.mockResolvedValue(clientes);

      const result = await service.findAll();

      expect(mockPrismaService.cliente.findMany).toHaveBeenCalledWith({
        where: { ativo: true },
        orderBy: { nome: 'asc' },
      });
      expect(result).toEqual(clientes);
    });
  });

  describe('findOne', () => {
    it('deve retornar um cliente por ID', async () => {
      const cliente = {
        id: '1',
        nome: 'João Silva',
        cpf: '12345678900',
        ativo: true,
        endereco: 'Rua A',
        telefone: '11111111111',
        email: 'joao@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        reservas: [],
        alugueis: [],
      };

      mockPrismaService.cliente.findUnique.mockResolvedValue(cliente);

      const result = await service.findOne('1');

      expect(mockPrismaService.cliente.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { reservas: true, alugueis: true },
      });
      expect(result).toEqual(cliente);
    });

    it('deve lançar NotFoundException se cliente não existe', async () => {
      mockPrismaService.cliente.findUnique.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente', async () => {
      const updateDto = {
        telefone: '11999999999',
        email: 'novo@email.com',
      };

      const clienteExistente = {
        id: '1',
        nome: 'João Silva',
        cpf: '12345678900',
        ativo: true,
        endereco: 'Rua A',
        telefone: '11111111111',
        email: 'joao@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        reservas: [],
        alugueis: [],
      };

      const clienteAtualizado = {
        ...clienteExistente,
        ...updateDto,
      };

      mockPrismaService.cliente.findUnique.mockResolvedValue(clienteExistente);
      mockPrismaService.cliente.update.mockResolvedValue(clienteAtualizado);

      const result = await service.update('1', updateDto);

      expect(mockPrismaService.cliente.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
      expect(result).toEqual(clienteAtualizado);
    });
  });

  describe('remove', () => {
    it('deve desativar (soft delete) um cliente', async () => {
      const cliente = {
        id: '1',
        nome: 'João Silva',
        cpf: '12345678900',
        ativo: true,
        endereco: 'Rua A',
        telefone: '11111111111',
        email: 'joao@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        reservas: [],
        alugueis: [],
      };

      const clienteDesativado = { ...cliente, ativo: false };

      mockPrismaService.cliente.findUnique.mockResolvedValue(cliente);
      mockPrismaService.cliente.update.mockResolvedValue(clienteDesativado);

      const result = await service.remove('1');

      expect(mockPrismaService.cliente.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { ativo: false },
      });
      expect(result.ativo).toBe(false);
    });
  });
});
