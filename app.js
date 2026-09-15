/**
 * Magic Hand Sparkles & Gesture Recognition System
 * Interactive Web Application with MediaPipe Hands & Real-Time Sparkle Particle Engine
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Audio Synthesizer (Web Audio API)
  // ==========================================
  class MagicalAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSparkleChime(scaleIndex = 0) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const baseFrequencies = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C5, D5, E5, G5, A5, C6 Pentatonic
      const count = 3;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          const freq = baseFrequencies[(scaleIndex + i) % baseFrequencies.length] * (1 + i * 0.5);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.85);
        }, i * 70);
      }
    }
  }

  const audio = new MagicalAudio();

  // ==========================================
  // 2. Color Themes & Palettes
  // ==========================================
  const THEMES = {
    cyan: {
      primary: '#00f2fe',
      secondary: '#4facfe',
      accentRgb: [0, 242, 254],
      palette: ['#00f2fe', '#4facfe', '#00c6ff', '#e0f7fa', '#ffffff']
    },
    gold: {
      primary: '#ffd700',
      secondary: '#ff8c00',
      accentRgb: [255, 215, 0],
      palette: ['#ffd700', '#ffb703', '#fb8500', '#fff3b0', '#ffffff']
    },
    purple: {
      primary: '#c471ed',
      secondary: '#f64f59',
      accentRgb: [196, 113, 237],
      palette: ['#c471ed', '#f64f59', '#12c2e9', '#e0c3fc', '#ffffff']
    },
    emerald: {
      primary: '#00f5a0',
      secondary: '#00d9f5',
      accentRgb: [0, 245, 160],
      palette: ['#00f5a0', '#00d9f5', '#70e000', '#d8f3dc', '#ffffff']
    },
    fire: {
      primary: '#ff416c',
      secondary: '#ff4b2b',
      accentRgb: [255, 65, 108],
      palette: ['#ff416c', '#ff4b2b', '#ff9a3c', '#ffb703', '#ffffff']
    },
    rainbow: {
      primary: '#f77062',
      secondary: '#fe5196',
      accentRgb: [247, 112, 98],
      palette: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ffffff']
    }
  };

  let currentThemeKey = 'gold';

  // ==========================================
  // 3. Gestures & Shape Definitions
  // ==========================================
  const GESTURE_INFO = {
    open_palm: {
      name: 'دەستی کراوە (Galaxy)',
      title: 'گەلەئەستێرەی خولاوە (Cosmic Galaxy)',
      desc: 'بریسکەکان بوونەتە گەلەئەستێرەیەکی سووڕاوە بە ملیۆنان ئەستێرەوە',
      icon: '🖐️',
      scaleIdx: 0
    },
    fist: {
      name: 'مستی داخراو (Singularity)',
      title: 'کونی ڕەش و تۆپە چڕە (Black Hole / Core)',
      desc: 'هەموو بریسکەکان بە توندی پەستێنران بۆ ناو تۆپەڵەیەکی پڕ وزە',
      icon: '✊',
      scaleIdx: 1
    },
    peace: {
      name: 'نیشانەی ئاشتی (Saturn)',
      title: 'هەسارەی کەیوان و خولگەکانی (Saturn with Rings)',
      desc: 'بریسکەکان شێوەی هەسارەی کەیوان و ئەڵقە درەوشاوەکانیان دروستکرد',
      icon: '✌️',
      scaleIdx: 2
    },
    pointing: {
      name: 'پەنجەی شایەتمان (الله أكبر)',
      title: 'نووسینی پیرۆزی "الله أكبر"',
      desc: 'بریسکەکان بوونەتە ناوی پیرۆزی "الله أكبر" بە خەتی عەرەبی درەوشاوە',
      icon: '☝️',
      scaleIdx: 3
    },
    love: {
      name: 'نیشانەی خۆشەویستی (Heart)',
      title: 'دڵی لێدەری درەوشاوە (Pulsing Heart ❤️)',
      desc: 'بریسکەکان لەگەڵ جوڵەی پەنجەکانت دەبنە دڵێکی لێدەر و ڕازاوە',
      icon: '🤟',
      scaleIdx: 4
    },
    thumbs_up: {
      name: 'دەستخۆشی (تەقینەوەی بریسکە)',
      title: 'تەقینەوەی گەورەی بریسکەکان (Sparkle Blast 🎆)',
      desc: 'تەقینەوەی بەهێزی یاری ئاگرین و مۆمباری بریسکەی ڕەنگاوڕەنگ',
      icon: '👍',
      scaleIdx: 5
    },
    pinch: {
      name: 'پەنجە تێهەڵکێش (Star)',
      title: 'ئەستێرەی درەوشاوە (Cosmic Star ⭐)',
      desc: 'بریسکەکان بوونەتە ئەستێرەیەکی گەشی ٥-پەڕی خولاوە',
      icon: '🤏',
      scaleIdx: 3
    }
  };

  let activeGesture = 'open_palm';
  let targetGesture = 'open_palm';
  let gestureDebounceTimer = null;

  // Hand position state in 3D
  const handState = {
    detected: false,
    x: 0, // normalized -1 to 1
    y: 0, // normalized -1 to 1
    z: 0, // scale factor
    indexTipX: 0.5,
    indexTipY: 0.5,
    lastDetectedTime: 0
  };

  // ==========================================
  // 4. Sparkle Particle Engine
  // ==========================================
  const sparklesCanvas = document.getElementById('sparkles-canvas');
  const sCtx = sparklesCanvas.getContext('2d');
  let particleCount = 3500;
  let particles = [];
  let shapeTargetPoints = [];

  class Sparkle {
    constructor() {
      this.reset();
      // start at random position
      this.x = (Math.random() - 0.5) * 800;
      this.y = (Math.random() - 0.5) * 800;
      this.z = (Math.random() - 0.5) * 800;
      this.tx = this.x;
      this.ty = this.y;
      this.tz = this.z;
    }

    reset() {
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.vz = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 2.2 + 0.8;
      this.baseSize = this.size;
      this.twinkleSpeed = Math.random() * 0.08 + 0.02;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.colorIndex = Math.floor(Math.random() * 5);
      this.alpha = Math.random() * 0.7 + 0.3;
      this.life = 1.0;
      this.isFirework = false;
    }

    update(target, rotX, rotY, time, mouseForce) {
      if (target) {
        // Morph towards target shape point
        let tx = target.x;
        let ty = target.y;
        let tz = target.z;

        // Apply custom dynamic motions per gesture
        if (activeGesture === 'open_palm') {
          // Continuous galaxy slow rotation
          const cosG = Math.cos(0.008);
          const sinG = Math.sin(0.008);
          const rx = tx * cosG - tz * sinG;
          const rz = tx * sinG + tz * cosG;
          tx = rx;
          tz = rz;
          target.x = rx;
          target.z = rz;
        } else if (activeGesture === 'love') {
          // Heartbeat pulse
          const pulse = 1 + Math.sin(time * 0.008) * 0.08 + Math.pow(Math.sin(time * 0.016), 4) * 0.06;
          tx *= pulse;
          ty *= pulse;
          tz *= pulse;
        } else if (activeGesture === 'fist') {
          // Singularity intense vibration & vortex pull
          tx += (Math.random() - 0.5) * 12;
          ty += (Math.random() - 0.5) * 12;
          tz += (Math.random() - 0.5) * 12;
        } else if (activeGesture === 'thumbs_up') {
          // Massive continuous multi-cluster firework explosion!
          if (!this.fireworkVy) {
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI;
            const speed = Math.random() * 8 + 3;
            this.fireworkVx = Math.cos(angle) * Math.cos(elevation) * speed;
            this.fireworkVy = -(Math.random() * 9 + 4);
            this.fireworkVz = Math.sin(angle) * Math.cos(elevation) * speed;
          }
          this.x += this.fireworkVx;
          this.y += this.fireworkVy;
          this.z += this.fireworkVz;
          this.fireworkVy += 0.13; // gravity acceleration
          this.fireworkVx *= 0.985;
          this.fireworkVz *= 0.985;

          // Continuous re-burst from multiple sky points
          if (this.y > 300) {
            const burstOrigins = [
              { x: 0, y: -120, z: 0 },
              { x: -180, y: -160, z: 50 },
              { x: 180, y: -150, z: -50 },
              { x: -90, y: -60, z: -30 },
              { x: 100, y: -70, z: 30 }
            ];
            const origin = burstOrigins[Math.floor(Math.random() * burstOrigins.length)];
            this.x = origin.x + (Math.random() - 0.5) * 40;
            this.y = origin.y + (Math.random() - 0.5) * 40;
            this.z = origin.z + (Math.random() - 0.5) * 40;
            const angle = Math.random() * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI;
            const speed = Math.random() * 9 + 4;
            this.fireworkVx = Math.cos(angle) * Math.cos(elevation) * speed;
            this.fireworkVy = -(Math.random() * 9 + 4);
            this.fireworkVz = Math.sin(angle) * Math.cos(elevation) * speed;
          }
        } else if (activeGesture === 'pointing') {
          // Sacred text "الله أكبر" divine celestial shimmer and subtle pulsing wave
          const shimmer = Math.sin(time * 0.007 + this.twinklePhase) * 2;
          tx += shimmer;
          ty += Math.cos(time * 0.005 + this.twinklePhase * 2) * 1.5;
        }

        // Apply 3D rotation based on hand tilt or mouse
        // Rotate around Y
        let rx = tx * Math.cos(rotY) - tz * Math.sin(rotY);
        let rz = tx * Math.sin(rotY) + tz * Math.cos(rotY);
        // Rotate around X
        let ry = ty * Math.cos(rotX) - rz * Math.sin(rotX);
        rz = ty * Math.sin(rotX) + rz * Math.cos(rotX);

        if (activeGesture !== 'thumbs_up') {
          // Smooth glide interpolation towards target
          const ease = 0.065;
          this.vx = (rx - this.x) * ease;
          this.vy = (ry - this.y) * ease;
          this.vz = (rz - this.z) * ease;

          this.x += this.vx;
          this.y += this.vy;
          this.z += this.vz;
        }
      }

      // External mouse / hand ripple interaction force
      if (mouseForce && mouseForce.active) {
        const dx = this.screenX - mouseForce.x;
        const dy = this.screenY - mouseForce.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 1) {
          const push = (140 - dist) / 140 * 8;
          this.x += (dx / dist) * push;
          this.y += (dy / dist) * push;
        }
      }

      // Twinkle & size shimmer
      this.twinklePhase += this.twinkleSpeed;
      this.alpha = 0.45 + Math.sin(this.twinklePhase) * 0.4;
      this.size = this.baseSize * (0.8 + Math.sin(this.twinklePhase * 1.5) * 0.3);
    }

    draw(ctx, centerX, centerY, fov, theme) {
      // 3D Perspective Projection
      const distance = 600;
      const scale = distance / (distance + this.z);

      if (scale <= 0) return;

      const px = centerX + this.x * scale;
      const py = centerY + this.y * scale;
      this.screenX = px;
      this.screenY = py;

      const renderSize = Math.max(0.6, this.size * scale);
      const palette = theme.palette;
      const color = palette[this.colorIndex % palette.length];

      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, this.alpha * scale));

      // Draw glowing sparkle particle
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, renderSize, 0, Math.PI * 2);
      ctx.fill();

      // Additional cross sparkle flare for large bright particles
      if (renderSize > 1.8 && this.alpha > 0.65) {
        const flareLen = renderSize * 2.8;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.65;
        ctx.beginPath();
        ctx.moveTo(px - flareLen, py);
        ctx.lineTo(px + flareLen, py);
        ctx.moveTo(px, py - flareLen);
        ctx.lineTo(px, py + flareLen);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // ==========================================
  // 5. Shape Target Generators (3D Math)
  // ==========================================
  let cachedAllahAkbarPoints = null;

  function generateArabicTextPoints(text, count) {
    if (cachedAllahAkbarPoints && cachedAllahAkbarPoints.length >= count) {
      return cachedAllahAkbarPoints.slice(0, count);
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1100;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render majestic bold Arabic text
    ctx.font = 'bold 150px "Amiri", "Vazirmatn", "Noto Naskh Arabic", "Traditional Arabic", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const validPixels = [];

    const step = 2;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        if (data[index] > 115) {
          validPixels.push({
            x: (x - canvas.width / 2) * 0.95,
            y: (y - canvas.height / 2) * 0.95
          });
        }
      }
    }

    const points = [];
    if (validPixels.length === 0) {
      for (let i = 0; i < count; i++) {
        points.push({ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 100, z: 0 });
      }
      return points;
    }

    for (let i = 0; i < count; i++) {
      const p = validPixels[Math.floor(Math.random() * validPixels.length)];
      const z = (Math.random() - 0.5) * 22; // subtle 3D depth
      points.push({
        x: p.x + (Math.random() - 0.5) * 2,
        y: p.y + (Math.random() - 0.5) * 2,
        z: z
      });
    }

    cachedAllahAkbarPoints = points;
    return points;
  }

  // Pre-load text when fonts are ready
  if (document.fonts) {
    document.fonts.ready.then(() => {
      cachedAllahAkbarPoints = null;
      if (activeGesture === 'pointing') {
        shapeTargetPoints = generateShapePoints('pointing', particleCount);
      }
    });
  }

  function generateShapePoints(gesture, count) {
    const points = [];

    switch (gesture) {
      case 'open_palm': {
        // Galaxy / Cosmic 3-arm spiral with central bulge
        const arms = 3;
        for (let i = 0; i < count; i++) {
          if (i < count * 0.25) {
            // Core central cluster
            const r = Math.pow(Math.random(), 2) * 80;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI * 0.8;
            points.push({
              x: r * Math.cos(theta) * Math.cos(phi),
              y: r * Math.sin(phi) * 0.7,
              z: r * Math.sin(theta) * Math.cos(phi)
            });
          } else {
            // Spiral arms
            const arm = i % arms;
            const armOffset = (arm * (2 * Math.PI)) / arms;
            const r = 60 + Math.pow(Math.random(), 0.7) * 260;
            const spiralAngle = 2.4 * Math.log(r / 50) + armOffset;
            const spread = (Math.random() - 0.5) * 35 * (r / 200);
            const height = (Math.random() - 0.5) * 30 * (1 - r / 350);

            points.push({
              x: Math.cos(spiralAngle) * r + spread,
              y: height,
              z: Math.sin(spiralAngle) * r + spread
            });
          }
        }
        break;
      }

      case 'fist': {
        // Singularity / Superdense pulsing core with relativistic jet
        for (let i = 0; i < count; i++) {
          if (i < count * 0.8) {
            // Very tight inner sphere
            const r = Math.pow(Math.random(), 1.5) * 55;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            points.push({
              x: r * Math.sin(phi) * Math.cos(theta),
              y: r * Math.sin(phi) * Math.sin(theta),
              z: r * Math.cos(phi)
            });
          } else {
            // Relativistic vertical jets shooting top & bottom
            const dir = Math.random() > 0.5 ? 1 : -1;
            const h = Math.random() * 240 * dir;
            const spread = (Math.random() - 0.5) * (Math.abs(h) * 0.15 + 8);
            points.push({
              x: spread,
              y: h,
              z: (Math.random() - 0.5) * 12
            });
          }
        }
        break;
      }

      case 'peace': {
        // Saturn Planet & Orbiting Concentric Ring Disks
        for (let i = 0; i < count; i++) {
          if (i < count * 0.35) {
            // Planet body sphere
            const r = 85;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            points.push({
              x: r * Math.sin(phi) * Math.cos(theta),
              y: r * Math.sin(phi) * Math.sin(theta) * 0.9, // slightly oblate
              z: r * Math.cos(phi)
            });
          } else {
            // Planetary Ring Disk (tilted)
            const ringRadius = 120 + Math.random() * 150;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * ringRadius;
            const z = Math.sin(angle) * ringRadius;
            const y = (Math.random() - 0.5) * 6; // thin ring

            // Tilt the ring by 27 degrees
            const tilt = 0.45;
            const tiltedY = y * Math.cos(tilt) - z * Math.sin(tilt);
            const tiltedZ = y * Math.sin(tilt) + z * Math.cos(tilt);

            points.push({
              x: x,
              y: tiltedY,
              z: tiltedZ
            });
          }
        }
        break;
      }

      case 'pointing': {
        // Sacred Arabic Calligraphy "الله أكبر"
        const textPoints = generateArabicTextPoints('الله أكبر', count);
        points.push(...textPoints);
        break;
      }

      case 'love': {
        // 3D Parametric Heart ❤️
        for (let i = 0; i < count; i++) {
          const t = Math.random() * Math.PI * 2;
          // Cardioid heart curve in 2D
          const hx = 16 * Math.pow(Math.sin(t), 3);
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          // Extrude into 3D volume
          const zDepth = (Math.random() - 0.5) * 55 * Math.sin(t);
          const scale = 11 + (Math.random() - 0.5) * 1.8;

          points.push({
            x: hx * scale + (Math.random() - 0.5) * 8,
            y: hy * scale + (Math.random() - 0.5) * 8,
            z: zDepth
          });
        }
        break;
      }

      case 'thumbs_up': {
        // Massive Firework explosion clusters with colorful sparkling fountains
        const bursts = [
          { x: 0, y: -70, z: 0 },
          { x: -160, y: -130, z: 40 },
          { x: 160, y: -120, z: -30 },
          { x: -90, y: 40, z: -40 },
          { x: 100, y: 50, z: 40 }
        ];
        for (let i = 0; i < count; i++) {
          const burst = bursts[i % bursts.length];
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const speed = 25 + Math.pow(Math.random(), 0.6) * 180;
          points.push({
            x: burst.x + Math.sin(phi) * Math.cos(theta) * speed,
            y: burst.y + Math.sin(phi) * Math.sin(theta) * speed,
            z: burst.z + Math.cos(phi) * speed
          });
        }
        break;
      }

      case 'pinch': {
        // Glowing 5-Point 3D Star ⭐
        for (let i = 0; i < count; i++) {
          const arm = i % 5;
          const armAngle = (arm * 2 * Math.PI) / 5 - Math.PI / 2;
          const nextAngle = ((arm + 1) * 2 * Math.PI) / 5 - Math.PI / 2;
          const innerAngle = armAngle + Math.PI / 5;

          const rOuter = 210;
          const rInner = 85;

          // Interpolate along the star perimeter with 3D thickness
          const segT = Math.random();
          let px, py;
          if (segT < 0.5) {
            const factor = segT * 2;
            px = (1 - factor) * Math.cos(armAngle) * rOuter + factor * Math.cos(innerAngle) * rInner;
            py = (1 - factor) * Math.sin(armAngle) * rOuter + factor * Math.sin(innerAngle) * rInner;
          } else {
            const factor = (segT - 0.5) * 2;
            px = (1 - factor) * Math.cos(innerAngle) * rInner + factor * Math.cos(nextAngle) * rOuter;
            py = (1 - factor) * Math.sin(innerAngle) * rInner + factor * Math.sin(nextAngle) * rOuter;
          }

          const fillRatio = Math.pow(Math.random(), 0.5);
          const z = (Math.random() - 0.5) * 45 * (1 - fillRatio * 0.5);

          points.push({
            x: px * fillRatio,
            y: py * fillRatio,
            z: z
          });
        }
        break;
      }

      default:
        for (let i = 0; i < count; i++) {
          points.push({ x: 0, y: 0, z: 0 });
        }
    }

    return points;
  }

  function initSparkles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Sparkle());
    }
    shapeTargetPoints = generateShapePoints(activeGesture, particleCount);
  }

  function switchGestureShape(newGesture) {
    if (activeGesture === newGesture) return;
    activeGesture = newGesture;

    // Reset fireworks if switching away/into it
    particles.forEach(p => {
      p.fireworkVx = null;
      p.fireworkVy = null;
      p.fireworkVz = null;
    });

    shapeTargetPoints = generateShapePoints(activeGesture, particleCount);

    // Update UI Elements
    const info = GESTURE_INFO[activeGesture] || GESTURE_INFO.open_palm;
    document.getElementById('gesture-hud-icon').textContent = info.icon;
    document.getElementById('gesture-hud-name').textContent = info.name;
    document.getElementById('banner-shape-title').textContent = info.title;
    document.getElementById('banner-shape-desc').textContent = info.desc;

    // Active chip highlight
    document.querySelectorAll('.gesture-chip').forEach(chip => {
      if (chip.dataset.gesture === activeGesture) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Play sparkle sound
    audio.playSparkleChime(info.scaleIdx);
  }

  // ==========================================
  // 6. MediaPipe Hands & Gesture Recognition
  // ==========================================
  const videoElement = document.getElementById('webcam-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  const cCtx = cameraCanvas.getContext('2d');
  const cameraOverlay = document.getElementById('camera-overlay');
  const cameraStatusText = document.getElementById('camera-status-text');
  const retryCamBtn = document.getElementById('retry-cam-btn');
  const toggleCamBtn = document.getElementById('toggle-cam-btn');

  let isCameraActive = true;
  let isCameraMirrored = true;
  let handsModel = null;
  let cameraInstance = null;
  let fpsCounter = 0;
  let lastFpsTime = performance.now();

  function distance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Robust hand gesture classification using 21 3D landmarks
   */
  function recognizeGesture(landmarks) {
    if (!landmarks || landmarks.length < 21) return 'open_palm';

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbMCP = landmarks[2];

    const indexTip = landmarks[8];
    const indexPIP = landmarks[6];
    const indexMCP = landmarks[5];

    const middleTip = landmarks[12];
    const middlePIP = landmarks[10];
    const middleMCP = landmarks[9];

    const ringTip = landmarks[16];
    const ringPIP = landmarks[14];
    const ringMCP = landmarks[13];

    const pinkyTip = landmarks[20];
    const pinkyPIP = landmarks[18];
    const pinkyMCP = landmarks[17];

    // Reference scale: distance between wrist and middle MCP
    const handScale = distance(wrist, middleMCP);
    if (handScale < 0.04) return 'open_palm';

    // Check finger extension: fingertip farther from wrist than PIP joint
    const isIndexExtended = distance(indexTip, wrist) > distance(indexPIP, wrist) * 1.15;
    const isMiddleExtended = distance(middleTip, wrist) > distance(middlePIP, wrist) * 1.15;
    const isRingExtended = distance(ringTip, wrist) > distance(ringPIP, wrist) * 1.15;
    const isPinkyExtended = distance(pinkyTip, wrist) > distance(pinkyPIP, wrist) * 1.15;

    // Thumb extension relative to index base
    const isThumbExtended = distance(thumbTip, indexMCP) > distance(thumbIP, indexMCP) * 1.25;

    // Check Pinch: Thumb tip & Index tip touch each other
    const pinchDist = distance(thumbTip, indexTip) / handScale;
    if (pinchDist < 0.45 && !isMiddleExtended && !isRingExtended) {
      return 'pinch';
    }

    // Check Thumbs Up: Thumb points up, all other 4 fingers curled
    const thumbPointingUp = thumbTip.y < thumbIP.y - 0.05 && thumbIP.y < wrist.y;
    if (thumbPointingUp && !isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return 'thumbs_up';
    }

    // Check Fist: All fingers curled
    if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return 'fist';
    }

    // Check Pointing: Only index finger extended
    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return 'pointing';
    }

    // Check Peace / V sign: Index & Middle extended, Ring & Pinky curled
    if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      return 'peace';
    }

    // Check Love / Rock Horns: Index & Pinky extended, Middle & Ring curled
    if (isIndexExtended && isPinkyExtended && !isMiddleExtended && !isRingExtended) {
      return 'love';
    }

    // Check Open Palm: All 4 fingers extended
    if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
      return 'open_palm';
    }

    // Default to open palm
    return 'open_palm';
  }

  // Draw cyber glowing hand skeleton on the camera preview
  function drawCyberHand(ctx, landmarks, theme) {
    const connections = [
      // Thumb
      [0, 1], [1, 2], [2, 3], [3, 4],
      // Index
      [0, 5], [5, 6], [6, 7], [7, 8],
      // Middle
      [0, 9], [9, 10], [10, 11], [11, 12],
      // Ring
      [0, 13], [13, 14], [14, 15], [15, 16],
      // Pinky
      [0, 17], [17, 18], [18, 19], [19, 20],
      // Palm cross connections
      [5, 9], [9, 13], [13, 17]
    ];

    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Draw connecting bones
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme.primary;
    ctx.shadowColor = theme.primary;
    ctx.shadowBlur = 12;

    connections.forEach(([i, j]) => {
      const p1 = landmarks[i];
      const p2 = landmarks[j];
      ctx.beginPath();
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    });

    // Draw glowing joints
    landmarks.forEach((pt, index) => {
      const x = pt.x * w;
      const y = pt.y * h;
      const isTip = [4, 8, 12, 16, 20].includes(index);
      const radius = isTip ? 6 : 3.5;

      ctx.fillStyle = isTip ? '#ffffff' : theme.secondary;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      if (isTip) {
        ctx.strokeStyle = theme.primary;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;
  }

  function onHandResults(results) {
    // Resize camera canvas if needed
    if (cameraCanvas.width !== videoElement.videoWidth || cameraCanvas.height !== videoElement.videoHeight) {
      cameraCanvas.width = videoElement.videoWidth || 640;
      cameraCanvas.height = videoElement.videoHeight || 480;
    }

    cCtx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);

    // Draw webcam video frame
    if (results.image) {
      cCtx.drawImage(results.image, 0, 0, cameraCanvas.width, cameraCanvas.height);
    }

    // Hide loading overlay once video frames flow
    if (cameraOverlay.style.display !== 'none') {
      cameraOverlay.style.display = 'none';
    }

    const currentTheme = THEMES[currentThemeKey];

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      handState.detected = true;
      handState.lastDetectedTime = performance.now();

      // Draw skeleton on camera canvas
      drawCyberHand(cCtx, landmarks, currentTheme);

      // Track Hand Center & Index Tip for 3D rotation / translation
      const wrist = landmarks[0];
      const middleMCP = landmarks[9];
      const indexTip = landmarks[8];

      // Normalized coordinates (-1 to 1)
      handState.x = ((middleMCP.x + wrist.x) / 2 - 0.5) * 2;
      handState.y = ((middleMCP.y + wrist.y) / 2 - 0.5) * 2;
      handState.indexTipX = indexTip.x;
      handState.indexTipY = indexTip.y;

      // Gesture Recognition
      const detected = recognizeGesture(landmarks);
      if (detected !== targetGesture) {
        targetGesture = detected;
        clearTimeout(gestureDebounceTimer);
        gestureDebounceTimer = setTimeout(() => {
          switchGestureShape(targetGesture);
        }, 120); // slight debounce for rock-solid stability
      }

      document.getElementById('stat-hands').textContent = `دەست: دۆزرایەوە (${results.multiHandLandmarks.length})`;
    } else {
      handState.detected = false;
      document.getElementById('stat-hands').textContent = 'دەست: نەدۆزراوەتەوە';
    }

    // Calculate FPS
    fpsCounter++;
    const now = performance.now();
    if (now - lastFpsTime >= 1000) {
      document.getElementById('stat-fps').textContent = `FPS: ${fpsCounter}`;
      fpsCounter = 0;
      lastFpsTime = now;
    }
  }

  async function initCameraAndMediaPipe() {
    try {
      cameraStatusText.textContent = 'بارکردنی زیرەکی دەستکرد (MediaPipe Hands)...';

      if (typeof Hands === 'undefined') {
        throw new Error('کتێبخانەی MediaPipe بار نەکرا');
      }

      handsModel = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      handsModel.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });

      handsModel.onResults(onHandResults);

      cameraStatusText.textContent = 'داواکردنی ڕێپێدانی کامێرای وێب...';

      if (typeof Camera !== 'undefined') {
        cameraInstance = new Camera(videoElement, {
          onFrame: async () => {
            if (isCameraActive) {
              await handsModel.send({ image: videoElement });
            }
          },
          width: 640,
          height: 480
        });

        await cameraInstance.start();
        cameraOverlay.style.display = 'none';
      } else {
        // Direct getUserMedia fallback
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } }
        });
        videoElement.srcObject = stream;
        await videoElement.play();

        async function processFrame() {
          if (isCameraActive && videoElement.readyState >= 2) {
            await handsModel.send({ image: videoElement });
          }
          requestAnimationFrame(processFrame);
        }
        processFrame();
        cameraOverlay.style.display = 'none';
      }
    } catch (err) {
      console.warn('Camera initialization note:', err);
      cameraStatusText.innerHTML = `
        <span>کامێرا چالاک نەکرا (${err.name || 'مۆڵەت پێنەدراو'}).</span>
        <br><small>دەتوانیت لە خوارەوە کلیک لەسەر شێوازەکان بکەیت و بە ماوسیش یاری پێبکەیت!</small>
      `;
      retryCamBtn.style.display = 'inline-flex';
    }
  }

  // ==========================================
  // 7. Sparkle Render Loop & Canvas Resize
  // ==========================================
  let mouseState = {
    x: 0,
    y: 0,
    active: false
  };

  let autoRotationY = 0;
  let autoRotationX = 0;

  function resizeSparklesCanvas() {
    const wrapper = document.getElementById('sparkles-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    sparklesCanvas.width = rect.width * window.devicePixelRatio;
    sparklesCanvas.height = rect.height * window.devicePixelRatio;
    sCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function renderSparkles(time) {
    const rect = sparklesCanvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Dark starry motion trail background
    sCtx.save();
    sCtx.fillStyle = 'rgba(5, 7, 13, 0.28)';
    sCtx.fillRect(0, 0, width, height);

    // Additive blending for rich, glowing sparkles!
    sCtx.globalCompositeOperation = 'lighter';

    // Compute interactive 3D rotation
    let rotX = autoRotationX;
    let rotY = autoRotationY;

    if (handState.detected) {
      // Smoothly steer rotation with hand position
      autoRotationY += (handState.x * 1.5 - autoRotationY) * 0.05;
      autoRotationX += (handState.y * 1.2 - autoRotationX) * 0.05;
    } else {
      // Gentle idle cosmic sway
      autoRotationY += 0.003;
      autoRotationX = Math.sin(time * 0.0008) * 0.15;
    }

    const currentTheme = THEMES[currentThemeKey];

    // Update & draw all sparkle particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const targetPoint = shapeTargetPoints[i % shapeTargetPoints.length];
      p.update(targetPoint, autoRotationX, autoRotationY, time, mouseState);
      p.draw(sCtx, centerX, centerY, 600, currentTheme);
    }

    sCtx.restore();
    requestAnimationFrame(renderSparkles);
  }

  // ==========================================
  // 8. Event Listeners & Interactive UI
  // ==========================================
  function setupEventListeners() {
    // Window Resize
    window.addEventListener('resize', resizeSparklesCanvas);

    // Theme selector
    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('change', (e) => {
      currentThemeKey = e.target.value;
      document.body.setAttribute('data-theme', currentThemeKey);
      audio.playSparkleChime(2);
    });

    // Sound toggle
    const soundBtn = document.getElementById('sound-btn');
    soundBtn.addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      if (audio.enabled) {
        soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        soundBtn.classList.remove('muted');
        audio.playSparkleChime(3);
      } else {
        soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        soundBtn.classList.add('muted');
      }
    });

    // Fullscreen toggle
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
      } else {
        document.exitFullscreen().catch(() => {});
        fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
      }
    });

    // Particle slider
    const particleSlider = document.getElementById('particle-slider');
    const particleCountDisplay = document.getElementById('particle-count-display');
    particleSlider.addEventListener('input', (e) => {
      particleCount = parseInt(e.target.value, 10);
      particleCountDisplay.textContent = particleCount;
      initSparkles();
    });

    // Reset sparkles button
    const resetSparklesBtn = document.getElementById('reset-sparkles-btn');
    resetSparklesBtn.addEventListener('click', () => {
      initSparkles();
      audio.playSparkleChime(4);
    });

    // Camera Toggle
    toggleCamBtn.addEventListener('click', () => {
      isCameraActive = !isCameraActive;
      if (isCameraActive) {
        toggleCamBtn.classList.add('active');
        toggleCamBtn.innerHTML = '<i class="fa-solid fa-video"></i> کامێرا کارایە';
      } else {
        toggleCamBtn.classList.remove('active');
        toggleCamBtn.innerHTML = '<i class="fa-solid fa-video-slash"></i> کامێرا راگیراوە';
        cCtx.clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
      }
    });

    // Flip Camera Button
    const flipCamBtn = document.getElementById('flip-cam-btn');
    flipCamBtn.addEventListener('click', () => {
      isCameraMirrored = !isCameraMirrored;
      cameraCanvas.style.transform = isCameraMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    });

    // Retry camera button
    retryCamBtn.addEventListener('click', () => {
      retryCamBtn.style.display = 'none';
      cameraStatusText.textContent = 'داواکردنی کامێرا...';
      initCameraAndMediaPipe();
    });

    // Gesture Shortcut Chips
    const gestureChips = document.querySelectorAll('.gesture-chip');
    gestureChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const gesture = chip.dataset.gesture;
        if (gesture) {
          switchGestureShape(gesture);
        }
      });
    });

    // Mouse & Touch interaction on Sparkles Canvas
    const sparklesWrapper = document.getElementById('sparkles-wrapper');
    sparklesWrapper.addEventListener('mousemove', (e) => {
      const rect = sparklesWrapper.getBoundingClientRect();
      mouseState.x = e.clientX - rect.left;
      mouseState.y = e.clientY - rect.top;
      mouseState.active = true;
    });

    sparklesWrapper.addEventListener('mouseleave', () => {
      mouseState.active = false;
    });

    sparklesWrapper.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = sparklesWrapper.getBoundingClientRect();
        mouseState.x = e.touches[0].clientX - rect.left;
        mouseState.y = e.touches[0].clientY - rect.top;
        mouseState.active = true;
      }
    }, { passive: true });

    sparklesWrapper.addEventListener('touchend', () => {
      mouseState.active = false;
    });

    // Click on sparkles canvas for sparkle blast
    sparklesWrapper.addEventListener('click', (e) => {
      audio.init();
      audio.playSparkleChime(Math.floor(Math.random() * 5));
    });
  }

  // ==========================================
  // 9. Application Bootstrap
  // ==========================================
  function init() {
    setupEventListeners();
    resizeSparklesCanvas();
    initSparkles();
    requestAnimationFrame(renderSparkles);

    // Initialize Camera and MediaPipe Hands
    initCameraAndMediaPipe();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
