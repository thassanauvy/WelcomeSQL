// Initialize canvas
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Track mouse position
    let mouse = {
      x: undefined,
      y: undefined,
      radius: 150
    };
    
    window.addEventListener('mousemove', function(event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });
    
    // Create particle class
    class Particle {
      constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
        this.originalSize = size;
        this.originalX = x;
        this.originalY = y;
        this.connectionDistance = 200;
        this.mode = 'financial'; // default mode
      }
      
      update() {
        // Mouse repulsion (in both modes)
        if (mouse.x !== undefined && mouse.y !== undefined) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            const pushX = Math.cos(angle) * force * 5;
            const pushY = Math.sin(angle) * force * 5;
            
            this.x += pushX;
            this.y += pushY;
          }
        }
        
        // Different movement logic based on mode
        if (this.mode === 'financial') {
          // Financial mode: circular motion like currency flow
          const time = Date.now() * 0.001;
          const radius = 30 + this.weight * 20;
          const speed = 0.3 - this.weight * 0.2;
          
          // Calculate new position based on circular motion
          const newX = this.originalX + Math.cos(time * speed + this.weight * 10) * radius;
          const newY = this.originalY + Math.sin(time * speed + this.weight * 10) * radius;
          
          // Smoothly interpolate to new position
          this.x += (newX - this.x) * 0.03;
          this.y += (newY - this.y) * 0.03;
        } else {
          // User data mode: gentle floating with slight gravitational pull
          if (Math.abs(this.x - this.originalX) > 100 || Math.abs(this.y - this.originalY) > 100) {
            this.x += (this.originalX - this.x) * 0.01;
            this.y += (this.originalY - this.y) * 0.01;
          } else {
            this.x += (Math.random() - 0.5) * 0.5;
            this.y += (Math.random() - 0.5) * 0.5;
          }
        }
        
        // Ensure particles stay within bounds
        if (this.x < 0) this.x = 0;
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y < 0) this.y = 0;
        if (this.y > canvas.height) this.y = canvas.height;
        
        // Draw the particle
        this.draw();
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      setMode(mode) {
        this.mode = mode;
        
        // Reset position when changing modes
        if (mode === 'financial') {
          this.color = getRandomFinancialColor();
        } else {
          this.color = getRandomUserColor();
        }
      }
    }
    
    // Color palettes
    function getRandomFinancialColor() {
      const colors = [
        'rgba(37, 248, 143, 0.7)',  // Green
        'rgba(22, 243, 232, 0.7)',  // Teal
        'rgba(95, 132, 252, 0.7)',  // Blue
        'rgba(255, 220, 100, 0.7)'  // Gold
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function getRandomUserColor() {
      const colors = [
        'rgba(127, 255, 200, 0.7)',  // Soft green
        'rgba(200, 255, 255, 0.7)',  // Light cyan
        'rgba(180, 180, 255, 0.7)',  // Light blue
        'rgba(255, 200, 200, 0.7)'   // Light pink
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Initialize particles
    let particles = [];
    
    function initParticles() {
      particles = [];
      const particleCount = window.innerWidth < 768 ? 50 : 100;
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2.5 + 1.5;
        const color = getRandomFinancialColor();
        const weight = Math.random(); // Used for movement calculations
        
        particles.push(new Particle(x, y, size, color, weight));
      }
    }
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      
      // Draw connections between particles that are close to each other
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < particles[i].connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = particles[i].color.replace('0.7', (1 - distance / particles[i].connectionDistance) * 0.5);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    // Mode switching functionality
    document.getElementById('financialMode').addEventListener('click', function() {
      particles.forEach(particle => particle.setMode('financial'));
    });
    
    document.getElementById('userMode').addEventListener('click', function() {
      particles.forEach(particle => particle.setMode('user'));
    });
    
    // Button interactions
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        mouse.radius = 100;
      });
      
      button.addEventListener('mouseleave', function() {
        mouse.radius = 150;
      });
      
      button.addEventListener('click', function() {
        if (this.id !== 'financialMode' && this.id !== 'userMode') {
          // Create explosion effect on button click
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              const randomX = this.getBoundingClientRect().left + this.offsetWidth / 2 + (Math.random() - 0.5) * 100;
              const randomY = this.getBoundingClientRect().top + this.offsetHeight / 2 + (Math.random() - 0.5) * 100;
              
              // Create temporary particle for explosion effect
              const size = Math.random() * 3 + 2;
              const color = getRandomFinancialColor();
              const tempParticle = new Particle(randomX, randomY, size, color, Math.random());
              particles.push(tempParticle);
              
              // Remove temporary particle after animation
              setTimeout(() => {
                const index = particles.indexOf(tempParticle);
                if (index > -1) {
                  particles.splice(index, 1);
                }
              }, 2000);
            }, i * 50);
          }
        }
      });
    });
    
    // Add simulated data update periodically
    setInterval(() => {
      const statValues = document.querySelectorAll('.stat-value');
      const statChanges = document.querySelectorAll('.stat-change');
      
      statValues.forEach((statValue, index) => {
        if (index === 0) {
          // Total Users
          const currentUsers = parseInt(statValue.textContent);
          const change = Math.floor(Math.random() * 5) - 1;
          statValue.textContent = currentUsers + change;
          
          const changePercent = ((change / currentUsers) * 100).toFixed(1);
          statChanges[index].textContent = `${changePercent > 0 ? '+' : ''}${changePercent}% from last month`;
          statChanges[index].className = 'stat-change' + (changePercent < 0 ? ' negative' : '');
        }
        
        // Similar updates for other stats...
      });
    }, 10000);
    
    // Initialize everything
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    initParticles();
    animate();

    
    
async function fetchDashboardData() {
    try {
      const res = await fetch(`${API_BASE}/dashboard-stats`);
      const stats = await res.json();
      
      // Update the UI with real data
      document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.totalUsers;
      document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.totalAccounts;
      // etc.
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }
  
  // Call this function when page loads
  fetchDashboardData();