// Constants
const WHATSAPP = "+584166806215";
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
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .service-card, .blog-card');
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
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip');
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
       10. FAQ ACCORDION
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
       11. WHATSAPP & CTA BUTTONS
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

    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
        headerCta.addEventListener('click', () => {
            gtag('event', 'click_header_cta');
            const preciosSection = document.getElementById('precios');
            if (preciosSection) {
                preciosSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* ==========================================================================
       11b. VISTA APARTE "CONTACTO"
       Al hacer click en cualquier enlace de Contacto, se oculta el resto del
       contenido (todo menos header/footer) y solo se ve esa sección.
       Cualquier otro enlace de ancla regresa primero a la vista normal.
       ========================================================================== */
    function irAContacto() {
        document.body.classList.add('show-contacto');
        window.scrollTo(0, 0);
        gtag('event', 'click_ir_a_contacto');
    }

    function salirDeContacto(hash) {
        document.body.classList.remove('show-contacto');
        if (hash && hash !== '#' && hash !== '#contacto') {
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
        } else {
            window.scrollTo(0, 0);
        }
    }

    const contactTargets = document.querySelectorAll('a[href="#contacto"], .go-contact, .nav-contact-link');
    contactTargets.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            irAContacto();
        });
    });

    // Cualquier otro enlace de ancla (Inicio, Servicios, Proceso, Precios, Blog,
    // "Volver al inicio" dentro de Contacto, logo, etc.) debe regresar primero
    // a la vista normal si estamos viendo la sección de Contacto aislada.
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.matches('a[href="#contacto"], .go-contact, .nav-contact-link')) return;
        link.addEventListener('click', (e) => {
            if (!document.body.classList.contains('show-contacto')) return;
            e.preventDefault();
            salirDeContacto(link.getAttribute('href'));
        });
    });

    // El botón "Quiero mi web" del header también debe salir de la vista de Contacto
    const headerCtaBtn = document.getElementById('header-cta');
    if (headerCtaBtn) {
        const originalHeaderCtaHandler = () => {
            if (document.body.classList.contains('show-contacto')) {
                salirDeContacto('#precios');
            }
        };
        headerCtaBtn.addEventListener('click', originalHeaderCtaHandler);
    }

    /* ==========================================================================
       11c. BLOG CARDS (tracking de clics a artículos externos)
       ========================================================================== */
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.addEventListener('click', () => {
            gtag('event', 'click_blog_articulo', {
                article_title: card.querySelector('h3') ? card.querySelector('h3').innerText : ''
            });
        });
    });

    /* ==========================================================================
       12. CONTACT FORM (solo existe en contacto.html)
       ========================================================================== */
    const form = document.getElementById('contact-form');

    if (form) {
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
    }

    /* ==========================================================================
       13. SPLIT TEXT — Títulos que se revelan letra por letra
       ========================================================================== */
    function splitTitleText(el) {
        const text = el.textContent;
        el.textContent = '';
        el.setAttribute('aria-label', text);
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'split-char';
            span.style.setProperty('--i', i);
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
    }

    const splitTargets = document.querySelectorAll('.section-title');
    splitTargets.forEach(el => splitTitleText(el));

    const splitObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('split-ready');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    splitTargets.forEach(el => splitObserver.observe(el));

    /* ==========================================================================
       14. BOTONES MAGNÉTICOS
       ========================================================================== */
    if (!isTouchDevice()) {
        const magneticEls = document.querySelectorAll('.magnetic');
        magneticEls.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ==========================================================================
       15. RIPPLE EN CLICS DE BOTONES
       ========================================================================== */
    const rippleTargets = document.querySelectorAll('.btn-primary, .btn-outline, #floating-wa');
    rippleTargets.forEach(el => {
        el.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.className = 'ripple-span';
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });

    /* ==========================================================================
       16. PARALLAX SUAVE DEL HERO
       ========================================================================== */
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                document.documentElement.style.setProperty('--scrollY', scrollY);
            }
        }, { passive: true });
    }
});
