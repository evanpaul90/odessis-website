/**
 * Waveform Canvas Animation
 * Renders animated sine waves on the hero section canvas.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('waveform-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isVisible = true;
    let time = 0;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Wave configuration
    const waves = [
        {
            amplitude: 50,
            frequency: 0.008,
            speed: 0.015,
            color: 'rgba(201, 168, 76, 0.12)',
            lineWidth: 1.5,
            phase: 0,
            yOffset: 0
        },
        {
            amplitude: 35,
            frequency: 0.012,
            speed: 0.02,
            color: 'rgba(201, 168, 76, 0.06)',
            lineWidth: 1,
            phase: 2,
            yOffset: 20
        },
        {
            amplitude: 65,
            frequency: 0.006,
            speed: 0.008,
            color: 'rgba(240, 240, 240, 0.04)',
            lineWidth: 1,
            phase: 4,
            yOffset: -30
        },
        {
            amplitude: 25,
            frequency: 0.015,
            speed: 0.025,
            color: 'rgba(240, 240, 240, 0.03)',
            lineWidth: 0.8,
            phase: 1,
            yOffset: 40
        }
    ];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    }

    function drawWave(wave, width, height) {
        const centerY = height * 0.55 + wave.yOffset;

        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = wave.lineWidth;

        for (let x = 0; x <= width; x++) {
            const y = centerY + wave.amplitude * Math.sin((x * wave.frequency) + wave.phase + time * wave.speed);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }

        const rect = canvas.parentElement.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        waves.forEach(function (wave) {
            drawWave(wave, width, height);
        });

        time += 1;
        animationId = requestAnimationFrame(animate);
    }

    // Observe visibility
    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                isVisible = entry.isIntersecting;
            });
        },
        { threshold: 0 }
    );

    // Debounced resize
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
    }

    // Initialize
    resize();
    observer.observe(canvas.parentElement);
    window.addEventListener('resize', handleResize);
    animate();
})();
