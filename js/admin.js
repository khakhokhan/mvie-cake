// M'Vie Cake - Comprehensive Admin CMS Logic

// ==========================================
// ADMIN SECURITY & PASSCODE SHIELD
// ==========================================
// Cryptographic SHA-256 Hash of passcode "010423"
const ADMIN_PASSCODE_HASH = "bbc6f061fd16b6f015ad33d80c2668cfcbdfaf142c5d1c2a2df4ed981b822d13";
const AUTH_SESSION_KEY = "mvie_admin_authenticated";

async function hashString(str) {
  try {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return str;
  }
}

async function verifyPasscode(input) {
  const hash = await hashString(input);
  return hash === ADMIN_PASSCODE_HASH || input === "010423";
}

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
  const gateEl = document.getElementById('admin-auth-gate');
  const appEl = document.getElementById('admin-app');

  if (isAuth) {
    if (gateEl) gateEl.classList.add('hidden');
    if (appEl) appEl.classList.remove('hidden');
    initAdmin();
  } else {
    if (gateEl) gateEl.classList.remove('hidden');
    if (appEl) appEl.classList.add('hidden');
    const input = document.getElementById('admin-passcode');
    if (input) setTimeout(() => input.focus(), 150);
  }
}

async function handleAdminLogin(e) {
  if (e) e.preventDefault();
  const inputEl = document.getElementById('admin-passcode');
  const errorMsg = document.getElementById('auth-error-msg');
  const card = document.getElementById('auth-card');
  if (!inputEl) return;

  const entered = inputEl.value.trim();
  const isValid = await verifyPasscode(entered);

  if (isValid) {
    sessionStorage.setItem(AUTH_SESSION_KEY, "true");
    if (errorMsg) errorMsg.classList.add('hidden');
    checkAdminAuth();
    showToast("Xác thực quản trị viên thành công!", "success");
  } else {
    inputEl.value = "";
    if (errorMsg) errorMsg.classList.remove('hidden');
    if (card) {
      card.classList.remove('shake');
      void card.offsetWidth; // trigger reflow
      card.classList.add('shake');
    }
    inputEl.focus();
  }
}

function handleAdminLogout() {
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  location.reload();
}

function togglePasscodeVisibility() {
  const input = document.getElementById('admin-passcode');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

let CONFIG = getFullConfig();

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

// Save & Sync All Changes
function saveAllChangesToStorage() {
  saveFullConfig(CONFIG);
  showToast("Đã lưu toàn bộ thay đổi! Website đã cập nhật tức thì.", "success");
}

// Tab Switcher
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.remove('bg-[#9BC7E8]', 'text-white', 'shadow-sm');
    btn.classList.add('bg-white', 'text-stone-600');
  });

  const activeContent = document.getElementById(`tab-${tabId}`);
  const activeBtn = document.getElementById(`tab-btn-${tabId}`);
  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('bg-[#9BC7E8]', 'text-white', 'shadow-sm');
    activeBtn.classList.remove('bg-white', 'text-stone-600');
  }
}

// ==========================================
// 1. HERO, TITLES & ANNOUNCEMENTS
// ==========================================
function loadHeroAndTitles() {
  document.getElementById('site-browserTitle').value = CONFIG.site.browserTitle || "";
  document.getElementById('site-topAnnouncement').value = CONFIG.site.topAnnouncement || "";
  document.getElementById('site-announcementSub').value = CONFIG.site.announcementSub || "";

  document.getElementById('hero-badge').value = CONFIG.hero.badge || "";
  document.getElementById('hero-titleLine1').value = CONFIG.hero.titleLine1 || "";
  document.getElementById('hero-titleHighlight').value = CONFIG.hero.titleHighlight || "";
  document.getElementById('hero-titleLine2').value = CONFIG.hero.titleLine2 || "";
  document.getElementById('hero-subtitle').value = CONFIG.hero.subtitle || "";

  document.getElementById('hero-img-preview').src = CONFIG.hero.heroImage || "assets/gato-flan-choco.jpg";
  document.getElementById('hero-imgBadge').value = CONFIG.hero.heroImageBadge || "";
  document.getElementById('hero-imgTitle').value = CONFIG.hero.heroImageTitle || "";
  document.getElementById('hero-imgSub').value = CONFIG.hero.heroImageSubtitle || "";

  document.getElementById('hero-policyTitle').value = CONFIG.hero.policyTitle || "";
  document.getElementById('hero-policyNote').value = CONFIG.hero.policyNote || "";
}

function handleHeroImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    CONFIG.hero.heroImage = e.target.result;
    document.getElementById('hero-img-preview').src = e.target.result;
    saveAllChangesToStorage();
    showToast("Đã cập nhật ảnh bìa Hero thành công!", "success");
  };
  reader.readAsDataURL(file);
}

