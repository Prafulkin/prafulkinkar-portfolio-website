document.addEventListener('DOMContentLoaded', () => {

    // ── CUSTOM CURSOR ────────────────────────────
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top  = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });

    // ── SCROLL REVEAL ────────────────────────────
    const revealEls = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ── NAVBAR SCROLL ────────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // ── SCROLL SPY ───────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => spyObserver.observe(s));

    // ── MOBILE NAV ───────────────────────────────
    const mobToggle = document.getElementById('mobToggle');
    const mobNav    = document.getElementById('mobNav');
    const mobLinks  = document.querySelectorAll('.mob-link');

    const openMob  = () => { mobNav.classList.add('open'); mobToggle.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const closeMob = () => { mobNav.classList.remove('open'); mobToggle.classList.remove('open'); document.body.style.overflow = ''; };

    mobToggle.addEventListener('click', () => mobNav.classList.contains('open') ? closeMob() : openMob());
    mobLinks.forEach(l => l.addEventListener('click', closeMob));

    // ── MARQUEE DUPLICATE (ensure seamless loop) ──
    const track = document.querySelector('.marquee-track');
    if (track) {
        track.innerHTML += track.innerHTML;
    }

    // ── CONTACT FORM ─────────────────────────────
    const form    = document.getElementById('contactForm');
    const formMsg = document.getElementById('formMsg');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.form-submit');
            btn.textContent = 'Sending…';
            btn.disabled = true;

            const data = new FormData(form);

            try {
                // Replace YOUR_FORM_ID with actual Formspree ID after signup
                const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    formMsg.textContent = 'Message sent! I\'ll get back to you soon.';
                    formMsg.className = 'form-msg';
                    form.reset();
                } else {
                    throw new Error('Failed');
                }
            } catch {
                formMsg.textContent = 'Something went wrong. Please email me directly.';
                formMsg.className = 'form-msg error';
            } finally {
                btn.innerHTML = 'Send Message <i class="ph ph-paper-plane-tilt"></i>';
                btn.disabled = false;
            }
        });
    }

    // ── PROJECT ROW HOVER TILT (subtle) ──────────
    document.querySelectorAll('.project-row').forEach(row => {
        row.addEventListener('mousemove', e => {
            const rect = row.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 3;
            row.style.transform = `perspective(800px) rotateX(${-x * 0.3}deg)`;
        });
        row.addEventListener('mouseleave', () => {
            row.style.transform = '';
        });
    });

});
