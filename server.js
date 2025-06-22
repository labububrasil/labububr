// Importa os pacotes necessários que foram instalados pelo package.json
const express = require('express');
const axios = require('axios');

// Inicializa o aplicativo Express, que é a base do nosso servidor
const app = express();

// Adiciona um "middleware" que permite ao servidor entender dados no formato JSON
app.use(express.json());


// --- CONFIGURAÇÕES IMPORTANTES ---
// As chaves secretas são lidas das "Environment Variables" que você configurou no painel da Render.
// Isso é crucial para a segurança, pois mantém suas chaves fora do código.
const ASAAS_API_KEY = process.env.$aact_prod_000MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjBkMDM3YzA4LTU0OWMtNGY3Ny1hYjFmLWZlNzk4N2VkNzk4OTo6JGFhY2hfOGY0MzNlYzctNjlmNi00ZjMyLTk4ZTctYjBiYWNiMTJjNGIw; 
const CUSTOMER_ID = process.env.cus_123544606;

// URL base da API do Asaas. Mantenha esta para transações reais.
const ASAAS_API_URL = 'https://api.asaas.com/api/v3'; 


// --- SERVIR ARQUIVOS ESTÁTICOS ---
// Esta é a correção importante:
// A linha abaixo diz ao servidor que a pasta onde ele está rodando (__dirname)
// também contém os arquivos do site (como o index.html).
// Quando alguém acessar a URL principal, o Express vai automaticamente procurar e enviar o index.html.
app.use(express.static(__dirname));


// --- ROTA PARA GERAR A COBRANÇA PIX ---
// Esta é a URL que o seu site chama quando o cliente clica em "Finalizar Compra"
// O endereço completo será, por exemplo: https://labububr.onrender.com/gerar-pix
app.post('/gerar-pix', async (req, res) => {
    console.log("LOG: Requisição para /gerar-pix recebida.");

    // Verificação de segurança: checa se as chaves foram carregadas corretamente no servidor.
    if (!ASAAS_API_KEY || !CUSTOMER_ID) {
        console.error("ERRO GRAVE: Chave de API (ASAAS_API_KEY) ou ID do Cliente (CUSTOMER_ID) não estão configurados nas Variáveis de Ambiente do Render.");
        return res.status(500).json({ success: false, message: "Erro de configuração interna do servidor." });
    }

    // Objeto com os detalhes da cobrança que serão enviados para a Asaas
    const cobranca = {
        customer: CUSTOMER_ID,
        billingType: "PIX",
        value: 38.84, // Valor total do pedido (produto R$29,90 + frete R$8,94)
        dueDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Define a validade do Pix para 24 horas
        description: "Pedido Toca da Labubu - Boneco Colecionável",
    };

    try {
        // 1. Faz a chamada para a API do Asaas para criar a cobrança
        const chargeResponse = await axios.post(`${ASAAS_API_URL}/payments`, cobranca, {
            headers: {
                'Content-Type': 'application/json',
                'access_token': ASAAS_API_KEY // Usa a chave secreta no cabeçalho
            }
        });

        const paymentId = chargeResponse.data.id;
        console.log(`LOG: Cobrança PIX criada com sucesso no Asaas. ID: ${paymentId}`);

        // 2. Com o ID da cobrança, busca os dados do QR Code correspondente
        const qrCodeResponse = await axios.get(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
            headers: {
                'access_token': ASAAS_API_KEY
            }
        });
        
        console.log("LOG: Dados do QR Code obtidos com sucesso.");

        // 3. Envia a imagem do QR Code e o código "Copia e Cola" de volta para a página do cliente
        return res.status(200).json({
            success: true,
            encodedImage: qrCodeResponse.data.encodedImage, // Imagem em base64
            payload: qrCodeResponse.data.payload // Código "Copia e Cola"
        });

    } catch (error) {
        // Em caso de erro, exibe os detalhes no log do servidor (lá no Render) para depuração
        console.error("ERRO AO COMUNICAR COM A ASAAS:", error.response ? error.response.data : error.message);
        
        // E envia uma resposta de erro genérica para o cliente
        return res.status(500).json({ 
            success: false, 
            message: "Ocorreu um erro ao comunicar com o sistema de pagamento. Tente novamente." 
        });
    }
});


// --- INICIALIZAÇÃO DO SERVIDOR ---
// O Render nos informa em qual "porta" devemos rodar o servidor através da variável de ambiente PORT.
// Se não estiver no Render (rodando localmente), ele usará a porta 3000 como padrão.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    // Esta mensagem aparecerá no log do Render quando o servidor iniciar com sucesso.
    console.log(`Servidor iniciado e ouvindo na porta ${PORT}`);
});