function saveHeroSettings() {
  CONFIG.site.browserTitle = document.getElementById('site-browserTitle').value.trim();
  CONFIG.site.topAnnouncement = document.getElementById('site-topAnnouncement').value.trim();
  CONFIG.site.announcementSub = document.getElementById('site-announcementSub').value.trim();

  CONFIG.hero.badge = document.getElementById('hero-badge').value.trim();
  CONFIG.hero.titleLine1 = document.getElementById('hero-titleLine1').value.trim();
  CONFIG.hero.titleHighlight = document.getElementById('hero-titleHighlight').value.trim();
  CONFIG.hero.titleLine2 = document.getElementById('hero-titleLine2').value.trim();
  CONFIG.hero.subtitle = document.getElementById('hero-subtitle').value.trim();

  CONFIG.hero.heroImageBadge = document.getElementById('hero-imgBadge').value.trim();
  CONFIG.hero.heroImageTitle = document.getElementById('hero-imgTitle').value.trim();
  CONFIG.hero.heroImageSubtitle = document.getElementById('hero-imgSub').value.trim();

  CONFIG.hero.policyTitle = document.getElementById('hero-policyTitle').value.trim();
  CONFIG.hero.policyNote = document.getElementById('hero-policyNote').value.trim();

  saveAllChangesToStorage();
}

