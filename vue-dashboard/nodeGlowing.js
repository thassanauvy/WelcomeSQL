const canvas = document.createElement('canvas');
canvas.id = 'glowCanvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: null, y: null };
const dots = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

for (let i = 0; i < 100; i++) {
  dots.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1
  });
}

function drawDots() {
  ctx.clearRect(0, 0, width, height);

  // draw and move each dot
  for (let dot of dots) {
    dot.x += dot.vx;
    dot.y += dot.vy;

    if (dot.x < 0 || dot.x > width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > height) dot.vy *= -1;

    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 221, 0.7)';
    ctx.shadowColor = '#9be2ff';
    ctx.shadowBlur = 8;
    ctx.fill();
  }

  // connect nearby dots
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      let dx = dots[i].x - dots[j].x;
      let dy = dots[i].y - dots[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = `rgba(173, 216, 230, ${1 - dist / 100})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  // connect dots to mouse
  if (mouse.x !== null) {
    for (let dot of dots) {
      let dx = dot.x - mouse.x;
      let dy = dot.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(173, 216, 230, ${1 - dist / 150})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawDots);
}

drawDots();
