/**
 * O2 EXTREME ACADEMIA - JAVASCRIPT PRINCIPAL
 * Funcionalidades interativas:
 * 1. Indicador dinâmico de Aberto / Fechado em tempo real
 * 2. Calculadora Interativa de IMC com recomendação de treino
 * 3. Envio dinâmico para o WhatsApp com mensagens personalizadas
 * 4. Galeria Lightbox interativa
 * 5. Acordeão de FAQ
 * 6. Menu mobile responsivo
 * 7. Alternador de tema Claro / Escuro
 */

document.addEventListener('DOMContentLoaded', () => {
  initBusinessStatus();
  initImcCalculator();
  initFaqAccordion();
  initMobileMenu();
  initHeaderScroll();
  initContactForm();
  initGalleryLightbox();
  initThemeToggle();
  initScrollReveal();
  initWhatsAppWidget();
  initQrModal();
});

/* ==========================================================================
   1. STATUS DE FUNCIONAMENTO EM TEMPO REAL ("ABERTO AGORA")
   Regras da O2 Extreme:
   - Segunda a Sexta: 05:30 às 22:00
   - Sábado: 07:30 às 11:00
   - Domingo: Fechado
   ========================================================================== */
function initBusinessStatus() {
  const topStatusBadge = document.getElementById('topStatusBadge');
  const hoursStatusBox = document.getElementById('hoursStatusBox');
  const hoursStatusText = document.getElementById('hoursStatusText');
  const hoursSubText = document.getElementById('hoursSubText');

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 1 = Seg, 2 = Ter, 3 = Qua, 4 = Qui, 5 = Sex, 6 = Sáb
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;

    let isOpen = false;
    let message = 'FECHADO AGORA';
    let subMessage = 'Confira nossos horários de funcionamento abaixo';
    let badgeClass = 'closed';

    if (day === 0) {
      // Domingo
      isOpen = false;
      message = 'FECHADO HOJE (DOMINGO)';
      subMessage = 'Reabrimos segunda-feira às 05:30';
      badgeClass = 'closed';
    } else if (day === 6) {
      // Sábado: 07:30 (450 min) às 11:00 (660 min)
      const openTime = 7 * 60 + 30;
      const closeTime = 11 * 60;
      if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
        isOpen = true;
        message = 'ABERTO AGORA';
        subMessage = 'Sábado aberto até às 11:00';
        badgeClass = 'open';
      } else if (currentTimeInMinutes < openTime) {
        isOpen = false;
        message = 'FECHADO AGORA';
        subMessage = 'Abre hoje às 07:30';
        badgeClass = 'closed';
      } else {
        isOpen = false;
        message = 'FECHADO AGORA';
        subMessage = 'Fechou às 11:00. Reabrimos segunda às 05:30';
        badgeClass = 'closed';
      }
    } else {
      // Segunda a Sexta: 05:30 (330 min) às 22:00 (1320 min)
      const openTime = 5 * 60 + 30;
      const closeTime = 22 * 60;
      if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
        isOpen = true;
        message = 'ABERTO AGORA';
        subMessage = 'Atendimento até às 22:00 hoje';
        badgeClass = 'open';
      } else if (currentTimeInMinutes < openTime) {
        isOpen = false;
        message = 'FECHADO AGORA';
        subMessage = 'Abre hoje às 05:30';
        badgeClass = 'closed';
      } else {
        isOpen = false;
        message = 'FECHADO AGORA';
        subMessage = day === 5 ? 'Fechou às 22:00. Reabrimos amanhã (sábado) às 07:30' : 'Fechou às 22:00. Reabrimos amanhã às 05:30';
        badgeClass = 'closed';
      }
    }

    // Atualiza Top Bar
    if (topStatusBadge) {
      topStatusBadge.className = `status-badge ${badgeClass}`;
      topStatusBadge.innerHTML = `<span class="status-dot"></span> <span>${isOpen ? '🟢 Aberto Agora' : '🔴 Fechado Agora'}</span>`;
    }

    // Atualiza Card da Seção de Horários
    if (hoursStatusBox && hoursStatusText) {
      hoursStatusBox.className = `hours-status-indicator ${badgeClass}`;
      hoursStatusText.innerText = message;
      if (hoursSubText) {
        hoursSubText.innerText = subMessage;
      }
    }

    // Destaca o dia atual na lista de horários
    const dayElements = document.querySelectorAll('.hours-item');
    const dayMap = [6, 0, 1, 2, 3, 4, 5]; // mapeia index para os itens da lista
    dayElements.forEach((el, index) => {
      el.classList.remove('today');
      if (index === dayMap[day]) {
        el.classList.add('today');
      }
    });
  }

  updateStatus();
  setInterval(updateStatus, 60000); // atualiza a cada minuto
}

/* ==========================================================================
   2. CALCULADORA INTERATIVA DE IMC COM SUGESTÃO DE TREINO
   ========================================================================== */
