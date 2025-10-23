// Conteúdo das páginas
const conteudos = {
    informacoes: `
    <section class="info-section">
      <h2>Minhas Informações</h2>
      <p>Gerencie suas informações pessoais e preferências de conta.</p>
      
      <form id="info-form">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" placeholder="Seu nome completo" value="">
        </div>
        
        <div class="form-group">
          <label>Email</label>
          <input type="email" placeholder="seu@email.com" value="">
        </div>
        
        <div class="form-group double">
          <div>
            <label>Telefone 1</label>
            <input type="tel" placeholder="(11) 99999-9999" value="">
          </div>
          <div>
            <label>Telefone 2</label>
            <input type="tel" placeholder="(11) 99999-9999">
          </div>
        </div>
        
        <div class="form-group">
          <label>Biografia</label>
          <textarea rows="4" placeholder="Escreva sua biografia aqui..."></textarea>
        </div>
        
        <div class="form-group double">
          <div>
            <label>Data de Nascimento</label>
            <input type="date" value="">
          </div>
          <div>
            <label>CEP</label>
            <input type="text" placeholder="00000-000" value="">
          </div>
        </div>
        
        <div class="form-group double">
          <div>
            <label>Número</label>
            <input type="text" placeholder="123" value="">
          </div>
          <div>
            <label>Logradouro</label>
            <input type="text" placeholder="Rua, Avenida, etc." value="">
          </div>
        </div>
        
        <div class="form-group double">
          <div>
            <label>Cidade</label>
            <input type="text" placeholder="Sua cidade" value="">
          </div>
          <div>
            <label>País</label>
            <input type="text" placeholder="Seu país" value="">
          </div>
        </div>
        
        <button type="submit" class="save-btn">Salvar Alterações</button>
      </form>
    </section>

    <section class="study-section">
      <div class="study-header">
        <h2>Continue estudando...</h2>
        <div class="search-courses">
          <input type="text" placeholder="Pesquisar meu curso" id="search-my-courses">
        </div>
      </div>
      
      <div class="courses-carousel-container">
        <button class="course-arrow course-arrow-left" onclick="scrollCarousel(this, -1)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        <div class="courses-carousel">
          <!-- Cards dos cursos -->
          <div class="course-card">
            <div class="course-image">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="N8N Para Iniciantes">
              <div class="course-badge">Em Andamento</div>
            </div>
            <div class="course-content">
              <h3 class="course-title">N8N Para Iniciantes</h3>
              <p class="course-instructor">Instrutor(a): João Silva</p>
              <div class="course-rating">
                <div class="rating-stars">★★★★★</div>
                <div class="rating-details">
                  <span class="rating-value">4.8</span>
                  <span class="rating-count">(4,934 avaliações)</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="course-progress-bar" style="width: 75%"></div>
              </div>
              <div class="course-price-container">
                <span class="course-duration">⏱️ 12 horas</span>
                <button class="play-button">▶</button>
              </div>
            </div>
          </div>

          <div class="course-card">
            <div class="course-image">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="N8N Para Iniciantes">
              <div class="course-badge">Em Andamento</div>
            </div>
            <div class="course-content">
              <h3 class="course-title">N8N Para Iniciantes</h3>
              <p class="course-instructor">Instrutor(a): João Silva</p>
              <div class="course-rating">
                <div class="rating-stars">★★★★★</div>
                <div class="rating-details">
                  <span class="rating-value">4.8</span>
                  <span class="rating-count">(4,934 avaliações)</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="course-progress-bar" style="width: 45%"></div>
              </div>
              <div class="course-price-container">
                <span class="course-duration">⏱️ 12 horas</span>
                <button class="play-button">▶</button>
              </div>
            </div>
          </div>

          <div class="course-card">
            <div class="course-image">
              <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop" alt="Automação com N8N">
              <div class="course-badge">Novo!</div>
            </div>
            <div class="course-content">
              <h3 class="course-title">Automação com N8N</h3>
              <p class="course-instructor">Instrutor(a): Pedro Almeida</p>
              <div class="course-rating">
                <div class="rating-stars">★★★★★</div>
                <div class="rating-details">
                  <span class="rating-value">4.9</span>
                  <span class="rating-count">(2,105 avaliações)</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="course-progress-bar" style="width: 25%"></div>
              </div>
              <div class="course-price-container">
                <span class="course-duration">⏱️ 8 horas</span>
                <button class="play-button">▶</button>
              </div>
            </div>
          </div>

          <div class="course-card">
            <div class="course-image">
              <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop" alt="APIs e Integrações">
              <div class="course-badge">Popular!</div>
            </div>
            <div class="course-content">
              <h3 class="course-title">APIs e Integrações</h3>
              <p class="course-instructor">Instrutor(a): Maria Santos</p>
              <div class="course-rating">
                <div class="rating-stars">★★★★☆</div>
                <div class="rating-details">
                  <span class="rating-value">4.5</span>
                  <span class="rating-count">(987 avaliações)</span>
                </div>
              </div>
              <div class="course-progress">
                <div class="course-progress-bar" style="width: 60%"></div>
              </div>
              <div class="course-price-container">
                <span class="course-duration">⏱️ 10 horas</span>
                <button class="play-button">▶</button>
              </div>
            </div>
          </div>
        </div>
        
        <button class="course-arrow course-arrow-right" onclick="scrollCarousel(this, 1)">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="#" class="view-all">Ver todos os cursos</a>
      </div>
    </section>
  `,
  
  cursos: `
    <section class="courses-page">
      <div class="courses-header">
        <h1>Visualizar Cursos</h1>
        <div class="courses-actions">
          <div class="courses-filter">
            <select id="course-filter">
              <option>Todos os cursos</option>
              <option>Em andamento</option>
              <option>Concluídos</option>
              <option>Favoritos</option>
            </select>
          </div>
          <div class="courses-search">
            <input type="text" placeholder="Buscar cursos..." id="course-search">
          </div>
        </div>
      </div>

      <!-- Cursos em Destaque -->
      <div class="featured-courses">
        <div class="section-header">
          <h2>Cursos em Destaque</h2>
          <a href="#" class="view-all">Ver todos</a>
        </div>
        
        <div class="courses-carousel-container">
          <button class="course-arrow course-arrow-left" onclick="scrollCarousel(this, -1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div class="courses-carousel">
            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop" alt="N8N Para Iniciantes">
                <div class="course-badge">Mais Vendido!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">Curso Completo de Desenvolvimento Web</h3>
                <p class="course-instructor">Instrutor(a): João Silva</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★★</div>
                  <div class="rating-details">
                    <span class="rating-value">4.8</span>
                    <span class="rating-count">(4,934 avaliações)</span>
                  </div>
                </div>
                <div class="course-progress">
                  <div class="course-progress-bar" style="width: 75%"></div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 199,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>

            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=200&fit=crop" alt="APIs Avançadas">
                <div class="course-badge">Novo!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">APIs Avançadas</h3>
                <p class="course-instructor">Instrutor(a): Pedro Almeida</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★★</div>
                  <div class="rating-details">
                    <span class="rating-value">4.9</span>
                    <span class="rating-count">(2,105 avaliações)</span>
                  </div>
                </div>
                <div class="course-progress">
                  <div class="course-progress-bar" style="width: 45%"></div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 249,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>

            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop" alt="Web Development">
                <div class="course-badge">Popular!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">Web Development</h3>
                <p class="course-instructor">Instrutor(a): Maria Santos</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★☆</div>
                  <div class="rating-details">
                    <span class="rating-value">4.5</span>
                    <span class="rating-count">(987 avaliações)</span>
                  </div>
                </div>
                <div class="course-progress">
                  <div class="course-progress-bar" style="width: 25%"></div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 179,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>
          </div>
          <button class="course-arrow course-arrow-right" onclick="scrollCarousel(this, 1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Cursos Recomendados -->
      <div class="recommended-courses">
        <div class="section-header">
          <h2>Recomendados para Você</h2>
          <a href="#" class="view-all">Ver todos</a>
        </div>
        
        <div class="courses-carousel-container">
          <button class="course-arrow course-arrow-left" onclick="scrollCarousel(this, -1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          <div class="courses-carousel">
            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop" alt="Data Science">
                <div class="course-badge">Em Alta!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">Data Science Fundamentals</h3>
                <p class="course-instructor">Instrutor(a): Dr. Carlos Silva</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★★</div>
                  <div class="rating-details">
                    <span class="rating-value">4.8</span>
                    <span class="rating-count">(2.3k avaliações)</span>
                  </div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 299,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>

            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop" alt="Machine Learning">
                <div class="course-badge">Novo!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">Machine Learning Básico</h3>
                <p class="course-instructor">Instrutor(a): Prof. Ana Santos</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★☆</div>
                  <div class="rating-details">
                    <span class="rating-value">4.6</span>
                    <span class="rating-count">(1.8k avaliações)</span>
                  </div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 349,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>

            <div class="course-card">
              <div class="course-image">
                <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=200&fit=crop" alt="Web Development">
                <div class="course-badge">Popular!</div>
              </div>
              <div class="course-content">
                <h3 class="course-title">Full Stack Development</h3>
                <p class="course-instructor">Instrutor(a): Roberto Lima</p>
                <div class="course-rating">
                  <div class="rating-stars">★★★★★</div>
                  <div class="rating-details">
                    <span class="rating-value">4.9</span>
                    <span class="rating-count">(3.2k avaliações)</span>
                  </div>
                </div>
                <div class="course-price-container">
                  <p class="course-price">R$ 399,90</p>
                  <button class="play-button">▶</button>
                </div>
              </div>
            </div>
          </div>
          <button class="course-arrow course-arrow-right" onclick="scrollCarousel(this, 1)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  `,
  
  seguranca: `
    <section class="info-section">
      <h2>Segurança da Conta</h2>
      <p>Edite suas configurações de conta e altere sua senha aqui.</p>
      
      <div class="form-group">
        <div class="input-with-button">
          <h3>E-mail:</h3>
          <div class="input-group">
            <input type="email" value="usuario@email.com" class="info-input" id="email-input">
            <button type="button" class="edit-action" onclick="alterarEmail()">Alterar</button>
          </div>
        </div>
      </div>

      <hr>

      <h3>Alterar Senha</h3>
      <form id="password-form">
        <div class="form-group">
          <label>Digite a nova senha</label>
          <input type="password" placeholder="Nova senha" id="new-password">
        </div>
        
        <div class="form-group">
          <label>Confirmar nova senha</label>
          <input type="password" placeholder="Confirmar senha" id="confirm-password">
        </div>
        
        <button type="submit" class="save-btn">Alterar Senha</button>
      </form>

      <hr>

      <div class="form-group">
        <div class="input-with-button">
          <h3>Número de telefone:</h3>
          <div class="input-group">
            <input type="tel" placeholder="Você não definiu um número de telefone" class="info-input" id="phone-input">
            <button type="button" class="add-action" onclick="adicionarTelefone()">Adicionar</button>
          </div>
        </div>
      </div>
    </section>
  `,
  
  foto: `
    <section class="info-section">
      <h1>Foto do Perfil</h1>
      <p>Adicione uma bela foto sua para o seu perfil.</p>
  
      <div class="photo-content">
        <div class="photo-visualization">
          <h2>Visualização da imagem</h2>
          <div class="avatar-preview">
            <div class="avatar-large" id="avatar-preview">U</div>
            <div class="avatar-placeholder">Sua foto aparecerá aqui</div>
          </div>
        </div>
  
        <div class="photo-upload">
          <h2>Adicionar/alterar imagem</h2>
          <p class="upload-instructions">Selecione uma imagem do seu computador para usar como foto de perfil.</p>
          
          <div class="upload-options">
            <div class="upload-option">
              <div class="upload-icon">📁</div>
              <h3>Fazer upload de imagem</h3>
              <p>Formatos suportados: JPG, PNG, GIF</p>
              <div class="file-info">
                <span class="no-file" id="file-name">Nenhum arquivo selecionado</span>
              </div>
              <input type="file" id="photo-upload" accept="image/*" style="display: none;">
              <button type="button" class="upload-btn" onclick="document.getElementById('photo-upload').click()">
                📤 Selecionar Arquivo
              </button>
            </div>
          </div>
  
          <div class="photo-actions">
            <button type="button" class="cancel-btn" onclick="cancelarUpload()">Cancelar</button>
            <button type="button" class="save-btn" onclick="salvarFoto()">💾 Salvar</button>
          </div>
        </div>
      </div>
    </section>
  `
};

