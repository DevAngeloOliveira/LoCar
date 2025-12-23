#!/bin/bash
# Script auxiliar para gerenciar o LoCar com Docker

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

show_help() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🚗 LoCar - Script de Gerenciamento Docker${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Uso: ./docker.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo ""
    echo -e "  ${GREEN}start${NC}      - Iniciar todos os containers (produção)"
    echo -e "  ${GREEN}dev${NC}        - Iniciar ambiente de desenvolvimento (apenas PostgreSQL)"
    echo -e "  ${GREEN}stop${NC}       - Parar todos os containers"
    echo -e "  ${GREEN}restart${NC}    - Reiniciar todos os containers"
    echo -e "  ${GREEN}logs${NC}       - Visualizar logs do backend"
    echo -e "  ${GREEN}status${NC}     - Ver status dos containers"
    echo -e "  ${GREEN}build${NC}      - Reconstruir imagem do backend"
    echo -e "  ${GREEN}clean${NC}      - Parar e remover todos os containers e volumes"
    echo -e "  ${GREEN}test${NC}       - Testar API"
    echo -e "  ${GREEN}shell${NC}      - Abrir shell no container backend"
    echo -e "  ${GREEN}db${NC}         - Abrir shell no PostgreSQL"
    echo -e "  ${GREEN}migrate${NC}    - Executar migrations"
    echo -e "  ${GREEN}seed${NC}       - Executar seeders"
    echo -e "  ${GREEN}help${NC}       - Mostrar esta ajuda"
    echo ""
}

case "$1" in
    start)
        echo -e "${GREEN}🚀 Iniciando LoCar (Produção)...${NC}"
        docker-compose up -d
        echo -e "${GREEN}✅ Containers iniciados!${NC}"
        echo -e "${BLUE}📝 API disponível em http://localhost:3000/api${NC}"
        ;;
    
    dev)
        echo -e "${GREEN}🔧 Iniciando ambiente de desenvolvimento...${NC}"
        docker-compose -f docker-compose.dev.yml up -d
        echo -e "${GREEN}✅ PostgreSQL iniciado!${NC}"
        echo -e "${BLUE}📝 Database disponível em localhost:5433${NC}"
        echo -e "${BLUE}🎨 Prisma Studio disponível em http://localhost:5555${NC}"
        ;;
    
    stop)
        echo -e "${YELLOW}⏸  Parando containers...${NC}"
        docker-compose down
        docker-compose -f docker-compose.dev.yml down 2>/dev/null || true
        echo -e "${GREEN}✅ Containers parados!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Reiniciando containers...${NC}"
        docker-compose restart
        echo -e "${GREEN}✅ Containers reiniciados!${NC}"
        ;;
    
    logs)
        echo -e "${BLUE}📋 Logs do backend:${NC}"
        docker-compose logs -f backend
        ;;
    
    status)
        echo -e "${BLUE}📊 Status dos containers:${NC}"
        docker-compose ps
        ;;
    
    build)
        echo -e "${GREEN}🔨 Reconstruindo imagem...${NC}"
        docker-compose build --no-cache backend
        echo -e "${GREEN}✅ Imagem reconstruída!${NC}"
        ;;
    
    clean)
        echo -e "${RED}🧹 Limpando tudo (containers, volumes, redes)...${NC}"
        read -p "Tem certeza? Isso apagará o banco de dados! (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
            echo -e "${GREEN}✅ Limpeza concluída!${NC}"
        else
            echo -e "${YELLOW}⏸  Operação cancelada${NC}"
        fi
        ;;
    
    test)
        echo -e "${BLUE}🧪 Testando API...${NC}"
        echo ""
        echo -e "${GREEN}GET /api/clientes:${NC}"
        curl -s http://localhost:3000/api/clientes | jq . || curl -s http://localhost:3000/api/clientes
        echo ""
        echo ""
        echo -e "${GREEN}GET /api/veiculos:${NC}"
        curl -s http://localhost:3000/api/veiculos | jq . || curl -s http://localhost:3000/api/veiculos
        echo ""
        ;;
    
    shell)
        echo -e "${BLUE}🐚 Abrindo shell no backend...${NC}"
        docker-compose exec backend sh
        ;;
    
    db)
        echo -e "${BLUE}🗄️  Conectando ao PostgreSQL...${NC}"
        docker-compose exec postgres psql -U locar -d locar
        ;;
    
    migrate)
        echo -e "${GREEN}🔄 Executando migrations...${NC}"
        docker-compose exec backend npx prisma migrate deploy
        echo -e "${GREEN}✅ Migrations executadas!${NC}"
        ;;
    
    seed)
        echo -e "${GREEN}🌱 Executando seeders...${NC}"
        docker-compose exec backend npm run prisma:seed
        echo -e "${GREEN}✅ Seeders executados!${NC}"
        ;;
    
    help|--help|-h|"")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Comando desconhecido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
