require('dotenv').config({ path: './Back-end/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Front-end')));

// Configuração PagSeguro
const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL || 'seu-email@sandbox.pagseguro.com.br';
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN || 'seu-token-aqui';
const PAGSEGURO_ENV = process.env.PAGSEGURO_ENV || 'sandbox';

const BASE_URL = PAGSEGURO_ENV === 'sandbox' 
  ? 'https://ws.sandbox.pagseguro.uol.com.br'
  : 'https://ws.pagseguro.uol.com.br';

const CHECKOUT_URL = PAGSEGURO_ENV === 'sandbox'
  ? 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html'
  : 'https://pagseguro.uol.com.br/v2/checkout/payment.html';

// Rota: Página de pagamento
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front-end', 'Pages', 'pagamento.html'));
});

app.get('/pagamento', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front-end', 'Pages', 'pagamento.html'));
});

// API: Criar sessão
app.get('/api/session', async (req, res) => {
  try {
    console.log('📡 Criando sessão no PagSeguro...');
    
    const response = await axios.post(
      `${BASE_URL}/v2/sessions`,
      null,
      {
        params: {
          email: PAGSEGURO_EMAIL,
          token: PAGSEGURO_TOKEN
        }
      }
    );
    
    const sessionId = response.data.match(/<id>(.*?)<\/id>/)[1];
    console.log('✅ Sessão criada:', sessionId);
    
    res.json({ sessionId });
  } catch (error) {
    console.error('❌ Erro ao criar sessão:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erro ao criar sessão',
      message: error.message,
      details: error.response?.data
    });
  }
});

// API: Criar checkout
app.post('/api/checkout', async (req, res) => {
  try {
    console.log('📤 Criando transação...');
    console.log('Dados recebidos:', req.body);
    
    const data = req.body;
    const params = new URLSearchParams();
    
    params.append('email', PAGSEGURO_EMAIL);
    params.append('token', PAGSEGURO_TOKEN);
    params.append('currency', 'BRL');
    params.append('reference', data.reference);
    
    // Comprador
    params.append('senderName', data.sender.name);
    params.append('senderEmail', data.sender.email);
    params.append('senderPhone.areaCode', data.sender.phone.areaCode);
    params.append('senderPhone.number', data.sender.phone.number);
    params.append('senderCPF', data.sender.cpf);
    
    // Endereço
    params.append('shippingAddressStreet', data.shipping.street);
    params.append('shippingAddressNumber', data.shipping.number);
    params.append('shippingAddressComplement', data.shipping.complement || '');
    params.append('shippingAddressDistrict', data.shipping.district);
    params.append('shippingAddressPostalCode', data.shipping.postalCode);
    params.append('shippingAddressCity', data.shipping.city);
    params.append('shippingAddressState', data.shipping.state);
    params.append('shippingAddressCountry', 'BRA');
    
    // Itens
    data.items.forEach((item, index) => {
      const i = index + 1;
      params.append(`itemId${i}`, item.id);
      params.append(`itemDescription${i}`, item.description);
      params.append(`itemAmount${i}`, item.amount.toFixed(2));
      params.append(`itemQuantity${i}`, item.quantity);
    });
    
    params.append('redirectURL', data.redirectURL);
    params.append('notificationURL', data.notificationURL);
    
    const response = await axios.post(
      `${BASE_URL}/v2/checkout`,
      params.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const code = response.data.match(/<code>(.*?)<\/code>/)[1];
    console.log('✅ Checkout criado:', code);
    
    res.json({
      code,
      paymentURL: `${CHECKOUT_URL}?code=${code}`
    });
  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Erro ao criar checkout',
      message: error.message,
      details: error.response?.data
    });
  }
});

// API: Notificações
app.post('/api/notification', (req, res) => {
  console.log('📬 Notificação recebida:', req.body);
  res.sendStatus(200);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 SERVIDOR DE TESTE RODANDO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`📄 Página de pagamento: http://localhost:${PORT}/pagamento`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🔧 Modo: ${PAGSEGURO_ENV.toUpperCase()}`);
  console.log(`📧 Email: ${PAGSEGURO_EMAIL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (!process.env.PAGSEGURO_EMAIL || !process.env.PAGSEGURO_TOKEN) {
    console.log('⚠️  ATENÇÃO: Configure o .env com suas credenciais!');
  }
});