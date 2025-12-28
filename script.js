document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const fill = document.getElementById('stability-fill');
    const clickSound = document.getElementById('click-sound');

    // intersection observer detects when a section is in view
    const observerOptions = {
        threshold: 0.5 // trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // add visible class
                entry.target.classList.add('active');
                
                // update the stability bar based on data-stability attribute
                const val = entry.target.getAttribute('data-stability');
                fill.style.width = val + "%";

                // play typewriter sound (requires user to have clicked page once)
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {
                    console.log("audio playback blocked: click the page once to enable sound.");
                });
            } else {
                // optional: remove class when scrolling away
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});
