document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const fill = document.getElementById('stability-fill');
    const statusText = document.getElementById('status-text');
    const navHint = document.getElementById('nav-hint');
    const clickSound = document.getElementById('click-sound');

    let currentIndex = 0;
    let touchStartY = 0;

    function updateSection(index) {
        sections.forEach(s => s.classList.remove('active'));
        const currentSection = sections[index];
        currentSection.classList.add('active');

        const val = currentSection.getAttribute('data-stability');
        const status = currentSection.getAttribute('data-status');
        fill.style.width = val + "%";
        statusText.innerText = `system status: ${status}`;

        // Dynamic Colors
        if (val <= 20) fill.style.background = "#ff3e3e";
        else if (val >= 80) fill.style.background = "#00ff41";
        else fill.style.background = "#ffffff";

        // Hint Visibility
        if (index > 0) navHint.style.opacity = "0";
        else navHint.style.opacity = "0.5";

        // Typewriter Sound
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }

    // Keyboard Controls
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

    // Mobile Swipe Controls
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

    updateSection(0);
});
