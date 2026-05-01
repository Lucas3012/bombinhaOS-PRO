#!/bin/bash

# Cores para o terminal
AZUL='\033[0;34m'
VERDE='\033[0;32m'
AMARELO='\033[1;33m'
VERMELHO='\033[0;31m'
SEM_COR='\033[0m'

echo -e "${AZUL}=========================================${SEM_COR}"
echo -e "${AZUL}   🚀 INICIANDO SISTEMA BOMBINHA OS-PRO  ${SEM_COR}"
echo -e "${AZUL}=========================================${SEM_COR}"

# 1. Limpeza de logs antigos
rm -f tunnel.log
touch tunnel.log

# 2. Iniciar o Túnel Cloudflare (Comando Corrigido)
echo -e "${AMARELO}Gerando link dinâmico via Cloudflare...${SEM_COR}"
# Usamos --logfile para garantir que o link seja escrito no arquivo
cloudflared tunnel --url http://localhost:3000 --logfile tunnel.log > /dev/null 2>&1 &
CPID=$!

# 3. Loop para capturar a URL (aguarda até 30 segundos)
echo -n "Procurando URL"
for i in {1..30}; do
    sleep 1
    echo -n "."
    URL=$(grep -o 'https://[-0-9a-z]*\.trycloudflare.com' tunnel.log | head -n 1)
    if [ -n "$URL" ]; then
        break
    fi
done
echo -e "\n"

if [ -z "$URL" ]; then
    echo -e "${VERMELHO}❌ Erro: Não foi possível capturar o link do Cloudflare.${SEM_COR}"
    kill $CPID 2>/dev/null
    exit 1
fi

echo -e "${VERDE}✅ Link Ativo: ${URL}${SEM_COR}"

# 4. Injeção Automática nos arquivos JavaScript
echo -e "${AMARELO}Injetando API_URL nos scripts...${SEM_COR}"
# O comando sed substitui a linha do API_URL nos arquivos js
sed -i "s|const API_URL = \".*\";|const API_URL = \"$URL\";|g" public/js/login.js
sed -i "s|const API_URL = \".*\";|const API_URL = \"$URL\";|g" public/js/main.js

# 5. Deploy Automático para o GitHub Pages
echo -e "${AZUL}Sincronizando com GitHub...${SEM_COR}"
git add .
git commit -m "Update API Link: $URL [$(date +'%H:%M:%S')]"
git push origin main

echo -e "${VERDE}✅ GitHub Pages atualizado!${SEM_COR}"
echo -e "${AZUL}-----------------------------------------${SEM_COR}"

# 6. Iniciar o Servidor Node.js
echo -e "${VERDE}💻 Servidor local rodando em http://localhost:3000${SEM_COR}"
echo -e "${AMARELO}⚠️  Mantenha esta janela aberta para o sistema funcionar.${SEM_COR}"
echo -e "${AMARELO}⚠️  Pressione CTRL+C para encerrar tudo.${SEM_COR}"
echo -e "${AZUL}-----------------------------------------${SEM_COR}"

node server.js

# Ao encerrar o node, finaliza o túnel também
echo -e "\n${AMARELO}Encerrando túnel e limpando...${SEM_COR}"
kill $CPID 2>/dev/null
rm tunnel.log