// ==========================================
// 2. PRODUCTS & PRICING
// ==========================================
function renderAdminProducts() {
  const container = document.getElementById('admin-products-list');
  if (!container) return;

  const search = (document.getElementById('admin-search-input')?.value || "").toLowerCase().trim();
  const catFilter = document.getElementById('admin-category-filter')?.value || "all";

  let list = CONFIG.products || [];

  if (catFilter !== "all") {
    list = list.filter(p => p.category === catFilter);
  }
  if (search) {
    list = list.filter(p => p.name.toLowerCase().includes(search) || p.desc.toLowerCase().includes(search));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-400">
        <p class="font-bold">Không tìm thấy món bánh nào phù hợp</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((prod) => {
    const originalIndex = CONFIG.products.findIndex(p => p.id === prod.id);
    const isAvailable = prod.isAvailable !== false;

    return `
      <div class="bg-white rounded-2xl border ${isAvailable ? 'border-stone-200' : 'border-rose-200 bg-rose-50/20'} overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow">
        <div>
          <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden">
            <img src="${prod.image}" alt="${prod.name}" class="w-full h-full object-cover">
            <div class="absolute top-2 left-2 flex flex-col gap-1">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.badgeColor || 'bg-amber-100 text-amber-900'}">
                ${prod.badge || 'Món Bánh'}
              </span>
              ${!isAvailable ? `
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                  Tạm hết hàng
                </span>
              ` : ''}
            </div>

            <!-- Position Control Buttons -->
            <div class="absolute top-2 right-2 flex gap-1 bg-black/60 rounded-xl p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onclick="moveProduct(${originalIndex}, -1)" class="w-6 h-6 text-white text-xs hover:bg-white/20 rounded flex items-center justify-center" title="Lên trên">↑</button>
              <button onclick="moveProduct(${originalIndex}, 1)" class="w-6 h-6 text-white text-xs hover:bg-white/20 rounded flex items-center justify-center" title="Xuống dưới">↓</button>
            </div>

            <!-- Quick Image Change Overlay -->
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <label class="cursor-pointer px-4 py-2 bg-white text-stone-800 rounded-xl text-xs font-bold shadow-lg hover:bg-stone-50 transition-all flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <span>Thay Ảnh Nhanh</span>
                <input type="file" accept="image/*" class="sr-only" onchange="quickChangeProductImage(${originalIndex}, this)">
              </label>
            </div>
          </div>

          <div class="p-4 space-y-3">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-bold text-sm text-mvie-choco line-clamp-1">${prod.name}</h3>
              <span class="text-[11px] text-stone-400 uppercase font-semibold shrink-0">${prod.category}</span>
            </div>
            
            <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">${prod.desc}</p>

            <!-- Options & Prices Preview -->
            <div class="bg-stone-50 rounded-xl p-2.5 text-xs space-y-1 border border-stone-100">
              <span class="font-bold text-[10px] uppercase text-stone-400 block mb-1">Bảng giá phân loại:</span>
              ${prod.options.map(opt => `
                <div class="flex justify-between items-center text-stone-700">
                  <span class="truncate max-w-[160px]">${opt.name}</span>
                  <span class="font-bold text-[#6CAAD8]">${formatVND(opt.price)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-stone-100 flex items-center justify-between gap-2 bg-stone-50/50">
          <button 
            onclick="toggleProductAvailability(${originalIndex})" 
            class="text-[11px] font-bold ${isAvailable ? 'text-stone-500 hover:text-rose-600' : 'text-emerald-600 hover:underline'}"
          >
            ${isAvailable ? '✕ Đánh dấu hết hàng' : '✓ Mở bán lại'}
          </button>
          <div class="flex items-center gap-1.5">
            <button onclick="editProduct(${originalIndex})" class="px-2.5 py-1.5 bg-white border border-stone-200 text-stone-700 rounded-lg text-xs font-bold hover:bg-stone-50 shadow-sm inline-flex items-center gap-1">
              <img src="assets/icons/edit.png" class="w-3.5 h-3.5 object-contain" alt="">
              <span>Sửa</span>
            </button>
            <button onclick="deleteProduct(${originalIndex})" class="px-2 py-1.5 bg-white border border-stone-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 shadow-sm inline-flex items-center gap-1" title="Xóa">
              <img src="assets/icons/trash.png" class="w-3.5 h-3.5 object-contain" alt="">
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterAdminProductsList() {
  renderAdminProducts();
}

function quickChangeProductImage(index, input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    CONFIG.products[index].image = e.target.result;
    saveAllChangesToStorage();
    renderAdminProducts();
    showToast(`Đã đổi ảnh cho "${CONFIG.products[index].name}"!`, "success");
  };
  reader.readAsDataURL(file);
}

function toggleProductAvailability(index) {
  CONFIG.products[index].isAvailable = !(CONFIG.products[index].isAvailable !== false);
  saveAllChangesToStorage();
  renderAdminProducts();
  showToast("Đã cập nhật trạng thái bán của món bánh.", "info");
}

function moveProduct(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= CONFIG.products.length) return;

  const temp = CONFIG.products[index];
  CONFIG.products[index] = CONFIG.products[targetIndex];
  CONFIG.products[targetIndex] = temp;

  saveAllChangesToStorage();
  renderAdminProducts();
}

// Bulk Price Adjust
function openBulkPriceModal() {
  document.getElementById('bulk-price-modal').classList.remove('hidden');
}

function applyBulkPriceChange() {
  const type = document.getElementById('bulk-type').value;
  const val = parseFloat(document.getElementById('bulk-value').value) || 0;

  if (val === 0) {
    showToast("Vui lòng nhập giá trị thay đổi khác 0!", "error");
    return;
  }

  CONFIG.products.forEach(p => {
    p.options.forEach(opt => {
      if (type === 'amount') {
        opt.price = Math.max(0, opt.price + val);
      } else if (type === 'percent') {
        opt.price = Math.max(0, Math.round(opt.price * (1 + val / 100)));
      }
    });
    if (p.options.length > 0) p.defaultPrice = p.options[0].price;
  });

  saveAllChangesToStorage();
  renderAdminProducts();
  document.getElementById('bulk-price-modal').classList.add('hidden');
  showToast(`Đã điều chỉnh giá toàn bộ menu thành công!`, "success");
}

// Product Edit/Add Modal
let currentEditingIndex = -1;

function populateCategorySelects() {
  const filterSelect = document.getElementById('admin-category-filter');
  const modalSelect = document.getElementById('prod-category');

  const categories = CONFIG.categories || [];

  if (filterSelect) {
    filterSelect.innerHTML = `<option value="all">Tất cả danh mục</option>` + 
      categories.filter(c => c.id !== 'all').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }

  if (modalSelect) {
    modalSelect.innerHTML = categories.filter(c => c.id !== 'all').map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  }
}

function openNewProductModal() {
  currentEditingIndex = -1;
  populateCategorySelects();
  document.getElementById('product-modal-title').textContent = "Thêm Món Bánh Mới";
  document.getElementById('prod-id').value = "";
  document.getElementById('prod-name').value = "";
  document.getElementById('prod-badge').value = "Món Mới";
  document.getElementById('prod-desc').value = "";
  document.getElementById('prod-note').value = "";
  document.getElementById('prod-available').checked = true;
  document.getElementById('prod-image-url').value = "";
  document.getElementById('prod-image-preview').src = "assets/logo.jpg";

  const container = document.getElementById('prod-options-container');
  container.innerHTML = "";
  addOptionRow("Size Tiêu Chuẩn (1 cái)", 50000);

  document.getElementById('product-modal').classList.remove('hidden');
}

function editProduct(index) {
  currentEditingIndex = index;
  populateCategorySelects();
  const prod = CONFIG.products[index];

  document.getElementById('product-modal-title').textContent = `Chỉnh Sửa: ${prod.name}`;
  document.getElementById('prod-id').value = prod.id;
  document.getElementById('prod-name').value = prod.name;
  document.getElementById('prod-category').value = prod.category;
  document.getElementById('prod-badge').value = prod.badge || "";
  document.getElementById('prod-desc').value = prod.desc || "";
  document.getElementById('prod-note').value = prod.note || "";
  document.getElementById('prod-available').checked = prod.isAvailable !== false;
  document.getElementById('prod-image-url').value = prod.image.startsWith('data:') ? '' : prod.image;
  document.getElementById('prod-image-preview').src = prod.image;

  const container = document.getElementById('prod-options-container');
  container.innerHTML = "";
  prod.options.forEach(opt => {
    addOptionRow(opt.name, opt.price);
  });

  document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.add('hidden');
}

function addOptionRow(name = "", price = 30000) {
  const container = document.getElementById('prod-options-container');
  const div = document.createElement('div');
  div.className = "flex items-center gap-2 option-row";
  div.innerHTML = `
    <input type="text" placeholder="Tên phân loại (VD: Size nhỏ, Set 6 hũ...)" value="${name}" class="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 opt-name" required>
    <input type="number" placeholder="Giá tiền" value="${price}" class="w-28 px-3 py-1.5 text-xs rounded-xl border border-stone-200 opt-price" required>
    <button type="button" onclick="this.parentElement.remove()" class="text-stone-400 hover:text-rose-500 p-1" title="Xóa">✕</button>
  `;
  container.appendChild(div);
}

function handleProductImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('prod-image-preview').src = e.target.result;
    document.getElementById('prod-image-url').value = "";
  };
  reader.readAsDataURL(file);
}

function saveProduct(e) {
  e.preventDefault();
  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const badge = document.getElementById('prod-badge').value.trim();
  const desc = document.getElementById('prod-desc').value.trim();
  const note = document.getElementById('prod-note').value.trim();
  const isAvailable = document.getElementById('prod-available').checked;
  const image = document.getElementById('prod-image-preview').src;

  const optionRows = document.querySelectorAll('.option-row');
  const options = [];
  optionRows.forEach(row => {
    const optName = row.querySelector('.opt-name').value.trim();
    const optPrice = parseInt(row.querySelector('.opt-price').value) || 0;
    if (optName) {
      options.push({ name: optName, price: optPrice });
    }
  });

  if (options.length === 0) {
    showToast("Vui lòng thêm ít nhất 1 phân loại giá cho sản phẩm!", "error");
    return;
  }

  const productData = {
    id: currentEditingIndex >= 0 ? CONFIG.products[currentEditingIndex].id : Date.now(),
    name,
    category,
    badge: badge || "Bánh Tươi",
    badgeColor: "bg-amber-100 text-amber-900",
    image,
    desc,
    note,
    isAvailable,
    options,
    defaultPrice: options[0].price
  };

  if (currentEditingIndex >= 0) {
    CONFIG.products[currentEditingIndex] = productData;
  } else {
    CONFIG.products.push(productData);
  }

  saveAllChangesToStorage();
  renderAdminProducts();
  closeProductModal();
}

function deleteProduct(index) {
  if (confirm(`Bạn có chắc muốn xóa món "${CONFIG.products[index].name}" khỏi menu?`)) {
    CONFIG.products.splice(index, 1);
    saveAllChangesToStorage();
    renderAdminProducts();
    showToast("Đã xóa món bánh thành công.", "info");
  }
}

// ==========================================
// 3. CATEGORIES MANAGEMENT
// ==========================================
function renderCategoriesList() {
  const container = document.getElementById('admin-categories-list');
  if (!container) return;

  const cats = CONFIG.categories || [];
  container.innerHTML = cats.map((cat, idx) => `
    <div class="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200">
      <div class="flex items-center gap-2">
        <span class="text-xs font-mono text-stone-400">[${cat.id}]</span>
        <input 
          type="text" 
          value="${cat.name}" 
          class="px-2 py-1 text-xs font-bold rounded-lg border border-transparent hover:border-stone-200 bg-transparent focus:bg-white focus:outline-none"
          onchange="updateCategoryName(${idx}, this.value)"
        >
      </div>
      <div>
        ${cat.id !== 'all' ? `
          <button onclick="deleteCategory(${idx})" class="text-xs text-rose-600 hover:underline px-2 py-1">Xóa</button>
        ` : '<span class="text-[11px] text-stone-400 italic">Mặc định</span>'}
      </div>
    </div>
  `).join('');

  populateCategorySelects();
}

function updateCategoryName(idx, newName) {
  if (newName.trim()) {
    CONFIG.categories[idx].name = newName.trim();
    saveAllChangesToStorage();
    showToast("Đã cập nhật tên danh mục!", "success");
  }
}

function addNewCategory() {
  const nameInput = document.getElementById('new-cat-name');
  const name = nameInput.value.trim();
  if (!name) return;

  const slug = 'cat_' + Date.now().toString().slice(-4);
  CONFIG.categories.push({ id: slug, name });
  nameInput.value = "";
  saveAllChangesToStorage();
  renderCategoriesList();
  showToast(`Đã thêm danh mục "${name}"!`, "success");
}

function deleteCategory(idx) {
  const cat = CONFIG.categories[idx];
  if (confirm(`Xóa danh mục "${cat.name}"? Các món bánh thuộc danh mục này vẫn được giữ lại.`)) {
    CONFIG.categories.splice(idx, 1);
    saveAllChangesToStorage();
    renderCategoriesList();
    showToast("Đã xóa danh mục.", "info");
  }
}

// ==========================================
// 4. ABOUT & REVIEWS
// ==========================================
function loadAboutAndReviews() {
  document.getElementById('about-title').value = CONFIG.about.title || "";
  document.getElementById('about-badge').value = CONFIG.about.badge || "";
  document.getElementById('about-desc').value = CONFIG.about.desc || "";
  document.getElementById('about-img-preview').src = CONFIG.about.image || "assets/baking-process.jpg";

  renderAboutFeaturesEditor();
  renderFeedbacksEditor();
}

function handleAboutImageUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    CONFIG.about.image = e.target.result;
    document.getElementById('about-img-preview').src = e.target.result;
    saveAllChangesToStorage();
    showToast("Đã cập nhật ảnh làm bánh!", "success");
  };
  reader.readAsDataURL(file);
}

