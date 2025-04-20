const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = -1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let clouds = [];

for (let i = 0; i < 10; i++) {
  clouds.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height / 2,
    size: 100 + Math.random() * 100,
    speed: 0.2 + Math.random() * 0.3,
  });
}

function drawCloud(cloud) {
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.arc(cloud.x, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.size * 0.3, cloud.y - 10, cloud.size * 0.35, 0, Math.PI * 2);
  ctx.arc(cloud.x + cloud.size * 0.6, cloud.y, cloud.size * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function animateClouds() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let cloud of clouds) {
    cloud.x += cloud.speed;
    if (cloud.x - cloud.size > canvas.width) cloud.x = -cloud.size;
    drawCloud(cloud);
  }
  requestAnimationFrame(animateClouds);
}
animateClouds();
