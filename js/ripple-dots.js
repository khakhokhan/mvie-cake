// M'Vie Cake - Aisol Ripple Dots Component
// Faithful port of Framer AisolRippleDots (by Karim Saif / Aisol)
// URL: https://framer.com/m/AisolRippleDots-etCwys.js@7VP8LaIiTWxttMKeoi2p
// Features: Interactive grid of dots, Spring Physics (k=180, damp), Shockwave Tap Rings, Pointer Ripple/Magnet

class AisolRippleDots {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    const theme = (typeof CONFIG !== 'undefined' && CONFIG.theme) ? CONFIG.theme : {};

    this.options = {
      bg: theme.rippleDotsBg || theme.backgroundColor || '#EEF7FD',
      dot: theme.rippleDotsColor || '#FDE047',
      spacing: theme.rippleDotsSpacing || 28,
      size: theme.rippleDotsSize || 2.8,
      reach: theme.rippleDotsReach || 160,
      strength: theme.rippleDotsStrength || 0.75,
      tapRing: theme.rippleDotsTapRing !== false,
      response: 'ripple',
      ...options
    };

    this.MAX_DOTS = 6000;
    this.MAX_DPR = 2;
    this.MAX_AREA = 16e6;
    this.RING_SPEED = 900; // px per second
    this.RING_WIDTH = 70;  // band width in px
    this.RING_LIFE = 1.4;  // seconds

    this.W = 0;
    this.H = 0;
    this.dpr = 1;
    this.field = null;
    this.rings = [];
    this.pointerIn = false;
    this.px = -1000;
    this.py = -1000;
    this.raf = 0;
    this.last = 0;
    this.settled = false;
    this.dirty = true;
    this.onScreen = true;
    this.tabOn = true;
    this.reduceMotion = false;

