const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÕES DE AMBIENTE ---
const ASAAS_API_KEY = process.env.$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjZkMGYxNWNhLTE3OGUtNDZjZC04YWIxLTg2YjQ0N2Q2NmQ5Yjo6JGFhY2hfM2YyZjM4ZmMtY2M0OC00ZjZkLWFkOGYtZmY5MzIwNDY3MGM4;
const MONGODB_URI = process.env.MONGODB_URI; // Variável de ambiente para o banco de dados
const ASAAS_API_URL = 'https://www.asaas.com/api/v3';

// --- CONEXÃO COM O BANCO DE DADOS MONGODB ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log("LOG: Conectado com sucesso ao MongoDB Atlas!"))
  .catch((error) => console.error("ERRO: Falha ao conectar com o MongoDB:", error));

// --- DEFINIÇÃO DO MODELO DE DADOS (SCHEMA) PARA UM PEDIDO ---
// Isso diz ao banco de dados como um pedido deve ser estruturado.
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

// --- SERVIR ARQUIVOS ESTÁTICOS ---
app.use(express.static(__dirname));

// --- ROTA PARA GERAR A COBRANÇA PIX E SALVAR O PEDIDO ---
app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    // Os dados do formulário agora vêm do corpo (body) da requisição
    const dadosDoPedido = req.body;

    // --- ETAPA 1: Salvar o pedido no banco de dados ---
    try {
        const novoPedido = new Pedido(dadosDoPedido);
        await novoPedido.save();
        console.log(`LOG: Pedido de ${dadosDoPedido.nome} salvo no banco de dados com sucesso!`);
    } catch (error) {
        console.error("ERRO: Falha ao salvar o pedido no banco de dados.", error);
        // Mesmo que não salve, podemos tentar gerar a cobrança, mas é bom saber do erro.
    }

    // --- ETAPA 2: Gerar a cobrança no Asaas ---
    if (!ASAAS_API_KEY) {
        console.error("ERRO GRAVE: Chave de API (ASAAS_API_KEY) não está configurada.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }
    
    const cobranca = {
        billingType: "PIX",
        value: 38.84,
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        description: `Pedido de ${dadosDoPedido.nome}`,
        customer: {
            name: dadosDoPedido.nome,
            cpfCnpj: dadosDoPedido.cpf.replace(/\D/g, '') // Envia o CPF sem pontos ou traços
        }
    };

    try {
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY }
        });
        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso no Asaas. ID: ${paymentId}`);
        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: { 'access_token': ASAAS_API_KEY }
        });
        console.log("LOG: QR Code obtido com sucesso.");
        return res.status(200).json({
            success: true,
            encodedImage: qrCodeResponse.data.encodedImage,
            payload: qrCodeResponse.data.payload
        });
    } catch (error) {
        console.error("ERRO AO COMUNICAR COM A ASAAS:", error.response ? error.response.data : error.message);
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
