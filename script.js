const carousel = document.querySelector('.carousel');
const list = document.querySelector('.list');
const items = document.querySelectorAll('.item');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const timeRunning = document.querySelector('.timeRunning');
const pausePlayBtn = document.querySelector('.pause-play');
const thumbnails = document.querySelectorAll('.thumb');

let currentIndex = 0;
let isAutoPlaying = true;
const timeAutoNext = 7000;
const timeTransition = 800;

function initSlider() {
    items.forEach((item, index) => {
        item.style.transform = `translateX(${index * 100}%)`;
        if (index === currentIndex) {
            item.classList.add('active');
            thumbnails[index].classList.add('active');
        }
    });
}

function showSlide(index) {
    items.forEach((item, i) => {
        item.style.transition = `transform ${timeTransition}ms ease, opacity ${timeTransition}ms ease`;
        item.style.transform = `translateX(${(i - index) * 100}%)`;
        item.classList.toggle('active', i === index);
        thumbnails[i].classList.toggle('active', i === index);
    });
    currentIndex = index;
    resetTimeAnimation();
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showSlide(currentIndex);
}

function resetTimeAnimation() {
    timeRunning.style.animation = 'none';
    timeRunning.offsetHeight;
    timeRunning.style.animation = `runningTime ${timeAutoNext}ms linear forwards`;
}

let autoSlide = setInterval(nextSlide, timeAutoNext);

nextBtn.addEventListener('click', () => {
    nextSlide();
    if (isAutoPlaying) {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, timeAutoNext);
    }
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    if (isAutoPlaying) {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, timeAutoNext);
    }
});

pausePlayBtn.addEventListener('click', () => {
    isAutoPlaying = !isAutoPlaying;
    pausePlayBtn.textContent = isAutoPlaying ? 'Pause' : 'Play';
    if (isAutoPlaying) {
        resetTimeAnimation();
        autoSlide = setInterval(nextSlide, timeAutoNext);
    } else {
        clearInterval(autoSlide);
        timeRunning.style.animationPlayState = 'paused';
    }
});

thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
        const index = parseInt(thumb.dataset.index);
        showSlide(index);
        if (isAutoPlaying) {
            clearInterval(autoSlide);
            autoSlide = setInterval(nextSlide, timeAutoNext);
        }
    });
    thumb.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const index = parseInt(thumb.dataset.index);
            showSlide(index);
            if (isAutoPlaying) {
                clearInterval(autoSlide);
                autoSlide = setInterval(nextSlide, timeAutoNext);
            }
        }
    });
});

let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
    if (isAutoPlaying) {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, timeAutoNext);
    }
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = window.innerWidth > 768 ? 50 : 25;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.05;
    }
    draw() {
        ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
            particles.splice(index, 1);
            if (particles.length < particleCount) {
                particles.push(new Particle());
            }
        }
    });
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initSlider();