#!/bin/bash

# --- Cores ---
VERDE='\033[0;32m'
AZUL='\033[0;34m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'

echo -e "${AZUL}=========================================${SEM_COR}"
echo -e "${AZUL}   🚀 BOMBINHA OS-PRO - AUTO PUSH        ${SEM_COR}"
echo -e "${AZUL}=========================================${SEM_COR}"

# 1. Verifica se há alterações
if [[ -n $(git status -s) ]]; then
    echo -e "${AMARELO}Alterações detectadas. Enviando para o GitHub...${SEM_COR}"
    git add .
    git commit -m "Sincronização automática: $(date +'%d/%m/%Y %H:%M:%S')"
    
    # Tenta o Push
    if git push origin main; then
        echo -e "${VERDE}✅ GitHub atualizado com sucesso!${SEM_COR}"
    else
        echo -e "${VERMELHO}❌ Erro no Push. Verifique a autenticação no navegador.${SEM_COR}"
        echo -e "${AMARELO}DICA: O Git pediu para você logar no navegador? Conclua o login lá.${SEM_COR}"
    fi
else
    echo -e "${VERDE}✨ Tudo atualizado! Nenhuma mudança nova para enviar.${SEM_COR}"
fi

echo -e "${AZUL}-----------------------------------------${SEM_COR}"

# 2. Inicia o Servidor
echo -e "${VERDE}💻 Servidor: http://localhost:3000${SEM_COR}"
node server.js
