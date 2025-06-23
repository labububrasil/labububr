<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toca da Labubu - Venda Boneco Labubu Pop Mart</title>
    <style>
        /* --- ESTILOS GERAIS --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');
        html {
            scroll-behavior: smooth;
        }
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            background-color: #f4f7fc;
            color: #333;
        }
        .container {
            max-width: 960px;
            margin: 20px auto;
            padding: 0 20px;
        }

        /* --- CABEÇALHO --- */
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            max-width: 250px;
            height: auto;
        }

        /* --- SEÇÃO PRINCIPAL DO PRODUTO --- */
        .product-section {
            display: flex;
            flex-wrap: wrap;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            overflow: hidden;
            margin-bottom: 30px;
        }
        .image-gallery {
            flex: 1 1 400px;
            padding: 20px;
            box-sizing: border-box;
        }
        .main-image img {
            width: 100%;
            border-radius: 12px;
            border: 1px solid #eee;
            aspect-ratio: 1/1;
            object-fit: cover;
        }
        .thumbnail-images {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            justify-content: center;
        }
        .thumbnail-images img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            cursor: pointer;
            border: 2px solid #ddd;
            transition: all 0.2s ease-in-out;
        }
        .thumbnail-images img:hover, .thumbnail-images img.active {
            border-color: #007bff;
            transform: scale(1.05);
        }
        .product-info {
            flex: 1 1 400px;
            padding: 30px;
            display: flex;
            flex-direction: column;
        }
        .status-tags {
            font-size: 0.9rem;
            color: #555;
            font-weight: 500;
        }
        .bestseller-tag {
            background-color: #fce8d4;
            color: #e67e22;
            padding: 5px 12px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 0.8rem;
            display: inline-block;
            margin-top: 10px;
        }
        .product-info h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 15px 0 10px 0;
            color: #2c3e50;
            line-height: 1.2;
        }
        .price-section .old-price {
            font-size: 1.2rem;
            color: #95a5a6;
            text-decoration: line-through;
        }
        .price-section .current-price {
            font-size: 2.5rem;
            font-weight: 700;
            color: #27ae60;
        }
        .price-section .current-price span {
            font-size: 0.5em;
            vertical-align: super;
        }
        .cta-button {
            background: #3498db;
            color: #fff;
            border: none;
            padding: 18px 25px;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            text-transform: uppercase;
            margin: 25px 0;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(52, 152, 219, 0.6);
        }
        .trust-info {
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .trust-info .info-item {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 15px;
            font-size: 0.9rem;
            color: #555;
        }
        .trust-info .info-item svg {
            width: 24px;
            height: 24px;
            flex-shrink: 0;
        }

        /* --- SEÇÃO DE CARACTERÍSTICAS --- */
        .features-section {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }
        .features-section h2 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #2c3e50;
            font-size: 1.5rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .features-list {
            overflow: hidden;
            border-radius: 8px;
        }
        .feature-row {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            font-size: 0.95rem;
        }
        .feature-row:nth-of-type(odd) {
            background-color: #f8f9fa;
        }
        .feature-row span:first-child {
            font-weight: 600;
            color: #555;
        }
        .feature-row span:last-child {
            color: #333;
        }

        /* --- SEÇÃO DE CHECKOUT --- */
        .checkout-section {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            margin-top: 20px;
        }
        .checkout-section h2 {
            margin-top: 0;
            color: #2c3e50;
            font-size: 1.5rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .form-group {
            margin: 15px 0;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #555;
            font-size: 0.9rem;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            box-sizing: border-box;
        }
        input.readonly {
            background-color: #f0f0f0;
            cursor: not-allowed;
        }

        #cep-status {
            font-size: 0.8em;
            margin-top: 5px;
            height: 1.2em;
        }
        .cep-loading {
            color: #f39c12;
        }
        .cep-error {
            color: #e74c3c;
        }
        .cep-success {
            color: #27ae60;
        }
        
        .shipping-result {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .shipping-option, .total-calculation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }
        .total-calculation {
            font-size: 1.2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-top: 15px;
            border-top: 1px solid #ddd;
            padding-top: 15px;
        }
        .final-checkout-button {
            display: block;
            background: #27ae60;
            color: #fff;
            border: none;
            padding: 18px 25px;
            width: 100%;
            font-size: 1.2rem;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            margin-top: 25px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.4);
        }

        .final-checkout-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(39, 174, 96, 0.6);
        }
        
        .final-checkout-button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
        }

        /* --- ESTILOS DO MODAL PIX --- */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            width: 90%;
            max-width: 400px;
            position: relative;
        }
        .close-button {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            color: #aaa;
        }
        .close-button:hover {
            color: #333;
        }
        #qr-code-container img {
            max-width: 250px;
            margin: 15px auto;
        }
        #pix-copia-cola {
            width: 100%;
            box-sizing: border-box;
            padding: 8px;
            margin-top: 5px;
            font-size: 0.9em;
            resize: none;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        #pix-copia-cola:focus {
            outline: none;
            border-color: #3498db;
        }

        /* --- RODAPÉ --- */
        footer {
            text-align: center;
            padding: 40px 20px;
            margin-top: 30px;
            color: #777;
            font-size: 0.9em;
        }
        
        /* --- RESPONSIVIDADE --- */
        @media (max-width: 768px) {
            .product-section { flex-direction: column; }
            .product-info h1 { font-size: 1.8em; }
            .price-section .current-price { font-size: 2.2em; }
            .container { padding: 0 15px; }
        }
    </style>
