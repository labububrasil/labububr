// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// --- CONFIGURAÇÕES IMPORTANTES ---

// 1. SUBSTITUA PELA SUA NOVA CHAVE DE API SECRETA DO ASAAS.
//    NUNCA COMPARTILHE ESSE ARQUIVO COM A CHAVE PREENCHIDA.
const ASAAS_API_KEY = '$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjBkMDM3YzA4LTU0OWMtNGY3Ny1hYjFmLWZlNzk4N2VkNzk4OTo6JGFhY2hfOGY0MzNlYzctNjlmNi00ZjMyLTk4ZTctYjBiYWNiMTJjNGIw';

// 2. SUBSTITUA PELO ID DE UM CLIENTE JÁ CADASTRADO NA SUA CONTA ASAAS.
//    Você pode criar um cliente "Consumidor Final" no painel da Asaas e usar o ID aqui.
//    O ID do cliente começa com "cus_...".
const CUSTOMER_ID = 'cus_123544606';

// 3. MUDE PARA A URL DE PRODUÇÃO QUANDO ESTIVER PRONTO.
//    Sandbox (para testes): https://sandbox.asaas.com/api/v3
//    Produção (real): https://api.asaas.com/api/v3
const ASAAS_API_URL = 'https://api.asaas.com/api/v3'; 


// --- CONFIGURAÇÃO DO SERVIDOR ---

// Serve o arquivo index.html como a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint que a página vai chamar para criar a cobrança PIX
app.post('/gerar-pix', async (req, res) => {
    console.log("Recebida requisição para gerar cobrança PIX...");

    const payload = {
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 38.84, // Valor total (produto + frete)
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Expira em 24h
        description: "Pedido #1 - Boneco Colecionável Labubu Pop Mart",
    };

    try {
        // 1. Cria a cobrança no Asaas
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY
            }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`Cobrança criada com sucesso. ID: ${paymentId}`);

        // 2. Busca o QR Code para essa cobrança recém-criada
        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: {
                'access_token': ASAAS_API_KEY
            }
        });

        console.log("QR Code e payload obtidos com sucesso.");

        // 3. Envia os dados do QR Code de volta para a página do cliente
        res.status(200).json({
            success: true,
            encodedImage: qrCodeResponse.data.encodedImage, // A imagem do QR Code em base64
            payload: qrCodeResponse.data.payload // O código "Copia e Cola"
        });

    } catch (error) {
        console.error("ERRO AO COMUNICAR COM A ASAAS:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            message: "Não foi possível gerar a cobrança PIX. Verifique as chaves e o saldo no servidor." 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});