// ============================================
// GLOBAL VARIABLES & DOM ELEMENTS
// ============================================
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

// Project Slider Variables
let currentSlide = 0;
let autoSlideInterval;
let autoSlideResumeTimer;
let isExpanded = false;
let isDragging = false;
let startY = 0;
let scrollTop = 0;
let isWheelScrolling = false;


// ============================================
// PROJECT SLIDER FUNCTIONALITY
// ============================================

function initializeProjects() {
    createDots();
    if (window.innerWidth <= 768 && !isExpanded) {
        startAutoSlide();
        setupEventListeners();
    }
    updateDots();
}

function createDots() {
    const projectBoxes = document.querySelectorAll('.project-box');
    const dotsContainer = document.querySelector('.slide-dots');
    dotsContainer.innerHTML = '';
    
    projectBoxes.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
}

function setupEventListeners() {
    const slider = document.querySelector('.project-slider');
    
    slider.addEventListener('mousedown', startDragging);
    slider.addEventListener('touchstart', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    
    slider.addEventListener('wheel', (e) => {
        if (!isExpanded) {
            e.preventDefault();
            if (isWheelScrolling) return;
            isWheelScrolling = true;
            moveSlide(e.deltaY > 0 ? 'down' : 'up', true);
            scheduleAutoSlideResume();
            setTimeout(() => { isWheelScrolling = false; }, 600);
        }
    }, { passive: false });
}

function startDragging(e) {
    if (isExpanded) return;
    
    isDragging = true;
    startY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
    scrollTop = currentSlide * document.querySelector('.project-box').offsetHeight;
    stopAutoSlide();
    clearTimeout(autoSlideResumeTimer);
}

function drag(e) {
    if (!isDragging || isExpanded) return;
    e.preventDefault();
    
    const y = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
    const walk = (startY - y) * 1.5;
    const boxes = document.querySelectorAll('.project-box');
    
    boxes.forEach(box => {
        box.style.transition = 'none';
        box.style.transform = `translateY(${-scrollTop - walk}px)`;
    });
}

function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const y = e.type === 'mouseup' ? e.pageY : e.changedTouches[0].pageY;
    const walk = startY - y;
    
    if (Math.abs(walk) > 50) {
        moveSlide(walk > 0 ? 'down' : 'up', true);
    } else {
        updateSlidePosition();
    }
    
    scheduleAutoSlideResume();
}

function moveSlide(direction, fromUser = false) {
    if (isExpanded) return;
    
    const boxes = document.querySelectorAll('.project-box');
    stopAutoSlide();
    
    if (direction === 'up' && currentSlide > 0) {
        currentSlide--;
    } else if (direction === 'down' && currentSlide < boxes.length - 1) {
        currentSlide++;
    }
    
    updateSlidePosition();
    
    if (!fromUser) {
        startAutoSlide();
    }
}

function goToSlide(index) {
    if (isExpanded) return;
    
    stopAutoSlide();
    clearTimeout(autoSlideResumeTimer);
    currentSlide = index;
    updateSlidePosition();
    scheduleAutoSlideResume();
}

function scheduleAutoSlideResume() {
    clearTimeout(autoSlideResumeTimer);
    autoSlideResumeTimer = setTimeout(() => {
        startAutoSlide();
    }, 3000);
}

