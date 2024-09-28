let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

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

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.logo');
    const circle = document.querySelector('.circle');

    const updateCircleDimensions = () => {
        const circleRect = circle.getBoundingClientRect();
        return {
            radius: circleRect.width / 2,
            centerX: circleRect.width / 2,
            centerY: circleRect.height / 2
        };
    };

    let { radius, centerX, centerY } = updateCircleDimensions();

    window.addEventListener('resize', debounce(() => {
        ({ radius, centerX, centerY } = updateCircleDimensions());
        arrangeIconsInDynamicPattern();
    }, 200));

    circle.addEventListener('click', () => {
        arrangeIconsInRing();
        circle.classList.add('rotate-icons');
    });

    icons.forEach((icon, index) => {
        const angle = Math.random() * 2 * Math.PI;
        const initialPosition = {
            x: centerX + radius * 1.5 * Math.cos(angle) - icon.offsetWidth / 2,
            y: centerY + radius * 1.5 * Math.sin(angle) - icon.offsetHeight / 2
        };
    
        // Initial setup of icon positions and styles
        Object.assign(icon.style, {
            left: `${initialPosition.x}px`,
            top: `${initialPosition.y}px`,
            opacity: 0,
            // transform: 'scale(0.5)', // Start at scale 0.5
            transition: 'all 2.5s ease'
        });
    
        // Start animating after a delay based on the index
        setTimeout(() => {
            icon.style.opacity = 1;
            const settledPosition = {
                x: centerX - icon.offsetWidth / 2,
                y: centerY - icon.offsetHeight / 2
            };
            Object.assign(icon.style, {
                left: `${settledPosition.x}px`,
                top: `${settledPosition.y}px`,
                transform: 'scale(0.95)' // Ensure icons are still scaled to 0.5
            });
    
            // After the icons have moved to the center, scale them to 0.95
            setTimeout(() => {
                icon.style.transform = 'scale(0.5)';
                setTimeout(() => {icon.style.transform = 'scale(0.95)';},5000);
    
                // Call arrangeIconsInDynamicPattern after all icons have reached scale 0.95
                setTimeout(() => arrangeIconsInDynamicPattern(), 6000);
            }, 2500); // Adjust this delay to match when the icons settle before scaling to 0.95
        }, index * 120);
    });
    
    
    function arrangeIconsInDynamicPattern() {
        const iconData = Array.from(icons).map(icon => {
            return {
                element: icon,
                x: centerX, // Start from the center of the circle
                y: centerY, // Start from the center of the circle
                velocityX: 0, // Initial horizontal velocity
                velocityY: 0, // Initial vertical velocity
                width: icon.offsetWidth,
                height: icon.offsetHeight,
            };
        });
    
        let isRunning = true; // Track if the animation is running
        const gravityStrength = 0.8; // Gravity strength
        const damping = 0.8; // Damping factor to simulate air resistance
        const iconRadius = radius * 0.95; // Boundary radius for the icons
        let spreadingComplete = false; // Track if spreading is complete
        
        // Calculate the angle increment based on the number of icons
        const angleIncrement = (2 * Math.PI) / icons.length;
        // Initial positioning: Spread icons horizontally and start above the circle center
        iconData.forEach((icon, index) => {
            const angle = index * angleIncrement;
        
                // Calculate offsets based on the angle and screen size
                const offsetX = Math.cos(angle) * (window.innerWidth * 1); // 40% of screen size
                const offsetY = Math.sin(angle) * (window.innerHeight * 1); // 40% of screen size

                // Set icon's initial position
                icon.x = centerX + offsetX;
                icon.y = centerY + offsetY;
            // Apply CSS transition for the initial spreading
            Object.assign(icon.element.style, {
                left: `${icon.x}px`,
                top: `${icon.y}px`,
                transition: 'left 1s ease, top 1s ease', // Add transition for spreading
            });
    
            // Mark the icon as needing a transition end event
            icon.element.addEventListener('transitionend', () => {
                if (index === iconData.length - 1) {
                    spreadingComplete = true; // Set to true when all icons have finished spreading
                    startGravity(); // Start gravity after spreading is complete
                }
            }, { once: true }); // Ensure the event listener is called only once
        });
    
        function startGravity() {
            // Start the physics simulation after spreading is complete
            function updatePhysics() {
                if (!isRunning) return; // Stop if animation is no longer running
    
                iconData.forEach((icon, index) => {
                    // Apply gravity to pull the icons down
                    icon.velocityY += gravityStrength;
    
                    // Apply damping to simulate air resistance
                    icon.velocityY *= damping;
    
                    // Update positions
                    icon.y += icon.velocityY;
    
                    // Constrain icons within the circle boundary smoothly
                    const iconCenterX = icon.x + icon.width / 2;
                    const iconCenterY = icon.y + icon.height / 2;
                    const distanceFromCenter = Math.sqrt((iconCenterX - centerX) ** 2 + (iconCenterY - centerY) ** 2);
    
                    if (distanceFromCenter + icon.width / 2 > iconRadius) {
                        // Keep the icon within the boundary without bouncing
                        const angle = Math.atan2(iconCenterY - centerY, iconCenterX - centerX);
                        icon.x = centerX + (iconRadius - icon.width / 2) * Math.cos(angle) - icon.width / 2;
                        icon.y = centerY + (iconRadius - icon.height / 2) * Math.sin(angle) - icon.height / 2;
    
                        // Simply stop applying velocity without bouncing
                        icon.velocityY = 0; // Reset velocity
                    }
    
                    // Ensure no overlapping with separation logic
                    iconData.forEach((otherIcon, otherIndex) => {
                        if (icon !== otherIcon) {
                            const dx = icon.x - otherIcon.x;
                            const dy = icon.y - otherIcon.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            const minDistance = (icon.width + otherIcon.width) / 2 + 10; // Add spacing
    
                            if (distance < minDistance) {
                                // Calculate overlap
                                const overlap = minDistance - distance;
    
                                // Normalize direction
                                const angle = Math.atan2(dy, dx);
                                const pushX = Math.cos(angle) * overlap / 2;
                                const pushY = Math.sin(angle) * overlap / 2;
    
                                // Push icons apart
                                icon.x += pushX;
                                icon.y += pushY;
                                otherIcon.x -= pushX;
                                otherIcon.y -= pushY;
    
                                // Adjust velocities for a more natural separation
                                icon.velocityY += pushY * 0.04; // Less aggressive velocity adjustment
                                otherIcon.velocityY -= pushY * 0.04; // Less aggressive velocity adjustment
                            }
                        }
                    });
    
                    // Apply the calculated styles
                    Object.assign(icon.element.style, {
                        left: `${icon.x}px`,
                        top: `${icon.y}px`,
                        transition: 'left 0.5s, top 0.5s', // Smooth transition for physics updates
                    });
                });
    
                requestAnimationFrame(updatePhysics);
            }
    
            updatePhysics(); // Start the physics simulation
        }
    
        // Stop the gravity animation and arrange icons in a ring when the circle is clicked
        circle.addEventListener('click', () => {
            isRunning = false;
            arrangeIconsInRing(); // Call the arrangeIconsInRing function
            circle.classList.add('rotate-icons');
        });
    }
    
   
    function arrangeIconsInRing() {
        const angleStep = (2 * Math.PI) / icons.length;
        icons.forEach((icon, index) => {
            const angle = index * angleStep;
            const iconPosition = {
                x: centerX + (radius * 1.2) * Math.cos(angle) - icon.offsetWidth / 2,
                y: centerY + (radius * 1.2) * Math.sin(angle) - icon.offsetHeight / 2
            };

            Object.assign(icon.style, {
                position: 'absolute',
                transition: 'left 1.2s ease, top 1.2s ease, transform 1.2s ease',
                left: `${iconPosition.x}px`,
                top: `${iconPosition.y}px`,
                transform: `rotate(${angle * (180 / Math.PI) + 90}deg) scale(1.1)`
            });
        });

        setTimeout(() => icons.forEach(icon => icon.style.opacity = 1), 400);
    }
