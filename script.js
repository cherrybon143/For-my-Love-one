const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ui = document.getElementById('ui');
const btn = document.getElementById('decryptBtn');
const music = document.getElementById('bgMusic');

let width, height;
let particles = [];
let decrypted = false;
const maxParticles = 240; // Total count of phrases to build a dense heart

function init() {
    resize();
    animate(); // Starts the loop, but canvas stays empty because array is empty
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

class Particle {
    constructor(targetX, targetY) {
        this.x = targetX;
        this.y = targetY;
        
        // Micro-movements to give a pulsing/live feel once spawned
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        
        this.text = "i love you baby"; 
        this.size = Math.floor(Math.random() * 3 + 12);
        
        // Start completely hidden and fade in smoothly
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.4 + 0.6; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Smooth fade in effect at the heart coordinate location
        if (this.opacity < this.maxOpacity) {
            this.opacity += 0.05;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 45, 85, ${this.opacity})`;
        ctx.font = `bold ${this.size}px Courier New`;
        
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff2d55";
        
        ctx.fillText(this.text, this.x, this.y);
        ctx.shadowBlur = 0; 
    }
}

function startAction() {
    if (decrypted) return;
    decrypted = true;
    ui.classList.add('hidden');
    
    if (music) {
        music.play().catch(error => {
            console.log("Audio playback was blocked or failed:", error);
        });
    }

    let currentParticle = 0;
    
    // This function creates a staggered, continuous drawing sequence
    function spawnHeart() {
        if (currentParticle >= maxParticles) return;
        
        // Controls the drawing speed: spawns 3 words per frame
        for (let k = 0; k < 3; k++) {
            if (currentParticle >= maxParticles) break;
            
            // Parametric angle tracking
            const t = (currentParticle / maxParticles) * Math.PI * 2;
            
            // Standard algebraic heart mapping equations
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            const isMobile = width < 600;
            const scale = isMobile ? (width / 46) : (Math.min(width, height) / 42); 
            
            // Center alignment with specific word length offset tuning (-35)
            const targetX = (width / 2 + x * scale) - 35;
            const targetY = height / 2 + y * scale;
            
            particles.push(new Particle(targetX, targetY));
            currentParticle++;
        }
        
        // Continue loop until the total maximum count is satisfied
        requestAnimationFrame(spawnHeart);
    }
    
    // Trigger the progressive drawing loop sequence
    spawnHeart();
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
