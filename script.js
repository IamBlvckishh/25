document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const fill = document.getElementById('stability-fill');
    const statusText = document.getElementById('status-text');
    const navHint = document.getElementById('nav-hint');
    const counter = document.getElementById('progress-counter');
    const aura = document.getElementById('emotional-aura');
    const clickSound = document.getElementById('click-sound');
    const startBtn = document.getElementById('start-btn');
    const gate = document.getElementById('interaction-gate');

    let currentIndex = 0;
    let touchStartY = 0;
    let idleTimer;

    startBtn.addEventListener('click', () => {
        clickSound.play().then(() => { clickSound.pause(); clickSound.currentTime = 0; });
        if (navigator.vibrate) navigator.vibrate(50);
        gate.style.opacity = "0";
        setTimeout(() => gate.style.display = "none", 1000);
        document.body.classList.add('started');
        updateSection(0);
    });

    function updateSection(index) {
        sections.forEach(s => s.classList.remove('active', 'focused'));
        document.body.classList.remove('final-peace');
        const currentSection = sections[index];
        currentSection.classList.add('active');
        const currentNum = (index + 1).toString().padStart(2, '0');
        const totalNum = sections.length.toString().padStart(2, '0');
        counter.innerText = `${currentNum} / ${totalNum}`;
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => currentSection.classList.add('focused'), 600);
        const val = currentSection.getAttribute('data-stability');
        const status = currentSection.getAttribute('data-status');
        fill.style.width = val + "%";
        statusText.innerText = `system status: ${status}`;
        if (currentSection.classList.contains('mood-glitch')) {
            aura.style.background = "radial-gradient(circle, rgba(255, 62, 62, 0.2) 0%, rgba(0,0,0,0) 70%)";
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        } 
        else if (index === sections.length - 1) {
            document.body.classList.add('final-peace');
            if (navigator.vibrate) navigator.vibrate(50);
        }
        else {
            aura.style.background = "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 70%)";
            fill.style.background = (val <= 20) ? "#ff3e3e" : (val >= 80) ? "#00ff41" : "#fff";
        }
        navHint.style.opacity = (index === 0) ? "0.5" : "0";
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }

    document.addEventListener('keydown', (e) => {
        if (!document.body.classList.contains('started')) return;
        if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
            if (currentIndex < sections.length - 1) { currentIndex++; updateSection(currentIndex); }
        } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
            if (currentIndex > 0) { currentIndex--; updateSection(currentIndex); }
        }
    });

    document.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY, {passive: true});
    document.addEventListener('touchend', e => {
        if (!document.body.classList.contains('started')) return;
        let deltaY = touchStartY - e.changedTouches[0].screenY;
        if (Math.abs(deltaY) > 50) {
            if (deltaY > 0 && currentIndex < sections.length - 1) { currentIndex++; updateSection(currentIndex); }
            else if (deltaY < 0 && currentIndex > 0) { currentIndex--; updateSection(currentIndex); }
        }
    }, {passive: true});
});
