import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...');
  await prisma.pagamento.deleteMany();
  await prisma.aluguel.deleteMany();
  await prisma.reservaVeiculo.deleteMany();
  await prisma.reserva.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.funcionario.deleteMany();
  await prisma.cliente.deleteMany();

  // Criar Clientes
  console.log('👥 Criando clientes...');
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nome: 'João da Silva',
        cpf: '12345678901',
        email: 'joao.silva@email.com',
        telefone: '11987654321',
        endereco: 'Rua das Flores, 123 - São Paulo/SP',
        ativo: true,
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Maria Oliveira',
        cpf: '98765432100',
        email: 'maria.oliveira@email.com',
        telefone: '11976543210',
        endereco: 'Av. Paulista, 1000 - São Paulo/SP',
        ativo: true,
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Pedro Santos',
        cpf: '11122233344',
        email: 'pedro.santos@email.com',
        telefone: '21987654321',
        endereco: 'Rua Atlântica, 500 - Rio de Janeiro/RJ',
        ativo: true,
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Ana Costa',
        cpf: '55566677788',
        email: 'ana.costa@email.com',
        telefone: '11965432100',
        endereco: 'Rua Augusta, 2000 - São Paulo/SP',
        ativo: true,
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Carlos Souza',
        cpf: '99988877766',
        email: 'carlos.souza@email.com',
        telefone: '31987654321',
        endereco: 'Av. Afonso Pena, 800 - Belo Horizonte/MG',
        ativo: true,
      },
    }),
  ]);

  // Criar Funcionários
  console.log('👔 Criando funcionários...');
  const funcionarios = await Promise.all([
    prisma.funcionario.create({
      data: {
        nome: 'Roberto Almeida',
        matricula: 'FUNC001',
        telefone: '11912345678',
        cargo: 'Gerente',
        ativo: true,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Juliana Ferreira',
        matricula: 'FUNC002',
        telefone: '11923456789',
        cargo: 'Atendente',
        ativo: true,
      },
    }),
    prisma.funcionario.create({
      data: {
        nome: 'Marcos Pereira',
        matricula: 'FUNC003',
        telefone: '11934567890',
        cargo: 'Atendente',
        ativo: true,
      },
    }),
  ]);

  // Criar Categorias
  console.log('📋 Criando categorias...');
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nome: 'Econômico',
        descricao: 'Veículos compactos e econômicos, ideais para uso urbano',
      },
    }),
    prisma.categoria.create({
      data: {
        nome: 'Sedan',
        descricao: 'Veículos sedan com conforto e espaço para toda família',
      },
    }),
    prisma.categoria.create({
      data: {
        nome: 'SUV',
        descricao: 'Veículos utilitários esportivos para aventuras',
      },
    }),
    prisma.categoria.create({
      data: {
        nome: 'Motos',
        descricao: 'Motocicletas para locomoção rápida e econômica',
      },
    }),
    prisma.categoria.create({
      data: {
        nome: 'Utilitários',
        descricao: 'Veículos para transporte de carga',
      },
    }),
  ]);

  // Criar Veículos - Carros
  console.log('🚗 Criando carros...');
  const carros = await Promise.all([
    prisma.veiculo.create({
      data: {
        placa: 'ABC1234',
        marca: 'Volkswagen',
        modelo: 'Gol',
        ano: 2022,
        cor: 'Branco',
        valorDiaria: 80.0,
        disponivel: true,
        tipo: 'CARRO',
        categoriaId: categorias[0].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'DEF5678',
        marca: 'Chevrolet',
        modelo: 'Onix',
        ano: 2023,
        cor: 'Prata',
        valorDiaria: 85.0,
        disponivel: true,
        tipo: 'CARRO',
        categoriaId: categorias[0].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'GHI9012',
        marca: 'Toyota',
        modelo: 'Corolla',
        ano: 2023,
        cor: 'Preto',
        valorDiaria: 120.0,
        disponivel: true,
        tipo: 'CARRO',
        categoriaId: categorias[1].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'JKL3456',
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2022,
        cor: 'Cinza',
        valorDiaria: 125.0,
        disponivel: true,
        tipo: 'CARRO',
        categoriaId: categorias[1].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'MNO7890',
        marca: 'Jeep',
        modelo: 'Compass',
        ano: 2023,
        cor: 'Vermelho',
        valorDiaria: 180.0,
        disponivel: true,
        tipo: 'CARRO',
        categoriaId: categorias[2].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'PQR1234',
        marca: 'Hyundai',
        modelo: 'Creta',
        ano: 2022,
        cor: 'Azul',
        valorDiaria: 185.0,
        disponivel: false, // Alugado
        tipo: 'CARRO',
        categoriaId: categorias[2].id,
        numeroPortas: 4,
        possuiArCondicionado: true,
      },
    }),
  ]);

  // Criar Veículos - Motos
  console.log('🏍️  Criando motos...');
  const motos = await Promise.all([
    prisma.veiculo.create({
      data: {
        placa: 'STU5678',
        marca: 'Honda',
        modelo: 'CG 160',
        ano: 2022,
        cor: 'Vermelho',
        valorDiaria: 60.0,
        disponivel: true,
        tipo: 'MOTO',
        categoriaId: categorias[3].id,
        cilindradas: 160,
        bau: false,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'VWX9012',
        marca: 'Yamaha',
        modelo: 'Fazer 250',
        ano: 2023,
        cor: 'Azul',
        valorDiaria: 70.0,
        disponivel: true,
        tipo: 'MOTO',
        categoriaId: categorias[3].id,
        cilindradas: 250,
        bau: true,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'YZA3456',
        marca: 'Honda',
        modelo: 'CB 500',
        ano: 2022,
        cor: 'Preto',
        valorDiaria: 90.0,
        disponivel: true,
        tipo: 'MOTO',
        categoriaId: categorias[3].id,
        cilindradas: 500,
        bau: false,
      },
    }),
  ]);

  // Criar Veículos - Caminhões
  console.log('🚚 Criando caminhões...');
  const caminhoes = await Promise.all([
    prisma.veiculo.create({
      data: {
        placa: 'BCD7890',
        marca: 'Mercedes-Benz',
        modelo: 'Accelo 1016',
        ano: 2021,
        cor: 'Branco',
        valorDiaria: 200.0,
        disponivel: true,
        tipo: 'CAMINHAO',
        categoriaId: categorias[4].id,
        capacidadeCarga: 4500,
      },
    }),
    prisma.veiculo.create({
      data: {
        placa: 'EFG1234',
        marca: 'Volkswagen',
        modelo: 'Delivery 6.160',
        ano: 2022,
        cor: 'Branco',
        valorDiaria: 250.0,
        disponivel: true,
        tipo: 'CAMINHAO',
        categoriaId: categorias[4].id,
        capacidadeCarga: 6000,
      },
    }),
  ]);

  // Criar Reservas
  console.log('📅 Criando reservas...');
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(amanha.getDate() + 1);
  const em3Dias = new Date(hoje);
  em3Dias.setDate(em3Dias.getDate() + 3);
  const em5Dias = new Date(hoje);
  em5Dias.setDate(em5Dias.getDate() + 5);
  const em7Dias = new Date(hoje);
  em7Dias.setDate(em7Dias.getDate() + 7);
  const em10Dias = new Date(hoje);
  em10Dias.setDate(em10Dias.getDate() + 10);

  const reservas = await Promise.all([
    prisma.reserva.create({
      data: {
        clienteId: clientes[0].id,
        funcionarioId: funcionarios[0].id,
        dataReserva: hoje,
        dataInicio: em3Dias,
        dataFim: em5Dias,
        cancelada: false,
        veiculos: {
          create: {
            veiculoId: carros[0].id,
          },
        },
      },
    }),
    prisma.reserva.create({
      data: {
        clienteId: clientes[1].id,
        funcionarioId: funcionarios[1].id,
        dataReserva: hoje,
        dataInicio: amanha,
        dataFim: em7Dias,
        cancelada: false,
        veiculos: {
          create: {
            veiculoId: carros[2].id,
          },
        },
      },
    }),
    prisma.reserva.create({
      data: {
        clienteId: clientes[2].id,
        funcionarioId: funcionarios[2].id,
        dataReserva: hoje,
        dataInicio: em5Dias,
        dataFim: em10Dias,
        cancelada: false,
        veiculos: {
          create: {
            veiculoId: motos[0].id,
          },
        },
      },
    }),
    prisma.reserva.create({
      data: {
        clienteId: clientes[3].id,
        funcionarioId: funcionarios[0].id,
        dataReserva: hoje,
        dataInicio: amanha,
        dataFim: em3Dias,
        cancelada: true,
        veiculos: {
          create: {
            veiculoId: motos[1].id,
          },
        },
      },
    }),
  ]);

  // Criar Aluguéis
  console.log('🚗 Criando aluguéis...');
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const ha3Dias = new Date(hoje);
  ha3Dias.setDate(ha3Dias.getDate() - 3);

  // Reserva para o aluguel ativo
  const reservaAluguelAtivo = await prisma.reserva.create({
    data: {
      clienteId: clientes[4].id,
      funcionarioId: funcionarios[1].id,
      dataReserva: ha3Dias,
      dataInicio: ontem,
      dataFim: em3Dias,
      cancelada: false,
      veiculos: {
        create: {
          veiculoId: carros[5].id,
        },
      },
    },
  });

  const alugueis = await Promise.all([
    prisma.aluguel.create({
      data: {
        reservaId: reservaAluguelAtivo.id,
        clienteId: clientes[4].id,
        veiculoId: carros[5].id,
        dataInicio: ontem,
        dataFim: em3Dias,
        valorTotal: 720.0,
        finalizado: false,
      },
    }),
  ]);

  // Criar reserva para aluguel finalizado
  const reservaAluguelFinalizado = await prisma.reserva.create({
    data: {
      clienteId: clientes[0].id,
      funcionarioId: funcionarios[2].id,
      dataReserva: ha3Dias,
      dataInicio: ha3Dias,
      dataFim: ontem,
      cancelada: false,
      veiculos: {
        create: {
          veiculoId: carros[1].id,
        },
      },
    },
  });

  const aluguelFinalizado = await prisma.aluguel.create({
    data: {
      reservaId: reservaAluguelFinalizado.id,
      clienteId: clientes[0].id,
      veiculoId: carros[1].id,
      dataInicio: ha3Dias,
      dataFim: ontem,
      valorTotal: 360.0,
      finalizado: true,
    },
  });

  // Criar Pagamentos
  console.log('💰 Criando pagamentos...');
  await prisma.pagamento.create({
    data: {
      aluguelId: aluguelFinalizado.id,
      valor: 360.0,
      tipo: 'PIX',
      dataPagamento: ontem,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`   - ${clientes.length} clientes`);
  console.log(`   - ${funcionarios.length} funcionários`);
  console.log(`   - ${categorias.length} categorias`);
  console.log(`   - ${carros.length} carros`);
  console.log(`   - ${motos.length} motos`);
  console.log(`   - ${caminhoes.length} caminhões`);
  console.log(`   - ${reservas.length + 2} reservas`);
  console.log(`   - ${alugueis.length + 1} aluguéis`);
  console.log(`   - 1 pagamento`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
