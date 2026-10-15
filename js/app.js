// M'Vie Cake - Full Dynamic Application Logic

let CONFIG = getFullConfig();

// Apply Dynamic Theme Colors
function applyThemeColors() {
  if (!CONFIG.theme) return;
  const root = document.documentElement;
  if (CONFIG.theme.primaryColor) {
    root.style.setProperty('--mvie-blue', CONFIG.theme.primaryColor);
    root.style.setProperty('--mvie-blue-hover', CONFIG.theme.primaryHover || CONFIG.theme.primaryColor);
  }
  if (CONFIG.theme.accentYellow) {
    root.style.setProperty('--mvie-yellow', CONFIG.theme.accentYellow);
  }
  if (CONFIG.theme.accentPink) {
    root.style.setProperty('--mvie-pink', CONFIG.theme.accentPink);
  }
  if (CONFIG.theme.backgroundColor) {
    root.style.setProperty('--mvie-cream', CONFIG.theme.backgroundColor);
    document.body.style.backgroundColor = CONFIG.theme.backgroundColor;
  }
  if (CONFIG.theme.textColor) {
    root.style.setProperty('--mvie-choco', CONFIG.theme.textColor);
    document.body.style.color = CONFIG.theme.textColor;
  }
}

// Apply Full Configuration to HTML DOM
function applyFullConfiguration() {
  CONFIG = getFullConfig();
  applyThemeColors();

  // 1. Browser Title & Meta
  if (CONFIG.site.browserTitle) {
    document.title = CONFIG.site.browserTitle;
  }
  const metaDescEl = document.querySelector('meta[name="description"]');
  if (metaDescEl && CONFIG.site.metaDesc) {
    metaDescEl.setAttribute('content', CONFIG.site.metaDesc);
  }

  // 2. Top Announcement
  const annText = document.getElementById('announcement-bar-text');
  if (annText) annText.textContent = CONFIG.site.topAnnouncement;
  const annSub = document.getElementById('announcement-sub-text');
  if (annSub) annSub.textContent = CONFIG.site.announcementSub;

  // 3. Store Identity & Logo
  document.querySelectorAll('.store-logo-img').forEach(img => {
    img.src = CONFIG.store.logoUrl;
  });
  document.querySelectorAll('.store-name-text').forEach(el => {
    el.textContent = CONFIG.store.name;
  });
  document.querySelectorAll('.store-tagline-text').forEach(el => {
    el.textContent = CONFIG.store.tagline;
  });
  document.querySelectorAll('.store-badge-text').forEach(el => {
    el.textContent = CONFIG.store.badgeText || "Homemade";
  });
  document.querySelectorAll('.store-address-text').forEach(el => {
    el.textContent = CONFIG.store.address;
  });
  document.querySelectorAll('.store-hotline-text').forEach(el => {
    el.textContent = CONFIG.store.hotline;
    if (el.tagName === 'A') el.href = `tel:${CONFIG.store.hotline.replace(/\s+/g, '')}`;
  });
  document.querySelectorAll('.store-hotline-link').forEach(a => {
    const clean = (CONFIG.store.hotline || '').replace(/\D+/g, '');
    a.href = clean ? `tel:${clean}` : 'tel:0909000000';
  });
  document.querySelectorAll('.store-zalo-link').forEach(a => {
    const clean = (CONFIG.store.hotline || '').replace(/\D+/g, '');
    a.href = clean ? `https://zalo.me/${clean}` : 'https://zalo.me/';
  });
  document.querySelectorAll('.store-fb-link').forEach(a => {
    a.href = CONFIG.store.facebookUrl;
  });
  document.querySelectorAll('.store-msg-link').forEach(a => {
    a.href = CONFIG.store.messengerUrl;
  });

  // 4. Hero Banner
  const heroBadge = document.getElementById('hero-badge-text');
  if (heroBadge) heroBadge.textContent = CONFIG.hero.badge;

  const heroLine1 = document.getElementById('hero-title-line1');
  if (heroLine1) heroLine1.textContent = CONFIG.hero.titleLine1;

  const heroHighlight = document.getElementById('hero-title-highlight');
  if (heroHighlight) heroHighlight.textContent = CONFIG.hero.titleHighlight;

  const heroLine2 = document.getElementById('hero-title-line2');
  if (heroLine2) heroLine2.textContent = CONFIG.hero.titleLine2;

  const heroSub = document.getElementById('hero-subtitle-text');
  if (heroSub) heroSub.textContent = CONFIG.hero.subtitle;

  const heroImg = document.getElementById('hero-main-img');
  if (heroImg) heroImg.src = CONFIG.hero.heroImage;

  const heroImgBadge = document.getElementById('hero-img-badge');
  if (heroImgBadge) heroImgBadge.textContent = CONFIG.hero.heroImageBadge;

  const heroImgTitle = document.getElementById('hero-img-title');
  if (heroImgTitle) heroImgTitle.textContent = CONFIG.hero.heroImageTitle;

  const heroImgSub = document.getElementById('hero-img-sub');
  if (heroImgSub) heroImgSub.textContent = CONFIG.hero.heroImageSubtitle;

  const heroCta1 = document.getElementById('hero-cta-primary');
  if (heroCta1) heroCta1.textContent = CONFIG.hero.ctaPrimaryText;

  const heroCta2 = document.getElementById('hero-cta-secondary');
  if (heroCta2) heroCta2.textContent = CONFIG.hero.ctaSecondaryText;

  const heroPolicyTitle = document.getElementById('hero-policy-title');
  if (heroPolicyTitle) heroPolicyTitle.textContent = CONFIG.hero.policyTitle;

  const heroPolicyNote = document.getElementById('hero-policy-note');
  if (heroPolicyNote) heroPolicyNote.innerHTML = CONFIG.hero.policyNote;

  // 5. About Section
  const aboutBadge = document.getElementById('about-badge-text');
  if (aboutBadge) aboutBadge.textContent = CONFIG.about.badge;

  const aboutTitle = document.getElementById('about-title-text');
  if (aboutTitle) aboutTitle.textContent = CONFIG.about.title;

  const aboutDesc = document.getElementById('about-desc-text');
  if (aboutDesc) aboutDesc.textContent = CONFIG.about.desc;

  const aboutImg = document.getElementById('about-main-img');
  if (aboutImg) aboutImg.src = CONFIG.about.image;

  renderAboutFeatures();
  renderFeedbacks();
  renderCategoriesTabs();
  renderProducts('all');
}

