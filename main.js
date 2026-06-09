// ── Terminal Typing Animation ──
(function() {
    const lines = [
        { prompt: '> ', text: 'initializing sean_jenkins.dev...', delay: 50 },
        { prompt: '> ', text: 'loading creative_work... ', suffix: '✓', delay: 40, hold: 600 },
        { prompt: '> ', text: 'loading game_dev... ', suffix: '✓', delay: 40, hold: 400 },
        { prompt: '> ', text: 'loading ai_systems... ', suffix: '✓', delay: 40, hold: 400 },
        { prompt: '> ', text: 'loading social_media... ', suffix: '✓', delay: 40, hold: 400 },
    ];

    const terminalLines = [
        document.getElementById('line-1'),
        document.getElementById('line-2'),
        document.getElementById('line-3'),
        document.getElementById('line-4'),
        document.getElementById('line-5'),
    ];

    let currentLine = 0;
    let currentChar = 0;
    let currentSuffix = '';

    function typeLine(lineIndex) {
        if (lineIndex >= lines.length) {
            // All lines done — show READY and transition
            setTimeout(transitionToHero, 800);
            return;
        }

        const line = lines[lineIndex];
        const el = terminalLines[lineIndex];
        const text = line.text;
        const delay = line.delay || 50;

        // Add prompt
        el.innerHTML = `<span class="prompt">${line.prompt}</span>`;

        let charIndex = 0;

        function typeChar() {
            if (charIndex < text.length) {
                el.innerHTML = `<span class="prompt">${line.prompt}</span><span class="typed">${text.substring(0, charIndex + 1)}</span>`;
                charIndex++;
                setTimeout(typeChar, delay + Math.random() * 30);
            } else {
                // Add suffix (checkmark) if present
                if (line.suffix) {
                    setTimeout(() => {
                        el.innerHTML = `<span class="prompt">${line.prompt}</span><span class="typed">${text}</span><span class="accent">${line.suffix}</span>`;
                    }, 200);
                }
                // Hold before next line
                const holdTime = line.hold || 300;
                setTimeout(() => typeLine(lineIndex + 1), holdTime);
            }
        }

        typeChar();
    }

    function transitionToHero() {
        const terminal = document.getElementById('terminal');
        const heroContent = document.getElementById('hero-content');

        terminal.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        terminal.style.opacity = '0';
        terminal.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            terminal.style.display = 'none';
            heroContent.classList.add('visible');
        }, 500);
    }

    // Start typing after brief delay
    setTimeout(() => typeLine(0), 500);
})();

// ── Scroll Reveal ──
(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the reveal
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        card.dataset.revealDelay = i * 80;
        observer.observe(card);
    });

    // Observe about section elements
    document.querySelectorAll('.about-text p, .stat').forEach((el, i) => {
        el.dataset.revealDelay = i * 120;
        observer.observe(el);
    });
})();

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── 404 Easter Egg (Konami Code) ──
// Only active on 404 page - a tiny drill reference for Gurren Lagann fans
(function() {
    // This is intentional - the Konami code on 404 page only
    // Left here as a hook for when a 404.html is created
})();