// Estado dos carousels
const carouselStates = new Map();

// Função principal para mostrar conteúdo
function mostrarConteudo(event) {
  event.preventDefault();
  const itemId = event.target.id;
  
  // Atualizar classe ativa
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Mostrar conteúdo correspondente
  const saida = document.getElementById("saida");
  saida.innerHTML = conteudos[itemId] || "<p>Conteúdo não encontrado.</p>";
  
  // Inicializar componentes específicos da página
  inicializarPagina(itemId);
}

// Inicializar componentes específicos de cada página
function inicializarPagina(pagina) {
  switch(pagina) {
    case 'informacoes':
      inicializarFormularioInformacoes();
      break;
    case 'cursos':
      inicializarFiltrosCursos();
      break;
    case 'seguranca':
      inicializarFormularioSeguranca();
      break;
    case 'foto':
      inicializarUploadFoto();
      break;
  }
  
  // Reinicializar todos os carousels
  inicializarCarousels();
}

// Inicializar formulário de informações
function inicializarFormularioInformacoes() {
  const form = document.getElementById('info-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Informações salvas com sucesso!');
    });
  }
}

// Inicializar filtros de cursos
function inicializarFiltrosCursos() {
  const filter = document.getElementById('course-filter');
  const search = document.getElementById('course-search');
  
  if (filter) {
    filter.addEventListener('change', function() {
      console.log('Filtro alterado:', this.value);
      // Aqui você implementaria a filtragem real
    });
  }
  
  if (search) {
    search.addEventListener('input', function() {
      console.log('Pesquisando:', this.value);
      // Aqui você implementaria a pesquisa real
    });
  }
}

