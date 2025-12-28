document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const fill = document.getElementById('stability-fill');
    const statusText = document.getElementById('status-text');
    const navHint = document.getElementById('nav-hint');
    const aura = document.getElementById('emotional-aura');
    const clickSound = document.getElementById('click-sound');

    let currentIndex = 0;
    let touchStartY = 0;
    let idleTimer;

    function updateSection(index) {
        sections.forEach(s => {
            s.classList.remove('active');
            s.classList.remove('focused');
        });

        const currentSection = sections[index];
        currentSection.classList.add('active');

        // Text reveal logic (Linger)
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            currentSection.classList.add('focused');
        }, 1200);

        // Update UI based on data attributes
        const val = currentSection.getAttribute('data-stability');
        const status = currentSection.getAttribute('data-status');
        fill.style.width = val + "%";
        statusText.innerText = `system status: ${status}`;

        // Handle Aura, Color, and Vibration
        if (currentSection.classList.contains('mood-glitch')) {
            aura.style.background = "radial-gradient(circle, rgba(255, 62, 62, 0.2) 0%, rgba(0,0,0,0) 70%)";
            if (navigator.vibrate) navigator.vibrate([100, 50, 100, 300]);
        } 
        else if (currentSection.classList.contains('mood-warm') || currentSection.classList.contains('mood-signature')) {
            aura.style.background = "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(0,0,0,0) 80%)";
            if (navigator.vibrate) navigator.vibrate(50);
        } 
        else if (val <= 20) {
            aura.style.background = "radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, rgba(0,0,0,0) 70%)";
            fill.style.background = "#ff3e3e";
        } 
        else if (val >= 80) {
            aura.style.background = "radial-gradient(circle, rgba(0, 255, 65, 0.08) 0%, rgba(0,0,0,0) 70%)";
            fill.style.background = "#00ff41";
        } 
        else {
            aura.style.background = "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 70%)";
            fill.style.background = "#ffffff";
        }

        // Hint Visibility
        navHint.style.opacity = (index === 0) ? "0.5" : "0";

        // Sound feedback
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {
            console.log("Audio waiting for user interaction...");
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
            if (currentIndex < sections.length - 1) {
                currentIndex++;
                updateSection(currentIndex);
            }
        } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
            if (currentIndex > 0) {
                currentIndex--;
                updateSection(currentIndex);
            }
        }
    });

    // Touch/Swipe Navigation
    document.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: true});

    document.addEventListener('touchend', e => {
        let touchEndY = e.changedTouches[0].screenY;
        let deltaY = touchStartY - touchEndY;
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && currentIndex < sections.length - 1) {
                currentIndex++; 
                updateSection(currentIndex);
            } else if (deltaY < 0 && currentIndex > 0) {
                currentIndex--; 
                updateSection(currentIndex);
            }
        }
    }, {passive: true});

    // Reset focus on mouse move to encourage stillness
    document.addEventListener('mousemove', () => {
        const activeSection = document.querySelector('section.active');
        if (activeSection && activeSection.classList.contains('focused')) {
            // Optional: Uncomment below if you want mouse movement to slightly blur text
            // activeSection.classList.remove('focused');
            // clearTimeout(idleTimer);
            // idleTimer = setTimeout(() => activeSection.classList.add('focused'), 800);
        }
    });

    updateSection(0);
});
