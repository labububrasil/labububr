// Importa os pacotes necessários
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Inicializa o aplicativo Express
const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- CONFIGURAÇÕES IMPORTANTES ---
// Agora só precisamos da sua chave de API.
// Ela será lida da "Environment Variable" que você configurou no painel da Render.
const ASAAS_API_KEY = process.env.$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjZkMGYxNWNhLTE3OGUtNDZjZC04YWIxLTg2YjQ0N2Q2NmQ5Yjo6JGFhY2hfM2YyZjM4ZmMtY2M0OC00ZjZkLWFkOGYtZmY5MzIwNDY3MGM4;

// URL base da API do Asaas.
const ASAAS_API_URL = 'https://api.asaas.com/api/v3';

// --- SERVIR ARQUIVOS ESTÁTICOS ---
// Serve o seu index.html
app.use(express.static(__dirname));

// --- ROTA PARA GERAR A COBRANÇA PIX ---
app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    if (!ASAAS_API_KEY) {
        console.error("ERRO GRAVE: Chave de API (ASAAS_API_KEY) não está configurada nas Variáveis de Ambiente do Render.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }

    // Objeto com os detalhes da cobrança
    const cobranca = {
        billingType: "PIX",
        value: 38.84, // Valor total do pedido
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Validade de 24 horas
        description: "Pedido Toca da Labubu - Boneco Colecionável",
        
        // --- NOVA FORMA DE IDENTIFICAR O CLIENTE ---
        // Em vez de um ID, enviamos os dados do cliente.
        // O Asaas vai criar um novo cliente ou usar um existente com este CPF/CNPJ.
        customer: {
            name: "Cliente Site Labubu",
            // IMPORTANTE: Coloque aqui o SEU PRÓPRIO CPF ou CNPJ para identificar as vendas.
            // Remova os pontos, traços e barras. Apenas números.
            cpfCnpj: "60922170000155" 
        }
    };

    try {
        // 1. Cria a cobrança na Asaas
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY
            }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso. ID: ${paymentId}`);

        // 2. Busca o QR Code para essa cobrança
        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: {
                'access_token': ASAAS_API_KEY
            }
        });
        
        console.log("LOG: QR Code obtido com sucesso.");

        // 3. Envia os dados do QR Code de volta para a página do cliente
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