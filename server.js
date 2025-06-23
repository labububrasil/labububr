const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// --- CONFIGURAÇÕES ---
const ASAAS_API_KEY = process.env.$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjZkMGYxNWNhLTE3OGUtNDZjZC04YWIxLTg2YjQ0N2Q2NmQ5Yjo6JGFhY2hfM2YyZjM4ZmMtY2M0OC00ZjZkLWFkOGYtZmY5MzIwNDY3MGM4;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'um-segredo-muito-dificil'; // Use uma variável de ambiente para isso!
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'senha123';
const ASAAS_API_URL = 'https://www.asaas.com/api/v3';

// --- CONFIGURAÇÃO DA SESSÃO DE LOGIN ---
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Sessão expira em 1 hora
}));

// --- CONEXÃO COM O BANCO DE DADOS ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log("LOG: Conectado com sucesso ao MongoDB Atlas!"))
  .catch((error) => console.error("ERRO: Falha ao conectar com o MongoDB:", error));

// --- MODELO DO PEDIDO ---
const pedidoSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    telefone: String,
    cep: String,
    rua: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
    statusPagamento: { type: String, default: 'AGUARDANDO' },
    dataPedido: { type: Date, default: Date.now }
});
const Pedido = mongoose.model('Pedido', pedidoSchema);

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
// Esta função verifica se o usuário está logado antes de mostrar páginas protegidas
function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next(); // Se estiver logado, continua
    } else {
        res.redirect('/login.html'); // Se não, redireciona para a tela de login
    }
}

// --- ROTAS PÚBLICAS (PÁGINA DE VENDAS) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(__dirname)); // Para servir imagens, css, etc.

// --- ROTAS DO PAINEL ADMIN ---
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        req.session.loggedIn = true;
        res.status(200).send('Login bem-sucedido');
    } else {
        res.status(401).send('Credenciais inválidas');
    }
});

// Rota para a página do painel - protegida pelo middleware `requireLogin`
app.get('/admin.html', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Rota da API para buscar os pedidos - também protegida
app.get('/api/pedidos', requireLogin, async (req, res) => {
    try {
        const pedidos = await Pedido.find().sort({ dataPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).send('Erro ao buscar pedidos');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// --- ROTA PARA GERAR PIX E SALVAR PEDIDO ---
app.post('/gerar-pix', async (req, res) => {
    const dadosDoPedido = req.body;
    try {
        const novoPedido = new Pedido(dadosDoPedido);
        await novoPedido.save();
        console.log(`LOG: Pedido de ${dadosDoPedido.nome} salvo no banco de dados.`);
    } catch (error) {
        console.error("ERRO ao salvar pedido:", error);
    }
    
    // ... (o resto da lógica do Asaas continua aqui) ...
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});