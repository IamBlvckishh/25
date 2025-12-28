document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const fill = document.getElementById('stability-fill');
    const statusText = document.getElementById('status-text');
    const counter = document.getElementById('progress-counter');
    const aura = document.getElementById('emotional-aura');
    const clickSound = document.getElementById('click-sound');
    const startBtn = document.getElementById('start-btn');
    const gate = document.getElementById('interaction-gate');

    let currentIndex = 0;
    let touchStartY = 0;
    let idleTimer;

    // Start Sequence
    startBtn.addEventListener('click', () => {
        // Haptic & Audio Handshake
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]); // Initial pulse to wake up motor
        
        clickSound.play().then(() => { 
            clickSound.pause(); 
            clickSound.currentTime = 0; 
        }).catch(e => console.log("Audio unlock failed"));

        gate.style.opacity = "0";
        setTimeout(() => {
            gate.style.display = "none";
            document.body.classList.add('started');
            updateSection(0);
        }, 1000);
    });

    function updateSection(index) {
        sections.forEach(s => s.classList.remove('active', 'focused'));
        document.body.classList.remove('final-peace');

        const currentSection = sections[index];
        currentSection.classList.add('active');

        // Update Progress
        const currentNum = (index + 1).toString().padStart(2, '0');
        const totalNum = sections.length.toString().padStart(2, '0');
        counter.innerText = `${currentNum} / ${totalNum}`;

        // Text reveal
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => currentSection.classList.add('focused'), 600);

        const val = currentSection.getAttribute('data-stability');
        const status = currentSection.getAttribute('data-status');
        fill.style.width = val + "%";
        statusText.innerText = `system status: ${status}`;

        // FORCED Haptics Logic
        if (currentSection.classList.contains('mood-glitch')) {
            aura.style.background = "radial-gradient(circle, rgba(255, 62, 62, 0.25) 0%, rgba(0,0,0,0) 70%)";
            if (navigator.vibrate) {
                // Heartbeat pattern: [vibe, pause, vibe, pause...]
                navigator.vibrate([150, 100, 150, 400, 150, 100, 150]);
            }
        } 
        else if (index === sections.length - 1) {
            document.body.classList.add('final-peace');
            if (navigator.vibrate) navigator.vibrate(80);
        }
        else {
            aura.style.background = "radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(0,0,0,0) 70%)";
            fill.style.background = (val <= 20) ? "#ff3e3e" : (val >= 80) ? "#00ff41" : "#fff";
        }

        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }

    // Navigation Buttons
    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentIndex < sections.length - 1) { currentIndex++; updateSection(currentIndex); }
    });
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentIndex > 0) { currentIndex--; updateSection(currentIndex); }
    });

    // Keys
    document.addEventListener('keydown', (e) => {
        if (!document.body.classList.contains('started')) return;
        if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
            if (currentIndex < sections.length - 1) { currentIndex++; updateSection(currentIndex); }
        } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
            if (currentIndex > 0) { currentIndex--; updateSection(currentIndex); }
        }
    });

    // Swipe
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
