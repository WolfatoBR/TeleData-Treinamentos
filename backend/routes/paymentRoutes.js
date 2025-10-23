const express = require('express');
const router = express.Router();
const PagSeguroAPI = require('../services/pagseguro');

const pagseguro = new PagSeguroAPI();

// Criar sessão do PagSeguro
router.get('/session', async (req, res) => {
  try {
    const sessionId = await pagseguro.createSession();
    res.json({ sessionId });
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    res.status(500).json({ 
      error: 'Erro ao criar sessão de pagamento',
      message: error.message 
    });
  }
});

// Criar transação de pagamento
router.post('/checkout', async (req, res) => {
  try {
    console.log('Recebendo dados do checkout:', req.body);
    
    const result = await pagseguro.createTransaction(req.body);
    
    console.log('Transação criada com sucesso:', result);
    
    res.json(result);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ 
      error: 'Erro ao processar pagamento',
      message: error.message 
    });
  }
});

// Consultar transação
router.get('/transaction/:code', async (req, res) => {
  try {
    const transaction = await pagseguro.getTransaction(req.params.code);
    res.json(transaction);
  } catch (error) {
    console.error('Erro ao consultar transação:', error);
    res.status(500).json({ 
      error: 'Erro ao consultar transação',
      message: error.message 
    });
  }
});

// Webhook para notificações do PagSeguro
router.post('/notification', async (req, res) => {
  try {
    const { notificationCode, notificationType } = req.body;
    
    console.log('📬 Notificação recebida do PagSeguro:', {
      code: notificationCode,
      type: notificationType
    });
    
    if (notificationType === 'transaction') {
      const notification = await pagseguro.processNotification(notificationCode);
      
      console.log('📊 Detalhes da transação:', notification);
      
      // Aqui você pode:
      // 1. Salvar no banco de dados
      // 2. Enviar email para o cliente
      // 3. Liberar acesso ao curso
      // 4. Atualizar status do pedido
      
      // Status possíveis:
      // 1 = Aguardando pagamento
      // 2 = Em análise
      // 3 = Paga (LIBERAR ACESSO AQUI)
      // 4 = Disponível
      // 5 = Em disputa
      // 6 = Devolvida
      // 7 = Cancelada
      
      // Exemplo de lógica:
      // if (notification.status === 3 || notification.status === 4) {
      //   // Liberar acesso ao curso
      //   console.log('✅ Pagamento confirmado! Liberando acesso...');
      // }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Erro ao processar notificação:', error);
    res.sendStatus(500);
  }
});

module.exports = router;