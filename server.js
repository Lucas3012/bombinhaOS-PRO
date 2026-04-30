const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware para entender JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static('public'));

const DATA_PATH = path.join(__dirname, 'data', 'db.json');

// --- FUNÇÕES AUXILIARES DE BANCO DE DATA ---

// Garante que o arquivo e a pasta existam
function initDB() {
    const dir = path.join(__dirname, 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    if (!fs.existsSync(DATA_PATH)) {
        const initialData = {
            usuarios: [{ id: 1, nome: "Admin", email: "admin@teste.com", password: "123" }],
            ordens: []
        };
        fs.writeFileSync(DATA_PATH, JSON.stringify(initialData, null, 2));
    }
}

function readDB() {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(data);
}

function writeDB(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// --- ROTAS DE AUTENTICAÇÃO ---

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = readDB();
    const user = db.usuarios.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, user: { nome: user.nome, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: "E-mail ou senha inválidos!" });
    }
});

// --- ROTAS DE ORDENS DE SERVIÇO (OS) ---

// Listar todas as OS
app.get('/api/os', (req, res) => {
    const db = readDB();
    res.json(db.ordens);
});

// Criar nova OS
app.post('/api/os', (req, res) => {
    const db = readDB();
    const novaOS = {
        id: Date.now(),
        ...req.body
    };
    db.ordens.push(novaOS);
    writeDB(db);
    res.status(201).json(novaOS);
});

// ATUALIZAR STATUS (O botão "OK" do histórico usa esta rota)
app.put('/api/os/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const index = db.ordens.findIndex(o => o.id === id);
    if (index !== -1) {
        db.ordens[index].status = status;
        writeDB(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ message: "OS não encontrada" });
    }
});

// Excluir OS
app.delete('/api/os/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    db.ordens = db.ordens.filter(o => o.id !== id);
    writeDB(db);
    res.json({ success: true });
});

// --- ROTAS DE ESTATÍSTICAS (DASHBOARD) ---

app.get('/api/stats', (req, res) => {
    const db = readDB();
    const total = db.ordens.length;
    const abertas = db.ordens.filter(o => o.status !== 'Concluído').length;
    res.json({ total, abertas });
});

// --- ROTAS DE USUÁRIOS (ADMIN) ---

app.get('/api/usuarios', (req, res) => {
    const db = readDB();
    // Retorna usuários sem a senha por segurança
    const lista = db.usuarios.map(({ password, ...u }) => u);
    res.json(lista);
});

app.post('/api/usuarios', (req, res) => {
    const db = readDB();
    const novoUser = { id: Date.now(), ...req.body };
    db.usuarios.push(novoUser);
    writeDB(db);
    res.status(201).json(novoUser);
});

app.delete('/api/usuarios/:id', (req, res) => {
    const db = readDB();
    const id = parseInt(req.params.id);
    if (id === 1) return res.status(403).json({ message: "Não é possível excluir o Admin Master" });
    db.usuarios = db.usuarios.filter(u => u.id !== id);
    writeDB(db);
    res.json({ success: true });
});

// --- INICIALIZAÇÃO ---

initDB();

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
