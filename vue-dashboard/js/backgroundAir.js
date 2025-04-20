// Create and configure canvas
const airCanvas = document.createElement('canvas');
airCanvas.id = 'airCanvas';
document.body.appendChild(airCanvas);
const airCtx = airCanvas.getContext('2d');

// Resize canvas to full screen
function resizeAirCanvas() {
  airCanvas.width = window.innerWidth;
  airCanvas.height = window.innerHeight;
}
resizeAirCanvas();
window.addEventListener('resize', resizeAirCanvas);

// Create particles (like drifting dust or airflow)
const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * airCanvas.width,
    y: Math.random() * airCanvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

// Animate them
function animateAir() {
  airCtx.clearRect(0, 0, airCanvas.width, airCanvas.height);

  for (let p of particles) {
    airCtx.beginPath();
    airCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    airCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    airCtx.fill();

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0 || p.x > airCanvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > airCanvas.height) p.dy *= -1;
  }

  requestAnimationFrame(animateAir);
}

animateAir();
