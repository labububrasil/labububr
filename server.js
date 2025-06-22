// Importa os pacotes necessários
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// =================================================================
// INÍCIO DO CÓDIGO DE DIAGNÓSTICO (TEMPORÁRIO)
// =================================================================
console.log("--- INICIANDO DIAGNÓSTICO DO SERVIDOR ---");
console.log("Verificando a variável de ambiente ASAAS_API_KEY...");
console.log("Valor recebido pelo Render:", process.env.ASAAS_API_KEY);
console.log("--- FIM DO DIAGNÓSTICO ---");
// =================================================================

app.use(cors());
app.use(express.json());

const ASAAS_API_KEY = process.env.ASAAS_API_KEY; 
const ASAAS_API_URL = 'https://api.asaas.com/api/v3'; 

app.use(express.static(__dirname));

app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    if (!ASAAS_API_KEY) {
        console.error("ERRO GRAVE: O servidor não encontrou a ASAAS_API_KEY nas variáveis de ambiente.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }
    
    const cobranca = {
        billingType: "PIX",
        value: 38.84,
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        description: "Pedido Toca da Labubu - Boneco Colecionável",
        customer: {
            name: "Cliente Site Labubu",
            cpfCnpj: "60922170000155" // IMPORTANTE: Coloque seu CPF/CNPJ aqui
        }
    };

    try {
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: { 'Content-Type': 'application/json', 'access_token': ASAAS_API_KEY }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso. ID: ${paymentId}`);

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
        return res.status(500).json({ 
            success: false, 
            message: "Ocorreu um erro ao comunicar com o sistema de pagamento." 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});
