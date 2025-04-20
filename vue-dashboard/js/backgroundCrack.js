const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawCrack() {
  let x = Math.random() * canvas.width;
  let y = 0;
  let points = [{ x, y }];

  for (let i = 0; i < 10; i++) {
    x += (Math.random() - 0.5) * 40;
    y += canvas.height / 12;
    points.push({ x, y });
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let pt of points.slice(1)) {
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.stroke();

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 200);
}

function crackLoop() {
  if (Math.random() < 0.01) {
    drawCrack();
  }
  requestAnimationFrame(crackLoop);
}
crackLoop();
