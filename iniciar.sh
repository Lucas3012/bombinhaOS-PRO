# --- PARTE DO GIT NO INICIAR.SH ---
echo -e "${AMARELO}Sincronizando com GitHub...${SEM_COR}"

# Verifica se o remote está certo
git remote set-url origin https://github.com/lucas3012/bombinhaOS-PRO.git

if [[ -n $(git status -s) ]]; then
    git add .
    git commit -m "Auto-update: $(date +'%d/%m/%Y %H:%M:%S')"
    
    # O comando abaixo tenta o push e mostra o erro detalhado se falhar
    if git push origin main; then
        echo -e "${VERDE}✅ Sincronizado!${SEM_COR}"
    else
        echo -e "${VERMELHO}❌ Falha no Push.${SEM_COR}"
        echo -e "${AMARELO}Tentando resolver conflitos (Pull)...${SEM_COR}"
        git pull origin main --rebase
        git push origin main
    fi
else
    echo -e "${VERDE}✨ Nada para atualizar no GitHub.${SEM_COR}"
fi
