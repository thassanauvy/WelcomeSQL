import math
import random
import js
from pyodide.ffi import create_proxy
from pyodide import create_once_callable
import asyncio

# Initialize canvas
canvas = js.document.getElementById('particleCanvas')
ctx = canvas.getContext('2d')

# Set canvas to full window size
def resizeCanvas():
    canvas.width = js.window.innerWidth
    canvas.height = js.window.innerHeight

# Track mouse position
mouse = {'x': None, 'y': None, 'radius': 150}

def on_mousemove(event):
    mouse['x'] = event.x
    mouse['y'] = event.y

js.window.addEventListener('mousemove', create_proxy(on_mousemove))

# Particle class
class Particle:
    def __init__(self, x, y, size, color, weight):
        self.x = x
        self.y = y
        self.size = size
        self.color = color
        self.weight = weight
        self.originalSize = size
        self.originalX = x
        self.originalY = y
        self.connectionDistance = 200
        self.mode = 'financial'

    def update(self):
        # Mouse repulsion
        if mouse['x'] is not None and mouse['y'] is not None:
            dx = self.x - mouse['x']
            dy = self.y - mouse['y']
            distance = math.sqrt(dx * dx + dy * dy)

            if distance < mouse['radius']:
                angle = math.atan2(dy, dx)
                force = (mouse['radius'] - distance) / mouse['radius']
                pushX = math.cos(angle) * force * 5
                pushY = math.sin(angle) * force * 5
                self.x += pushX
                self.y += pushY

        # Movement logic based on mode
        if self.mode == 'financial':
            time = js.Date.now() * 0.001
            radius = 30 + self.weight * 20
            speed = 0.3 - self.weight * 0.2
            newX = self.originalX + math.cos(time * speed + self.weight * 10) * radius
            newY = self.originalY + math.sin(time * speed + self.weight * 10) * radius
            self.x += (newX - self.x) * 0.03
            self.y += (newY - self.y) * 0.03
        else:
            if abs(self.x - self.originalX) > 100 or abs(self.y - self.originalY) > 100:
                self.x += (self.originalX - self.x) * 0.01
                self.y += (self.originalY - self.y) * 0.01
            else:
                self.x += (random.random() - 0.5) * 0.5
                self.y += (random.random() - 0.5) * 0.5

        # Keep particles in bounds
        self.x = max(0, min(self.x, canvas.width))
        self.y = max(0, min(self.y, canvas.height))

        self.draw()

    def draw(self):
        ctx.beginPath()
        ctx.arc(self.x, self.y, self.size, 0, math.pi * 2)
        ctx.fillStyle = self.color
        ctx.fill()
        ctx.shadowColor = self.color
        ctx.shadowBlur = 15
        ctx.fill()
        ctx.shadowBlur = 0

    def setMode(self, mode):
        self.mode = mode
        self.color = getRandomFinancialColor() if mode == 'financial' else getRandomUserColor()

# Color palettes
def getRandomFinancialColor():
    colors = [
        'rgba(37, 248, 143, 0.7)',  # Green
        'rgba(22, 243, 232, 0.7)',  # Teal
        'rgba(95, 132, 252, 0.7)',  # Blue
        'rgba(255, 220, 100, 0.7)'  # Gold
    ]
    return random.choice(colors)

def getRandomUserColor():
    colors = [
        'rgba(127, 255, 200, 0.7)',  # Soft green
        'rgba(200, 255, 255, 0.7)',  # Light cyan
        'rgba(180, 180, 255, 0.7)',  # Light blue
        'rgba(255, 200, 200, 0.7)'   # Light pink
    ]
    return random.choice(colors)

# Initialize particles
particles = []

def initParticles():
    global particles
    particles = []
    particleCount = 50 if js.window.innerWidth < 768 else 100
    for _ in range(particleCount):
        x = random.random() * canvas.width
        y = random.random() * canvas.height
        size = random.random() * 2.5 + 1.5
        color = getRandomFinancialColor()
        weight = random.random()
        particles.append(Particle(x, y, size, color, weight))

# Animation loop
async def animate():
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    for particle in particles:
        particle.update()

    # Draw connections
    for i, p1 in enumerate(particles):
        for p2 in particles[i + 1:]:
            dx = p1.x - p2.x
            dy = p1.y - p2.y
            distance = math.sqrt(dx * dx + dy * dy)
            if distance < p1.connectionDistance:
                ctx.beginPath()
                opacity = (1 - distance / p1.connectionDistance) * 0.5
                ctx.strokeStyle = p1.color.replace('0.7', str(opacity))
                ctx.lineWidth = 0.5
                ctx.moveTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()

    # Schedule next frame
    js.window.requestAnimationFrame(create_once_callable(lambda _: asyncio.ensure_future(animate())))

# Mode switching
def setFinancialMode(_):
    for particle in particles:
        particle.setMode('financial')

def setUserMode(_):
    for particle in particles:
        particle.setMode('user')

js.document.getElementById('financialMode').addEventListener('click', create_proxy(setFinancialMode))
js.document.getElementById('userMode').addEventListener('click', create_proxy(setUserMode))

# Button interactions
def on_button_mouseenter(event):
    mouse['radius'] = 100

def on_button_mouseleave(event):
    mouse['radius'] = 150

async def on_button_click(event):
    button = event.target
    if button.id not in ['financialMode', 'userMode']:
        for i in range(20):
            await asyncio.sleep(i * 0.05)
            rect = button.getBoundingClientRect()
            randomX = rect.left + rect.width / 2 + (random.random() - 0.5) * 100
            randomY = rect.top + rect.height / 2 + (random.random() - 0.5) * 100
            size = random.random() * 3 + 2
            color = getRandomFinancialColor()
            tempParticle = Particle(randomX, randomY, size, color, random.random())
            particles.append(tempParticle)
            js.setTimeout(create_once_callable(lambda: particles.remove(tempParticle) if tempParticle in particles else None), 2000)

buttons = js.document.querySelectorAll('button')
for button in buttons:
    button.addEventListener('mouseenter', create_proxy(on_button_mouseenter))
    button.addEventListener('mouseleave', create_proxy(on_button_mouseleave))
    button.addEventListener('click', create_proxy(lambda e: asyncio.ensure_future(on_button_click(e))))

# Initialize everything
def on_resize(_):
    resizeCanvas()
    initParticles()

js.window.addEventListener('resize', create_proxy(on_resize))
resizeCanvas()
initParticles()
asyncio.ensure_future(animate())