function renderAboutFeaturesEditor() {
  const container = document.getElementById('about-features-editor');
  if (!container || !CONFIG.about.features) return;

  container.innerHTML = CONFIG.about.features.map((feat, idx) => `
    <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
          ${feat.icon && feat.icon.includes('/') ? `<img src="${feat.icon}" class="w-6 h-6 object-contain" alt="">` : `<img src="assets/icons/sparkling.png" class="w-6 h-6 object-contain" alt="">`}
        </div>
        <input type="text" value="${feat.icon || 'assets/icons/sparkling.png'}" class="w-1/3 px-2 py-1 text-xs rounded-lg border border-stone-200 feat-icon" placeholder="Icon (VD: assets/icons/milk-bottle.png)">
        <input type="text" value="${feat.title}" class="flex-1 px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-200 feat-title" placeholder="Tiêu đề cam kết">
      </div>
      <textarea rows="2" class="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 feat-desc" placeholder="Mô tả cam kết">${feat.desc}</textarea>
    </div>
  `).join('');
}

function renderFeedbacksEditor() {
  const container = document.getElementById('feedbacks-editor');
  if (!container || !CONFIG.feedbacks) return;

  container.innerHTML = CONFIG.feedbacks.map((fb, idx) => `
    <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row gap-3 items-start justify-between">
      <div class="flex-1 w-full space-y-2">
        <div class="flex gap-2">
          <input type="text" value="${fb.name}" class="w-1/3 px-2.5 py-1 text-xs font-bold rounded-lg border border-stone-200 fb-name" placeholder="Tên khách">
          <input type="text" value="${fb.location}" class="flex-1 px-2.5 py-1 text-xs rounded-lg border border-stone-200 fb-loc" placeholder="Địa chỉ / Tỉnh thành">
        </div>
        <textarea rows="2" class="w-full px-2.5 py-1 text-xs rounded-lg border border-stone-200 fb-content" placeholder="Nội dung đánh giá">${fb.content}</textarea>
      </div>
      <button onclick="deleteFeedbackRow(${idx})" class="text-xs text-rose-600 hover:underline shrink-0">Xóa</button>
    </div>
  `).join('');
}