function initImcCalculator() {
  const calcBtn = document.getElementById('btnCalcularImc');
  const weightInput = document.getElementById('calcPeso');
  const heightInput = document.getElementById('calcAltura');
  const imcDisplay = document.getElementById('calcImcDisplay');
  const statusDisplay = document.getElementById('calcStatusDisplay');
  const tipDisplay = document.getElementById('calcTipDisplay');
  const shareBtn = document.getElementById('btnShareImc');

  if (!calcBtn || !weightInput || !heightInput) return;

  function calculate() {
    let weight = parseFloat(weightInput.value);
    let height = parseFloat(heightInput.value);

    if (!weight || !height || weight <= 0 || height <= 0) {
      alert('Por favor, digite valores válidos para peso e altura.');
      return;
    }

    // Se a altura for inserida em cm (ex: 175), converte para metros (1.75)
    if (height > 3) {
      height = height / 100;
    }

    const imc = (weight / (height * height)).toFixed(1);
    imcDisplay.innerText = imc;

    let status = '';
    let tip = '';

    if (imc < 18.5) {
      status = 'Abaixo do Peso';
      tip = 'Foco sugerido: Musculação para ganho de massa magra e acompanhamento nutricional.';
    } else if (imc < 24.9) {
      status = 'Peso Ideal';
      tip = 'Excelente! Foco sugerido: Manutenção, definição muscular e treinamento funcional.';
    } else if (imc < 29.9) {
      status = 'Sobrepeso';
      tip = 'Foco sugerido: Musculação combinada com aulas de Spinning e Funcional para alta queima calórica.';
    } else {
      status = 'Obesidade';
      tip = 'Foco sugerido: Treinos orientados com avaliação física regular, Funcional e Musculação.';
    }

    statusDisplay.innerText = status;
    tipDisplay.innerText = tip;

    // Atualiza o botão de compartilhar via WhatsApp
    if (shareBtn) {
      shareBtn.style.display = 'inline-flex';
      const msg = encodeURIComponent(`Olá! Fiz o teste de IMC no site da O2 Extreme (meu resultado foi ${imc} - ${status}) e gostaria de agendar uma avaliação física para começar a treinar!`);
      shareBtn.href = `https://wa.me/5583981855100?text=${msg}`;
    }
  }

  calcBtn.addEventListener('click', calculate);
}

/* ==========================================================================
   3. ACORDEÃO DE FAQ
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha todos os outros itens
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Abre o atual se não estava ativo
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. MENU MOBILE
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const isExpanded = navMenu.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
    menuToggle.innerHTML = isExpanded 
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  });

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      if (menuToggle) {
        menuToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      }
    });
  });
}

/* ==========================================================================
   5. HEADER SCROLL & SOMBRA DE VIDRO
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   6. FORMULÁRIO DE CONTATO (DISPARO DIRETO PRO WHATSAPP)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('leadName').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    const goal = document.getElementById('leadGoal').value;
    const time = document.getElementById('leadTime').value;

    const text = `Olá! Meu nome é ${name} (${phone}). Vim pelo site da O2 Extreme Academia e quero saber mais sobre como começar. Meu objetivo principal é ${goal} no período da ${time}.`;
    const whatsappUrl = `https://wa.me/5583981855100?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank');
  });
}

/* ==========================================================================
   7. GALERIA LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightboxModal || !lightboxImg) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('.gallery-img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   8. ALTERNADOR DE TEMA (DARK / LIGHT)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    toggleBtn.innerHTML = newTheme === 'light' 
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  });
}

/* ==========================================================================
   9. ANIMAÇÕES DE SCROLL REVEAL SUAVE
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.modality-card, .pricing-card, .included-card, .feature-item, .gallery-item, .hours-layout, .location-layout');
  
  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. WIDGET DE MINI-CHAT DO WHATSAPP
   ========================================================================== */
function initWhatsAppWidget() {
  const triggerBtn = document.getElementById('whatsappChatTrigger');
  const modal = document.getElementById('whatsappWidgetModal');
  const closeBtn = document.getElementById('whatsappWidgetClose');
  const quickReplies = document.querySelectorAll('.quick-reply-btn');

  if (!triggerBtn || !modal) return;

  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.getAttribute('data-msg');
      const url = `https://wa.me/5583981855100?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      modal.classList.remove('active');
    });
  });
}

/* ==========================================================================
   11. MODAL DE QR CODE (PARA APRESENTAÇÃO NA REUNIÃO)
   ========================================================================== */
function initQrModal() {
  const qrBtn = document.getElementById('qrPitchBtn');
  const qrModal = document.getElementById('qrModal');
  const qrClose = document.getElementById('qrModalClose');
  const qrImg = qrModal ? qrModal.querySelector('.qr-code-img') : null;

  if (!qrBtn || !qrModal) return;

  // Quando o site for publicado na internet, atualiza o QR Code automaticamente para a URL real
  if (qrImg && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}`;
  }

  qrBtn.addEventListener('click', () => {
    qrModal.classList.add('active');
  });

  if (qrClose) {
    qrClose.addEventListener('click', () => {
      qrModal.classList.remove('active');
    });
  }

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove('active');
    }
  });
}

