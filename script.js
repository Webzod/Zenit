// Constants
const WHATSAPP = "584248780043";
const GA_ID = "G-XXXXXXXXXX"; // Reemplaza G-XXXXXXXXXX con tu ID real de Google Analytics 4

// Utils
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. LOADER & LOGO ANIMATION
       ========================================================================== */
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const textToType = "Iniciando Zénit...";
    let textIndex = 0;

    function typeLoader() {
        if (textIndex < textToType.length) {
            loaderText.innerHTML += textToType.charAt(textIndex);
            textIndex++;
            setTimeout(typeLoader, 100);
        }
    }
    typeLoader();

    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.transform = 'scale(1.1)';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.add('loaded');
            initCounters(); // Start counters when loaded
        }, 500);
    }, 2500);

    /* ==========================================================================
       2. CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    if (!isTouchDevice()) {
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15; // Lerp
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .service-card, .portfolio-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else {
        cursor.style.display = 'none';
    }

    /* ==========================================================================
       3. SCROLL PROGRESS
       ========================================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    let scrolled50 = false;
    let scrolled100 = false;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // GA4 Scroll Tracking
        if (scrollPercent >= 50 && !scrolled50) {
            gtag('event', 'scroll_50_porciento');
            scrolled50 = true;
        }
        if (scrollPercent >= 99 && !scrolled100) {
            gtag('event', 'scroll_100_porciento');
            scrolled100 = true;
        }
    });

    /* ==========================================================================
       4. HEADER & HAMBURGER
       ========================================================================== */
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    function toggleMenu() {
        hamburger.classList.toggle('open');
        mainNav.classList.toggle('open');
    }

    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) toggleMenu();
        });
    });

    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('open') && !e.target.closest('#main-nav') && !e.target.closest('#hamburger')) {
            toggleMenu();
        }
    });

    /* ==========================================================================
       5. HERO CANVAS PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        const numParticles = window.innerWidth < 768 ? 40 : 100;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        const connectDistance = window.innerWidth < 768 ? 80 : 120;
        
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(108, 99, 255, 0.5)';
            ctx.fill();

            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 217, 255, ${1 - dist/connectDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateCanvas);
    }

    initCanvas();
    animateCanvas();
    window.addEventListener('resize', initCanvas);

    /* ==========================================================================
       6. TYPEWRITER EFFECT
       ========================================================================== */
    const phrases = ["Diseñamos webs que venden.", "Diseñamos webs que impresionan.", "Diseñamos webs que crecen."];
    const typeTarget = document.getElementById('typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentPhrase.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new phrase
        }

        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 1000);

    /* ==========================================================================
       7. SCROLL REVEAL & STAGGER
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');
    const serviceCards = document.querySelectorAll('.service-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger logic for services if container is visible
                if(entry.target.classList.contains('services')) {
                    serviceCards.forEach((card, i) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, i * 100);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Init hidden state for stagger
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
    });

    /* ==========================================================================
       8. ANIMATED COUNTERS
       ========================================================================== */
    const counters = document.querySelectorAll('.counter');
    let countersStarted = false;

    function initCounters() {
        if(countersStarted) return;
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countersStarted = true;
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000;
                        const increment = target / (duration / 16); // 60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.stats-bar');
        if(statsSection) counterObserver.observe(statsSection);
    }

    /* ==========================================================================
       9. TILT 3D
       ========================================================================== */
    if (!isTouchDevice()) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }

    /* ==========================================================================
       10. PORTFOLIO FILTERS & TRACKING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.getAttribute('data-name');
            gtag('event', 'click_portafolio', { proyecto: name });
        });
    });

    /* ==========================================================================
       11. TESTIMONIAL CAROUSEL
       ========================================================================== */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.carousel-dots');
    
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if(i === 0) dot.classList.add('active');
        dot.dataset.slide = i;
        dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    let currentIndex = 0;
    
    function updateCarousel(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentIndex = index;
    }

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
    });

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel(prevIndex);
    });

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('.dot');
        if(!targetDot) return;
        const targetIndex = parseInt(targetDot.dataset.slide);
        updateCarousel(targetIndex);
    });

    let autoplayInterval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % slides.length;
        updateCarousel(nextIndex);
    }, 5000);

    const carouselContainer = document.getElementById('testimonial-carousel');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            updateCarousel(nextIndex);
        }, 5000);
    });

    /* ==========================================================================
       12. FAQ ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                header.classList.add('active');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       13. WHATSAPP & CTA BUTTONS
       ========================================================================== */
    const waButtons = document.querySelectorAll('.wa-btn');
    
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = btn.getAttribute('data-msg');
            const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
            
            // Track specific events based on classes/IDs
            if(btn.id === 'floating-wa') {
                gtag('event', 'click_whatsapp_flotante');
            } else if(btn.closest('.price-card')) {
                const planName = btn.closest('.price-card').querySelector('h3').innerText;
                gtag('event', 'click_plan', { plan_name: planName });
            } else if(btn.closest('.process')) {
                gtag('event', 'click_consulta_gratis');
            }
            
            window.open(url, '_blank');
        });
    });

    document.getElementById('header-cta').addEventListener('click', () => {
        gtag('event', 'click_header_cta');
        document.getElementById('precios').scrollIntoView({ behavior: 'smooth' });
    });

    /* ==========================================================================
       14. CONTACT FORM
       ========================================================================== */
    const form = document.getElementById('contact-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (form.checkValidity()) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const company = document.getElementById('company').value || 'No especificado';
            const type = document.getElementById('type').value;
            const budget = document.getElementById('budget').value;
            const message = document.getElementById('message').value;

            const waMessage = `Hola Zénit! Vengo desde el formulario web.%0A%0A` +
                              `*Nombre:* ${name}%0A` +
                              `*Email:* ${email}%0A` +
                              `*Empresa:* ${company}%0A` +
                              `*Proyecto:* ${type}%0A` +
                              `*Presupuesto:* ${budget}%0A%0A` +
                              `*Mensaje:* ${message}`;

            gtag('event', 'form_submit_contacto');
            
            window.open(`https://wa.me/${WHATSAPP}?text=${waMessage}`, '_blank');
            form.reset();
        } else {
            form.reportValidity();
        }
    });
});
