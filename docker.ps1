# Script auxiliar para gerenciar o LoCar com Docker (Windows PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command
)

function Show-Help {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host "🚗 LoCar - Script de Gerenciamento Docker" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Uso: .\docker.ps1 [comando]"
    Write-Host ""
    Write-Host "Comandos disponíveis:"
    Write-Host ""
    Write-Host "  start       - Iniciar todos os containers (produção)" -ForegroundColor Green
    Write-Host "  dev         - Iniciar ambiente de desenvolvimento (apenas PostgreSQL)" -ForegroundColor Green
    Write-Host "  stop        - Parar todos os containers" -ForegroundColor Green
    Write-Host "  restart     - Reiniciar todos os containers" -ForegroundColor Green
    Write-Host "  logs        - Visualizar logs do backend" -ForegroundColor Green
    Write-Host "  status      - Ver status dos containers" -ForegroundColor Green
    Write-Host "  build       - Reconstruir imagem do backend" -ForegroundColor Green
    Write-Host "  clean       - Parar e remover todos os containers e volumes" -ForegroundColor Green
    Write-Host "  test        - Testar API" -ForegroundColor Green
    Write-Host "  shell       - Abrir shell no container backend" -ForegroundColor Green
    Write-Host "  db          - Abrir shell no PostgreSQL" -ForegroundColor Green
    Write-Host "  migrate     - Executar migrations" -ForegroundColor Green
    Write-Host "  seed        - Executar seeders" -ForegroundColor Green
    Write-Host "  help        - Mostrar esta ajuda" -ForegroundColor Green
    Write-Host ""
}

switch ($Command) {
    "start" {
        Write-Host "🚀 Iniciando LoCar (Produção)..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "✅ Containers iniciados!" -ForegroundColor Green
        Write-Host "📝 API disponível em http://localhost:3000/api" -ForegroundColor Blue
    }

    "dev" {
        Write-Host "🔧 Iniciando ambiente de desenvolvimento..." -ForegroundColor Green
        docker-compose -f docker-compose.dev.yml up -d
        Write-Host "✅ PostgreSQL iniciado!" -ForegroundColor Green
        Write-Host "📝 Database disponível em localhost:5433" -ForegroundColor Blue
        Write-Host "🎨 Prisma Studio disponível em http://localhost:5555" -ForegroundColor Blue
    }

    "stop" {
        Write-Host "⏸  Parando containers..." -ForegroundColor Yellow
        docker-compose down
        docker-compose -f docker-compose.dev.yml down 2>$null
        Write-Host "✅ Containers parados!" -ForegroundColor Green
    }

    "restart" {
        Write-Host "🔄 Reiniciando containers..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "✅ Containers reiniciados!" -ForegroundColor Green
    }

    "logs" {
        Write-Host "📋 Logs do backend:" -ForegroundColor Blue
        docker-compose logs -f backend
    }

    "status" {
        Write-Host "📊 Status dos containers:" -ForegroundColor Blue
        docker-compose ps
    }

    "build" {
        Write-Host "🔨 Reconstruindo imagem..." -ForegroundColor Green
        docker-compose build --no-cache backend
        Write-Host "✅ Imagem reconstruída!" -ForegroundColor Green
    }

    "clean" {
        Write-Host "🧹 Limpando tudo (containers, volumes, redes)..." -ForegroundColor Red
        $confirm = Read-Host "Tem certeza? Isso apagará o banco de dados! (y/N)"
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            docker-compose down -v
            docker-compose -f docker-compose.dev.yml down -v 2>$null
            Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
        } else {
            Write-Host "⏸  Operação cancelada" -ForegroundColor Yellow
        }
    }

    "test" {
        Write-Host "🧪 Testando API..." -ForegroundColor Blue
        Write-Host ""
        Write-Host "GET /api/clientes:" -ForegroundColor Green
        Invoke-RestMethod -Uri "http://localhost:3000/api/clientes" -UseBasicParsing | ConvertTo-Json
        Write-Host ""
        Write-Host "GET /api/veiculos:" -ForegroundColor Green
        Invoke-RestMethod -Uri "http://localhost:3000/api/veiculos" -UseBasicParsing | ConvertTo-Json
        Write-Host ""
    }

    "shell" {
        Write-Host "🐚 Abrindo shell no backend..." -ForegroundColor Blue
        docker-compose exec backend sh
    }

    "db" {
        Write-Host "🗄️  Conectando ao PostgreSQL..." -ForegroundColor Blue
        docker-compose exec postgres psql -U locar -d locar
    }

    "migrate" {
        Write-Host "🔄 Executando migrations..." -ForegroundColor Green
        docker-compose exec backend npx prisma migrate deploy
        Write-Host "✅ Migrations executadas!" -ForegroundColor Green
    }

    "seed" {
        Write-Host "🌱 Executando seeders..." -ForegroundColor Green
        docker-compose exec backend npm run prisma:seed
        Write-Host "✅ Seeders executados!" -ForegroundColor Green
    }

    default {
        if ($Command) {
            Write-Host "❌ Comando desconhecido: $Command" -ForegroundColor Red
            Write-Host ""
        }
        Show-Help
    }
}
