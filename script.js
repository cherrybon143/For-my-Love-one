const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const ui = document.getElementById('ui');
const btn = document.getElementById('decryptBtn');
const music = document.getElementById('bgMusic');

let width, height;
let particles = [];
let decrypted = false;
const maxParticles = 200; 

function init() {
    resize();
    animate();
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);

class Particle {
    constructor(targetX, targetY) {
        // Spawns exactly at the heart target position, but scales up or fades in
        this.x = targetX;
        this.y = targetY;
        
        // Give them a slight micro-vibration so they look alive
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        
        this.text = "i love you baby"; 
        this.size = Math.floor(Math.random() * 3 + 12);
        
        // Start completely transparent and fade in instantly
        this.opacity = 0;
        this.maxOpacity = Math.random() * 0.5 + 0.5; // Final glow range
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Fast fade-in effect right at their heart positions
        if (this.opacity < this.maxOpacity) {
            this.opacity += 0.08;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 45, 85, ${this.opacity})`;
        ctx.font = `bold ${this.size}px Courier New`;
        
        // Heavy neon glow effect
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff2d55";
        
        ctx.fillText(this.text, this.x, this.y);
        ctx.shadowBlur = 0; // Reset
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

    // Generate the entire heart shape structure instantly, but stagger the visual emergence
    let currentParticle = 0;
    
    function spawnWave() {
        if (currentParticle >= maxParticles) return;
        
        // Spawn 4 particles per frame for a smooth, progressive "drawing" animation
        for (let k = 0; k < 4; k++) {
            if (currentParticle >= maxParticles) break;
            
            const t = (currentParticle / maxParticles) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            const isMobile = width < 600;
            const scale = isMobile ? (width / 45) : (Math.min(width, height) / 40); 
            
            // Calculate final heart coordinates
            const targetX = (width / 2 + x * scale) - 35;
            const targetY = height / 2 + y * scale;
            
            particles.push(new Particle(targetX, targetY));
            currentParticle++;
        }
        
        requestAnimationFrame(spawnWave);
    }
    
    // Start generating the heart shape pattern
    spawnWave();
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