// Render 4 About Features (Spacious Haute Pâtisserie 3D Cards)
function renderAboutFeatures() {
  const container = document.getElementById('about-features-container');
  if (!container || !CONFIG.about.features) return;

  const defaultAboutIcons = [
    'assets/icons/milk-bottle.png',
    'assets/icons/heart.png',
    'assets/icons/chef-hat.png',
    'assets/icons/gift.png'
  ];

  container.innerHTML = CONFIG.about.features.map((feat, idx) => {
    const iconSrc = (feat.icon && feat.icon.includes('/')) ? feat.icon : defaultAboutIcons[idx % defaultAboutIcons.length];
    return `
      <div class="card-3d bg-white rounded-[2.25rem] p-7 sm:p-8 shadow-[0_12px_32px_rgba(30,22,18,0.05)] border border-[#EAE3D9] flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EEF7FD] to-[#D7ECFB] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-xs border border-[#9BC7E8]/30 layer-3d-z1">
          <img src="${iconSrc}" class="w-8 h-8 object-contain" alt="">
        </div>
        <div class="layer-3d-z1 space-y-2">
          <h4 class="font-serif-luxury font-bold text-base sm:text-lg text-[#1E1612]">${feat.title}</h4>
          <p class="text-xs sm:text-[13px] text-stone-500 leading-relaxed font-light">${feat.desc}</p>
        </div>
      </div>
    `;
  }).join('');

  init3DTiltCards();
}

// Render Feedbacks / Reviews (Clean Boutique 3D Cards)
function renderFeedbacks() {
  const container = document.getElementById('feedbacks-container');
  if (!container || !CONFIG.feedbacks) return;

  const avatarBgs = ['bg-sky-100 text-sky-700', 'bg-amber-100 text-amber-800', 'bg-rose-100 text-rose-700', 'bg-emerald-100 text-emerald-700'];

  container.innerHTML = CONFIG.feedbacks.map((fb, idx) => `
    <div class="card-3d bg-white p-7 sm:p-9 rounded-[2.25rem] shadow-[0_12px_32px_rgba(45,35,30,0.06)] border border-[#EAE3D9]/90 flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
      <div class="space-y-4 layer-3d-z1">
        <div class="flex items-center gap-1 mb-3">
          ${Array(fb.stars || 5).fill(0).map(() => `<img src="assets/icons/star.png" class="w-4 h-4 object-contain inline-block" alt="Star">`).join('')}
        </div>
        <p class="text-stone-700 text-sm sm:text-base leading-relaxed italic font-light">
          “${fb.content}”
        </p>
      </div>
      <div class="flex items-center justify-between pt-6 mt-6 border-t border-[#F2ECE4] layer-3d-z2">
        <div class="flex items-center gap-3.5">
          <div class="w-11 h-11 rounded-2xl ${avatarBgs[idx % avatarBgs.length]} flex items-center justify-center font-bold text-xs shadow-xs border border-white">
            ${fb.avatar || fb.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 class="font-serif-luxury font-bold text-sm text-[#1E1612]">${fb.name}</h4>
            <p class="text-[11px] text-stone-400 font-medium">${fb.location}</p>
          </div>
        </div>
        <span class="text-xs text-amber-500 font-bold">5.0 ★</span>
      </div>
    </div>
  `).join('');

  init3DTiltCards();
}

// Render Category Filter Tabs
let currentFilter = 'all';

const CATEGORY_ICONS_MAP = {
  all: 'assets/icons/cookie.png',
  gatoflan: 'assets/icons/cake.png',
  pannacotta: 'assets/icons/dessert.png',
  flan: 'assets/icons/jelly.png',
  cupcake: 'assets/icons/cupcake.png',
  birthday: 'assets/icons/birthday-cake.png'
};

function renderCategoriesTabs() {
  const container = document.getElementById('category-tabs-container');
  if (!container || !CONFIG.categories) return;

  container.innerHTML = CONFIG.categories.map(cat => {
    const cleanName = cat.name.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    const iconSrc = CATEGORY_ICONS_MAP[cat.id] || 'assets/icons/cake.png';
    const isActive = cat.id === currentFilter;

    return `
      <button 
        class="cat-btn ${isActive ? 'active bg-[#9BC7E8] text-white shadow-md' : 'bg-white/90 hover:bg-white text-stone-700 border border-stone-200/80 shadow-xs'} px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 group"
        data-category="${cat.id}"
        onclick="filterCategory('${cat.id}')"
      >
        <img src="${iconSrc}" class="w-4 h-4 object-contain group-hover:scale-110 transition-transform" alt="">
        <span>${cleanName}</span>
      </button>
    `;
  }).join('');
}

function filterCategory(catId) {
  currentFilter = catId;
  renderCategoriesTabs();
  renderProducts(catId);
}

function quickFilterFromFlavor(catId) {
  filterCategory(catId);
  const menuEl = document.getElementById('menu-section');
  if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
}

// Format Currency
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