// Inicializar formulário de segurança
function inicializarFormularioSeguranca() {
  const form = document.getElementById('password-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const novaSenha = document.getElementById('new-password').value;
      const confirmarSenha = document.getElementById('confirm-password').value;
      
      if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
      }
      
      if (novaSenha.length < 6) {
        alert('A senha deve ter pelo menos 6 caracteres!');
        return;
      }
      
      alert('Senha alterada com sucesso!');
      form.reset();
    });
  }
}

// Inicializar upload de foto
function inicializarUploadFoto() {
  const fileInput = document.getElementById('photo-upload');
  const fileName = document.getElementById('file-name');
  const avatarPreview = document.getElementById('avatar-preview');
  
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        fileName.textContent = file.name;
        
        // Criar preview da imagem
        const reader = new FileReader();
        reader.onload = function(e) {
          avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Funções auxiliares para segurança
function alterarEmail() {
  const emailInput = document.getElementById('email-input');
  const novoEmail = prompt('Digite o novo e-mail:', emailInput.value);
  if (novoEmail && novoEmail.includes('@')) {
    emailInput.value = novoEmail;
    // Removido o alerta de sucesso
  }
}

function adicionarTelefone() {
  const phoneInput = document.getElementById('phone-input');
  const novoTelefone = prompt('Digite o número de telefone:');
  if (novoTelefone) {
    phoneInput.value = novoTelefone;
    // Removido o alerta de sucesso
  }
}

// Funções para upload de foto
function cancelarUpload() {
  const fileInput = document.getElementById('photo-upload');
  const fileName = document.getElementById('file-name');
  const avatarPreview = document.getElementById('avatar-preview');
  
  fileInput.value = '';
  fileName.textContent = 'Nenhum arquivo selecionado';
  avatarPreview.innerHTML = 'U';
  avatarPreview.style.background = '';
}

function salvarFoto() {
  const fileInput = document.getElementById('photo-upload');
  if (!fileInput.files[0]) {
    alert('Por favor, selecione uma imagem primeiro!');
    return;
  }
  
  alert('Foto salva com sucesso!');
  // Aqui você implementaria o upload real para o servidor
}

// Sistema de carousel melhorado
function inicializarCarousels() {
  document.querySelectorAll('.courses-carousel-container').forEach((container, index) => {
    if (!carouselStates.has(index)) {
      carouselStates.set(index, 0);
    }
    
    const track = container.querySelector('.courses-carousel');
    const cards = track.querySelectorAll('.course-card');
    const cardWidth = cards[0].offsetWidth + 20; // card width + gap
    
    // Atualizar posição do carousel
    track.style.transform = `translateX(-${carouselStates.get(index) * cardWidth}px)`;
  });
}

function scrollCarousel(button, direction) {
  const container = button.parentElement;
  const containerIndex = Array.from(document.querySelectorAll('.courses-carousel-container')).indexOf(container);
  const track = container.querySelector('.courses-carousel');
  const cards = track.querySelectorAll('.course-card');
  const cardWidth = cards[0].offsetWidth + 20; // card width + gap
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  const maxScroll = cards.length - visibleCards;
  
  let currentPosition = carouselStates.get(containerIndex) || 0;
  let newPosition = currentPosition + direction;
  
  // Limitar scroll
  newPosition = Math.max(0, Math.min(maxScroll, newPosition));
  
  if (newPosition !== currentPosition) {
    carouselStates.set(containerIndex, newPosition);
    track.style.transform = `translateX(-${newPosition * cardWidth}px)`;
    track.style.transition = 'transform 0.3s ease';
  }
}

// Função auxiliar
function emBreve() {
  alert("Funcionalidade em desenvolvimento!");
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  const saida = document.getElementById("saida");
  saida.innerHTML = conteudos.informacoes;
  inicializarPagina('informacoes');
  
  // Adicionar event listeners globais
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('play-button')) {
      alert('Iniciando curso...');
    }
  });
});   