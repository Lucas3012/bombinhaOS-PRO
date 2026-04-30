#!/bin/bash

# --- Cores para o terminal ---
VERDE='\033[0;32m'
AZUL='\033[0;34m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'

echo -e "${AZUL}=========================================${SEM_COR}"
echo -e "${AZUL}   🚀 BOMBINHA OS-PRO - SYNC & START     ${SEM_COR}"
echo -e "${AZUL}=========================================${SEM_COR}"

# 1. Configurar Remoto (Caso necessário)
if [ ! -d ".git" ]; then
    echo -e "${AMARELO}Iniciando Git...${SEM_COR}"
    git init
    git remote add origin https://github.com/SEU_USUARIO/bombinhaOS-PRO.git
    git branch -M main
fi

# 2. SINCRONIZAÇÃO IMEDIATA (Git Push)
echo -e "${AMARELO}Enviando atualizações para o GitHub agora...${SEM_COR}"
git add .
git commit -m "Sincronização ao iniciar: $(date +'%d/%m/%Y %H:%M:%S')"
git push origin main || git push origin master

if [ $? -eq 0 ]; then
    echo -e "${VERDE}✅ GitHub atualizado com sucesso!${SEM_COR}"
else
    echo -e "${VERMELHO}⚠️ Falha no Push (Verifique se há mudanças para salvar).${SEM_COR}"
fi

echo -e "${AZUL}-----------------------------------------${SEM_COR}"

# 3. Verificar dependências
if [ ! -d "node_modules" ]; then
    echo -e "${AMARELO}Instalando dependências...${SEM_COR}"
    npm install
fi

# 4. Iniciar o Servidor
echo -e "${VERDE}💻 Servidor iniciando em: http://localhost:3000${SEM_COR}"
echo -e "${AMARELO}Pressione CTRL+C para parar o servidor quando terminar.${SEM_COR}"
echo -e "${AZUL}-----------------------------------------${SEM_COR}"

node server.js