    this.init();
  }

  init() {
    // Check reduced motion preference
    if (typeof window.matchMedia === 'function') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reduceMotion = !!(mq && mq.matches);
      mq.addEventListener('change', (e) => {
        this.reduceMotion = e.matches;
        if (this.reduceMotion) {
          this.rings.length = 0;
          if (this.field) {
            this.field.off.fill(0);
            this.field.vel.fill(0);
            this.field.sc.fill(1);
            this.field.sv.fill(0);
          }
          this.dirty = true;
        }
        this.schedule();
      });
    }

    this.size();
    this.bindEvents();

    // Trigger an initial subtle welcome ripple wave
    if (this.options.tapRing && !this.reduceMotion) {
      setTimeout(() => {
        this.rings.push({ x: this.W * 0.5, y: Math.min(300, this.H * 0.35), t: 0 });
        this.settled = false;
        this.schedule();
      }, 350);
    }
  }

  build() {
    let s = this.options.spacing;
    let cols = Math.ceil(this.W / s) + 1;
    let rows = Math.ceil(this.H / s) + 1;

    while (cols * rows > this.MAX_DOTS) {
      s *= 1.25;
      cols = Math.ceil(this.W / s) + 1;
      rows = Math.ceil(this.H / s) + 1;
    }

    const n = cols * rows;
    const base = new Float32Array(n * 2);
    const ox = ((this.W % s) - s) / 2 + s / 2;
    const oy = ((this.H % s) - s) / 2 + s / 2;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 2;
        base[i] = ox + c * s;
        base[i + 1] = oy + r * s;
      }
    }

    this.field = {
      cols,
      rows,
      ox,
      oy,
      n,
      base,
      off: new Float32Array(n * 2),
      vel: new Float32Array(n * 2),
      sc: new Float32Array(n).fill(1),
      sv: new Float32Array(n)
    };

    this.dirty = true;
  }

  size() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);

    let d = Math.min(window.devicePixelRatio || 1, this.MAX_DPR);
    if (w * h * d * d > this.MAX_AREA) {
      d = Math.max(1, Math.sqrt(this.MAX_AREA / (w * h)));
    }

    if (w !== this.W || h !== this.H || d !== this.dpr) {
      this.W = w;
      this.H = h;
      this.dpr = d;

      this.canvas.width = Math.round(this.W * this.dpr);
      this.canvas.height = Math.round(this.H * this.dpr);
      this.canvas.style.width = `${this.W}px`;
      this.canvas.style.height = `${this.H}px`;

      this.build();
    }
  }

  draw() {
    if (!this.field || !this.ctx) return;
    const { dot, bg, size: ds } = this.options;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.clearRect(0, 0, this.W, this.H);

    if (bg && bg !== 'transparent') {
      this.ctx.fillStyle = bg;
      this.ctx.fillRect(0, 0, this.W, this.H);
    }

    this.ctx.fillStyle = dot;
    const r0 = ds / 2;
    const { n, base, off, sc } = this.field;

    this.ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const x = base[i * 2] + off[i * 2];
      const y = base[i * 2 + 1] + off[i * 2 + 1];
      const r = Math.max(0.2, r0 * sc[i]);
      this.ctx.moveTo(x + r, y);
      this.ctx.arc(x, y, r, 0, 6.2831853);
    }
    this.ctx.fill();
  }

  step(dt) {
    if (!this.field) return true;
    const { response, reach, strength } = this.options;
    const { n, base, off, vel, sc, sv } = this.field;

    const k = 180; // spring constant
    const damp = Math.exp(-dt * 11);
    let moving = false;
    const reach2 = reach * reach;
    const inField = this.pointerIn && response !== 'still' && !this.reduceMotion;

    for (let i = 0; i < n; i++) {
      const bx = base[i * 2];
      const by = base[i * 2 + 1];
      let tx = 0;
      let ty = 0;
      let ts = 1;

      if (inField) {
        const dx = bx - this.px;
        const dy = by - this.py;
        const d2 = dx * dx + dy * dy;

        if (d2 < reach2) {
          const d = Math.sqrt(d2) || 1;
          const f = 1 - d / reach;
          const g = f * f * (3 - 2 * f);

          if (response === 'magnet') {
            const push = g * reach * 0.35 * strength;
            tx = (dx / d) * push;
            ty = (dy / d) * push;
            ts = 1 + g * 0.6 * strength;
          } else {
            ts = 1 + g * 2.2 * strength;
          }
        }
      }

      for (let q = 0; q < this.rings.length; q++) {
        const rg = this.rings[q];
        const rr = rg.t * this.RING_SPEED;
        const dx = bx - rg.x;
        const dy = by - rg.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const band = Math.abs(d - rr);

        if (band < this.RING_WIDTH) {
          const f = 1 - band / this.RING_WIDTH;
          const fade = 1 - rg.t / this.RING_LIFE;
          ts += f * f * 1.8 * fade * strength;
        }
      }

      // Scale spring
      const aScale = (ts - sc[i]) * k;
      sv[i] = (sv[i] + aScale * dt) * damp;
      sc[i] += sv[i] * dt;

      // Offset spring
      const aOffX = (tx - off[i * 2]) * k;
      vel[i * 2] = (vel[i * 2] + aOffX * dt) * damp;
      off[i * 2] += vel[i * 2] * dt;

      const aOffY = (ty - off[i * 2 + 1]) * k;
      vel[i * 2 + 1] = (vel[i * 2 + 1] + aOffY * dt) * damp;
      off[i * 2 + 1] += vel[i * 2 + 1] * dt;

      if (!moving) {
        if (
          Math.abs(sc[i] - ts) > 0.004 ||
          Math.abs(sv[i]) > 0.02 ||
          Math.abs(off[i * 2] - tx) > 0.05 ||
          Math.abs(off[i * 2 + 1] - ty) > 0.05 ||
          Math.abs(vel[i * 2]) > 0.5 ||
          Math.abs(vel[i * 2 + 1]) > 0.5
        ) {
          moving = true;
        }
      }
    }

    for (let q = this.rings.length - 1; q >= 0; q--) {
      this.rings[q].t += dt;
      if (this.rings[q].t > this.RING_LIFE) {
        this.rings.splice(q, 1);
      }
    }

    if (this.rings.length > 0) moving = true;
    return !moving;
  }

  tick(now) {
    this.raf = 0;
    if (!this.onScreen || !this.tabOn) return;

    const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0.016);
    this.last = now;

    this.settled = this.step(dt);
    this.draw();
    this.dirty = false;

    if (!this.settled) {
      this.raf = requestAnimationFrame((t) => this.tick(t));
    } else {
      this.last = 0;
    }
  }

  schedule() {
    if (this.raf || !this.onScreen || !this.tabOn) return;
    if (this.settled && !this.dirty) return;
    this.last = 0;
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  bindEvents() {
    const onMove = (e) => {
      if (this.reduceMotion || this.options.response === 'still') return;
      this.px = e.clientX;
      this.py = e.clientY;
      this.pointerIn = true;
      this.settled = false;
      this.schedule();
    };

    const onLeave = () => {
      this.pointerIn = false;
      this.settled = false;
      this.schedule();
    };

    const onDown = (e) => {
      if (this.reduceMotion || this.options.response !== 'ripple' || !this.options.tapRing) return;
      this.px = e.clientX;
      this.py = e.clientY;
      if (this.rings.length >= 4) this.rings.shift();
      this.rings.push({ x: e.clientX, y: e.clientY, t: 0 });
      this.settled = false;
      this.schedule();
    };

    const onVis = () => {
      this.tabOn = document.visibilityState === 'visible';
      if (!this.tabOn && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
        this.last = 0;
      } else {
        this.dirty = true;
        this.schedule();
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave, { passive: true });
    window.addEventListener('pointercancel', onLeave, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.size();
        this.schedule();
      }, 60);
    });

    this.schedule();
  }

  updateOptions(newOptions = {}) {
    Object.assign(this.options, newOptions);
    this.build();
    this.dirty = true;
    this.schedule();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
  }
}

// Global initialization helper
function initRippleDots() {
  const container = document.getElementById('ripple-dots-bg');
  if (!container) return;

  if (typeof CONFIG !== 'undefined' && CONFIG.theme && CONFIG.theme.rippleDotsEnabled === false) {
    container.style.display = 'none';
    if (window.rippleDotsInstance) {
      window.rippleDotsInstance.destroy();
      window.rippleDotsInstance = null;
    }
    return;
  }

  container.style.display = 'block';

  if (!window.rippleDotsInstance) {
    window.rippleDotsInstance = new AisolRippleDots('ripple-dots-canvas');
  } else {
    const t = (typeof CONFIG !== 'undefined' && CONFIG.theme) ? CONFIG.theme : {};
    window.rippleDotsInstance.updateOptions({
      bg: t.rippleDotsBg || t.backgroundColor || '#EEF7FD',
      dot: t.rippleDotsColor || '#FDE047',
      spacing: t.rippleDotsSpacing || 28,
      size: t.rippleDotsSize || 2.8,
      reach: t.rippleDotsReach || 160,
      strength: t.rippleDotsStrength || 0.75,
      tapRing: t.rippleDotsTapRing !== false
    });
  }
}
