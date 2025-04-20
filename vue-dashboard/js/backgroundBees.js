const beeCanvas = document.createElement('canvas');
beeCanvas.id = 'beeCanvas';
document.body.appendChild(beeCanvas);
const beeCtx = beeCanvas.getContext('2d');

function resizeBees() {
  beeCanvas.width = window.innerWidth;
  beeCanvas.height = window.innerHeight;
}

let bees = Array.from({ length: 50 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 6.22 + .7,
  dx: Math.random() * 0.65 - 0.325,
  dy: Math.random() * 0.5 - 0.25,
  alpha: Math.random()
}));

function animateBees() {
  beeCtx.clearRect(0, 0, beeCanvas.width, beeCanvas.height);

  bees.forEach(b => {
    beeCtx.beginPath();
    beeCtx.fillStyle = `rgba(127, 255, 200, ${b.alpha})`;
    beeCtx.shadowColor = '#ffffcc';
    beeCtx.shadowBlur = 8.1;
    beeCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    beeCtx.fill();

    b.x += b.dx;
    b.y += b.dy;

    if (b.x < 0 || b.x > beeCanvas.width) b.dx *= -1;
    if (b.y < 0 || b.y > beeCanvas.height) b.dy *= -1;

    b.alpha += (Math.random() - 0.5) * 0.05;
    b.alpha = Math.max(0.2, Math.min(1, b.alpha));
  });

  requestAnimationFrame(animateBees);
}

resizeBees();
window.addEventListener('resize', resizeBees);
animateBees();