function updateSlidePosition() {
    if (isExpanded) return;
    
    const boxes = document.querySelectorAll('.project-box');
    const slideHeight = boxes[0].offsetHeight;
    
    boxes.forEach(box => {
        box.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
        box.style.transform = `translateY(${-currentSlide * slideHeight}px)`;
    });
    
    updateDots();
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoSlide() {
    if (isExpanded || window.innerWidth > 768) return;
    
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        const boxes = document.querySelectorAll('.project-box');
        currentSlide = currentSlide < boxes.length - 1 ? currentSlide + 1 : 0;
        updateSlidePosition();
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function toggleView() {
    const slider = document.querySelector('.project-slider');
    const btn = document.querySelector('.view-toggle-btn');
    const dots = document.querySelector('.slide-dots');
    
    isExpanded = !isExpanded;
    slider.classList.toggle('expanded');
    btn.querySelector('.toggle-text').textContent = isExpanded ? 'Collapse Projects' : 'View All Projects';
    dots.style.display = isExpanded ? 'none' : 'flex';
    
    if (isExpanded) {
        stopAutoSlide();
        document.querySelectorAll('.project-box').forEach(box => {
            box.style.transform = '';
        });
    } else {
        currentSlide = 0;
        updateSlidePosition();
        startAutoSlide();
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !isExpanded) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
    updateSlidePosition();
});


// ============================================
// ACHIEVEMENT CAROUSEL
// ============================================

function initAchievCarousel() {
    const wrapper = document.getElementById('achiev-wrapper');
    const dotsContainer = document.getElementById('achiev-dots');
    if (!wrapper || !dotsContainer) return;

    const items = wrapper.querySelectorAll('.achivement-item');

    // Create dots dynamically
    dotsContainer.innerHTML = '';
    items.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('achiev-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            const gap = parseFloat(getComputedStyle(wrapper).gap) || 40;
            const itemWidth = items[i].offsetWidth + gap;
            wrapper.scrollTo({ left: i * itemWidth, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.achiev-dot');

    // Sync active dot on scroll
    wrapper.addEventListener('scroll', () => {
        const gap = parseFloat(getComputedStyle(wrapper).gap) || 40;
        const itemWidth = items[0].offsetWidth + gap;
        const active = Math.round(wrapper.scrollLeft / itemWidth);
        dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    });

    // Touch swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    wrapper.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            const gap = parseFloat(getComputedStyle(wrapper).gap) || 40;
            const itemWidth = items[0].offsetWidth + gap;
            const current = Math.round(wrapper.scrollLeft / itemWidth);
            const next = diff > 0
                ? Math.min(current + 1, items.length - 1)
                : Math.max(current - 1, 0);
            wrapper.scrollTo({ left: next * itemWidth, behavior: 'smooth' });
        }
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', initAchievCarousel);


// ============================================
// MOBILE MENU TOGGLE
// ============================================

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};



// ============================================
// NAVIGATION & SCROLL HANDLING
// ============================================

window.onscroll = () => {
    let top = window.scrollY;
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
        }
    });
};


// ============================================
// TIMELINE/EDUCATION SECTION
// ============================================

function toggleContent(contentId) {
    const content = document.getElementById(`content-${contentId}`);
    const allContent = document.querySelectorAll('.timeline-content');
    const verticalLine = document.getElementById(`vl-${contentId}`);
    const horizontalLine = document.getElementById(`hl-${contentId}`);
    const isMobile = window.matchMedia("(max-width: 700px)").matches;

    // Hide all other content
    allContent.forEach((item) => {
        if (item !== content) {
            item.classList.remove('active');
            const lineId = item.id.split('-')[1];
            const otherVerticalLine = document.getElementById(`vl-${lineId}`);
            const otherHorizontalLine = document.getElementById(`hl-${lineId}`);
            
            otherVerticalLine.style.height = isMobile ? "13rem" : "14.5rem";
            otherHorizontalLine.style.top = isMobile ? "160%" : "150%";
        }
    });

    // Toggle selected content
    content.classList.toggle('active');

    // Adjust lines based on content state
    if (content.classList.contains('active')) {
        const contentHeight = content.scrollHeight;
        verticalLine.style.height = `${contentHeight + (isMobile ? 114 : 140)}px`;
        horizontalLine.style.top = `${contentHeight + (isMobile ? 82 : 103)}px`;
    } else {
        verticalLine.style.height = isMobile ? "13rem" : "14.5rem";
        horizontalLine.style.top = isMobile ? "160%" : "150%";
    }
}


