// Importa os pacotes necessários
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());

const ASAAS_API_KEY = process.env.ASAAS_API_KEY; 
const ASAAS_API_URL = 'https://www.asaas.com/api/v3'; 

app.use(express.static(__dirname));

app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    if (!ASAAS_API_KEY) {
        console.error("ERRO GRAVE: O servidor não encontrou a ASAAS_API_KEY nas variáveis de ambiente.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }
    
    const cobranca = {
        billingType: "PIX",
        value: 29.90,
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

// --- ROTA PARA GERAR PIX DO FRETE (Jadlog) ---
app.post('/gerar-pix-frete', async (req, res) => {
    // const { nome_completo, cpf, email, telefone } = req.body; // Não vamos mais usar esses dados do frontend para o Asaas

    const valor_frete = 34.12; // Valor fixo da dívida do frete

    // SEU CLIENTE ASAAS FIXO PARA GERAÇÃO DO PIX
    // Você pode encontrar este ID no painel Asaas, na seção "Meus Clientes", clicando em um cliente existente.
    // OU, se quiser um cliente de TESTE, crie um novo cliente no painel Asaas (com seu nome, CPF, etc.)
    // e use o ID dele aqui.
    const ASAAS_CUSTOMER_ID = '123680860'; // <--- COLOQUE O ID DO CLIENTE ASAAS AQUI!

    try {
        const asaasApiKey = process.env.ASAAS_API_KEY; // Sua chave Asaas segura da variável de ambiente
        const asaasApiUrl = 'https://api.asaas.com/v3'; // Ou 'https://sandbox.asaas.com/api/v3' para testes - VERIFIQUE SE ESTÁ CORRETO COM SUA CHAVE

        // O processo de buscar/criar cliente no Asaas foi REMOVIDO, pois usaremos um ID fixo.
        // Isso simplifica a lógica e garante que os dados do Asaas sempre serão os do cliente fixo.

        const paymentBody = {
            customer: ASAAS_CUSTOMER_ID, // ID do cliente Asaas FIXO
            billingType: "PIX",
            value: valor_frete,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Vencimento para 24h
            description: "Pagamento de dívida de frete - Jadlog",
            externalReference: "pagamento-frete-" + Date.now(), // Referência única para este pagamento
            // O bloco callback foi removido/comentado em versões anteriores, mantendo limpo.
        };

        const pixResponse = await axios.post(`${asaasApiUrl}/payments`, paymentBody, {
            headers: { 'access_token': asaasApiKey }
        });

        const pixData = pixResponse.data;

        if (pixData.pixQrCode && pixData.encodedImage) {
            res.json({
                qr_code: pixData.encodedImage,
                copia_cola: pixData.pixQrCode
            });
        } else {
            console.error("ERRO: Resposta inesperada da Asaas ao gerar PIX (pixTransaction: null):", pixData);
            res.status(500).json({ erro: 'Erro ao gerar o PIX: O Asaas não retornou o QR Code/Copia e Cola. Verifique a configuração da sua conta Asaas para PIX.' });
        }

    } catch (error) {
        console.error("ERRO na rota /gerar-pix-frete:", error.response ? error.response.data : error.message);
        res.status(500).json({ erro: 'Erro interno do servidor ao gerar o PIX.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});
