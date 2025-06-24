// Importa os pacotes necessários
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose'); // Mantenho mongoose caso você ainda use para o painel admin
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Necessário para express-session

// --- CONFIGURAÇÕES ---
const ASAAS_API_KEY = process.env.ASAAS_API_KEY; 
const MONGODB_URI = process.env.MONGODB_URI; // Deixado caso você ainda use o MongoDB para o painel admin
const SESSION_SECRET = process.env.SESSION_SECRET || 'um-segredo-muito-dificil'; // Use uma variável de ambiente para isso!
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'senha123';
const ASAAS_API_URL = 'https://api.asaas.com/v3'; // OU 'https://sandbox.asaas.com/api/v3' para testes.

// SEU CLIENTE ASAAS FIXO PARA GERAÇÃO DO PIX DA LABUBU
// Este é o ID do cliente Asaas que você obteve no painel, usado para todas as cobranças da Labubu.
// Use um CPF/CNPJ válido associado a este cliente no Asaas.
const ASAAS_CUSTOMER_ID_LABUBU = '123702730'; // <--- SUBSTITUA AQUI COM O ID DO CLIENTE FIXO DA LABUBU!
const ASAAS_CUSTOMER_CPFCNPJ_LABUBU = '60922170000155'; // <--- SUBSTITUA AQUI COM O CPF/CNPJ DO CLIENTE FIXO DA LABUBU!

// --- CONFIGURAÇÃO DA SESSÃO DE LOGIN (se você ainda usa o painel admin) ---
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Sessão expira em 1 hora
}));

// --- CONEXÃO COM O BANCO DE DADOS (se você ainda usa o painel admin) ---
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
      .then(() => console.log("LOG: Conectado com sucesso ao MongoDB Atlas!"))
      .catch((error) => console.error("ERRO: Falha ao conectar com o MongoDB:", error));

    // Modelo do Pedido (se ainda usa o painel admin)
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
        valor: Number, // Adicionado campo valor
        statusPagamento: { type: String, default: 'AGUARDANDO' },
        dataPedido: { type: Date, default: Date.now }
    });
    const Pedido = mongoose.model('Pedido', pedidoSchema);

    // Middleware de autenticação (se ainda usa o painel admin)
    function requireLogin(req, res, next) {
        if (req.session.loggedIn) {
            next();
        } else {
            res.redirect('/login.html');
        }
    }

    // Rotas do Painel Admin (se ainda usa o painel admin)
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

    app.get('/admin.html', requireLogin, (req, res) => {
        res.sendFile(path.join(__dirname, 'admin.html'));
    });

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

} else {
    console.warn("AVISO: MONGODB_URI não configurada. Funcionalidades de banco de dados e painel admin podem não estar ativas.");
}


// Serve arquivos estáticos da raiz do projeto (ex: index.php, imagens)
app.use(express.static(__dirname));

// --- ROTA PARA GERAR PIX (Toca da Labubu) ---
app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    if (!ASAAS_API_KEY) {
        console.error("ERRO GRAVE: O servidor não encontrou a ASAAS_API_KEY nas variáveis de ambiente.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }

    // Coleta o valor total enviado pelo frontend
    const valorTotal = req.body.valorTotal;

    if (typeof valorTotal !== 'number' || valorTotal <= 0) {
        console.error(`ERRO: Valor total inválido recebido: ${valorTotal}`);
        return res.status(400).json({ success: false, message: "Valor do pedido inválido." });
    }
    
    const cobranca = {
        billingType: "PIX",
        value: valorTotal, // Usando o valor total dinâmico
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        description: `Pedido Toca da Labubu - ${req.body.nome} (${valorTotal.toFixed(2).replace('.', ',')})`, // Descrição mais detalhada
        customer: ASAAS_CUSTOMER_ID_LABUBU // Usando o ID do cliente fixo
        // Se você quiser que o Asaas use os dados do cliente do frontend, precisaria reativar a lógica de busca/criação de cliente.
        // Mas para simplificar, usaremos o ID fixo.
    };

    try {
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso. ID: ${paymentId}`);

        // Salva o pedido no MongoDB se o MONGODB_URI estiver configurado
        if (MONGODB_URI) {
            try {
                const Pedido = mongoose.model('Pedido'); // Acessa o modelo Pedido
                const novoPedido = new Pedido({
                    ...req.body, // Inclui todos os dados do formulário
                    valor: valorTotal,
                    asaasPaymentId: paymentId // Guarda o ID do pagamento Asaas
                });
                await novoPedido.save();
                console.log(`LOG: Pedido #${novoPedido._id} salvo no MongoDB.`);
            } catch (dbError) {
                console.error("ERRO ao salvar pedido no MongoDB:", dbError);
                // Continua o processo mesmo com erro no DB para não travar o PIX
            }
        }


        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: { 'access_token': ASAAS_API_KEY }
        });
        
        console.log("LOG: Dados do QR Code obtidos com sucesso.");

        return res.status(200).json({
            success: true,
            encodedImage: qrCodeResponse.data.encodedImage,
            payload: qrCodeResponse.data.payload
        });

    } catch (error) {
        console.error("ERRO AO COMUNICAR COM A ASAAS:", error.response ? error.response.data : error.message);
        // Verifica se o erro é o 'pixTransaction: null'
        if (error.response && error.response.data && error.response.data.object === 'payment' && error.response.data.pixTransaction === null) {
             return res.status(500).json({ 
                success: false, 
                message: "O Asaas não retornou o QR Code/Copia e Cola. Verifique a configuração da sua conta Asaas para PIX." 
            });
        }
        return res.status(500).json({ 
            success: false, 
            message: "Ocorreu um erro ao comunicar com o sistema de pagamento." 
        });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});
