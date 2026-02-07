/**
 * Main JavaScript
 * Navigation, scroll animations, hamburger menu, portfolio filters,
 * custom cursor glow, smooth scrolling, back-to-top.
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========================================
    // NAVIGATION - Scroll State
    // ========================================
    var nav = document.getElementById('nav');
    var heroSection = document.getElementById('hero');

    if (nav && heroSection) {
        var navObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        nav.classList.remove('scrolled');
                    } else {
                        nav.classList.add('scrolled');
                    }
                });
            },
            { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
        );
        navObserver.observe(heroSection);
    }

    // ========================================
    // NAVIGATION - Active Section Highlighting
    // ========================================
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links .nav-link');

    if (sections.length && navLinks.length) {
        var sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        var id = entry.target.getAttribute('id');
                        navLinks.forEach(function (link) {
                            link.classList.toggle('active', link.dataset.section === id);
                        });
                    }
                });
            },
            { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
        );

        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    // ========================================
    // SMOOTH SCROLLING
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href').substring(1);
            var target = document.getElementById(targetId);
            if (target) {
                var offset = 72; // nav height
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // HAMBURGER MENU
    // ========================================
    var hamburger = document.querySelector('.hamburger');
    var mobileMenu = document.getElementById('mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            var isOpen = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ========================================
    if (!prefersReducedMotion) {
        var revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

        if (revealElements.length) {
            var revealObserver = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var delay = entry.target.dataset.delay || 0;
                            entry.target.style.setProperty('--reveal-delay', delay + 'ms');
                            entry.target.style.transitionDelay = delay + 'ms';
                            entry.target.classList.add('visible');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '-40px 0px' }
            );

            revealElements.forEach(function (el) {
                revealObserver.observe(el);
            });
        }
    } else {
        // If reduced motion, make everything visible immediately
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========================================
    // PORTFOLIO FILTER TABS
    // ========================================
    var filterBtns = document.querySelectorAll('.filter-btn');
    var portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length && portfolioCards.length) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var filter = this.dataset.filter;

                // Update active state
                filterBtns.forEach(function (b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                // Filter cards
                portfolioCards.forEach(function (card) {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95) translateY(10px)';
                        requestAnimationFrame(function () {
                            requestAnimationFrame(function () {
                                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1) translateY(0)';
                            });
                        });
                    } else {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(function () {
                            card.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // ========================================
    // CUSTOM CURSOR GLOW (Desktop Only)
    // ========================================
    var cursorGlow = document.querySelector('.cursor-glow');

    if (cursorGlow && !matchMedia('(pointer: coarse)').matches && !prefersReducedMotion) {
        var mouseX = 0;
        var mouseY = 0;
        var currentX = 0;
        var currentY = 0;
        var glowActive = false;

        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!glowActive) {
                glowActive = true;
                cursorGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', function () {
            glowActive = false;
            cursorGlow.classList.remove('active');
        });

        function updateCursor() {
            // Smooth lerp
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;
            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';
            requestAnimationFrame(updateCursor);
        }

        updateCursor();
    }

    // ========================================
    // CONTACT FORM VALIDATION
    // ========================================
    var contactForm = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var isValid = true;
            var groups = contactForm.querySelectorAll('.form-group');

            groups.forEach(function (group) {
                var input = group.querySelector('.form-input, .form-select, .form-textarea');
                if (!input) return;

                group.classList.remove('error');

                if (input.hasAttribute('required') && !input.value.trim()) {
                    group.classList.add('error');
                    isValid = false;
                    return;
                }

                if (input.type === 'email' && input.value.trim()) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        group.classList.add('error');
                        isValid = false;
                    }
                }

                if (input.tagName === 'SELECT' && !input.value) {
                    group.classList.add('error');
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message (no real backend)
                var submitBtn = contactForm.querySelector('.form-submit');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                setTimeout(function () {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
                    formSuccess.classList.add('visible');

                    setTimeout(function () {
                        formSuccess.classList.remove('visible');
                    }, 5000);
                }, 1200);
            }
        });

        // Clear error on input
        contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (input) {
            input.addEventListener('input', function () {
                this.closest('.form-group').classList.remove('error');
            });
            input.addEventListener('change', function () {
                this.closest('.form-group').classList.remove('error');
            });
        });
    }

    // ========================================
    // NOTIFY FORM
    // ========================================
    var notifyForm = document.getElementById('notify-form');

    if (notifyForm) {
        notifyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = notifyForm.querySelector('.notify-input');
            var btn = notifyForm.querySelector('.notify-btn');
            if (input && input.value.trim()) {
                btn.textContent = 'Subscribed!';
                btn.style.background = 'var(--color-success)';
                input.value = '';
                setTimeout(function () {
                    btn.textContent = 'Notify Me';
                    btn.style.background = '';
                }, 3000);
            }
        });
    }

    // ========================================
    // BACK TO TOP
    // ========================================
    var backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
