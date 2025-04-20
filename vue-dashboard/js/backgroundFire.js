const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;
canvas.style.pointerEvents = 'none';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createStars(); // reset stars on resize
});

// Star config
let stars = [];

function createStars() {
  stars = [];
  const total = 200;
  for (let i = 0; i < total; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.05,
      dy: (Math.random() - 0.5) * 0.05,
      flicker: Math.random() * 0.03,
    });
  }
}
createStars();

// Animate stars
function animateStars() {
  ctx.fillStyle = "rgba(0, 0, 20, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let s of stars) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // movement
    s.x += s.dx;
    s.y += s.dy;

    // flicker
    s.alpha += (Math.random() - 0.5) * s.flicker;
    if (s.alpha < 0.2) s.alpha = 0.2;
    if (s.alpha > 1) s.alpha = 1;

    // wrap around screen
    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;
  }

  requestAnimationFrame(animateStars);
}
animateStars();
