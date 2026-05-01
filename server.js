const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(express.json());
app.use(express.static('public'));

let db;

// Conectar ao Banco de Dados SQLite
(async () => {
    db = await open({
        filename: path.join(__dirname, 'data', 'dados.db'),
        driver: sqlite3.Database
    });

    // Criar tabelas iniciais
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            email TEXT UNIQUE,
            password TEXT
        );
        CREATE TABLE IF NOT EXISTS ordens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente TEXT,
            equipamento TEXT,
            status TEXT,
            data TEXT
        );
    `);

    // Criar admin padrão se não existir
    const admin = await db.get('SELECT * FROM usuarios WHERE email = ?', ['admin@teste.com']);
    if (!admin) {
        await db.run('INSERT INTO usuarios (nome, email, password) VALUES (?, ?, ?)', 
        ['Admin Master', 'admin@teste.com', '123']);
    }

    console.log("✅ Banco de Dados SQLite (dados.db) pronto!");
})();

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);

    if (user) {
        res.json({ success: true, user: { nome: user.nome, email: user.email } });
    } else {
        res.status(401).json({ success: false, message: "E-mail ou senha incorretos!" });
    }
});

// Listar Ordens
app.get('/api/os', async (req, res) => {
    const rows = await db.all('SELECT * FROM ordens ORDER BY id DESC');
    res.json(rows);
});

// Criar Ordem
app.post('/api/os', async (req, res) => {
    const { cliente, equipamento, status } = req.body;
    const data = new Date().toLocaleString();
    await db.run('INSERT INTO ordens (cliente, equipamento, status, data) VALUES (?, ?, ?, ?)',
    [cliente, equipamento, status || 'Aberto', data]);
    res.status(201).json({ success: true });
});

app.listen(3000, () => console.log("🚀 Servidor em http://localhost:3000"));
