const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

let mouse = {
  x: undefined,
  y: undefined,
  radius: 150
};

window.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

class Particle {
  constructor(x, y, size, color, weight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.weight = weight;
    this.originalSize = size;
    this.originalX = x;
    this.originalY = y;
    this.connectionDistance = 200;
    this.mode = 'financial';
  }

  update() {
    if (mouse.x !== undefined && mouse.y !== undefined) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - distance) / mouse.radius;
        const pushX = Math.cos(angle) * force * 5;
        const pushY = Math.sin(angle) * force * 5;

        this.x += pushX;
        this.y += pushY;
      }
    }

    if (this.mode === 'financial') {
      const time = Date.now() * 0.001;
      const radius = 30 + this.weight * 20;
      const speed = 0.3 - this.weight * 0.2;

      const newX = this.originalX + Math.cos(time * speed + this.weight * 10) * radius;
      const newY = this.originalY + Math.sin(time * speed + this.weight * 10) * radius;

      this.x += (newX - this.x) * 0.03;
      this.y += (newY - this.y) * 0.03;
    } else {
      if (Math.abs(this.x - this.originalX) > 100 || Math.abs(this.y - this.originalY) > 100) {
        this.x += (this.originalX - this.x) * 0.01;
        this.y += (this.originalY - this.y) * 0.01;
      } else {
        this.x += (Math.random() - 0.5) * 0.5;
        this.y += (Math.random() - 0.5) * 0.5;
      }
    }

    this.x = Math.max(0, Math.min(this.x, canvas.width));
    this.y = Math.max(0, Math.min(this.y, canvas.height));
    this.draw();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  setMode(mode) {
    this.mode = mode;
    this.color = mode === 'financial' ? getRandomFinancialColor() : getRandomUserColor();
  }
}

function getRandomFinancialColor() {
  const colors = [
    'rgba(37, 248, 143, 0.7)',
    'rgba(22, 243, 232, 0.7)',
    'rgba(95, 132, 252, 0.7)',
    'rgba(255, 220, 100, 0.7)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomUserColor() {
  const colors = [
    'rgba(127, 255, 200, 0.7)',
    'rgba(200, 255, 255, 0.7)',
    'rgba(180, 180, 255, 0.7)',
    'rgba(255, 200, 200, 0.7)'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

let particles = [];

function initParticles() {
  particles = [];
  const count = window.innerWidth < 768 ? 50 : 100;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2.5 + 1.5;
    const color = getRandomFinancialColor();
    const weight = Math.random();
    particles.push(new Particle(x, y, size, color, weight));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) p.update();

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < particles[i].connectionDistance) {
        ctx.beginPath();
        ctx.strokeStyle = particles[i].color.replace('0.7', (1 - dist / particles[i].connectionDistance) * 0.5);
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animate);
}

// Button events
document.getElementById('financialMode').addEventListener('click', () => {
  particles.forEach(p => p.setMode('financial'));
});
document.getElementById('userMode').addEventListener('click', () => {
  particles.forEach(p => p.setMode('user'));
});

// Hover and click effects
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('mouseenter', () => mouse.radius = 100);
  btn.addEventListener('mouseleave', () => mouse.radius = 150);

  btn.addEventListener('click', function () {
    if (!['financialMode', 'userMode'].includes(this.id)) {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const rect = this.getBoundingClientRect();
          const x = rect.left + this.offsetWidth / 2 + (Math.random() - 0.5) * 100;
          const y = rect.top + this.offsetHeight / 2 + (Math.random() - 0.5) * 100;
          const size = Math.random() * 3 + 2;
          const color = getRandomFinancialColor();
          const p = new Particle(x, y, size, color, Math.random());
          particles.push(p);
          setTimeout(() => particles.splice(particles.indexOf(p), 1), 2000);
        }, i * 50);
      }
    }
  });
});

// Init
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
animate();
