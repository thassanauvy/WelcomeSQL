const canvasDNA = document.getElementById('particleCanvas');
const ctxDNA = canvasDNA.getContext('2d');

function resizeCanvasDNA() {
  canvasDNA.width = window.innerWidth;
  canvasDNA.height = window.innerHeight;
}

class DNAParticle {
  constructor(baseX, baseY, strandIndex, verticalIndex) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.strandIndex = strandIndex;
    this.verticalIndex = verticalIndex;
    this.radius = 2 + Math.random() * 1.5;
    this.amplitude = 30 + Math.random() * 10;
    this.speed = 0.001 + Math.random() * 0.0015; // slower motion
    this.phase = Math.random() * Math.PI * 2;
  }

  update() {
    const time = Date.now();
    this.x = this.baseX + Math.sin(time * this.speed + this.verticalIndex * 0.2 + this.phase) * this.amplitude;
    this.y = this.baseY + this.verticalIndex * 10;
    this.draw();
  }

  draw() {
    ctxDNA.beginPath();
    ctxDNA.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctxDNA.fillStyle = 'rgba(255, 180, 180, 0.8)';
    ctxDNA.shadowColor = '#ffc0cb';
    ctxDNA.shadowBlur = 8;
    ctxDNA.fill();
    ctxDNA.shadowBlur = 0;
  }
}

let dnaParticles = [];
const strands = 15; // number of DNA strands
const verticalParticles = 60; // particles per strand

function initDNAParticles() {
  dnaParticles = [];
  const spacingX = canvasDNA.width / strands;

  for (let i = 0; i < strands; i++) {
    const strandX = spacingX * i + spacingX / 2;
    const offsetY = Math.random() * 30;

    for (let j = 0; j < verticalParticles; j++) {
      const y = offsetY + j * 10;
      dnaParticles.push(new DNAParticle(strandX, y, i, j));
    }
  }
}

function animateDNA() {
  ctxDNA.clearRect(0, 0, canvasDNA.width, canvasDNA.height);

  dnaParticles.forEach(p => p.update());

  // Connect DNA pairs
  for (let i = 0; i < dnaParticles.length - 1; i++) {
    const a = dnaParticles[i];
    const b = dnaParticles[i + 1];

    // Connect only particles in same strand
    if (a.strandIndex === b.strandIndex && b.verticalIndex === a.verticalIndex + 1) {
      ctxDNA.beginPath();
      ctxDNA.moveTo(a.x, a.y);
      ctxDNA.lineTo(b.x, b.y);
      ctxDNA.strokeStyle = 'rgba(255, 180, 180, 0.2)';
      ctxDNA.lineWidth = 1;
      ctxDNA.stroke();
    }
  }

  requestAnimationFrame(animateDNA);
}

window.addEventListener('resize', () => {
  resizeCanvasDNA();
  initDNAParticles();
});

resizeCanvasDNA();
initDNAParticles();
animateDNA();
