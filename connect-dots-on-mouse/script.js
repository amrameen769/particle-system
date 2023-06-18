/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.strokeStyle = 'white'
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
gradient.addColorStop(0, 'white')
gradient.addColorStop(0.5, 'gold')
gradient.addColorStop(1, 'orangered')
ctx.fillStyle = gradient

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 10 + 1);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5
        this.vy = Math.random() * 1 - 0.5
    }
    draw(context) {
        // context.fillStyle = 'hsl(' + this.x * 0.5 + ', 100%, 50%)'
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke()
    }
    update() {

        if (this.x > (this.effect.width - (this.radius)) || this.x < (this.radius)) {
            this.vx *= -1
        }

        if (this.y > (this.effect.height - (this.radius)) || this.y < (this.radius)) {
            this.vy *= -1
        }
        this.x += this.vx
        this.y += this.vy
    }
    drawLine(context, particle, opacity) {
        context.save()
        context.globalAlpha = opacity
        context.beginPath()
        context.moveTo(this.x, this.y)
        context.lineTo(particle.x, particle.y)
        context.stroke()
        context.restore()
    }
    reset() {
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}

class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = []
        this.numOfParticles = 100;
        this.createParticles();

        window.addEventListener("resize", (e) => {
            this.resize(e.target.innerWidth, e.target.innerHeight)
        })

    }
    createParticles() {
        for (let i = 0; i < this.numOfParticles; i++) {
            this.particles.push(new Particle(this))
        }
    }
    handleParticles() {
        this.connectParticles()
        this.particles.forEach((particle) => {
            particle.draw(this.context)
            particle.update()
        })
    }
    connectParticles() {
        const maxDistance = 100;
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x
                const dy = this.particles[i].y - this.particles[j].y
                const dis = Math.hypot(dx, dy)
                if (dis < maxDistance) {
                    const opacity = 1 - (dis / maxDistance)
                    this.particles[i].drawLine(this.context, this.particles[j], opacity)
                }
            }
        }
    }
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width
        this.height = height
        ctx.strokeStyle = 'white'
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, 'white')
        gradient.addColorStop(0.5, 'gold')
        gradient.addColorStop(1, 'orangered')
        ctx.fillStyle = gradient
        this.particles.forEach(particle => particle.reset())
    }
}

const effect = new Effect(canvas, ctx);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.handleParticles()
    requestAnimationFrame(animate)
}

animate()