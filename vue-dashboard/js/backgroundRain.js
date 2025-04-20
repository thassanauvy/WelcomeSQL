const rainCanvas = document.createElement('canvas');
rainCanvas.id = 'rainCanvas';
document.body.appendChild(rainCanvas);
const rainCtx = rainCanvas.getContext('2d');

function resizeRain() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
}

let drops = Array.from({ length: 250 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  length: Math.random() * 20 + 10,
  xs: -2 + Math.random() * 4,
  ys: 10 + Math.random() * 10
}));

function animateRain() {
  rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.strokeStyle = 'rgba(173,216,230,0.3)';
  rainCtx.lineWidth = 1;
  rainCtx.beginPath();

  drops.forEach(d => {
    rainCtx.moveTo(d.x, d.y);
    rainCtx.lineTo(d.x + d.xs, d.y + d.length);
  });

  rainCtx.stroke();

  drops.forEach(d => {
    d.x += d.xs;
    d.y += d.ys;

    if (d.x > rainCanvas.width || d.y > rainCanvas.height) {
      d.x = Math.random() * rainCanvas.width;
      d.y = -20;
    }
  });

  requestAnimationFrame(animateRain);
}

resizeRain();
window.addEventListener('resize', resizeRain);
animateRain();
