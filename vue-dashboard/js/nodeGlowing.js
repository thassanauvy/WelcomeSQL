const canvas = document.createElement('canvas');
canvas.id = 'glowCanvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let mouse = { x: null, y: null };
const dots = [];

function getRandomColor() {
  const r = Math.floor(150 + Math.random() * 100);
  const g = Math.floor(150 + Math.random() * 100);
  const b = Math.floor(150 + Math.random() * 100);
  return `rgb(${r},${g},${b})`;
}

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

// Create glowing dots with random color
for (let i = 0; i < 100; i++) {
  dots.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1,
    color: getRandomColor()
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
    ctx.fillStyle = dot.color;
    ctx.shadowColor = dot.color;
    ctx.shadowBlur = 10;
    ctx.fill();
  }

  // connect nearby dots with blended lines
  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      let dx = dots[i].x - dots[j].x;
      let dy = dots[i].y - dots[j].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = dots[i].color;
        ctx.globalAlpha = 1 - dist / 100;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  // connect to mouse
  if (mouse.x !== null) {
    for (let dot of dots) {
      let dx = dot.x - mouse.x;
      let dy = dot.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = dot.color;
        ctx.globalAlpha = 1 - dist / 150;
        ctx.lineWidth = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  requestAnimationFrame(drawDots);
}

drawDots();
