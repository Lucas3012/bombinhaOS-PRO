const express = require('express');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const app = express();
app.use(cors()); // Permite conexões externas via Cloudflare
app.use(express.json());
app.use(express.static('public'));

let db;

// Inicialização do Banco de Dados SQLite
(async () => {
    db = await open({
        filename: path.join(__dirname, 'data', 'dados.db'),
        driver: sqlite3.Database
    });

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
            status TEXT DEFAULT 'Aberto',
            data TEXT
        );
    `);

    // Usuário padrão
    const admin = await db.get('SELECT * FROM usuarios WHERE email = ?', ['admin@teste.com']);
    if (!admin) {
        await db.run('INSERT INTO usuarios (nome, email, password) VALUES (?, ?, ?)', 
        ['Admin', 'admin@teste.com', '123']);
    }
    console.log("✅ Banco SQLite pronto.");
})();

// Rotas de API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
    user ? res.json({ success: true, user }) : res.status(401).json({ message: "Inválido" });
});

app.get('/api/os', async (req, res) => {
    const rows = await db.all('SELECT * FROM ordens ORDER BY id DESC');
    res.json(rows);
});

app.post('/api/os', async (req, res) => {
    const { cliente, equipamento } = req.body;
    const data = new Date().toLocaleString('pt-BR');
    await db.run('INSERT INTO ordens (cliente, equipamento, data) VALUES (?, ?, ?)', [cliente, equipamento, data]);
    res.status(201).json({ success: true });
});

app.listen(3000, () => console.log("🚀 Servidor em http://localhost:3000"));
