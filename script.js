const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ui = document.getElementById('ui');
const btn = document.getElementById('decryptBtn');
const music = document.getElementById('bgMusic'); // Connects to audio element

let width, height;
let particles = [];
let decrypted = false;
const particleCount = 200; 

function init() {
    resize();
    createParticles();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.targetX = this.x;
        this.targetY = this.y;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.speed = 0.05; 
        this.text = "i love you baby"; 
        this.size = Math.floor(Math.random() * 3 + 12);
        this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
        if (decrypted) {
            this.x += (this.targetX - this.x) * this.speed;
            this.y += (this.targetY - this.y) * this.speed;
            this.opacity = 1;
        } else {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 45, 85, ${this.opacity})`;
        ctx.font = `bold ${this.size}px Courier New`;
        if (decrypted) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ff2d55";
        }
        ctx.fillText(this.text, this.x, this.y);
        ctx.shadowBlur = 0;
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function startAction() {
    if (decrypted) return;
    ui.classList.add('hidden');
    
    // Play music immediately upon button press
    if (music) {
        music.play().catch(error => {
            console.log("Audio play blocked or failed:", error);
        });
    }
    
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const isMobile = width < 600;
        const scale = isMobile ? (width / 45) : (Math.min(width, height) / 40); 
        
        particles[i].targetX = (width / 2 + x * scale) - 35; 
        particles[i].targetY = height / 2 + y * scale;
    }

    setTimeout(() => {
        decrypted = true;
    }, 300);
}

btn.addEventListener('click', startAction);
btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startAction();
});

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

init();
