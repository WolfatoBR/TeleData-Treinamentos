require('dotenv').config();
const axios = require('axios');

class PagSeguroAPI {
  constructor() {
    this.email = process.env.PAGSEGURO_EMAIL;
    this.token = process.env.PAGSEGURO_TOKEN;
    this.env = process.env.PAGSEGURO_ENV || 'sandbox';
    
    // Validar credenciais
    if (!this.email || !this.token) {
      console.error('⚠️ ATENÇÃO: Credenciais do PagSeguro não configuradas no .env');
    }
    
    // URLs base
    this.baseURL = this.env === 'sandbox' 
      ? 'https://ws.sandbox.pagseguro.uol.com.br'
      : 'https://ws.pagseguro.uol.com.br';
      
    this.checkoutURL = this.env === 'sandbox'
      ? 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html'
      : 'https://pagseguro.uol.com.br/v2/checkout/payment.html';
    
    console.log(`🔧 PagSeguro configurado em modo: ${this.env.toUpperCase()}`);
  }

  // Criar sessão de checkout
  async createSession() {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/sessions`,
        null,
        {
          params: {
            email: this.email,
            token: this.token
          }
        }
      );
      
      // Extrair ID da sessão do XML
      const sessionId = response.data.match(/<id>(.*?)<\/id>/)[1];
      console.log('✅ Sessão criada:', sessionId);
      return sessionId;
    } catch (error) {
      console.error('❌ Erro ao criar sessão:', error.response?.data || error.message);
      throw new Error('Erro ao criar sessão do PagSeguro');
    }
  }

  // Criar transação de pagamento
  async createTransaction(data) {
    try {
      const params = new URLSearchParams();
      
      // Credenciais
      params.append('email', this.email);
      params.append('token', this.token);
      
      // Moeda (BRL)
      params.append('currency', 'BRL');
      
      // Referência única da transação
      params.append('reference', data.reference);
      
      // Informações do comprador
      params.append('senderName', data.sender.name);
      params.append('senderEmail', data.sender.email);
      params.append('senderPhone.areaCode', data.sender.phone.areaCode);
      params.append('senderPhone.number', data.sender.phone.number);
      params.append('senderCPF', data.sender.cpf);
      
      // Endereço de entrega/cobrança
      params.append('shippingAddressStreet', data.shipping.street);
      params.append('shippingAddressNumber', data.shipping.number);
      params.append('shippingAddressComplement', data.shipping.complement || '');
      params.append('shippingAddressDistrict', data.shipping.district);
      params.append('shippingAddressPostalCode', data.shipping.postalCode);
      params.append('shippingAddressCity', data.shipping.city);
      params.append('shippingAddressState', data.shipping.state);
      params.append('shippingAddressCountry', 'BRA');
      
      // Produtos/Cursos
      data.items.forEach((item, index) => {
        const i = index + 1;
        params.append(`itemId${i}`, item.id);
        params.append(`itemDescription${i}`, item.description);
        params.append(`itemAmount${i}`, item.amount.toFixed(2));
        params.append(`itemQuantity${i}`, item.quantity);
      });
      
      // URLs de retorno
      params.append('redirectURL', data.redirectURL || 'http://localhost:3001/obrigado');
      params.append('notificationURL', data.notificationURL || 'http://localhost:3001/api/notification');
      
      console.log('📤 Enviando transação para PagSeguro...');
      
      const response = await axios.post(
        `${this.baseURL}/v2/checkout`,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      // Extrair código do checkout do XML
      const code = response.data.match(/<code>(.*?)<\/code>/)[1];
      
      console.log('✅ Transação criada:', code);
      
      return {
        code,
        paymentURL: `${this.checkoutURL}?code=${code}`
      };
    } catch (error) {
      console.error('❌ Erro ao criar transação:', error.response?.data || error.message);
      throw new Error('Erro ao criar transação no PagSeguro');
    }
  }

  // Consultar transação
  async getTransaction(transactionCode) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v3/transactions/${transactionCode}`,
        {
          params: {
            email: this.email,
            token: this.token
          }
        }
      );
      
      console.log('📊 Transação consultada:', transactionCode);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao consultar transação:', error.response?.data || error.message);
      throw new Error('Erro ao consultar transação');
    }
  }

  // Processar notificação de pagamento
  async processNotification(notificationCode) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v3/transactions/notifications/${notificationCode}`,
        {
          params: {
            email: this.email,
            token: this.token
          }
        }
      );
      
      console.log('📬 Notificação processada:', notificationCode);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao processar notificação:', error.response?.data || error.message);
      throw new Error('Erro ao processar notificação');
    }
  }
}

module.exports = PagSeguroAPI;