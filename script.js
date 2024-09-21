let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
};

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); // Change icon if needed
    navbar.classList.toggle('active'); // Toggle the navbar visibility
};

// Physics Simulation and Improved Honeybee Pattern
document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.logo');
    const circle = document.querySelector('.circle');

    // Recalculate circle dimensions on resize for responsiveness
    const updateCircleDimensions = () => {
        const circleRect = circle.getBoundingClientRect();
        const radius = circleRect.width / 2;
        const centerX = circleRect.width / 2;
        const centerY = circleRect.height / 2;
        return { circleRect, radius, centerX, centerY };
    };

    let { circleRect, radius, centerX, centerY } = updateCircleDimensions();

    window.addEventListener('resize', debounce(() => {
        ({ circleRect, radius, centerX, centerY } = updateCircleDimensions());
        arrangeIconsInHoneycomb();
    }, 200));

    // Initialize positions for each icon with staggered animation coming from outside the circle
    icons.forEach((icon, index) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = radius * 1.5; // Start far outside the circle
        const initialX = centerX + distance * Math.cos(angle) - icon.offsetWidth / 2;
        const initialY = centerY + distance * Math.sin(angle) - icon.offsetHeight / 2;

        icon.style.left = `${initialX}px`;
        icon.style.top = `${initialY}px`;
        icon.style.opacity = 0;

        // Simulate icons converging into the center
        setTimeout(() => {
            icon.style.transition = 'all 3s ease';
            icon.style.opacity = 1;

            const settledX = centerX - icon.offsetWidth / 2;
            const settledY = centerY - icon.offsetHeight / 2;
            icon.style.transform = `scale(0.95)`;
            icon.style.left = `${settledX}px`;
            icon.style.top = `${settledY}px`;

            // After reaching the center, spread into the honeycomb pattern
            setTimeout(() => {
                arrangeIconsInHoneycomb();
            }, 5000 + index * 100); // Staggered spreading animation
        }, index * 150); // Staggered start for convergence
    });

    // Arrange icons in a honeycomb pattern with pop-in animation
function arrangeIconsInHoneycomb() {
    let offsetIndex = 0;
    const iconSize = icons[0].offsetWidth; // Assuming square icons
    const spacing = iconSize * 1.4; // Add a little spacing between icons
    const hexHeight = spacing * Math.sqrt(3) / 2; // Vertical spacing for hexagonal layout

    // Generate honeycomb pattern by iterating in layers from the center outwards
    let layer = 0;
    let iconsToPlace = icons.length;
    const maxIconsPerLayer = (layer) => 6 * layer || 1; // 1 icon at the center, then 6 per layer

    // Apply the honeycomb pattern positions
    while (iconsToPlace > 0) {
        const iconsInThisLayer = Math.min(maxIconsPerLayer(layer), iconsToPlace);
        for (let i = 0; i < iconsInThisLayer; i++) {
            const angle = (i / iconsInThisLayer) * (2 * Math.PI); // Divide the circle for icons
            const layerRadius = layer * spacing; // Increase distance with each layer

            const hexX = centerX + layerRadius * Math.cos(angle) - iconSize / 2;
            const hexY = centerY + layerRadius * Math.sin(angle) - iconSize / 2;

            if (offsetIndex < icons.length) {
                const icon = icons[offsetIndex];

                // Directly set the position in honeycomb pattern
                icon.style.left = `${hexX}px`;
                icon.style.top = `${hexY}px`;
                icon.style.opacity = 0; // Set to 0 initially for animation

                // Apply pop-in animation with staggered delay
                setTimeout(() => {
                    icon.style.opacity = 1;
                    icon.style.transform = `scale(1.1)`; // Scale slightly larger
                    icon.style.animation = 'popIn 0.6s ease-out forwards';
                }, offsetIndex * 100); // Staggered delay for each icon

                offsetIndex++;
            }
        }
        iconsToPlace -= iconsInThisLayer;
        layer++; // Move to the next outer layer
    }
}

// Add the pop-in animation via CSS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes popIn {
        0% {
            transform: scale(0.5);
            opacity: 0;
        }
        70% {
            transform: scale(1.2);
            opacity: 0.5;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);


    // Event listener to arrange icons in a ring outside the circle
    circle.addEventListener('click', () => {
        arrangeIconsInRing();
        circle.classList.add('rotate-icons'); // Start rotating icons on click
    });

    // Arrange icons in a circular ring outside the circle
    function arrangeIconsInRing() {
        const angleStep = (2 * Math.PI) / icons.length;
        icons.forEach((icon, index) => {
            const angle = index * angleStep;
            const iconX = centerX + (radius * 1.2) * Math.cos(angle) - icon.offsetWidth / 2; // 1.4 * radius for outside circle
            const iconY = centerY + (radius * 1.2) * Math.sin(angle) - icon.offsetHeight / 2;

            icon.style.position = 'absolute';
            icon.style.left = `${iconX}px`;
            icon.style.top = `${iconY}px`;

            // Rotate icon to face outward
            const rotateDegree = angle * (180 / Math.PI) + 90;
            icon.style.transform = `rotate(${rotateDegree}deg) scale(1)`;
        });

        setTimeout(() => {
            icons.forEach(icon => icon.style.opacity = 1);
        }, 400);
    }

    // Drag functionality for icons
    icons.forEach((icon) => {
        const startDrag = (event) => {
            event.preventDefault();
            const isTouch = event.type === 'touchstart';
            const startX = isTouch ? event.touches[0].clientX : event.clientX;
            const startY = isTouch ? event.touches[0].clientY : event.clientY;
            const offsetX = startX - icon.getBoundingClientRect().left;
            const offsetY = startY - icon.getBoundingClientRect().top;

            const onDrag = (moveEvent) => {
                const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
                const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

                let x = clientX - circleRect.left - offsetX;
                let y = clientY - circleRect.top - offsetY;

                const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distanceFromCenter + icon.clientWidth / 2 > radius) {
                    const angle = Math.atan2(y - centerY, x - centerX);
                    x = centerX + (radius - icon.clientWidth / 2) * Math.cos(angle) - icon.clientWidth / 2;
                    y = centerY + (radius - icon.clientHeight / 2) * Math.sin(angle) - icon.clientHeight / 2;
                }

                icon.style.left = `${x}px`;
                icon.style.top = `${y}px`;
            };

            const endDrag = () => {
                document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag);
                document.removeEventListener(isTouch ? 'touchend' : 'mouseup', endDrag);
            };

            document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag);
            document.addEventListener(isTouch ? 'touchend' : 'mouseup', endDrag);
        };

        icon.addEventListener('mousedown', startDrag);
        icon.addEventListener('touchstart', startDrag, { passive: false });
    });

    // Debounce function to prevent excessive firing on resize
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
