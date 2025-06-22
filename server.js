// Importa os pacotes necessários
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // <-- ADICIONAMOS ESTA LINHA

// Inicializa o aplicativo Express
const app = express();

// --- Middlewares ---
app.use(cors()); // <-- ADICIONAMOS ESTA LINHA PARA PERMITIR ACESSO DE OUTROS DOMÍNIOS
app.use(express.json());

// --- CONFIGURAÇÕES IMPORTANTES ---
const ASAAS_API_KEY = process.env.$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjBkMDM3YzA4LTU0OWMtNGY3Ny1hYjFmLWZlNzk4N2VkNzk4OTo6JGFhY2hfOGY0MzNlYzctNjlmNi00ZjMyLTk4ZTctYjBiYWNiMTJjNGIw; 
const CUSTOMER_ID = process.env.cus_123544606;
const ASAAS_API_URL = 'https://api.asaas.com/api/v3'; 

// --- SERVIR ARQUIVOS ESTÁTICOS ---
app.use(express.static(__dirname));

// --- ROTA PARA GERAR A COBRANÇA PIX ---
app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    if (!ASAAS_API_KEY || !CUSTOMER_ID) {
        console.error("ERRO GRAVE: Chave de API ou ID do Cliente não configurados.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }

    const cobranca = {
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 38.84,
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        description: "Pedido Toca da Labubu - Boneco Colecionável",
    };

    try {
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY
            }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso no Asaas. ID: ${paymentId}`);

        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: {
                'access_token': ASAAS_API_KEY
            }
        });
        
        console.log("LOG: Dados do QR Code obtidos com sucesso.");

        return res.status(200).json({
            success: true,
            encodedImage: qrCodeResponse.data.encodedImage,
            payload: qrCodeResponse.data.payload
        });

    } catch (error) {
        console.error("ERRO AO COMUNICAR COM A ASAAS:", error.response ? error.response.data : error.message);
        return res.status(500).json({ 
            success: false, 
            message: "Ocorreu um erro ao comunicar com o sistema de pagamento. Tente novamente." 
        });
    }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});