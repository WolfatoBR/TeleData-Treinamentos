const API_URL = 'http://localhost:3000/api';
        let sessionId = null;
        let paymentReady = false;

        // Inicializar PagSeguro
        async function initPagSeguro() {
            const loading = document.getElementById('loading');
            const errorMsg = document.getElementById('error-message');
            
            loading.style.display = 'block';
            
            try {
                const response = await fetch(`${API_URL}/session`);
                const data = await response.json();
                
                if (data.sessionId) {
                    sessionId = data.sessionId;
                    PagSeguroDirectPayment.setSessionId(sessionId);
                    paymentReady = true;
                    console.log('✅ PagSeguro inicializado com sucesso!');
                } else {
                    throw new Error('Sessão não foi criada');
                }
            } catch (error) {
                console.error('❌ Erro ao inicializar PagSeguro:', error);
                errorMsg.textContent = 'Erro ao conectar com o sistema de pagamento. Tente novamente.';
                errorMsg.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }

        // Formatação automática dos campos
        document.getElementById('card-number')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        document.getElementById('expiry')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 6);
            }
            e.target.value = value;
        });

        document.getElementById('cvv')?.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Formatação CPF
        const cpfInputs = ['buyer-cpf', 'pix-cpf', 'boleto-cpf'];
        cpfInputs.forEach(id => {
            document.getElementById(id)?.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }
                e.target.value = value;
            });
        });

        // Formatação telefone
        document.getElementById('buyer-phone')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });

        // Formatação CEP
        document.getElementById('cep')?.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 8);
            }
            e.target.value = value;
        });

        // Buscar CEP
        document.getElementById('cep')?.addEventListener('blur', async function(e) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        document.getElementById('street').value = data.logradouro;
                        document.getElementById('district').value = data.bairro;
                        document.getElementById('city').value = data.localidade;
                        document.getElementById('state').value = data.uf;
                    }
                } catch (error) {
                    console.error('Erro ao buscar CEP:', error);
                }
            }
        });

        // Troca de abas
        function showTab(tab) {
            const tabs = document.querySelectorAll('.payment-tab');
            const contents = document.querySelectorAll('.tab-content');
            
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.style.display = 'none');
            
            event.target.classList.add('active');
            document.getElementById(tab + '-tab').style.display = 'block';
        }

        // Processar pagamento com cartão
        document.getElementById('payment-form')?.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!paymentReady) {
                alert('Sistema de pagamento ainda não está pronto. Aguarde...');
                return;
            }

            const submitBtn = document.getElementById('submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processando pagamento...';

            try {
                const phone = document.getElementById('buyer-phone').value.replace(/\D/g, '');
                const expiry = document.getElementById('expiry').value.split('/');
                
                const data = {
                    reference: 'UDEMY_' + Date.now(),
                    sender: {
                        name: document.getElementById('buyer-name').value,
                        email: document.getElementById('buyer-email').value,
                        cpf: document.getElementById('buyer-cpf').value.replace(/\D/g, ''),
                        phone: {
                            areaCode: phone.substring(0, 2),
                            number: phone.substring(2)
                        }
                    },
                    shipping: {
                        street: document.getElementById('street').value,
                        number: document.getElementById('number').value,
                        complement: document.getElementById('complement').value || '',
                        district: document.getElementById('district').value,
                        postalCode: document.getElementById('cep').value.replace(/\D/g, ''),
                        city: document.getElementById('city').value,
                        state: document.getElementById('state').value.toUpperCase()
                    },
                    items: [{
                        id: '001',
                        description: 'Curso de Desenvolvimento Web Completo 2024',
                        amount: 29.90,
                        quantity: 1
                    }],
                    redirectURL: window.location.origin + '/obrigado',
                    notificationURL: API_URL + '/notification'
                };

                const response = await fetch(`${API_URL}/checkout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.paymentURL) {
                    alert('✅ Pagamento criado! Você será redirecionado para finalizar.');
                    window.location.href = result.paymentURL;
                } else {
                    throw new Error('URL de pagamento não foi gerada');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('❌ Erro ao processar pagamento. Tente novamente.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Concluir pagamento - R$ 29,90';
            }
        });

        // Aplicar cupom
        function applyPromo() {
            const promoCode = document.getElementById('promo').value;
            if (promoCode.toLowerCase() === 'udemy10') {
                alert('✅ Código promocional aplicado! Desconto adicional de 10%');
            } else {
                alert('❌ Código promocional inválido');
            }
        }

        // Inicializar ao carregar
        window.addEventListener('load', initPagSeguro);