</head>
<body>

    <header class="header">
        <img src="https://i.imgur.com/KzX5a9d.png" class="logo" alt="Logo Toca da Labubu">
    </header>

    <div class="container">
        <main class="product-section">
            <div class="image-gallery">
                <div class="main-image">
                    <img id="mainProductImage" src="https://i.imgur.com/L1nE8G0.jpeg" alt="Labubu com caixa">
                </div>
                <div class="thumbnail-images">
                    <img src="https://i.imgur.com/L1nE8G0.jpeg" alt="Labubu com caixa" class="thumbnail active" onclick="changeImage(this)">
                    <img src="https://i.imgur.com/x9n7f0v.jpeg" alt="Labubus na praia" class="thumbnail" onclick="changeImage(this)">
                    <img src="https://i.imgur.com/7gH1M1W.jpeg" alt="Labubus na água" class="thumbnail" onclick="changeImage(this)">
                </div>
            </div>

            <div class="product-info">
                <div class="status-tags">
                    <span>Novo | +500 vendidos</span>
                </div>
                <p><span class="bestseller-tag">MAIS VENDIDO</span> 5º em Figuras de Ação</p>
                <h1>Boneco Colecionável Chaveiro Labubu Pop Mart</h1>
                <div class="price-section">
                    <span class="old-price">R$ 129,90</span>
                    <div class="current-price">R$ 29<span>,90</span></div>
                </div>
                <button class="cta-button" onclick="showCheckout()">Comprar Agora</button>
                <div class="trust-info">
                   <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#27ae60" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        <div><strong>Devolução grátis.</strong> Você tem 30 dias a partir do recebimento.</div>
                   </div>
                   <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3498db" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                        <div><strong>Compra Garantida</strong>, receba o produto que está esperando ou devolvemos o dinheiro.</div>
                   </div>
                </div>
            </div>
        </main>
        
        <section class="features-section">
            <h2>Características principais</h2>
            <div class="features-list">
                <div class="feature-row"><span>Marca</span><span>Pop Mart</span></div>
                <div class="feature-row"><span>Linha</span><span>labubu</span></div>
                <div class="feature-row"><span>Coleção</span><span>Chaveiro</span></div>
                <div class="feature-row"><span>Modelo alfanumérico</span><span>Labubu Have a Seat</span></div>
                <div class="feature-row"><span>Altura</span><span>19,5 cm</span></div>
                <div class="feature-row"><span>Largura</span><span>7 cm</span></div>
                <div class="feature-row"><span>É colecionável</span><span>Sim</span></div>
                <div class="feature-row"><span>Inclui acessórios</span><span>Não</span></div>
                <div class="feature-row"><span>Peso</span><span>89 g</span></div>
            </div>
        </section>

        <section id="checkout-section" class="checkout-section" style="display: none;">
            <h2>Endereço de Entrega</h2>
            <div class="form-group">
                <label for="cep-input">CEP</label>
                <input type="text" id="cep-input" placeholder="00000-000" maxlength="9">
                <div id="cep-status"></div>
            </div>
            
            <div class="form-group">
                <label for="rua-input">Rua</label>
                <input type="text" id="rua-input" class="readonly" readonly>
            </div>

            <div class="form-group">
                <label for="bairro-input">Bairro</label>
                <input type="text" id="bairro-input" class="readonly" readonly>
            </div>
            
            <div class="form-group">
                <label for="cidade-input">Cidade</label>
                <input type="text" id="cidade-input" class="readonly" readonly>
            </div>

            <div class="form-group">
                <label for="estado-input">Estado</label>
                <input type="text" id="estado-input" class="readonly" readonly>
            </div>
            
            <div id="shipping-result" style="display: none;">
                <div class="shipping-option">
                    <span>Entrega Padrão</span>
                    <span>R$ 8,94</span>
                </div>
                <small>Receba em até 2 dias úteis</small>

                <div class="total-calculation">
                    <span>Total</span>
                    <span>R$ 38,84</span>
                </div>

                <button id="final-checkout-button" class="final-checkout-button" onclick="gerarPagamentoPix()">
                    Finalizar Compra e Pagar com Pix
                </button>
            </div>

            <div id="pix-modal" class="modal-overlay" style="display:none;">
                <div class="modal-content">
                    <span class="close-button" onclick="fecharModalPix()">&times;</span>
                    <h2>Pague com Pix para Finalizar</h2>
                    <p>Escaneie o QR Code com o app do seu banco:</p>
                    <div id="qr-code-container">
                        </div>
                    <p>Ou use o Pix Copia e Cola:</p>
                    <textarea id="pix-copia-cola" rows="4" readonly></textarea>
                    <button onclick="copiarTextoPix()">Copiar Código</button>
                    <p id="copy-status" style="color: green; font-weight: bold;"></p>
                </div>
            </div>

        </section>

    </div>

    <footer>
        <p>&copy; 2025 Toca da Labubu. Todos os direitos reservados.</p>
    </footer>

    <script>
        function changeImage(thumbnailElement) {
            document.getElementById('mainProductImage').src = thumbnailElement.src;
            document.querySelectorAll('.thumbnail-images img').forEach(thumb => thumb.classList.remove('active'));
            thumbnailElement.classList.add('active');
        }

        function showCheckout() {
            const checkoutSection = document.getElementById('checkout-section');
            checkoutSection.style.display = 'block';
            const cepInput = document.getElementById('cep-input');
            cepInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            cepInput.focus();
        }
        
        const cepInputField = document.getElementById('cep-input');
        cepInputField.addEventListener('keyup', handleCepInput);

        function handleCepInput(event) {
            let cep = event.target.value.replace(/\D/g, '');
            if (cep.length > 5) {
                cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
            }
            event.target.value = cep;
            if (cep.length === 9) {
                searchCep(cep);
            }
        }
        
        async function searchCep(cep) {
            const cepStatus = document.getElementById('cep-status');
            const shippingResult = document.getElementById('shipping-result');
            const fields = ['rua-input', 'bairro-input', 'cidade-input', 'estado-input'];
            fields.forEach(id => document.getElementById(id).value = '');
            shippingResult.style.display = 'none';
            cepStatus.textContent = 'Buscando...';
            cepStatus.className = 'cep-loading';
            
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
                if (!response.ok) throw new Error('Erro na rede.');
                const data = await response.json();
                if (data.erro) {
                    cepStatus.textContent = 'CEP não encontrado.';
                    cepStatus.className = 'cep-error';
                } else {
                    document.getElementById('rua-input').value = data.logradouro;
                    document.getElementById('bairro-input').value = data.bairro;
                    document.getElementById('cidade-input').value = data.localidade;
                    document.getElementById('estado-input').value = data.uf;
                    cepStatus.textContent = 'Endereço encontrado!';
                    cepStatus.className = 'cep-success';
                    shippingResult.style.display = 'block';
                }
            } catch (error) {
                cepStatus.textContent = 'Erro ao buscar CEP. Tente novamente.';
                cepStatus.className = 'cep-error';
            }
        }
        
        async function gerarPagamentoPix() {
            const button = document.getElementById('final-checkout-button');
            button.textContent = 'Gerando...';
            button.disabled = true;
            
            try {
                const response = await fetch('https://labububr.onrender.com/gerar-pix', { method: 'POST' });
                if (!response.ok) throw new Error('Falha ao gerar cobrança.');
                
                const data = await response.json();
                document.getElementById('qr-code-container').innerHTML = `<img src="data:image/png;base64,${data.encodedImage}" alt="QR Code Pix">`;
                document.getElementById('pix-copia-cola').value = data.payload;
                document.getElementById('pix-modal').style.display = 'flex';

            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao gerar o pagamento. Por favor, tente novamente mais tarde.');
            } finally {
                button.textContent = 'Finalizar Compra e Pagar com Pix';
                button.disabled = false;
            }
        }
        
        function fecharModalPix() {
            document.getElementById('pix-modal').style.display = 'none';
        }

        function copiarTextoPix() {
            const textarea = document.getElementById('pix-copia-cola');
            textarea.select();
            document.execCommand('copy');
            document.getElementById('copy-status').textContent = 'Copiado!';
            setTimeout(() => { document.getElementById('copy-status').textContent = ''; }, 2000);
        }
    </script>
</body>
</html>