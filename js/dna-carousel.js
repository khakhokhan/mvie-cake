// M'Vie Cake - DNA Carousel Component
// Inspired by Framer DNA-Carousel (by Karim Saif)
// Pure 3D Double-Helix Carousel with Inertia, Drag & Auto-Rotation

class DNACarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    const isTiny = window.innerWidth < 420;
    const isMobile = window.innerWidth < 640;
    this.options = {
      cardWidth: isTiny ? 170 : (isMobile ? 190 : 230),
      cardHeight: isTiny ? 245 : (isMobile ? 270 : 320),
      gap: isTiny ? 14 : (isMobile ? 18 : 26),
      curveDepth: isTiny ? 120 : (isMobile ? 140 : 180),
      curveHeight: isTiny ? 30 : (isMobile ? 40 : 55),
      helixSpread: isTiny ? 45 : (isMobile ? 60 : 85),
      perspective: 1100,
      activeScale: 1,
      inactiveScale: 0.78,
      rotation: 30,
      tilt: 10,
      blur: 3,
      inactiveOpacity: 0.5,
      dragSensitivity: 1.35,
      inertia: 0.93,
      snapStrength: 0.18,
      autoPlay: true,
      autoSpeed: 0.22,
      ...options
    };

    this.position = 0;
    this.velocity = 0;
    this.rafId = null;
    this.isDragging = false;
    this.startX = 0;
    this.startPos = 0;
    this.lastX = 0;
    this.lastTime = 0;
    this.lastFrameTime = performance.now();
    this.cards = [];
    this.items = [];

    this.init();
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  wrap(value, length) {
    if (length <= 0) return 0;
    const result = value % length;
    return result < 0 ? result + length : result;
  }

  shortestDistance(index, position, count) {
    let distance = index - position;
    if (distance > count / 2) distance -= count;
    if (distance < -count / 2) distance += count;
    return distance;
  }

  easeOutCubic(value) {
    const t = this.clamp(value, 0, 1);
    return 1 - Math.pow(1 - t, 3);
  }

  init() {
    this.container.innerHTML = "";
    this.container.style.position = "relative";
    this.container.style.perspective = `${this.options.perspective}px`;
    this.container.style.overflow = "hidden";
    this.container.style.userSelect = "none";
    this.container.style.touchAction = "pan-y";
    this.container.style.cursor = "grab";

    this.setupItems();
    this.bindEvents();
    this.animate();
  }

  setupItems() {
    const products = (typeof CONFIG !== 'undefined' && CONFIG.products) ? CONFIG.products : [];
    this.items = products.length > 0 ? products : [
      { name: "Gato Flan Choco", price: 30000, image: "assets/gato-flan-choco.jpg", badge: "Món Tủ" },
      { name: "Gato Flan Matcha", price: 30000, image: "assets/cake-matcha.jpg", badge: "Thơm Vị Trà" },
      { name: "Gato Flan Full Matcha", price: 35000, image: "assets/cake-matcha.jpg", badge: "Đặc Biệt" },
      { name: "Bánh Flan Caramel", price: 85000, image: "assets/flan-caramel.jpg", badge: "Set 10 Cái" },
      { name: "Panna Cotta 50ml", price: 8000, image: "assets/panna-cotta.jpg", badge: "Thanh Mát" },
      { name: "Panna Cotta 120ml", price: 12000, image: "assets/panna-cotta-jars.jpg", badge: "Size Lớn" },
      { name: "Set Cupcake Xinh", price: 110000, image: "assets/cupcake-set.jpg", badge: "Set 4-12" }
    ];

    this.cards = this.items.map((item, idx) => {
      const card = document.createElement("div");
      card.className = "dna-card";
      card.style.position = "absolute";
      card.style.left = "50%";
      card.style.top = "50%";
      card.style.width = `${this.options.cardWidth}px`;
      card.style.height = `${this.options.cardHeight}px`;
      card.style.marginLeft = `${-this.options.cardWidth / 2}px`;
      card.style.marginTop = `${-this.options.cardHeight / 2}px`;
      card.style.transformStyle = "preserve-3d";
      card.style.willChange = "transform, opacity, filter";
      card.style.borderRadius = "24px";
      card.style.overflow = "hidden";
      card.style.boxShadow = "0 15px 35px -5px rgba(0, 0, 0, 0.25)";
      card.style.border = "3px solid rgba(255, 255, 255, 0.9)";
      card.style.backgroundColor = "#FFFFFF";
      card.style.cursor = "pointer";

      const minPrice = item.options ? Math.min(...item.options.map(o => o.price)) : (item.price || item.defaultPrice || 30000);
      const formattedPrice = typeof formatVND === 'function' ? formatVND(minPrice) : (minPrice.toLocaleString('vi-VN') + ' đ');

      card.innerHTML = `
        <div class="relative w-full h-full flex flex-col justify-between group">
          <img src="${item.image}" alt="${item.name}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" draggable="false" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
          
          <div class="relative p-3 z-10 flex justify-between items-start">
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/95 text-stone-800 shadow-sm backdrop-blur-sm">
              ${item.badge || 'M’Vie'}
            </span>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 shadow-sm inline-flex items-center gap-1">
              <img src="assets/icons/3d.png" class="w-3 h-3 object-contain inline-block" alt="">
              <span>3D</span>
            </span>
          </div>

          <div class="relative p-4 z-10 text-white">
            <h4 class="font-bold text-sm leading-tight text-white mb-1 line-clamp-1">${item.name}</h4>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-[#FEF08A]">${formattedPrice}</span>
              <span class="text-[10px] font-semibold bg-[#9BC7E8] text-white px-2 py-0.5 rounded-lg shadow-sm">
                Xem món →
              </span>
            </div>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        // Snap to this card or open modal
        const count = this.cards.length;
        const currentWrapped = this.wrap(this.position, count);
        const dist = this.shortestDistance(idx, currentWrapped, count);
        if (Math.abs(dist) < 0.3) {
          if (typeof openQuickView === 'function' && item.id) {
            openQuickView(item.id);
          }
        } else {
          this.position += dist;
        }
      });

      this.container.appendChild(card);
      return card;
    });

    this.render();
  }

  render() {
    const count = this.cards.length;
    if (!count) return;

    const position = this.wrap(this.position, count);
    const centerWidth = this.options.cardWidth + this.options.gap;
    const maxVisibleDistance = Math.max(3, Math.ceil(count / 2));

    this.cards.forEach((card, index) => {
      const distance = this.shortestDistance(index, position, count);
      const absoluteDistance = Math.abs(distance);
      const normalizedDistance = this.clamp(absoluteDistance / maxVisibleDistance, 0, 1);
      
      // Double Helix Math
      const phase = distance * Math.PI * 0.48;
      const wave = Math.sin(phase);
      const depthWave = Math.cos(phase);
      const strand = index % 2 === 0 ? 1 : -1;

      const x = distance * centerWidth * 0.72;
      const y = wave * this.options.curveHeight * strand;
      const z = depthWave * this.options.curveDepth;
      const strandY = strand * this.options.helixSpread * Math.cos(phase * 0.5) * 0.5;
      
      const rotateY = depthWave * this.options.rotation * strand;
      const rotateZ = wave * this.options.tilt * strand;
      const rotateX = wave * this.options.tilt * 0.35;

      const activeAmount = this.clamp(1 - absoluteDistance, 0, 1);
      const smoothActive = this.easeOutCubic(activeAmount);

      const scale = this.options.inactiveScale + (this.options.activeScale - this.options.inactiveScale) * smoothActive;
      const opacity = this.options.inactiveOpacity + (1 - this.options.inactiveOpacity) * smoothActive;
      const depthNormalized = this.clamp((z + this.options.curveDepth) / (this.options.curveDepth * 2), 0, 1);
      const zScale = 0.88 + depthNormalized * 0.12;
      const finalScale = scale * zScale;

      const blurAmount = this.options.blur * normalizedDistance * (1 - smoothActive);
      const zIndex = Math.round(100 - absoluteDistance * 10 + (z > 0 ? 50 : 0));

      card.style.transform = `
        translate3d(${x}px, ${y + strandY}px, ${z}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
        scale(${finalScale})
      `;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(zIndex);
      card.style.filter = blurAmount > 0.4 ? `blur(${blurAmount}px)` : "none";
    });
  }

  animate() {
    const loop = (time) => {
      let delta = (time - this.lastFrameTime) / 1000;
      this.lastFrameTime = time;
      delta = this.clamp(delta, 0, 0.05);

      if (!this.isDragging) {
        if (this.options.autoPlay) {
          this.position += this.options.autoSpeed * delta;
        }

        if (Math.abs(this.velocity) > 0.0001) {
          this.position += this.velocity * delta;
          this.velocity *= Math.pow(this.options.inertia, delta * 60);
        }

        if (!this.options.autoPlay && Math.abs(this.velocity) < 0.025) {
          const target = Math.round(this.position);
          const diff = target - this.position;
          const snap = 1 - Math.exp(-this.options.snapStrength * 60 * delta);
          this.position += diff * snap;
          if (Math.abs(diff) < 0.0005) {
            this.position = target;
            this.velocity = 0;
          }
        }
      }

      this.render();
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  bindEvents() {
    const onPointerDown = (e) => {
      this.isDragging = true;
      this.startX = (e.touches && e.touches[0].clientX) || e.clientX || 0;
      this.startY = (e.touches && e.touches[0].clientY) || e.clientY || 0;
      this.startPos = this.position;
      this.lastX = this.startX;
      this.lastTime = performance.now();
      this.velocity = 0;
      this.container.style.cursor = "grabbing";
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientX = (e.touches && e.touches[0].clientX) || e.clientX || 0;
      const clientY = (e.touches && e.touches[0].clientY) || e.clientY || 0;

      // On touch devices, if vertical swipe is detected, allow native page scroll
      if (e.touches && e.touches.length > 0) {
        const diffX = Math.abs(clientX - this.startX);
        const diffY = Math.abs(clientY - this.startY);
        if (diffY > diffX + 10) {
          this.isDragging = false;
          return;
        }
      }

      const now = performance.now();
      const dx = clientX - this.startX;
      const travel = Math.max(1, this.options.cardWidth + this.options.gap);
      this.position = this.startPos - (dx / travel) * this.options.dragSensitivity;

      const deltaX = clientX - this.lastX;
      const deltaTime = Math.max(1, now - this.lastTime);
      const instantVelocity = -(deltaX / travel) / (deltaTime / 1000) * this.options.dragSensitivity;
      this.velocity = this.velocity * 0.72 + instantVelocity * 0.28;

      this.lastX = clientX;
      this.lastTime = now;
      this.render();
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.container.style.cursor = "grab";
      this.velocity = this.clamp(this.velocity, -2.5, 2.5);
    };

    this.container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    this.container.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Mouse wheel support
    this.container.addEventListener("wheel", (e) => {
      e.preventDefault();
      const travel = Math.max(1, this.options.cardWidth + this.options.gap);
      const delta = (e.deltaX || e.deltaY) / travel * 0.6;
      this.position += delta;
      this.velocity = delta * 3;
    }, { passive: false });

    // Handle resize
    window.addEventListener("resize", () => {
      const isTiny = window.innerWidth < 420;
      const isMobile = window.innerWidth < 640;
      this.options.cardWidth = isTiny ? 170 : (isMobile ? 190 : 230);
      this.options.cardHeight = isTiny ? 245 : (isMobile ? 270 : 320);
      this.options.gap = isTiny ? 14 : (isMobile ? 18 : 26);
      this.options.curveDepth = isTiny ? 120 : (isMobile ? 140 : 180);
      this.options.curveHeight = isTiny ? 30 : (isMobile ? 40 : 55);
      this.options.helixSpread = isTiny ? 45 : (isMobile ? 60 : 85);
      this.cards.forEach(c => {
        c.style.width = `${this.options.cardWidth}px`;
        c.style.height = `${this.options.cardHeight}px`;
        c.style.marginLeft = `${-this.options.cardWidth / 2}px`;
        c.style.marginTop = `${-this.options.cardHeight / 2}px`;
      });
      this.render();
    });
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// Global initialization helper
function initDNACarousel() {
  if (typeof CONFIG !== 'undefined' && CONFIG.theme && CONFIG.theme.dnaEnabled === false) {
    const wrapper = document.getElementById('dna-carousel-section');
    if (wrapper) wrapper.style.display = 'none';
    return;
  }
  const wrapper = document.getElementById('dna-carousel-section');
  if (wrapper) wrapper.style.display = 'block';

  window.dnaInstance = new DNACarousel('dna-carousel-root', {
    autoPlay: typeof CONFIG !== 'undefined' && CONFIG.theme ? (CONFIG.theme.dnaAutoPlay !== false) : true,
    autoSpeed: typeof CONFIG !== 'undefined' && CONFIG.theme ? (CONFIG.theme.dnaSpeed || 0.22) : 0.22
  });
}
