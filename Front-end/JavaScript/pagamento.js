// Carrega o menu superior
document.addEventListener('DOMContentLoaded', function() {
    // Carregar menu superior
    fetch('../html/menu_sup.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('.chama-menu').innerHTML = html;
        });

    // Configurar máscaras para os campos do formulário
    setupInputMasks();
    
    // Configurar interações do PIX
    setupPixInteractions();
    
    // Configurar interações do cartão
    setupCardInteractions();
    
    // Configurar formulário de pagamento
    setupPaymentForm();
    
    // Configurar botão de boleto
    setupBoletoButton();
});

function setupInputMasks() {
    // Máscara para número do cartão
    new Cleave('#cardNumber', {
        creditCard: true,
        onCreditCardTypeChanged: function(type) {
            const cardBrand = document.getElementById('card-brand');
            if (type === 'visa') {
                cardBrand.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg';
            } else if (type === 'mastercard') {
                cardBrand.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg';
            } else if (type === 'amex') {
                cardBrand.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/americanexpress/americanexpress-original.svg';
            } else {
                cardBrand.src = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/creditcard/creditcard-original.svg';
            }
        }
    });
    
    // Máscara para data de expiração
    new Cleave('#expiryDate', {
        date: true,
        datePattern: ['m', 'y']
    });
    
    // Máscara para CVV
    new Cleave('#cvv', {
        numericOnly: true,
        blocks: [3]
    });
    
    // Máscara para CPF
    new Cleave('#cpf', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        numericOnly: true
    });
}

function setupPixInteractions() {
    const copyPixBtn = document.getElementById('copyPixBtn');
    const pixCode = document.getElementById('pixCode');
    const copyFeedback = document.getElementById('copyFeedback');
    
    if (!copyPixBtn || !pixCode || !copyFeedback) return;
    
    copyPixBtn.addEventListener('click', function() {
        // Cria um elemento textarea temporário
        const textarea = document.createElement('textarea');
        textarea.value = pixCode.textContent;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            // Executa o comando de cópia
            const successful = document.execCommand('copy');
            if (successful) {
                // Mostra feedback visual
                copyFeedback.classList.add('show');
                
                // Esconde o feedback após 2 segundos
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 2000);
            }
        } catch (err) {
            console.error('Falha ao copiar texto: ', err);
        }
        
        // Remove o textarea temporário
        document.body.removeChild(textarea);
        
        // Animação no botão
        this.classList.add('animate__animated', 'animate__pulse');
        setTimeout(() => {
            this.classList.remove('animate__animated', 'animate__pulse');
        }, 500);
    });
    
    // Configurar botão de pagamento via PIX
    const pixButton = document.querySelector('.pix-button');
    if (pixButton) {
        pixButton.addEventListener('click', function(e) {
            e.preventDefault();
            processPayment('PIX');
        });
    }
}

function setupCardInteractions() {
    // Atualiza o preview do cartão em tempo real
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const expiryDateInput = document.getElementById('expiryDate');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            const previewNumber = this.value || '•••• •••• •••• ••••';
            const previewElement = document.getElementById('preview-card-number');
            if (previewElement) previewElement.textContent = previewNumber;
        });
    }
    
    if (cardNameInput) {
        cardNameInput.addEventListener('input', function() {
            const previewName = this.value.toUpperCase() || 'NOME NO CARTÃO';
            const previewElement = document.getElementById('preview-card-name');
            if (previewElement) previewElement.textContent = previewName;
        });
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function() {
            const previewExpiry = this.value || '••/••';
            const previewElement = document.getElementById('preview-card-expiry');
            if (previewElement) previewElement.textContent = previewExpiry;
        });
    }
    
    // Animação ao selecionar parcelamento
    const installmentsSelect = document.getElementById('installments');
    if (installmentsSelect) {
        installmentsSelect.addEventListener('change', function() {
            const priceElement = document.getElementById('course-total');
            if (!priceElement) return;
            
            // Animação
            priceElement.classList.add('animate__animated', 'animate__pulse');
            setTimeout(() => {
                priceElement.classList.remove('animate__animated', 'animate__pulse');
            }, 1000);
            
            // Aqui você pode adicionar lógica para calcular diferentes valores baseados nas parcelas
            updateInstallmentValue(this.value);
        });
    }
}

function setupPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    if (!paymentForm) return;
    
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        processPayment('CARTÃO');
    });
}

function setupBoletoButton() {
    const boletoButton = document.querySelector('.boleto-button');
    if (boletoButton) {
        boletoButton.addEventListener('click', function(e) {
            e.preventDefault();
            processPayment('BOLETO');
        });
    }
}

function processPayment(paymentMethod) {
    let button;
    
    switch(paymentMethod) {
        case 'PIX':
            button = document.querySelector('.pix-button');
            break;
        case 'BOLETO':
            button = document.querySelector('.boleto-button');
            break;
        case 'CARTÃO':
            button = document.querySelector('.pay-button');
            break;
        default:
            button = null;
    }
    
    if (button) {
        // Mostrar estado de carregamento
        const originalText = button.innerHTML;
        button.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> PROCESSANDO...';
        button.disabled = true;
        
        // Simular processamento do pagamento
        setTimeout(() => {
            showSuccessModal(paymentMethod);
            
            // Restaurar botão (para casos de erro, você pode adicionar lógica adicional)
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }
}

function showSuccessModal(paymentMethod) {
    const successModal = document.getElementById('successModal');
    if (!successModal) return;
    
    // Atualizar informações específicas do método de pagamento no modal
    const paymentMethodElement = document.getElementById('payment-method-info');
    if (paymentMethodElement) {
        paymentMethodElement.textContent = `Método: ${paymentMethod}`;
    }
    
    // Mostrar o modal
    successModal.style.display = 'flex';
    
    // Atualizar a barra de progresso
    document.querySelector(`.step[data-step="2"]`).classList.add('completed');
    document.querySelector(`.step[data-step="3"]`).classList.add('active');
    document.querySelector('.progress-fill').style.width = '100%';
    
    // Configurar botão de fechar
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            successModal.style.display = 'none';
            window.location.href = '../main_area.html';
        });
    }
}

function updateInstallmentValue(installments) {
    // Esta função pode ser implementada para calcular os valores com base nas parcelas
    // Exemplo básico:
    const basePrice = 1297.00;
    let finalPrice = basePrice;
    let discount = 0;
    
    if (installments == 1) {
        discount = basePrice * 0.05; // 5% de desconto à vista
        finalPrice = basePrice - discount;
    } 
    // Adicione outras condições para diferentes parcelamentos
    
    // Atualizar os valores na interface
    document.getElementById('course-discount').textContent = `-R$ ${discount.toFixed(2)}`;
    document.getElementById('course-total').textContent = `R$ ${finalPrice.toFixed(2)}`;
}