function addNewFeedbackRow() {
  CONFIG.feedbacks.push({
    id: Date.now(),
    name: "Khách Hàng Mới",
    location: "Thuận An, Bình Dương",
    avatar: "KH",
    stars: 5,
    content: "Bánh của tiệm ăn rất vừa miệng, ít ngọt và thơm bơ. Đóng gói rất chu đáo!"
  });
  renderFeedbacksEditor();
}

function deleteFeedbackRow(idx) {
  CONFIG.feedbacks.splice(idx, 1);
  renderFeedbacksEditor();
}

function saveAboutAndReviews() {
  CONFIG.about.title = document.getElementById('about-title').value.trim();
  CONFIG.about.badge = document.getElementById('about-badge').value.trim();
  CONFIG.about.desc = document.getElementById('about-desc').value.trim();

  // Collect features
  const featureCards = document.querySelectorAll('#about-features-editor > div');
  CONFIG.about.features = Array.from(featureCards).map(card => ({
    icon: card.querySelector('.feat-icon').value.trim(),
    title: card.querySelector('.feat-title').value.trim(),
    desc: card.querySelector('.feat-desc').value.trim()
  }));

  // Collect feedbacks
  const fbCards = document.querySelectorAll('#feedbacks-editor > div');
  CONFIG.feedbacks = Array.from(fbCards).map((card, i) => ({
    id: i + 1,
    name: card.querySelector('.fb-name').value.trim(),
    location: card.querySelector('.fb-loc').value.trim(),
    avatar: card.querySelector('.fb-name').value.trim().slice(0, 2).toUpperCase(),
    stars: 5,
    content: card.querySelector('.fb-content').value.trim()
  }));

  saveAllChangesToStorage();
}

// ==========================================
// 5. STORE & LOGO
// ==========================================
function loadStoreProfile() {
  document.getElementById('store-logo-preview').src = CONFIG.store.logoUrl || "assets/logo.jpg";
  document.getElementById('admin-header-logo').src = CONFIG.store.logoUrl || "assets/logo.jpg";
  document.getElementById('admin-header-store-name').textContent = CONFIG.store.name || "M'Vie Cake";

  document.getElementById('store-name').value = CONFIG.store.name || "";
  document.getElementById('store-hotline').value = CONFIG.store.hotline || "";
  document.getElementById('store-address').value = CONFIG.store.address || "";
  document.getElementById('store-facebookUrl').value = CONFIG.store.facebookUrl || "";
  document.getElementById('store-messengerUrl').value = CONFIG.store.messengerUrl || "";
  document.getElementById('store-workingHours').value = CONFIG.store.workingHours || "";
}

function handleStoreLogoUpload(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    CONFIG.store.logoUrl = e.target.result;
    document.getElementById('store-logo-preview').src = e.target.result;
    document.getElementById('admin-header-logo').src = e.target.result;
    saveAllChangesToStorage();
    showToast("Đã cập nhật Logo tiệm!", "success");
  };
  reader.readAsDataURL(file);
}

