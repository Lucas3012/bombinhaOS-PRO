#!/bin/bash

# --- Cores para um terminal elegante ---
VERDE='\033[0;32m'
AZUL='\033[0;34m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'

echo -e "${AZUL}=========================================${SEM_COR}"
echo -e "${AZUL}   🚀 BOMBINHA OS-PRO - SISTEMA ATIVO    ${SEM_COR}"
echo -e "${AZUL}=========================================${SEM_COR}"

# 1. Verificação de Dependências (Crucial para o SQLite)
if [ ! -d "node_modules" ]; then
    echo -e "${AMARELO}Dependências não encontradas. Instalando...${SEM_COR}"
    npm install express sqlite3 sqlite
    echo -e "${VERDE}✅ Dependências instaladas!${SEM_COR}"
fi

# 2. Sincronização com GitHub (Antes de abrir o servidor)
echo -e "${AMARELO}Sincronizando com GitHub...${SEM_COR}"
git add .
# Só faz o commit se houver mudanças reais (evita erro de commit vazio)
if ! git diff-index --quiet HEAD --; then
    git commit -m "Sincronização automática: $(date +'%d/%m/%Y %H:%M:%S')"
    if git push origin main; then
        echo -e "${VERDE}✅ Código salvo no GitHub com sucesso!${SEM_COR}"
    else
        echo -e "${VERMELHO}❌ Falha no Push. Verifique sua conexão ou Token.${SEM_COR}"
    fi
else
    echo -e "${VERDE}✨ Nenhuma alteração nova para salvar.${SEM_COR}"
fi

echo -e "${AZUL}-----------------------------------------${SEM_COR}"

# 3. Inicialização do Servidor Node.js
echo -e "${VERDE}💻 Servidor rodando em: http://localhost:3000${SEM_COR}"
echo -e "${AMARELO}⚠️  Para fechar o sistema, aperte CTRL+C${SEM_COR}"
echo -e "${AZUL}-----------------------------------------${SEM_COR}"

# Comando que inicia o seu servidor real
node server.js