// Draggable icons optimized
icons.forEach(icon => {
    const startDrag = event => {
        event.preventDefault();
        const isTouch = event.type === 'touchstart';
        const startX = isTouch ? event.touches[0].clientX : event.clientX;
        const startY = isTouch ? event.touches[0].clientY : event.clientY;
        
        // Capture the initial icon offset from the top-left corner of the page
        const iconRect = icon.getBoundingClientRect();
        const offsetX = startX - iconRect.left;
        const offsetY = startY - iconRect.top;

        let x, y;
        let isDragging = false;

        // RequestAnimationFrame loop for smooth dragging
        const onDrag = moveEvent => {
            isDragging = true;
            const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
            const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

            // Calculate the new x and y position so that the icon's center is at the mouse/touch position
            x = clientX - offsetX;
            y = clientY - offsetY;

            requestAnimationFrame(() => {
                if (isDragging) {
                    // Directly set the position of the icon to follow the mouse/touch position
                    icon.style.left = `${x}px`;
                    icon.style.top = `${y}px`;
                }
            });
        };

        const endDrag = () => {
            isDragging = false;
            document.removeEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag);
            document.removeEventListener(isTouch ? 'touchend' : 'mouseup', endDrag);
        };

        document.addEventListener(isTouch ? 'touchmove' : 'mousemove', onDrag, { passive: false });
        document.addEventListener(isTouch ? 'touchend' : 'mouseup', endDrag);
    };

    icon.addEventListener('mousedown', startDrag);
    icon.addEventListener('touchstart', startDrag, { passive: false });
});


    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
