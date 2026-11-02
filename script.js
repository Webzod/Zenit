// Constants
const WHATSAPP = "584166806215";

// Utils
const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. LOADER & LOGO ANIMATION
       ========================================================================== */
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader-text');
    const textToType = "Iniciando Zénit...";
    let textIndex = 0;

    function typeLoader() {
        if (loaderText && textIndex < textToType.length) {
            loaderText.innerHTML += textToType.charAt(textIndex);
            textIndex++;
            setTimeout(typeLoader, 100);
        }
    }

    if (prefersReducedMotion) {
        loader.style.display = 'none';
        document.body.classList.add('loaded');
    } else {
        typeLoader();
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transform = 'scale(1.1)';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded');
                initCounters();
            }, 500);
        }, 800);
    }

    /* ==========================================================================
       2. CUSTOM CURSOR
       ========================================================================== */
    const cursor = document.getElementById('custom-cursor');
    if (!isTouchDevice() && !prefersReducedMotion) {
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

        // Estela de estrellitas siguiendo al mouse
        const starChars = ['✦', '✧', '★'];
        let lastStarTime = 0;
        const starThrottleMs = 55;

        function spawnCursorStar(x, y) {
            const star = document.createElement('span');
            star.className = 'cursor-star';
            star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            star.style.color = Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)';
            const drift = (Math.random() - 0.5) * 30;
            star.style.setProperty('--drift', drift + 'px');
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 700);
        }

        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastStarTime > starThrottleMs) {
                lastStarTime = now;
                spawnCursorStar(e.clientX, e.clientY);
            }
        });
    } else {
        cursor.style.display = 'none';
    }

    /* ==========================================================================
       3. SCROLL PROGRESS
       ========================================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';
    });

    /* ==========================================================================
       3. HEADER
       ========================================================================== */
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       4. HERO CANVAS PARTICLES
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    let heroIsVisible = false;
    let canvasFrameId = null;

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
        canvasFrameId = null;
        if (document.visibilityState !== 'visible' || !heroIsVisible) return;

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
        canvasFrameId = requestAnimationFrame(animateCanvas);
    }

    if (!prefersReducedMotion) {
        initCanvas();
        const heroObserver = new IntersectionObserver(([entry]) => {
            heroIsVisible = entry.isIntersecting;
            if (heroIsVisible && document.visibilityState === 'visible' && canvasFrameId === null) {
                canvasFrameId = requestAnimationFrame(animateCanvas);
            } else if (!heroIsVisible && canvasFrameId !== null) {
                cancelAnimationFrame(canvasFrameId);
                canvasFrameId = null;
            }
        });
        heroObserver.observe(canvas);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && heroIsVisible && canvasFrameId === null) {
                canvasFrameId = requestAnimationFrame(animateCanvas);
            } else if (document.visibilityState !== 'visible' && canvasFrameId !== null) {
                cancelAnimationFrame(canvasFrameId);
                canvasFrameId = null;
            }
        });
        window.addEventListener('resize', initCanvas);
    }

    /* ==========================================================================
       5. TYPEWRITER EFFECT
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
    if (prefersReducedMotion) {
        typeTarget.textContent = phrases[0];
    } else {
        setTimeout(typeEffect, 1000);
    }

    /* ==========================================================================
       6. SCROLL REVEAL & STAGGER
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
       7. ANIMATED COUNTERS
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
                        if (prefersReducedMotion) {
                            counter.innerText = target;
                            return;
                        }

                        const duration = 2000;
                        const increment = target / (duration / 16);
                        
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

    if (prefersReducedMotion) initCounters();

    /* ==========================================================================
       8. TILT 3D
       ========================================================================== */
    if (!isTouchDevice() && !prefersReducedMotion) {
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
       9. FAQ ACCORDION
       ========================================================================== */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.setAttribute('aria-hidden', 'true');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.setAttribute('aria-hidden', 'false');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    /* ==========================================================================
       10. WHATSAPP & CTA BUTTONS
       ========================================================================== */
    const waButtons = document.querySelectorAll('.wa-btn');
    
    waButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = btn.getAttribute('data-msg');
            const url = `https://wa.me/${WHATSAPP}?${new URLSearchParams({ text: msg })}`;
            window.open(url, '_blank');
        });
    });

    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
        headerCta.addEventListener('click', () => {
            const preciosSection = document.getElementById('precios');
            if (preciosSection) {
                preciosSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    }

    /* ==========================================================================
       10b. VISTA APARTE "CONTACTO"
       ========================================================================== */
    function irAContacto(actualizarHash = true) {
        document.body.classList.remove('show-privacidad');
        document.body.classList.add('show-contacto');
        window.scrollTo(0, 0);
        if (actualizarHash && window.location.hash !== '#contacto') {
            history.pushState(null, '', '#contacto');
        }
    }

    function irAPrivacidad(actualizarHash = true) {
        document.body.classList.remove('show-contacto');
        document.body.classList.add('show-privacidad');
        window.scrollTo(0, 0);
        if (actualizarHash && window.location.hash !== '#privacidad') {
            history.pushState(null, '', '#privacidad');
        }
    }

    function salirDeContacto(hash) {
        document.body.classList.remove('show-contacto');
        document.body.classList.remove('show-privacidad');
        if (hash && hash !== '#' && hash !== '#contacto') {
            history.replaceState(null, '', hash);
            setTimeout(() => {
                const target = document.querySelector(hash);
                if (target) target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }, 60);
        } else {
            history.replaceState(null, '', window.location.pathname + window.location.search);
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

    document.querySelectorAll('a[href="#privacidad"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            irAPrivacidad();
        });
    });

    // Estallido de estrellitas al hacer click en "Volver al inicio"
    function createStarBurst(x, y) {
        const count = 16;
        const burstChars = ['★', '✦', '✧', '✨'];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
            const distance = 90 + Math.random() * 70;
            const star = document.createElement('span');
            star.className = 'burst-star';
            star.textContent = burstChars[Math.floor(Math.random() * burstChars.length)];
            star.style.left = x + 'px';
            star.style.top = y + 'px';
            star.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
            star.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
            star.style.color = i % 2 === 0 ? 'var(--primary)' : 'var(--secondary)';
            star.style.fontSize = (14 + Math.random() * 10) + 'px';
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 850);
        }
    }

    // Transición especial (fade + escala + estrellas) al volver de Contacto a Inicio
    function volverAInicioConAnimacion(hash, originEl) {
        if (prefersReducedMotion) {
            salirDeContacto(hash);
            return;
        }

        const activeView = document.body.classList.contains('show-privacidad')
            ? document.getElementById('privacidad')
            : document.getElementById('contacto');
        const rect = originEl.getBoundingClientRect();
        createStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        activeView.classList.add('page-transition-out');

        setTimeout(() => {
            salirDeContacto(hash);
            activeView.classList.remove('page-transition-out');

            const heroSection = document.getElementById('inicio');
            if (heroSection) {
                heroSection.classList.add('page-transition-in');
                setTimeout(() => heroSection.classList.remove('page-transition-in'), 750);
            }
        }, 420);
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        if (link.matches('a[href="#contacto"], .go-contact, .nav-contact-link')) return;
        if (link.matches('a[href="#privacidad"]')) return;
        link.addEventListener('click', (e) => {
            if (!document.body.classList.contains('show-contacto') &&
                !document.body.classList.contains('show-privacidad')) return;
            e.preventDefault();
            const hash = link.getAttribute('href');
            if (link.classList.contains('back-home-link')) {
                volverAInicioConAnimacion(hash, link);
            } else {
                salirDeContacto(hash);
            }
        });
    });

    const headerCtaBtn = document.getElementById('header-cta');
    if (headerCtaBtn) {
        const originalHeaderCtaHandler = () => {
            if (document.body.classList.contains('show-contacto') ||
                document.body.classList.contains('show-privacidad')) {
                salirDeContacto('#precios');
            }
        };
        headerCtaBtn.addEventListener('click', originalHeaderCtaHandler);
    }

    if (window.location.hash === '#contacto') {
        irAContacto(false);
    } else if (window.location.hash === '#privacidad') {
        irAPrivacidad(false);
    }

    window.addEventListener('popstate', () => {
        if (window.location.hash === '#contacto') {
            irAContacto(false);
        } else if (window.location.hash === '#privacidad') {
            irAPrivacidad(false);
        } else {
            document.body.classList.remove('show-contacto');
            document.body.classList.remove('show-privacidad');
        }
    });

    /* ==========================================================================
       11. CONTACT FORM
       ========================================================================== */
    const form = document.getElementById('contact-form');

    if (form) {
        const formStatus = document.getElementById('form-status');
        const whatsappLink = document.getElementById('form-whatsapp-link');
        const confirmationDialog = document.getElementById('form-confirmation');
        const confirmationButton = document.getElementById('form-confirmation-button');
        const confirmationWhatsappLink = document.getElementById('form-confirmation-whatsapp');
        const confirmationClose = confirmationDialog.querySelector('.form-confirmation-close');
        const submitButton = form.querySelector('button[type="submit"]');

        const clearFormStatus = () => {
            formStatus.hidden = true;
        };

        form.addEventListener('invalid', () => form.classList.add('was-validated'), true);
        form.addEventListener('input', clearFormStatus);
        form.addEventListener('change', clearFormStatus);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (form.checkValidity()) {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const company = document.getElementById('company').value || 'No especificado';
                const type = document.getElementById('type').value;
                const budget = document.getElementById('budget').value;
                const message = document.getElementById('message').value;

                const waMessage = `Hola Zénit! Vengo desde el formulario web.\n\n` +
                                  `*Nombre:* ${name}\n` +
                                  `*Email:* ${email}\n` +
                                  `*Empresa:* ${company}\n` +
                                  `*Proyecto:* ${type}\n` +
                                  `*Presupuesto:* ${budget}\n\n` +
                                  `*Mensaje:* ${message}`;
                const whatsappUrl = `https://wa.me/${WHATSAPP}?${new URLSearchParams({ text: waMessage })}`;

                whatsappLink.href = whatsappUrl;
                confirmationWhatsappLink.href = whatsappUrl;
                const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                confirmationWhatsappLink.hidden = Boolean(whatsappWindow);
                if (typeof confirmationDialog.showModal === 'function') {
                    confirmationDialog.showModal();
                } else {
                    formStatus.hidden = false;
                    formStatus.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
                }
            } else {
                form.reportValidity();
            }
        });

        confirmationClose.addEventListener('click', () => confirmationDialog.close());
        confirmationButton.addEventListener('click', () => {
            form.reset();
            form.classList.remove('was-validated');
            formStatus.hidden = true;
            confirmationDialog.close();
        });
        confirmationDialog.addEventListener('close', () => submitButton.focus());
    }

    /* ==========================================================================
       12. SPLIT TEXT — Títulos que se revelan letra por letra
       ========================================================================== */
    function splitTitleText(el) {
        const originalText = el.textContent;
        const nodes = Array.from(el.childNodes);
        el.textContent = '';
        el.setAttribute('aria-label', originalText);
        let i = 0;

        function appendWord(word, extraClass) {
            if (word.length === 0) return;
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word';
            [...word].forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.className = 'split-char' + (extraClass ? ' ' + extraClass : '');
                charSpan.style.setProperty('--i', i++);
                charSpan.textContent = char;
                wordSpan.appendChild(charSpan);
            });
            el.appendChild(wordSpan);
        }

        nodes.forEach(node => {
            const text = node.textContent;
            const extraClass = node.nodeType === 1 ? node.className : '';
            // Separa por palabras conservando cuántos espacios había entre ellas.
            const parts = text.split(/( +)/);
            parts.forEach(part => {
                if (part.length === 0) return;
                if (/^ +$/.test(part)) {
                    // Deja todos los espacios menos el último como no-rompibles
                    // (para mantener el espaciado visual original) y el último
                    // como un espacio normal, que es donde SÍ puede saltar la línea.
                    el.appendChild(document.createTextNode('\u00A0'.repeat(part.length - 1) + ' '));
                } else {
                    appendWord(part, extraClass);
                }
            });
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
       13. BOTONES MAGNÉTICOS
       ========================================================================== */
    if (!isTouchDevice() && !prefersReducedMotion) {
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
       14. RIPPLE EN CLICS DE BOTONES
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
       15. PARALLAX SUAVE DEL HERO
       ========================================================================== */
    const heroSection = document.querySelector('.hero');
    if (heroSection && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                document.documentElement.style.setProperty('--scrollY', scrollY);
            }
        }, { passive: true });
    }

    /* ==========================================================================
       16. BARRA DE NAVEGACIÓN INFERIOR (SOLO MÓVIL)
       Marca el ícono activo según la sección visible en pantalla, y también
       al hacer clic (para respuesta inmediata antes de que termine el scroll).
       ========================================================================== */
    const mobileNavItems = document.querySelectorAll('.mnav-item');
    const mobileNavSectionIds = ['inicio', 'servicios', 'proceso', 'precios', 'pagos'];
    const mobileNavSections = mobileNavSectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean);

    function setActiveMobileNav(targetId) {
        mobileNavItems.forEach(item => {
            const isActive = item.getAttribute('data-target') === targetId;
            item.classList.toggle('active', isActive);
            if (isActive) {
                item.setAttribute('aria-current', 'location');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    // Estado activo inicial
    setActiveMobileNav('inicio');

    // Respuesta inmediata al tocar un ítem
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            setActiveMobileNav(item.getAttribute('data-target'));
        });
    });

    // Actualiza el ítem activo según la sección visible al hacer scroll
    // Cuando se activa la vista de Contacto (por cualquier vía), marcar su ícono
    document.querySelectorAll('a[href="#contacto"], .go-contact, .nav-contact-link').forEach(el => {
        el.addEventListener('click', () => setActiveMobileNav('contacto'));
    });
    if (window.location.hash === '#contacto') setActiveMobileNav('contacto');

    if (mobileNavSections.length && 'IntersectionObserver' in window) {
        const mobileNavObserver = new IntersectionObserver((entries) => {
            // Si el usuario está viendo la vista aislada de Contacto, no tocar la barra
            if (document.body.classList.contains('show-contacto') ||
                document.body.classList.contains('show-privacidad')) return;

            let mostVisible = null;
            let maxRatio = 0;
            entries.forEach(entry => {
                if (entry.intersectionRatio > maxRatio) {
                    maxRatio = entry.intersectionRatio;
                    mostVisible = entry.target;
                }
            });
            if (mostVisible && maxRatio > 0) {
                setActiveMobileNav(mostVisible.id);
            }
        }, { threshold: [0.2, 0.35, 0.5, 0.65, 0.8] });

        mobileNavSections.forEach(section => mobileNavObserver.observe(section));
    }
});