// Toast System
function showToast(message, type = "success") {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
    success: 'bg-[#2D231E] text-white border-l-4 border-[#9BC7E8]',
    info: 'bg-[#2D231E] text-white border-l-4 border-[#FEF08A]',
    error: 'bg-rose-600 text-white'
  };

  toast.className = `toast-item px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-sm font-medium ${bgColors[type] || bgColors.success}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Lightweight Card Hover Engine (0% CPU overhead, pure hardware-accelerated CSS)
function init3DTiltCards() {
  // Pure CSS handles all card transitions and hover states smoothly without mousemove event listeners
}

// Search & Filter State
let currentSearchQuery = "";
let currentTasteFilter = "";

function handleMenuSearch(val) {
  currentSearchQuery = (val || "").trim();
  const clearBtn = document.getElementById('menu-search-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('hidden', !currentSearchQuery);
  }
  renderProducts(currentFilter);
}

function clearMenuSearch() {
  const input = document.getElementById('menu-search-input');
  if (input) input.value = '';
  handleMenuSearch('');
}

function filterByTaste(taste) {
  currentTasteFilter = taste || "";
  document.querySelectorAll('.taste-chip').forEach(btn => {
    const btnOnClick = btn.getAttribute('onclick') || '';
    if ((taste === '' && btnOnClick.includes("''")) || (taste && btnOnClick.includes(`'${taste}'`))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderProducts(currentFilter);
}

// Render Products Catalog (Luxury Boutique 3D Cards with Clean Unified CTA)
function renderProducts(filter = "all") {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const productsList = CONFIG.products || [];
  let filtered = filter === "all" ? productsList : productsList.filter(p => p.category === filter);

  // Apply taste chip filter
  if (currentTasteFilter) {
    const taste = currentTasteFilter.toLowerCase();
    filtered = filtered.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.desc || '').toLowerCase();
      const badge = (p.badge || '').toLowerCase();
      const note = (p.note || '').toLowerCase();
      return name.includes(taste) || desc.includes(taste) || badge.includes(taste) || note.includes(taste);
    });
  }

  // Apply search text query
  if (currentSearchQuery) {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(p => {
      const name = (p.name || '').toLowerCase();
      const desc = (p.desc || '').toLowerCase();
      const badge = (p.badge || '').toLowerCase();
      const optionsStr = (p.options || []).map(o => o.name).join(' ').toLowerCase();
      return name.includes(q) || desc.includes(q) || badge.includes(q) || optionsStr.includes(q);
    });
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-400">
        <span class="text-5xl block mb-3">🔍</span>
        <p class="font-serif-luxury text-xl font-bold text-stone-600">Không tìm thấy món bánh phù hợp</p>
        <p class="text-xs text-stone-400 mt-1.5 max-w-sm mx-auto">
          Thử tìm với từ khóa khác như "Matcha", "Choco", "Flan" hoặc bấm nút bên dưới để xem toàn bộ menu nhé!
        </p>
        <button 
          onclick="clearMenuSearch(); filterByTaste(''); filterCategory('all')" 
          class="mt-4 px-5 py-2 rounded-full bg-[#1E1612] text-white text-xs font-bold hover:bg-[#3B6998] transition-all shadow-xs"
        >
          Xem Lại Toàn Bộ Menu
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const minPrice = Math.min(...product.options.map(o => o.price));
    const maxPrice = Math.max(...product.options.map(o => o.price));
    const priceDisplay = minPrice === maxPrice 
      ? formatVND(minPrice) 
      : `${formatVND(minPrice)} - ${formatVND(maxPrice)}`;

    const isAvailable = product.isAvailable !== false;

    return `
      <div class="card-3d rounded-[2.25rem] bg-white border border-[#EAE3D9]/90 shadow-[0_12px_32px_rgba(45,35,30,0.06)] hover:shadow-[0_26px_56px_rgba(45,35,30,0.15)] transition-all duration-300 flex flex-col group p-4 sm:p-5 relative ${!isAvailable ? 'opacity-70' : ''}">
        
        <!-- Image with 3D Depth Layer 1 -->
        <div class="relative overflow-hidden aspect-[4/3] rounded-[1.75rem] bg-[#EEF7FD] layer-3d-z1 shadow-sm">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          <!-- Badge with 3D Depth Layer 2 -->
          <div class="absolute top-3.5 left-3.5 flex flex-col gap-1.5 layer-3d-z2">
            <span class="text-xs font-bold px-3 py-1.5 rounded-full shadow-xs tracking-wide ${product.badgeColor || 'bg-[#FEF08A] text-amber-950'}">
              ${product.badge || 'Món Bánh'}
            </span>
            ${!isAvailable ? `
              <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
                Tạm hết hàng
              </span>
            ` : ''}
          </div>
          
          <!-- Quick Look Icon Button -->
          <button 
            onclick="openQuickView(${product.id})"
            class="layer-3d-z2 absolute bottom-3.5 right-3.5 bg-white/95 hover:bg-white text-[#1E1612] p-3 rounded-2xl shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="Xem chi tiết & chọn phân loại"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
          </button>
        </div>

        <!-- Card Body Content with Generous Breathing Space -->
        <div class="pt-5 pb-2 flex-1 flex flex-col justify-between layer-3d-z1 space-y-4">
          <div>
            <h3 class="font-serif-luxury text-xl font-bold text-[#1E1612] group-hover:text-[#3B6998] transition-colors leading-snug mb-2">
              ${product.name}
            </h3>
            <p class="text-stone-500 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3">
              ${product.desc}
            </p>
            ${product.note ? `
              <div class="text-[11px] text-[#8C7A6B] bg-[#FAF8F5] px-2.5 py-1 rounded-full font-medium border border-[#E8DCC8]/70 inline-flex items-center gap-1.5 w-fit">
                <span>✦</span> ${product.note}
              </div>
            ` : ''}
          </div>

          <!-- Price & Options Row with Clear Separation -->
          <div class="space-y-3 pt-3 border-t border-[#F2ECE4]">
            <div class="flex items-baseline justify-between">
              <div>
                <span class="text-[11px] text-[#8C7A6B] uppercase tracking-wider font-semibold block">Giá từ:</span>
                <span class="text-xl sm:text-2xl font-serif-luxury font-bold text-[#1E1612]">${priceDisplay}</span>
              </div>
              <span class="text-[11px] bg-stone-100/80 px-2.5 py-1 rounded-full text-stone-600 font-semibold border border-stone-200/50">
                ${product.options.length} lựa chọn
              </span>
            </div>

            <!-- Unified Single High-Impact CTA Button (Zero Decision Fatigue) -->
            <div class="layer-3d-z2 pt-1">
              ${isAvailable ? `
                <button 
                  onclick="openQuickView(${product.id})"
                  class="w-full py-3.5 px-4 rounded-full bg-[#1E1612] hover:bg-[#3B6998] text-white text-xs sm:text-[13px] font-bold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <img src="assets/icons/shopping-cart.png" class="w-3.5 h-3.5 object-contain filter invert group-hover/btn:scale-110 transition-transform" alt="">
                  <span>Tùy Chọn Size & Mua</span>
                  <span class="text-sm font-normal group-hover/btn:translate-x-1 transition-transform">→</span>
                </button>
              ` : `
                <button 
                  disabled
                  class="w-full py-3.5 px-4 rounded-full bg-stone-200 text-stone-400 text-xs font-bold cursor-not-allowed text-center"
                >
                  Tạm Hết Hàng
                </button>
              `}
            </div>
          </div>
        </div>

      </div>
    `;
  }).join('');

  init3DTiltCards();
}

// Cart State Management
class CartState {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('mvie_cart') || '[]');
  }

  save() {
    localStorage.setItem('mvie_cart', JSON.stringify(this.items));
    this.updateUI();
  }

  addItem(product, selectedOption = null, note = "") {
    const opt = selectedOption || product.options[0];
    
    const existingIndex = this.items.findIndex(
      i => i.id === product.id && i.optionName === opt.name && i.note === note
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        optionName: opt.name,
        price: opt.price,
        image: product.image,
        note: note,
        quantity: 1
      });
    }

    this.save();
    triggerCartPulse();
    showToast(`Đã thêm "${product.name} (${opt.name})" vào giỏ hàng! 🍮`, "success");
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.save();
    showToast("Đã xóa món khỏi giỏ hàng.", "info");
  }

  updateQuantity(index, delta) {
    if (this.items[index]) {
      this.items[index].quantity += delta;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  getTotalCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateUI() {
    const badge = document.getElementById('cart-badge');
    const badgeMobile = document.getElementById('cart-badge-mobile');
    const count = this.getTotalCount();
    
    if (badge) {
      badge.textContent = count;
      badge.classList.toggle('hidden', count === 0);
    }
    if (badgeMobile) {
      badgeMobile.textContent = count;
      badgeMobile.classList.toggle('hidden', count === 0);
    }

    renderCartDrawer();
  }
}

// Micro-interaction: Cart Tactile Bounce Pulse
function triggerCartPulse() {
  const desktopCart = document.getElementById('cart-btn-desktop');
  const floatingCart = document.getElementById('cart-btn-floating');
  const mobileBadge = document.getElementById('cart-badge-mobile');

  [desktopCart, floatingCart, mobileBadge].forEach(el => {
    if (!el) return;
    el.classList.remove('cart-bounce-pulse');
    void el.offsetWidth; // Force DOM reflow
    el.classList.add('cart-bounce-pulse');
    setTimeout(() => el.classList.remove('cart-bounce-pulse'), 650);
  });
}

// 1-Click Upsell Item in Cart Drawer
function quickAddUpsellItem() {
  const pannacotta = (CONFIG.products || []).find(p => (p.name || '').toLowerCase().includes('panna cotta 120ml'))
    || (CONFIG.products || []).find(p => (p.category || '').toLowerCase().includes('pannacotta'))
    || (CONFIG.products || [])[0];
  if (pannacotta) {
    cart.addItem(pannacotta, pannacotta.options[0], "Mua kèm giỏ hàng");
  }
}

const cart = new CartState();

// Render Cart Drawer with Free Ship Progress & Upsell
function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const footerContainer = document.getElementById('cart-footer');
  if (!container) return;

  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-stone-400 flex flex-col items-center">
        <div class="w-20 h-20 rounded-full bg-[#EEF7FD] flex items-center justify-center mb-4 text-[#9BC7E8]">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
        </div>
        <p class="font-bold text-stone-600 mb-1">Giỏ hàng của bạn đang trống</p>
        <p class="text-xs max-w-xs text-stone-400 mb-6">Hãy dạo quanh tiệm và chọn bánh Gato Flan, Panna Cotta hay Cupcake nhé!</p>
        <button 
          onclick="toggleCart(false); document.getElementById('menu-section').scrollIntoView({behavior: 'smooth'})"
          class="px-5 py-2.5 rounded-2xl bg-[#9BC7E8] text-white text-xs font-bold shadow-md hover:bg-[#7dbce8]"
        >
          Xem Menu Bánh Ngay
        </button>
      </div>
    `;
    if (footerContainer) footerContainer.classList.add('hidden');
    return;
  }

  if (footerContainer) footerContainer.classList.remove('hidden');

  // Free shipping & reward progress calculation
  const totalPrice = cart.getTotalPrice();
  const goalPrice = 150000;
  const progressPct = Math.min(100, Math.round((totalPrice / goalPrice) * 100));
  const remaining = goalPrice - totalPrice;

  const progressHtml = `
    <div class="mb-4 p-3.5 rounded-2xl bg-[#EEF7FD] border border-[#9BC7E8]/40">
      <div class="flex items-center justify-between text-xs font-bold mb-1.5">
        <span class="text-[#3B6998] flex items-center gap-1.5">
          <span>🛵</span>
          ${totalPrice >= goalPrice ? 'Đã đạt ưu đãi Freeship & Quà Tặng!' : `Thêm ${formatVND(remaining)} để nhận ưu đãi!`}
        </span>
        <span class="text-[11px] text-[#3B6998] font-black">${progressPct}%</span>
      </div>
      <div class="w-full h-2 rounded-full bg-white overflow-hidden shadow-2xs">
        <div class="h-full bg-gradient-to-r from-[#9BC7E8] to-[#3B6998] rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
      </div>
      <p class="text-[10px] text-stone-500 mt-1.5 font-medium">
        ${totalPrice >= goalPrice ? '🎉 Chúc mừng! Đơn hàng được hỗ trợ 15k phí ship & tặng kèm nến nghệ thuật!' : 'Đơn từ 150k được hỗ trợ 15k ship & tặng nến sinh nhật.'}
      </p>
    </div>
  `;

  // Upsell suggestion
  const hasPannaCotta = cart.items.some(i => (i.name || '').toLowerCase().includes('panna'));
  const upsellHtml = !hasPannaCotta ? `
    <div class="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between gap-2.5">
      <div class="flex items-center gap-2.5 min-w-0">
        <img src="assets/panna-cotta.jpg" class="w-10 h-10 rounded-xl object-cover shrink-0 border border-amber-200/50" alt="Panna Cotta">
        <div class="min-w-0">
          <p class="text-xs font-bold text-amber-950 truncate">Thêm Panna Cotta 120ml?</p>
          <p class="text-[10px] text-amber-700 font-semibold">Chỉ 12.000đ • Mát lành thanh ngọt</p>
        </div>
      </div>
      <button 
        onclick="quickAddUpsellItem()" 
        class="px-3 py-1.5 rounded-xl bg-[#FEF08A] hover:bg-yellow-300 text-amber-950 text-xs font-bold transition-all shrink-0 shadow-2xs"
      >
        + Thêm
      </button>
    </div>
  ` : '';

  const itemsHtml = cart.items.map((item, index) => `
    <div class="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-xl object-cover border border-stone-200">
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-sm text-[#2D231E] truncate mb-0.5">${item.name}</h4>
        <p class="text-[11px] text-[#6CAAD8] font-bold">${item.optionName}</p>
        ${item.note ? `<p class="text-[10px] text-stone-500 italic truncate">Ghi chú: ${item.note}</p>` : ''}
        <div class="flex items-center justify-between mt-2">
          <span class="font-bold text-sm text-[#2D231E]">${formatVND(item.price * item.quantity)}</span>
          <div class="flex items-center border border-stone-200 rounded-xl bg-white">
            <button onclick="cart.updateQuantity(${index}, -1)" class="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-l-xl">-</button>
            <span class="w-7 text-center text-xs font-bold">${item.quantity}</span>
            <button onclick="cart.updateQuantity(${index}, 1)" class="w-6 h-6 flex items-center justify-center text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-r-xl">+</button>
          </div>
        </div>
      </div>
      <button onclick="cart.removeItem(${index})" class="text-stone-400 hover:text-rose-500 p-1.5" title="Xóa">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>
  `).join('');

  container.innerHTML = `
    ${progressHtml}
    <div class="space-y-3">
      ${itemsHtml}
    </div>
    ${upsellHtml}
  `;

  const totalEl = document.getElementById('cart-total-price');
  if (totalEl) totalEl.textContent = formatVND(cart.getTotalPrice());
}