function resetDefaultStoreLogo() {
  CONFIG.store.logoUrl = "assets/logo.jpg";
  document.getElementById('store-logo-preview').src = "assets/logo.jpg";
  document.getElementById('admin-header-logo').src = "assets/logo.jpg";
  saveAllChangesToStorage();
  showToast("Đã khôi phục logo cún mặc định.", "info");
}

function saveStoreProfile() {
  CONFIG.store.name = document.getElementById('store-name').value.trim();
  CONFIG.store.hotline = document.getElementById('store-hotline').value.trim();
  CONFIG.store.address = document.getElementById('store-address').value.trim();
  CONFIG.store.facebookUrl = document.getElementById('store-facebookUrl').value.trim();
  CONFIG.store.messengerUrl = document.getElementById('store-messengerUrl').value.trim();
  CONFIG.store.workingHours = document.getElementById('store-workingHours').value.trim();

  document.getElementById('admin-header-store-name').textContent = CONFIG.store.name;
  saveAllChangesToStorage();
}

// ==========================================
// 6. ORDERS
// ==========================================
function renderOrders() {
  const container = document.getElementById('admin-orders-list');
  const badge = document.getElementById('admin-orders-badge');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('mvie_orders') || '[]');
  
  if (badge) {
    badge.textContent = orders.length;
    badge.classList.toggle('hidden', orders.length === 0);
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-400">
        <span class="text-4xl block mb-2">📦</span>
        <p class="font-bold text-stone-600">Chưa có đơn hàng nào</p>
        <p class="text-xs">Khi khách đặt hàng trên web, đơn sẽ được lưu tự động tại đây!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map((ord, idx) => `
    <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
        <div>
          <span class="font-bold text-sm text-mvie-choco">#${ord.id} - ${ord.name}</span>
          <span class="text-xs text-stone-400 ml-2">🕒 ${ord.createdAt}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-[#6CAAD8]">${formatVND(ord.total)}</span>
          <button onclick="deleteSingleOrder(${idx})" class="text-stone-300 hover:text-rose-500 p-1" title="Xóa đơn">✕</button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
        <div><strong>SĐT:</strong> <a href="tel:${ord.phone}" class="text-blue-600 font-bold hover:underline">${ord.phone}</a></div>
        <div><strong>Ngày muốn nhận:</strong> ${ord.date}</div>
        <div class="sm:col-span-2"><strong>Địa chỉ:</strong> ${ord.address}</div>
        ${ord.note ? `<div class="sm:col-span-2 text-amber-700 italic"><strong>Ghi chú:</strong> ${ord.note}</div>` : ''}
      </div>

      <div class="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
        <strong class="text-stone-700 block mb-1">Chi tiết bánh:</strong>
        ${ord.items.map(i => `
          <div class="flex justify-between text-stone-600">
            <span>• ${i.name} (${i.optionName}) x${i.quantity}</span>
            <span>${formatVND(i.price * i.quantity)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function deleteSingleOrder(idx) {
  const orders = JSON.parse(localStorage.getItem('mvie_orders') || '[]');
  orders.splice(idx, 1);
  localStorage.setItem('mvie_orders', JSON.stringify(orders));
  renderOrders();
  showToast("Đã xóa đơn hàng.", "info");
}

function clearOrdersHistory() {
  if (confirm("Bạn có chắc muốn xóa tất cả lịch sử đơn hàng?")) {
    localStorage.removeItem('mvie_orders');
    renderOrders();
    showToast("Đã dọn sạch lịch sử đơn hàng.", "info");
  }
}

function exportOrdersToCSV() {
  const orders = JSON.parse(localStorage.getItem('mvie_orders') || '[]');
  if (orders.length === 0) {
    showToast("Chưa có đơn hàng nào để xuất!", "info");
    return;
  }

  let csv = "Mã Đơn,Thời Gian,Khách Hàng,SĐT,Địa Chỉ,Ngày Nhận,Tổng Tiền,Ghi Chú\n";
  orders.forEach(o => {
    csv += `"${o.id}","${o.createdAt}","${o.name}","${o.phone}","${o.address}","${o.date}","${o.total}","${o.note || ''}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `don-hang-mvie-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Đã xuất file đơn hàng CSV!", "success");
}

// ==========================================
// 7. BACKUP & FACTORY RESET
// ==========================================
function exportFullConfigBackup() {
  const data = {
    config: CONFIG,
    exportedAt: new Date().toISOString()
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mvie-cake-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Đã tải về file sao lưu toàn bộ dữ liệu!", "success");
}

function importFullConfigBackup(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.config) {
        CONFIG = data.config;
      } else if (data.products) {
        CONFIG.products = data.products;
      }
      saveFullConfig(CONFIG);
      initAdmin();
      showToast("Khôi phục toàn bộ cấu hình thành công!", "success");
    } catch (err) {
      showToast("File sao lưu không hợp lệ!", "error");
    }
  };
  reader.readAsText(file);
}

function resetFullConfigToDefault() {
  if (confirm("Bạn có chắc muốn đưa TOÀN BỘ website (tiêu đề, ảnh hero, menu bánh, giá tiền) về lại mặc định ban đầu của M'Vie Cake?")) {
    resetFullConfig();
    CONFIG = getFullConfig();
    initAdmin();
    showToast("Đã khôi phục về trạng thái chuẩn ban đầu!", "success");
  }
}

// ==========================================
// THEME & 3D DNA CAROUSEL SETTINGS
// ==========================================
const THEME_PRESETS = {
  mvie_default: {
    primaryColor: "#9BC7E8",
    primaryHover: "#82b9df",
    accentYellow: "#FEF08A",
    accentPink: "#FDA4AF",
    backgroundColor: "#FCFBF7",
    textColor: "#2D231E"
  },
  strawberry_pink: {
    primaryColor: "#F472B6",
    primaryHover: "#ec4899",
    accentYellow: "#FEF08A",
    accentPink: "#FB7185",
    backgroundColor: "#FFF5F7",
    textColor: "#4A202A"
  },
  matcha_green: {
    primaryColor: "#86EFAC",
    primaryHover: "#4ade80",
    accentYellow: "#FEF08A",
    accentPink: "#FCA5A5",
    backgroundColor: "#F7FAF7",
    textColor: "#1F382B"
  },
  choco_caramel: {
    primaryColor: "#D97706",
    primaryHover: "#b45309",
    accentYellow: "#FDE68A",
    accentPink: "#F87171",
    backgroundColor: "#FDF8F3",
    textColor: "#382314"
  },
  lavender_purple: {
    primaryColor: "#C084FC",
    primaryHover: "#a855f7",
    accentYellow: "#FEF08A",
    accentPink: "#F472B6",
    backgroundColor: "#FAF7FD",
    textColor: "#2E1065"
  },
  warm_latte: {
    primaryColor: "#B45309",
    primaryHover: "#92400e",
    accentYellow: "#FEF08A",
    accentPink: "#FCA5A5",
    backgroundColor: "#F5F5F4",
    textColor: "#292524"
  }
};

function loadThemeSettings() {
  if (!CONFIG.theme) {
    CONFIG.theme = { ...(DEFAULT_CONFIG.theme || {}) };
  }
  const t = CONFIG.theme;

  const setColor = (id, val) => {
    const picker = document.getElementById(id);
    const hex = document.getElementById(id + '-hex');
    if (picker) picker.value = val;
    if (hex) hex.value = val;
  };

  setColor('theme-primaryColor', t.primaryColor || "#9BC7E8");
  setColor('theme-primaryHover', t.primaryHover || "#82b9df");
  setColor('theme-accentYellow', t.accentYellow || "#FEF08A");
  setColor('theme-accentPink', t.accentPink || "#FDA4AF");
  setColor('theme-backgroundColor', t.backgroundColor || "#EEF7FD");
  setColor('theme-textColor', t.textColor || "#2D231E");

  // DNA Carousel
  const dnaEnabled = document.getElementById('theme-dnaEnabled');
  if (dnaEnabled) dnaEnabled.checked = (t.dnaEnabled !== false);

  const dnaAutoPlay = document.getElementById('theme-dnaAutoPlay');
  if (dnaAutoPlay) dnaAutoPlay.checked = (t.dnaAutoPlay !== false);

  const dnaSpeed = document.getElementById('theme-dnaSpeed');
  const dnaSpeedVal = document.getElementById('theme-dnaSpeed-val');
  if (dnaSpeed) {
    dnaSpeed.value = t.dnaSpeed || 0.22;
    if (dnaSpeedVal) dnaSpeedVal.textContent = dnaSpeed.value;
  }

  // Aisol Ripple Dots
  const rippleDotsEnabled = document.getElementById('theme-rippleDotsEnabled');
  if (rippleDotsEnabled) rippleDotsEnabled.checked = (t.rippleDotsEnabled !== false);

  const rippleDotsTapRing = document.getElementById('theme-rippleDotsTapRing');
  if (rippleDotsTapRing) rippleDotsTapRing.checked = (t.rippleDotsTapRing !== false);

  setColor('theme-rippleDotsBg', t.rippleDotsBg || t.backgroundColor || "#EEF7FD");
  setColor('theme-rippleDotsColor', t.rippleDotsColor || "#FDE047");

  const rippleDotsSize = document.getElementById('theme-rippleDotsSize');
  const rippleDotsSizeVal = document.getElementById('theme-rippleDotsSize-val');
  if (rippleDotsSize) {
    rippleDotsSize.value = t.rippleDotsSize || 2.8;
    if (rippleDotsSizeVal) rippleDotsSizeVal.textContent = (t.rippleDotsSize || 2.8) + " px";
  }

  const rippleDotsSpacing = document.getElementById('theme-rippleDotsSpacing');
  const rippleDotsSpacingVal = document.getElementById('theme-rippleDotsSpacing-val');
  if (rippleDotsSpacing) {
    rippleDotsSpacing.value = t.rippleDotsSpacing || 28;
    if (rippleDotsSpacingVal) rippleDotsSpacingVal.textContent = (t.rippleDotsSpacing || 28) + " px";
  }

  updateThemePreview();
}

function syncThemeColorInput(colorInputId, hexInputId) {
  const colorInput = document.getElementById(colorInputId);
  const hexInput = document.getElementById(hexInputId);
  if (colorInput && hexInput) {
    hexInput.value = colorInput.value;
  }
  updateThemePreview();
}

function syncThemeHexInput(hexInputId, colorInputId) {
  const hexInput = document.getElementById(hexInputId);
  const colorInput = document.getElementById(colorInputId);
  if (hexInput && colorInput) {
    let val = hexInput.value.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      colorInput.value = val;
      updateThemePreview();
    }
  }
}

function updateThemePreview() {
  const previewBox = document.getElementById('theme-preview-box');
  const previewBadge = document.getElementById('theme-preview-badge');
  const previewTitle = document.getElementById('theme-preview-title');
  const previewBtn = document.getElementById('theme-preview-btn');
  if (!previewBox) return;

  const bg = document.getElementById('theme-backgroundColor')?.value || '#EEF7FD';
  const text = document.getElementById('theme-textColor')?.value || '#2D231E';
  const primary = document.getElementById('theme-primaryColor')?.value || '#9BC7E8';
  const yellow = document.getElementById('theme-accentYellow')?.value || '#FEF08A';

  previewBox.style.backgroundColor = bg;
  if (previewTitle) previewTitle.style.color = text;
  if (previewBadge) {
    previewBadge.style.backgroundColor = yellow;
    previewBadge.style.color = '#78350F';
  }
  if (previewBtn) {
    previewBtn.style.backgroundColor = primary;
  }
}

function applyThemePreset(presetKey) {
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return;

  const setColor = (id, val) => {
    const picker = document.getElementById(id);
    const hex = document.getElementById(id + '-hex');
    if (picker) picker.value = val;
    if (hex) hex.value = val;
  };

  setColor('theme-primaryColor', preset.primaryColor);
  setColor('theme-primaryHover', preset.primaryHover);
  setColor('theme-accentYellow', preset.accentYellow);
  setColor('theme-accentPink', preset.accentPink);
  setColor('theme-backgroundColor', preset.backgroundColor);
  setColor('theme-textColor', preset.textColor);

  if (preset.backgroundColor) {
    setColor('theme-rippleDotsBg', preset.backgroundColor);
  }
  if (preset.accentYellow) {
    setColor('theme-rippleDotsColor', preset.accentYellow);
  }

  updateThemePreview();
  showToast(`Đã chọn bảng màu "${presetKey}". Nhấn "Lưu Toàn Bộ Cài Đặt" để áp dụng!`, "info");
}

function saveThemeSettings() {
  if (!CONFIG.theme) CONFIG.theme = {};

  CONFIG.theme.primaryColor = document.getElementById('theme-primaryColor').value;
  CONFIG.theme.primaryHover = document.getElementById('theme-primaryHover').value;
  CONFIG.theme.accentYellow = document.getElementById('theme-accentYellow').value;
  CONFIG.theme.accentPink = document.getElementById('theme-accentPink').value;
  CONFIG.theme.backgroundColor = document.getElementById('theme-backgroundColor').value;
  CONFIG.theme.textColor = document.getElementById('theme-textColor').value;

  // DNA Carousel
  CONFIG.theme.dnaEnabled = document.getElementById('theme-dnaEnabled').checked;
  CONFIG.theme.dnaAutoPlay = document.getElementById('theme-dnaAutoPlay').checked;
  CONFIG.theme.dnaSpeed = parseFloat(document.getElementById('theme-dnaSpeed').value) || 0.22;

  // Aisol Ripple Dots
  const rippleDotsEnabled = document.getElementById('theme-rippleDotsEnabled');
  if (rippleDotsEnabled) CONFIG.theme.rippleDotsEnabled = rippleDotsEnabled.checked;

  const rippleDotsTapRing = document.getElementById('theme-rippleDotsTapRing');
  if (rippleDotsTapRing) CONFIG.theme.rippleDotsTapRing = rippleDotsTapRing.checked;

  const rippleDotsBg = document.getElementById('theme-rippleDotsBg');
  if (rippleDotsBg) CONFIG.theme.rippleDotsBg = rippleDotsBg.value;

  const rippleDotsColor = document.getElementById('theme-rippleDotsColor');
  if (rippleDotsColor) CONFIG.theme.rippleDotsColor = rippleDotsColor.value;

  const rippleDotsSize = document.getElementById('theme-rippleDotsSize');
  if (rippleDotsSize) CONFIG.theme.rippleDotsSize = parseFloat(rippleDotsSize.value) || 2.8;

  const rippleDotsSpacing = document.getElementById('theme-rippleDotsSpacing');
  if (rippleDotsSpacing) CONFIG.theme.rippleDotsSpacing = parseInt(rippleDotsSpacing.value) || 28;

  saveAllChangesToStorage();
  showToast("Đã lưu bảng màu, 3D DNA Carousel & Nền Ripple Dots thành công!", "success");
}

// Init Admin Dashboard
function initAdmin() {
  CONFIG = getFullConfig();
  loadHeroAndTitles();
  populateCategorySelects();
  renderAdminProducts();
  renderCategoriesList();
  loadAboutAndReviews();
  loadStoreProfile();
  loadThemeSettings();
  renderOrders();
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});
