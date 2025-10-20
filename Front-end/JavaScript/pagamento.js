// Inicialização quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', function() {
            setupInputMasks();
            setupPixInteractions();
            setupCardInteractions();
            setupPaymentForm();
            setupBoletoButton();
        });

        // Configurar máscaras de entrada
        function setupInputMasks() {
            if (typeof Cleave !== 'undefined') {
                new Cleave('#cardNumber', {
                    creditCard: true
                });
                
                new Cleave('#expiryDate', {
                    date: true,
                    datePattern: ['m', 'y']
                });
                
                new Cleave('#cvv', {
                    numericOnly: true,
                    blocks: [3]
                });
                
                new Cleave('#cpf', {
                    delimiters: ['.', '.', '-'],
                    blocks: [3, 3, 3, 2],
                    numericOnly: true
                });
            }
        }

        // Configurar interações do PIX
        function setupPixInteractions() {
            const copyPixBtn = document.getElementById('copyPixBtn');
            const pixCode = document.getElementById('pixCode');
            const copyFeedback = document.getElementById('copyFeedback');
            
            if (copyPixBtn && pixCode && copyFeedback) {
                copyPixBtn.addEventListener('click', function() {
                    const textarea = document.createElement('textarea');
                    textarea.value = pixCode.textContent;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                        copyFeedback.classList.add('show');
                        
                        setTimeout(() => {
                            copyFeedback.classList.remove('show');
                        }, 2000);
                    } catch (err) {
                        console.error('Falha ao copiar:', err);
                    }
                    
                    document.body.removeChild(textarea);
                    
                    this.classList.add('animate__animated', 'animate__pulse');
                    setTimeout(() => {
                        this.classList.remove('animate__animated', 'animate__pulse');
                    }, 500);
                });
            }
            
            const pixButton = document.querySelector('.pix-button');
            if (pixButton) {
                pixButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    processPayment('PIX', this);
                });
            }
        }

        // Configurar interações do cartão
        function setupCardInteractions() {
            const installmentsSelect = document.getElementById('installments');
            if (installmentsSelect) {
                installmentsSelect.addEventListener('change', function() {
                    updateInstallmentValue(this.value);
                });
            }
        }

        // Configurar formulário de pagamento
        function setupPaymentForm() {
            const paymentForm = document.getElementById('paymentForm');
            if (paymentForm) {
                paymentForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const button = this.querySelector('.pay-button');
                    processPayment('CARTÃO', button);
                });
            }
        }

        // Configurar botão de boleto
        function setupBoletoButton() {
            const boletoButton = document.querySelector('.boleto-button');
            if (boletoButton) {
                boletoButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    processPayment('BOLETO', this);
                });
            }
        }

        // Processar pagamento
        function processPayment(paymentMethod, button) {
            if (!button) return;
            
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> PROCESSANDO...';
            button.disabled = true;
            
            // Simular processamento
            setTimeout(() => {
                showSuccessModal(paymentMethod);
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        }

        // Mostrar modal de sucesso
        function showSuccessModal(paymentMethod) {
            const successModal = document.getElementById('successModal');
            if (!successModal) return;
            
            // Atualizar parcelas no modal
            const installments = document.getElementById('installments');
            const modalInstallments = document.getElementById('modal-installments');
            if (installments && modalInstallments) {
                modalInstallments.textContent = installments.options[installments.selectedIndex].text.split(' ')[0];
            }
            
            // Mostrar modal
            successModal.classList.add('show');
            
            // Atualizar progresso
            const steps = document.querySelectorAll('.step');
            steps[0].classList.remove('active');
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
            
            // Configurar botão de fechar
            const closeModal = document.getElementById('closeModal');
            if (closeModal) {
                closeModal.onclick = function() {
                    successModal.classList.remove('show');
                    // Redirecionar para área do aluno (ajuste conforme necessário)
                    // window.location.href = '/area-do-aluno';
                };
            }
            
            // Fechar ao clicar fora do modal
            successModal.onclick = function(e) {
                if (e.target === successModal) {
                    successModal.classList.remove('show');
                }
            };
        }

        // Atualizar valor do parcelamento
        function updateInstallmentValue(installments) {
            const basePrice = 89.90;
            let finalPrice = basePrice;
            let discount = 0;
            
            if (installments == 1) {
                discount = basePrice * 0.22; // 22% de desconto à vista (R$ 19,80)
                finalPrice = basePrice - discount;
            } else if (installments <= 6) {
                discount = 0;
                finalPrice = basePrice;
            } else {
                // Calcular juros para 10x e 12x
                const rate = installments == 10 ? 0.0199 : 0.0249;
                finalPrice = basePrice * Math.pow(1 + rate, installments);
            }
            
            // Atualizar interface
            const discountElement = document.getElementById('course-discount');
            const totalElement = document.getElementById('course-total');
            
            if (discountElement) {
                discountElement.textContent = discount > 0 ? `-R$ ${discount.toFixed(2)}` : 'R$ 0,00';
            }
            
            if (totalElement) {
                totalElement.textContent = `R$ ${finalPrice.toFixed(2)}`;
                totalElement.classList.add('animate__animated', 'animate__pulse');
                setTimeout(() => {
                    totalElement.classList.remove('animate__animated', 'animate__pulse');
                }, 1000);
            }
        }

        // Validação básica dos campos
        function validateForm() {
            const cardNumber = document.getElementById('cardNumber').value;
            const cardName = document.getElementById('cardName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cpf = document.getElementById('cpf').value;
            
            if (!cardNumber || !cardName || !expiryDate || !cvv || !cpf) {
                alert('Por favor, preencha todos os campos do cartão.');
                return false;
            }
            
            if (cardNumber.replace(/\s/g, '').length < 13) {
                alert('Número do cartão inválido.');
                return false;
            }
            
            if (cvv.length < 3) {
                alert('CVV inválido.');
                return false;
            }
            
            if (cpf.replace(/\D/g, '').length !== 11) {
                alert('CPF inválido.');
                return false;
            }
            
            return true;
        }