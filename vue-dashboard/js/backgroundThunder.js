const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function flashThunder() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 100 + Math.random() * 200);
}

function thunderLoop() {
  if (Math.random() < 0.005) {
    flashThunder();
  }
  requestAnimationFrame(thunderLoop);
}
thunderLoop();
