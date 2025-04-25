const canvasRNA = document.getElementById('particleCanvas');
const ctxRNA = canvasRNA.getContext('2d');

function resizeCanvasRNA() {
  canvasRNA.width = window.innerWidth;
  canvasRNA.height = window.innerHeight;
}

class RNAParticle {
  constructor(x, y, size, weight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.weight = weight;
    this.angle = Math.random() * 2 * Math.PI;
    this.orbitRadius = 20 + Math.random() * 30;
    this.speed = 0.002 + Math.random() * 0.002;
  }

  update() {
    const time = Date.now();
    this.angle += this.speed;
    this.x += Math.cos(this.angle) * this.orbitRadius * 0.02;
    this.y += Math.sin(this.angle) * this.orbitRadius * 0.02;
    this.draw();
  }

  draw() {
    ctxRNA.beginPath();
    ctxRNA.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctxRNA.fillStyle = 'rgba(150, 255, 200, 0.7)';
    ctxRNA.shadowColor = '#a0fcd0';
    ctxRNA.shadowBlur = 12;
    ctxRNA.fill();
    ctxRNA.shadowBlur = 0;
  }
}

let rnaParticles = [];

function initRNAParticles() {
  rnaParticles = [];
  const count = window.innerWidth < 768 ? 40 : 80;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvasRNA.width;
    const y = Math.random() * canvasRNA.height;
    const size = Math.random() * 2 + 1;
    const weight = Math.random();
    rnaParticles.push(new RNAParticle(x, y, size, weight));
  }
}

function animateRNA() {
  ctxRNA.clearRect(0, 0, canvasRNA.width, canvasRNA.height);
  rnaParticles.forEach(p => p.update());
  requestAnimationFrame(animateRNA);
}

window.addEventListener('resize', () => {
  resizeCanvasRNA();
  initRNAParticles();
});

resizeCanvasRNA();
initRNAParticles();
animateRNA();
