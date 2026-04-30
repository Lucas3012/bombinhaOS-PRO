const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para entender JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// --- FUNÇÕES AUXILIARES ---

// Lê os dados do arquivo JSON
const readDB = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // Se o arquivo não existir, retorna uma estrutura básica
        return { usuarios: [], ordens: [] };
    }
};

// Escreve os dados no arquivo JSON
const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// --- ROTAS DA API ---

// 1. Rota de Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();

    const user = db.usuarios.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, redirect: '/dashboard.html' });
    } else {
        res.status(401).json({ success: false, message: 'E-mail ou senha incorretos!' });
    }
});

// 2. Buscar todas as Ordens de Serviço
app.get('/api/os', (req, res) => {
    const db = readDB();
    res.json(db.ordens);
});

// 3. Salvar nova Ordem de Serviço
app.post('/api/os', (req, res) => {
    const db = readDB();
    const novaOS = {
        id: Date.now(), // Gera um ID único baseado no timestamp
        ...req.body
    };

    db.ordens.push(novaOS);
    writeDB(db);

    res.status(201).json(novaOS);
});

// Rota para listar usuários (Painel ADM)
app.get('/api/usuarios', (req, res) => {
    const db = readDB();
    res.json(db.usuarios);
});

// Rota para cadastrar novo usuário/técnico
app.post('/api/usuarios', (req, res) => {
    const db = readDB();
    const novoUsuario = { id: Date.now(), ...req.body };
    db.usuarios.push(novoUsuario);
    writeDB(db);
    res.status(201).json(novoUsuario);
});

// Rota para deletar usuário
app.delete('/api/usuarios/:id', (req, res) => {
    const db = readDB();
    db.usuarios = db.usuarios.filter(u => u.id != req.params.id);
    writeDB(db);
    res.json({ message: "Usuário removido" });
});

// Rota para estatísticas do Dashboard
app.get('/api/stats', (req, res) => {
    const db = readDB();
    const stats = {
        total: db.ordens.length,
        abertas: db.ordens.filter(o => o.status === 'Aberto').length,
        analise: db.ordens.filter(o => o.status === 'Em Análise').length
    };
    res.json(stats);
});

// Rota para atualizar o status de uma OS
app.put('/api/os/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const index = db.ordens.findIndex(o => o.id === id);

    if (index !== -1) {
        db.ordens[index].status = status; // Atualiza apenas o status
        writeDB(db);
        res.json({ success: true, message: "Status atualizado!" });
    } else {
        res.status(404).json({ success: false, message: "OS não encontrada." });
    }
});


// --- INICIALIZAÇÃO DO SERVIDOR ---

app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 SERVIDOR RODANDO COM SUCESSO!
    💻 Acesse: http://localhost:${PORT}
    📂 Banco de Dados: ${DB_PATH}
    =========================================
    `);
});