// ============================================
// CIRCULAR ICON ANIMATION & PHYSICS
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const iconEls = Array.from(document.querySelectorAll('.logo'));
    const circle  = document.querySelector('.circle');

    // ── Physics constants ──────────────────────────────────────────
    const GRAVITY       = 0.07;   // moon-like low gravity (floaty, slow pull down)
    const WALL_BOUNCE   = 0.78;   // rubber ball — high energy kept on wall hit
    const ICON_BOUNCE   = 0.72;   // rubber ball — elastic icon-to-icon collision
    const FRICTION      = 0.995;  // very low air resistance, momentum preserved long
    const SPACE_DAMPING = 0.985;  // near-zero drag outside circle (space float)
    const PULL_BACK     = 0.025;  // gentle pull back toward circle centre when outside

    // ── Helpers ────────────────────────────────────────────────────
    function getCircleDims() {
        return {
            R:  circle.offsetWidth  / 2,
            cx: circle.offsetWidth  / 2,
            cy: circle.offsetHeight / 2
        };
    }

    let { R, cx, cy } = getCircleDims();

    // Per-icon collision radius based on actual rendered element size
    function iconR(el) {
        return Math.max(el.offsetWidth, el.offsetHeight) / 2;
    }

    // ── Build physics bodies ───────────────────────────────────────
    // b.x / b.y = centre of icon element, relative to .circle top-left
    const bodies = iconEls.map(el => ({
        el,
        r:  iconR(el),
        x: cx, y: cy,
        vx: 0, vy: 0,
        dragging: false,
        active: false       // false = CSS owns this icon; true = physics owns it
    }));

    function applyDOM(b) {
        b.el.style.left = `${b.x - b.r}px`;
        b.el.style.top  = `${b.y - b.r}px`;
    }

    // ═══════════════════════════════════════════════════════════════
    // PHASE 1 — Landing
    // Icons fly from random positions outside the circle, all converge
    // to the exact centre of the circle, overlapping each other.
    // ═══════════════════════════════════════════════════════════════
    iconEls.forEach((el, i) => {
        const sr    = iconR(el);
        const angle = Math.random() * 2 * Math.PI;
        const sx    = cx + R * 2 * Math.cos(angle) - sr;
        const sy    = cy + R * 2 * Math.sin(angle) - sr;

        Object.assign(el.style, {
            position:   'absolute',
            left:       `${sx}px`,
            top:        `${sy}px`,
            opacity:    '0',
            transform:  'scale(0.95)',
            transition: 'all 2.5s ease'
        });

        setTimeout(() => {
            el.style.opacity = '1';
            // exact centre of the circle element
            el.style.left = `${cx - sr}px`;
            el.style.top  = `${cy - sr}px`;

            // shrink to 0.5 and hold — blast fires right after this settles
            setTimeout(() => {
                el.style.transition = 'transform 0.5s ease';
                el.style.transform  = 'scale(0.65)';
            }, 2500);
        }, i * 120);
    });

    // ═══════════════════════════════════════════════════════════════
    // PHASE 2 — Blast
    // After the scale pulse completes, icons explode outward far
    // beyond the circle boundary (original arrangeIconsInDynamicPattern
    // spread behaviour).
    // ═══════════════════════════════════════════════════════════════
    const blastDelay = (iconEls.length - 1) * 120 + 2500 + 1000;

    setTimeout(() => {
        const angleStep = (2 * Math.PI) / iconEls.length;

        iconEls.forEach((el, i) => {
            const angle  = i * angleStep;
            const sr     = iconR(el);
            el.style.transform  = 'scale(0.95)';
            // blast far outside — mirrors old arrangeIconsInDynamicPattern offsets
            const blastX = cx + Math.cos(angle) * (window.innerWidth  * 0.9);
            const blastY = cy + Math.sin(angle) * (window.innerHeight * 0.8);

            Object.assign(el.style, {
                transition: 'left 1s ease, top 1s ease',
                left:       `${blastX - sr}px`,
                top:        `${blastY - sr}px`,
            });

            // Mark body position as blasted so physics can pick up from there
            bodies[i].x = blastX;
            bodies[i].y = blastY;
        });

        // ═══════════════════════════════════════════════════════════
        // PHASE 3 — CSS return journey, then per-icon physics handoff
        // After blast lands, each icon CSS-transitions back to a spread
        // position inside the circle. The moment each icon's transition
        // ends, transition is stripped and physics activates for that
        // icon individually — so coming-in animation plays in full.
        // ═══════════════════════════════════════════════════════════
        iconEls[iconEls.length - 1].addEventListener('transitionend', () => {
            const returnAngleStep = (2 * Math.PI) / iconEls.length;

            // Build a shuffled index list so icons return in random order
            const order = iconEls.map((_, i) => i)
                .sort(() => Math.random() - 0.5);

            // Assign each slot a random delay in 0–2 s window so 1-2 arrive
            // at roughly the same time rather than strict one-by-one sequence
            order.forEach(i => {
                const el  = iconEls[i];
                const b   = bodies[i];
                const sr  = iconR(el);
                const angle = i * returnAngleStep;
                const retX  = cx + Math.cos(angle) * (R * 0.62);
                const retY  = cy + Math.sin(angle) * (R * 0.62);

                b.x = retX;
                b.y = retY;

                const delay = Math.random() * 2000;   // 0–2 s random stagger

                setTimeout(() => {
                    Object.assign(el.style, {
                        transition: 'left 1.4s ease, top 1.4s ease',
                        left:       `${retX - sr}px`,
                        top:        `${retY - sr}px`,
                    });

                    el.addEventListener('transitionend', () => {
                        el.style.transition = 'none';
                        b.x  = parseFloat(el.style.left) + b.r;
                        b.y  = parseFloat(el.style.top)  + b.r;
                        const a = Math.random() * 2 * Math.PI;
                        b.vx = Math.cos(a) * 1.5;
                        b.vy = Math.sin(a) * 1.5;
                        b.active = true;
                    }, { once: true });
                }, delay);
            });

            // Start the physics loop now — it skips inactive icons
            startPhysics();
        }, { once: true });

    }, blastDelay);

    // ── Physics / ring state ──────────────────────────────────────
    let physicsRunning = false;
    let ringMode       = false;
    let ringRAF        = null;

    function startPhysics() {
        if (physicsRunning) return;
        physicsRunning = true;
        requestAnimationFrame(physicsLoop);
    }

    // ── Ring mode ─────────────────────────────────────────────────
    // Double-click the circle to enter / exit ring mode.
    // Icons CSS-transition to an evenly-spaced orbit ring, then
    // rotate continuously. Double-click again → physics resumes.
    function enterRingMode() {
        physicsRunning = false;
        ringMode       = true;
        if (ringRAF) { cancelAnimationFrame(ringRAF); ringRAF = null; }

        // Apply the class NOW so icons immediately get their 70×70 ring sizes,
        // but freeze the rotation so we can position icons cleanly first.
        circle.classList.add('rotate-icons');
        circle.style.animation = 'none';
        void circle.offsetWidth;   // force reflow — icons are now 70×70

        const angleStep = (2 * Math.PI) / iconEls.length;

        iconEls.forEach((el, i) => {
            // Use the real post-class dimensions for exact centring
            const hw    = el.offsetWidth  / 2;   // 35px
            const hh    = el.offsetHeight / 2;   // 35px
            // Place icon centres just outside the circle boundary
            const ringR = R + hw + 4;
            const angle = i * angleStep;
            const deg   = angle * (180 / Math.PI) + 90;  // face outward

            Object.assign(el.style, {
                transition: 'left 1.2s ease, top 1.2s ease, transform 1.2s ease',
                left:       `${cx + Math.cos(angle) * ringR - hw}px`,
                top:        `${cy + Math.sin(angle) * ringR - hh}px`,
                transform:  `rotate(${deg}deg) scale(0.95)`,
            });

            bodies[i].active = false;
            bodies[i].vx     = 0;
            bodies[i].vy     = 0;
        });

        // After icons settle into position, release the CSS rotation
        setTimeout(() => {
            if (!ringMode) return;
            iconEls.forEach(el => { el.style.transition = 'none'; });
            circle.style.animation = '';   // rotateRing 20s takes over
        }, 1300);
    }

    function exitRingMode() {
        ringMode = false;
        if (ringRAF) { cancelAnimationFrame(ringRAF); ringRAF = null; }

        // Remove CSS ring animation — clear any inline animation override and reset transform
        circle.classList.remove('rotate-icons');
        circle.style.animation  = '';
        circle.style.transform  = '';

        // Hand every icon back to physics: strip transform, give outward flick
        iconEls.forEach((el, i) => {
            const b = bodies[i];
            el.style.transition = 'none';
            el.style.transform  = 'scale(0.95)';
            b.x  = parseFloat(el.style.left) + b.r;
            b.y  = parseFloat(el.style.top)  + b.r;
            const a  = Math.atan2(b.y - cy, b.x - cx);
            b.vx     = Math.cos(a) * 2.5;
            b.vy     = Math.sin(a) * 2.5;
            b.active = true;
        });

        startPhysics();
    }

    // Desktop double-click + mobile double-tap both toggle ring mode
    const toggleRing = () => { if (ringMode) exitRingMode(); else enterRingMode(); };

    circle.addEventListener('dblclick', toggleRing);

    // Double-tap detection for touch (two taps within 300 ms)
    let lastTap = 0;
    circle.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
            e.preventDefault();   // prevent the browser's synthetic dblclick / zoom
            toggleRing();
        }
        lastTap = now;
    });

    // ── Main physics loop ──────────────────────────────────────────
    function physicsLoop() {
        if (!physicsRunning) return;     // stopped by ring mode or reset
        // ── Per-body: gravity / space + wall collision ─────────────
        bodies.forEach(b => {
            if (!b.active) return;          // still on CSS return journey
            if (b.dragging) { applyDOM(b); return; }
            const dx   = b.x - cx;
            const dy   = b.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist + b.r < R) {
                // Inside circle — gravity pulls down
                b.vy += GRAVITY;
                b.vx *= FRICTION;
                b.vy *= FRICTION;
            } else {
                // Outside circle — space: slow drift + gentle inward pull
                b.vx *= SPACE_DAMPING;
                b.vy *= SPACE_DAMPING;
                if (dist > 0) {
                    b.vx -= (dx / dist) * PULL_BACK;
                    b.vy -= (dy / dist) * PULL_BACK;
                }
            }

            b.x += b.vx;
            b.y += b.vy;

            // Circle wall: rubber bounce
            const nx = b.x - cx;
            const ny = b.y - cy;
            const nd = Math.sqrt(nx * nx + ny * ny);
            if (nd + b.r > R) {
                const ratio = (R - b.r) / nd;
                b.x = cx + nx * ratio;
                b.y = cy + ny * ratio;
                const nnx = nx / nd;
                const nny = ny / nd;
                const dot = b.vx * nnx + b.vy * nny;
                b.vx = (b.vx - 2 * dot * nnx) * WALL_BOUNCE;
                b.vy = (b.vy - 2 * dot * nny) * WALL_BOUNCE;
            }

            applyDOM(b);
        });

        // ── Icon-to-icon elastic rubber collisions ─────────────────
        // Icons have real 2D volume — they push each other apart and
        // bounce so they naturally fill the circle without overlapping.
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const a    = bodies[i];
                const b    = bodies[j];
                const dx   = b.x - a.x;
                const dy   = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minD = a.r + b.r;

                if (dist < minD && dist > 0) {
                    // Separate overlapping bodies proportionally
                    const overlap = (minD - dist) / 2;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    if (!a.dragging) { a.x -= nx * overlap; a.y -= ny * overlap; }
                    if (!b.dragging) { b.x += nx * overlap; b.y += ny * overlap; }

                    // Exchange velocity along collision normal (elastic rubber)
                    const relVx = a.vx - b.vx;
                    const relVy = a.vy - b.vy;
                    const dot   = relVx * nx + relVy * ny;
                    if (dot > 0) {
                        const imp = dot * ICON_BOUNCE;
                        if (!a.dragging) { a.vx -= imp * nx; a.vy -= imp * ny; }
                        if (!b.dragging) { b.vx += imp * nx; b.vy += imp * ny; }
                    }
                }
            }
        }

        if (physicsRunning) requestAnimationFrame(physicsLoop);
    }

    // ── Real-time zero-delay dragging ──────────────────────────────
    bodies.forEach(body => {
        const onDragStart = (e) => {
            e.preventDefault();
            e.stopPropagation();

            body.dragging        = true;
            body.vx              = 0;
            body.vy              = 0;
            body.el.style.zIndex = '999';

            const isTouch    = e.type === 'touchstart';
            const clientX    = isTouch ? e.touches[0].clientX : e.clientX;
            const clientY    = isTouch ? e.touches[0].clientY : e.clientY;
            const circleRect = circle.getBoundingClientRect();

            const grabX = clientX - (circleRect.left + body.x);
            const grabY = clientY - (circleRect.top  + body.y);
            let prevX = body.x, prevY = body.y;

            const onMove = (e) => {
                if (e.cancelable) e.preventDefault();
                const mx   = e.touches ? e.touches[0].clientX : e.clientX;
                const my   = e.touches ? e.touches[0].clientY : e.clientY;
                const rect = circle.getBoundingClientRect();
                prevX  = body.x;
                prevY  = body.y;
                body.x = mx - grabX - rect.left;
                body.y = my - grabY - rect.top;
                body.el.style.left = `${body.x - body.r}px`;
                body.el.style.top  = `${body.y - body.r}px`;
            };

            const onEnd = () => {
                body.dragging        = false;
                body.el.style.zIndex = '';
                body.vx = (body.x - prevX) * 1.2;
                body.vy = (body.y - prevY) * 1.2;
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('mouseup',   onEnd);
                document.removeEventListener('touchend',  onEnd);
            };

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup',   onEnd);
            document.addEventListener('touchend',  onEnd);
        };

        body.el.addEventListener('mousedown',  onDragStart);
        body.el.addEventListener('touchstart', onDragStart, { passive: false });
    });

    // ── Resize ─────────────────────────────────────────────────────
    window.addEventListener('resize', debounce(() => {
        ({ R, cx, cy } = getCircleDims());
    }, 200));
});


// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', initializeProjects);