function toggleCart(show = null) {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;

  const isOpen = !drawer.classList.contains('translate-x-full');
  const shouldOpen = show !== null ? show : !isOpen;

  if (shouldOpen) {
    overlay.classList.remove('hidden');
    setTimeout(() => {
      overlay.classList.remove('opacity-0');
      drawer.classList.remove('translate-x-full');
    }, 10);
  } else {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }
}

// Quick View Modal
function openQuickView(productId) {
  const product = (CONFIG.products || []).find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const content = document.getElementById('quickview-content');
  if (!modal || !content) return;

  let currentSelectedOption = product.options[0];

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
      <div class="rounded-2xl overflow-hidden bg-[#EEF7FD] aspect-[4/3] md:aspect-square flex items-center justify-center max-h-56 md:max-h-none">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
      </div>
      <div class="flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold px-3 py-1 rounded-full ${product.badgeColor || 'bg-amber-100 text-amber-900'}">${product.badge}</span>
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-[#2D231E] mb-1">${product.name}</h2>
          <div id="qv-price-display" class="text-xl sm:text-2xl font-bold text-[#6CAAD8] mb-3">
            ${formatVND(currentSelectedOption.price)}
          </div>
          <p class="text-stone-600 text-xs sm:text-sm mb-4 leading-relaxed">${product.desc}</p>
          
          <div class="mb-4">
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Chọn phân loại / Số lượng:
            </label>
            <div class="space-y-2" id="qv-options-list">
              ${product.options.map((opt, idx) => `
                <div 
                  class="qv-option-item p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${idx === 0 ? 'border-[#9BC7E8] bg-[#EEF7FD]' : 'border-stone-200 hover:bg-stone-50'}"
                  data-index="${idx}"
                >
                  <span class="font-bold text-xs text-[#2D231E]">${opt.name}</span>
                  <span class="font-bold text-xs text-[#6CAAD8]">${formatVND(opt.price)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mb-5">
            <label class="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Ghi chú (vị sốt, yêu cầu riêng):</label>
            <input type="text" id="qv-note" placeholder="VD: Sốt xoài, dâu tây, hoặc ghi chữ..." class="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#9BC7E8]">
          </div>
        </div>

        <button 
          id="qv-add-btn"
          class="w-full py-3.5 rounded-2xl bg-[#9BC7E8] hover:bg-[#7dbce8] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span>Thêm Vào Giỏ Hàng - <span id="qv-btn-price">${formatVND(currentSelectedOption.price)}</span></span>
        </button>
      </div>
    </div>
  `;

  // Option items click handler
  const optionItems = content.querySelectorAll('.qv-option-item');
  optionItems.forEach(item => {
    item.addEventListener('click', () => {
      optionItems.forEach(it => {
        it.classList.remove('border-[#9BC7E8]', 'bg-[#EEF7FD]');
        it.classList.add('border-stone-200');
      });
      item.classList.add('border-[#9BC7E8]', 'bg-[#EEF7FD]');
      item.classList.remove('border-stone-200');

      const idx = parseInt(item.dataset.index);
      currentSelectedOption = product.options[idx];

      const priceDisplay = content.querySelector('#qv-price-display');
      const btnPrice = content.querySelector('#qv-btn-price');
      if (priceDisplay) priceDisplay.textContent = formatVND(currentSelectedOption.price);
      if (btnPrice) btnPrice.textContent = formatVND(currentSelectedOption.price);
    });
  });

  const addBtn = content.querySelector('#qv-add-btn');
  addBtn.addEventListener('click', () => {
    const note = content.querySelector('#qv-note').value.trim();
    cart.addItem(product, currentSelectedOption, note);
    closeQuickView();
    toggleCart(true);
  });

  modal.classList.remove('hidden');
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) modal.classList.add('hidden');
}

// Delivery Time Preset Handler (Today / Tomorrow)
function setDeliveryPreset(type) {
  const dateInput = document.getElementById('cust-date');
  const noteInput = document.getElementById('cust-note');
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');

  if (type === 'today') {
    now.setHours(now.getHours() + 2);
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    if (dateInput) dateInput.value = dateStr;
    if (noteInput && !noteInput.value.includes('Giao gấp')) {
      noteInput.value = `[Giao gấp trong hôm nay] ${noteInput.value}`.trim();
    }
    showToast("Đã chọn: Giao gấp trong hôm nay! ⚡", "info");
  } else if (type === 'tomorrow') {
    now.setDate(now.getDate() + 1);
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T14:00`;
    if (dateInput) dateInput.value = dateStr;
    if (noteInput && !noteInput.value.includes('Đặt trước')) {
      noteInput.value = `[Đặt trước cho ngày mai 14:00] ${noteInput.value}`.trim();
    }
    showToast("Đã chọn: Đặt trước ngày mai (14:00)! 🎂", "info");
  }
}

// Checkout Modal
function openCheckout() {
  if (cart.items.length === 0) {
    showToast("Giỏ hàng của bạn đang trống!", "error");
    return;
  }
  toggleCart(false);
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    const summaryList = document.getElementById('checkout-items-summary');
    if (summaryList) {
      summaryList.innerHTML = cart.items.map(i => `
        <div class="flex justify-between items-center text-xs py-1 border-b border-stone-100">
          <span class="truncate max-w-[200px]">${i.name} - ${i.optionName} (x${i.quantity})</span>
          <span class="font-bold">${formatVND(i.price * i.quantity)}</span>
        </div>
      `).join('');
    }
    const finalTotal = document.getElementById('checkout-total-price');
    if (finalTotal) finalTotal.textContent = formatVND(cart.getTotalPrice());
  }
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
}

// Complete Order & Save
function submitOrder(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const date = document.getElementById('cust-date').value;
  const note = document.getElementById('cust-note').value.trim();

  if (!name || !phone || !address) {
    showToast("Vui lòng điền đủ Tên, SĐT và Địa chỉ nhận bánh!", "error");
    return;
  }

  const orderObj = {
    id: "MV" + Date.now().toString().slice(-6),
    createdAt: new Date().toLocaleString('vi-VN'),
    name,
    phone,
    address,
    date: date || "Sớm nhất",
    note,
    items: [...cart.items],
    total: cart.getTotalPrice()
  };
  
  try {
    const existingOrders = JSON.parse(localStorage.getItem('mvie_orders') || '[]');
    existingOrders.unshift(orderObj);
    localStorage.setItem('mvie_orders', JSON.stringify(existingOrders));
  } catch (err) {
    console.error("Error saving order history", err);
  }

  let msg = `🍮 ĐƠN ĐẶT BÁNH M'VIE CAKE [${orderObj.id}] 🍮\n`;
  msg += `Khách hàng: ${name}\n`;
  msg += `SĐT: ${phone}\n`;
  msg += `Địa chỉ: ${address}\n`;
  msg += `Ngày/Giờ nhận: ${date || 'Sớm nhất có thể'}\n`;
  if (note) msg += `Ghi chú: ${note}\n`;
  msg += `---------------------------\n`;
  msg += `DANH SÁCH MÓN ĐẶT:\n`;
  cart.items.forEach((item, idx) => {
    msg += `${idx + 1}. ${item.name} (${item.optionName}) x${item.quantity} - ${formatVND(item.price * item.quantity)}\n`;
    if (item.note) msg += `   - Ghi chú: ${item.note}\n`;
  });
  msg += `---------------------------\n`;
  msg += `TỔNG CỘNG: ${formatVND(cart.getTotalPrice())}\n`;
  msg += `(Tiệm M'Vie Cake tại An Thạnh 73, Thuận An)`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(msg).catch(() => {});
  }

  const messengerUrl = CONFIG.store.messengerUrl || "https://m.me/61589434797320";

  closeCheckout();
  cart.clear();

  const successModal = document.getElementById('order-success-modal');
  if (successModal) {
    document.getElementById('order-success-text').value = msg;
    successModal.classList.remove('hidden');
  } else {
    window.open(messengerUrl, '_blank');
    showToast("Đơn hàng đã tạo thành công! Đang chuyển tiếp tới Fanpage M'Vie Cake...", "success");
  }
}

// Custom Cake Builder interactive submission
function setupCustomCakeBuilder() {
  const form = document.getElementById('custom-cake-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cakeType = document.querySelector('input[name="cake_type"]:checked')?.value || "Gato Flan Sinh Nhật Lớn";
    const cakeFlavor = document.getElementById('custom-flavor').value;
    const cakeText = document.getElementById('custom-text').value.trim();
    const receiveDate = document.getElementById('custom-date').value;
    const custContact = document.getElementById('custom-contact').value.trim();
    const extraNotes = document.getElementById('custom-notes').value.trim();

    let customMsg = `🎂 YÊU CẦU ĐẶT BÁNH TRANG TRÍ SINH NHẬT - M'VIE CAKE 🎂\n`;
    customMsg += `Loại bánh: ${cakeType}\n`;
    customMsg += `Vị bánh yêu thích: ${cakeFlavor}\n`;
    customMsg += `Lời chúc ghi trên bánh: ${cakeText || 'Không có'}\n`;
    customMsg += `Ngày & giờ muốn nhận (đặt trước 1-2 ngày): ${receiveDate || 'Thương lượng'}\n`;
    customMsg += `SĐT / Liên hệ: ${custContact}\n`;
    if (extraNotes) customMsg += `Mô tả mẫu trang trí riêng: ${extraNotes}\n`;
    customMsg += `\n*Lưu ý: Giá có thể thay đổi tùy theo mẫu trang trí và yêu cầu riêng của khách hàng.*`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(customMsg).catch(() => {});
    }

    showToast("Đã lưu yêu cầu! Đang chuyển đến Fanpage M'Vie Cake để shop tư vấn mẫu...", "success");
    setTimeout(() => {
      window.open(CONFIG.store.messengerUrl || "https://m.me/61589434797320", '_blank');
    }, 1200);
  });
}

// Hero Dynamic Deals Auto-Rotator
let heroDealsInterval = null;
let currentHeroDealIndex = 0;

function setupHeroDealsRotator() {
  const showcaseContainer = document.getElementById('hero-showcase-container');
  const cardWrapper = document.getElementById('hero-card-wrapper');
  const mainImg = document.getElementById('hero-main-img');
  const badgeWrap = document.getElementById('hero-img-badge-wrap');
  const badgeText = document.getElementById('hero-img-badge');
  const badgeIcon = document.getElementById('hero-badge-icon');
  const titleEl = document.getElementById('hero-img-title');
  const subEl = document.getElementById('hero-img-sub');
  const dotsContainer = document.getElementById('hero-deal-dots');
  const prevBtn = document.getElementById('hero-deal-prev');
  const nextBtn = document.getElementById('hero-deal-next');
  const floatingBadge = document.getElementById('hero-floating-badge');
  const floatingIcon = document.getElementById('floating-badge-icon');
  const floatingTitle = document.getElementById('floating-badge-title');
  const floatingSub = document.getElementById('floating-badge-sub');

  if (!cardWrapper || !mainImg || !titleEl) return;

  if (heroDealsInterval) {
    clearInterval(heroDealsInterval);
    heroDealsInterval = null;
  }

  // Real deals pool using M'Vie Cake signature menu items
  const defaultDeals = [
    {
      productId: 1,
      image: (CONFIG.hero && CONFIG.hero.heroImage) || "assets/gato-flan-choco.jpg",
      badge: (CONFIG.hero && CONFIG.hero.heroImageBadge) || "Món Tủ Signature",
      badgeIcon: "assets/icons/sparkling.png",
      badgeBg: "bg-[#FEF08A] text-amber-900",
      title: (CONFIG.hero && CONFIG.hero.heroImageTitle) || "Gato Flan Choco & Matcha",
      sub: (CONFIG.hero && CONFIG.hero.heroImageSubtitle) || "Size nhỏ 30k - 35k • Ổ lớn sinh nhật 160k - 200k",
      floatingIcon: "assets/icons/jelly.png",
      floatingTitle: "Flan Caramel Béo Ngậy",
      floatingSub: "Set 10 cái chỉ 85k ngọt dịu",
      floatingProductId: 4
    },
    {
      productId: 2,
      image: "assets/cake-matcha.jpg",
      badge: "Vị Trà Xanh Thanh Mát",
      badgeIcon: "assets/icons/star.png",
      badgeBg: "bg-emerald-100 text-emerald-900",
      title: "Gato Flan Matcha & Full Matcha",
      sub: "Bánh bông lan trà xanh mềm tan • 30k - 35k / cái",
      floatingIcon: "assets/icons/dessert.png",
      floatingTitle: "Combo 10 Hũ Panna Cotta",
      floatingSub: "Chỉ 75k sốt hoa quả tươi mát",
      floatingProductId: 5
    },
    {
      productId: 5,
      image: "assets/panna-cotta-jars.jpg",
      badge: "Best Seller Giải Nhiệt",
      badgeIcon: "assets/icons/dessert.png",
      badgeBg: "bg-rose-100 text-rose-900",
      title: "Panna Cotta Hũ Hoa Quả Tươi",
      sub: "Hũ 50ml chỉ 8k • Hũ 120ml chỉ 12k • Vị dâu, xoài, kiwi",
      floatingIcon: "assets/icons/cupcake.png",
      floatingTitle: "Set 4 Cupcake Xinh",
      floatingSub: "Chỉ 110k tặng kèm nến sinh nhật",
      floatingProductId: 7
    },
    {
      productId: 4,
      image: "assets/flan-caramel.jpg",
      badge: "Truyền Thống Béo Mịn",
      badgeIcon: "assets/icons/jelly.png",
      badgeBg: "bg-amber-100 text-amber-900",
      title: "Bánh Flan Caramel Trứng Sữa",
      sub: "Set 10 cái chỉ 85k • Vị caramel sánh ngọt, thơm ngậy",
      floatingIcon: "assets/icons/cake.png",
      floatingTitle: "Ổ Gato Flan Lớn",
      floatingSub: "Ổ tiệc sinh nhật từ 160k",
      floatingProductId: 1
    },
    {
      productId: 8,
      image: "assets/cake-custom-vintage.jpg",
      badge: "Thiết Kế Theo Yêu Cầu",
      badgeIcon: "assets/icons/birthday-cake.png",
      badgeBg: "bg-sky-100 text-sky-900",
      title: "Bánh Sinh Nhật Custom Riêng",
      sub: "Gato Flan Decor & Bento Cake • Đặt trước 1-2 ngày",
      floatingIcon: "assets/icons/heart.png",
      floatingTitle: "Giảm 40% Đường",
      floatingSub: "Vị ngọt dịu thanh khiết cho cả nhà",
      floatingProductId: 8
    },
    {
      productId: 7,
      image: "assets/cupcake-set.jpg",
      badge: "Combo Tiệc Sinh Nhật",
      badgeIcon: "assets/icons/cupcake.png",
      badgeBg: "bg-pink-100 text-pink-900",
      title: "Set Cupcake Xinh Xắn Trang Trí",
      sub: "Set 4 - 6 - 9 - 12 cái • Từ 110k • Decor hoa kem xinh",
      floatingIcon: "assets/icons/sparkling.png",
      floatingTitle: "Nướng Mới Mỗi Ngày",
      floatingSub: "Bánh ra lò thơm lừng từng mẻ",
      floatingProductId: 7
    }
  ];

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = defaultDeals.map((_, idx) => `
      <button 
        class="deal-dot-btn transition-all duration-300 rounded-full ${idx === currentHeroDealIndex ? 'w-5 h-1.5 bg-[#FEF08A]' : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'}"
        data-index="${idx}"
        title="Xem deal ${idx + 1}"
        aria-label="Xem deal ${idx + 1}"
      ></button>
    `).join('');

    dotsContainer.querySelectorAll('.deal-dot-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index);
        applyDeal(idx);
        restartTimer();
      };
    });
  }

  function applyDeal(index, isSmooth = true) {
    currentHeroDealIndex = (index + defaultDeals.length) % defaultDeals.length;
    const deal = defaultDeals[currentHeroDealIndex];

    if (!isSmooth) {
      updateDealDOM(deal);
      renderDots();
      return;
    }

    // Smooth transition: fade out slightly
    mainImg.style.opacity = '0.35';
    mainImg.style.transform = 'scale(0.98)';
    if (floatingBadge) {
      floatingBadge.style.opacity = '0.5';
      floatingBadge.style.transform = 'translateY(4px)';
    }

    setTimeout(() => {
      updateDealDOM(deal);
      renderDots();

      // Smooth transition: fade in
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
      if (floatingBadge) {
        floatingBadge.style.opacity = '1';
        floatingBadge.style.transform = 'translateY(0)';
      }
    }, 220);
  }

  function updateDealDOM(deal) {
    mainImg.src = deal.image;
    mainImg.alt = deal.title;
    if (badgeText) badgeText.textContent = deal.badge;
    if (badgeIcon) badgeIcon.src = deal.badgeIcon;
    if (badgeWrap && deal.badgeBg) {
      badgeWrap.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-xs ${deal.badgeBg}`;
    }
    titleEl.textContent = deal.title;
    subEl.textContent = deal.sub;

    if (floatingBadge && deal.floatingTitle) {
      if (floatingIcon) floatingIcon.src = deal.floatingIcon;
      if (floatingTitle) floatingTitle.textContent = deal.floatingTitle;
      if (floatingSub) floatingSub.textContent = deal.floatingSub;
    }
  }

  function pickRandomNextDeal() {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * defaultDeals.length);
    } while (nextIdx === currentHeroDealIndex && defaultDeals.length > 1);
    applyDeal(nextIdx);
  }

  function startTimer() {
    stopTimer();
    heroDealsInterval = setInterval(() => {
      pickRandomNextDeal();
    }, 3800);
  }

  function stopTimer() {
    if (heroDealsInterval) {
      clearInterval(heroDealsInterval);
      heroDealsInterval = null;
    }
  }

  function restartTimer() {
    startTimer();
  }

  // Click card to open quick view or custom cake
  cardWrapper.onclick = () => {
    const deal = defaultDeals[currentHeroDealIndex];
    if (deal && deal.productId) {
      if (deal.productId === 8) {
        const customEl = document.getElementById('custom-cake');
        if (customEl) customEl.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof openQuickView === 'function') {
        openQuickView(deal.productId);
      }
    }
  };

  // Click floating badge
  if (floatingBadge) {
    floatingBadge.onclick = (e) => {
      e.stopPropagation();
      const deal = defaultDeals[currentHeroDealIndex];
      const targetId = deal.floatingProductId || deal.productId;
      if (targetId === 8) {
        const customEl = document.getElementById('custom-cake');
        if (customEl) customEl.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof openQuickView === 'function' && targetId) {
        openQuickView(targetId);
      }
    };
  }

  // Prev / Next button click
  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      applyDeal(currentHeroDealIndex - 1);
      restartTimer();
    };
  }
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      pickRandomNextDeal();
      restartTimer();
    };
  }

  // Pause on hover & touch hold
  if (showcaseContainer) {
    showcaseContainer.onmouseenter = stopTimer;
    showcaseContainer.onmouseleave = startTimer;
    showcaseContainer.ontouchstart = stopTimer;
    showcaseContainer.ontouchend = startTimer;
  }

  // Initial render
  renderDots();
  startTimer();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  applyFullConfiguration();
  cart.updateUI();
  setupCustomCakeBuilder();
  setupHeroDealsRotator();
  init3DTiltCards();

  // Listen for cross-tab storage changes (if user changes something in Admin tab!)
  window.addEventListener('storage', (e) => {
    if (e.key === 'mvie_full_config') {
      applyFullConfiguration();
      setupHeroDealsRotator();
      init3DTiltCards();
    }
  });

  // Liquid Glass Dock dynamic scroll physics & scrollspy
  const glassDock = document.getElementById('liquid-glass-dock');
  const navPills = document.querySelectorAll('.liquid-glass-pill');

  if (glassDock) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        glassDock.classList.add('is-scrolled');
      } else {
        glassDock.classList.remove('is-scrolled');
      }

      // Simple active link highlight on scroll
      const sections = ['menu-section', 'flavors-section', 'price-table', 'custom-cake', 'about'];
      let currentSec = '';
      const scrollPos = window.scrollY + 200;

      for (const secId of sections) {
        const secEl = document.getElementById(secId);
        if (secEl) {
          const top = secEl.offsetTop;
          const height = secEl.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            currentSec = secId;
            break;
          }
        }
      }

      navPills.forEach(pill => {
        const href = pill.getAttribute('href');
        if (href && href === `#${currentSec}`) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // Mobile menu toggle & outside-click auto-close
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Auto-close menu when any navigation link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });

    // Close when clicking outside of the mobile sheet
    document.addEventListener('click', (e) => {
      if (!mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  }
});
