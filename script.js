let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
let currentSlide = 0;
let autoSlideInterval;
let isExpanded = false;
let isDragging = false;
let startY = 0;
let scrollTop = 0;

// Initialize
function initializeProjects() {
    createDots();
    if (window.innerWidth <= 768 && !isExpanded) {
        startAutoSlide();
        setupEventListeners();
    }
    updateDots();
}

// Create dots
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

// Setup event listeners
function setupEventListeners() {
    const slider = document.querySelector('.project-slider');
    
    // Mouse events
    slider.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    // Touch events
    slider.addEventListener('touchstart', startDragging);
    slider.addEventListener('touchmove', drag);
    slider.addEventListener('touchend', stopDragging);
    
    // Prevent default scrolling when in slider mode
    slider.addEventListener('wheel', (e) => {
        if (!isExpanded) {
            e.preventDefault();
            moveSlide(e.deltaY > 0 ? 'down' : 'up');
        }
    });
}

// Dragging functions
function startDragging(e) {
    if (isExpanded) return;
    
    isDragging = true;
    startY = e.type === 'mousedown' ? e.pageY : e.touches[0].pageY;
    scrollTop = currentSlide * document.querySelector('.project-box').offsetHeight;
    
    // Stop auto-slide while dragging
    stopAutoSlide();
}

function drag(e) {
    if (!isDragging || isExpanded) return;
    e.preventDefault();
    
    const y = e.type === 'mousemove' ? e.pageY : e.touches[0].pageY;
    const walk = (startY - y) * 1.5; // Multiplier for faster response
    
    // Update slide position while dragging
    const slider = document.querySelector('.project-slider');
    const boxes = document.querySelectorAll('.project-box');
    boxes.forEach(box => {
        box.style.transform = `translateY(${-scrollTop - walk}px)`;
    });
}

function stopDragging(e) {
    if (!isDragging) return;
    isDragging = false;
    
    const y = e.type === 'mouseup' ? e.pageY : e.changedTouches[0].pageY;
    const walk = startY - y;
    
    // Determine direction and move slide
    if (Math.abs(walk) > 50) {
        moveSlide(walk > 0 ? 'down' : 'up');
    } else {
        // Snap back to current slide if movement was too small
        updateSlidePosition();
    }
    
    // Restart auto-slide
    startAutoSlide();
}

// Toggle view
function toggleView() {
    const slider = document.querySelector('.project-slider');
    const btn = document.querySelector('.view-toggle-btn');
    const dots = document.querySelector('.slide-dots');
    
    isExpanded = !isExpanded;
    slider.classList.toggle('expanded');
    
    // Update button text and controls visibility
    btn.querySelector('.toggle-text').textContent = isExpanded ? 'Collapse Projects' : 'View All Projects';
    dots.style.display = isExpanded ? 'none' : 'flex';
    
    // Handle auto-slide
    if (isExpanded) {
        stopAutoSlide();
        // Reset transforms
        document.querySelectorAll('.project-box').forEach(box => {
            box.style.transform = '';
        });
    } else {
        currentSlide = 0;
        updateSlidePosition();
        startAutoSlide();
    }
}

// Slide movement
function moveSlide(direction) {
    if (isExpanded) return;
    
    const boxes = document.querySelectorAll('.project-box');
    stopAutoSlide();
    
    if (direction === 'up' && currentSlide > 0) {
        currentSlide--;
    } else if (direction === 'down' && currentSlide < boxes.length - 1) {
        currentSlide++;
    }
    
    updateSlidePosition();
    startAutoSlide();
}

// Go to specific slide
function goToSlide(index) {
    if (isExpanded) return;
    
    stopAutoSlide();
    currentSlide = index;
    updateSlidePosition();
    startAutoSlide();
}

// Update slide positions
function updateSlidePosition() {
    if (isExpanded) return;
    
    const boxes = document.querySelectorAll('.project-box');
    const slideHeight = boxes[0].offsetHeight;
    
    boxes.forEach(box => {
        box.style.transform = `translateY(${-currentSlide * slideHeight}px)`;
    });
    
    updateDots();
}

// Update dots
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Auto-slide functions
function startAutoSlide() {
    if (isExpanded || window.innerWidth > 768) return;
    
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
        const boxes = document.querySelectorAll('.project-box');
        if (currentSlide < boxes.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0;
        }
        updateSlidePosition();
    }, 3000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Window resize handler
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !isExpanded) {
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
    updateSlidePosition();
});

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeProjects);



function toggleContent(contentId) {
    const content = document.getElementById(`content-${contentId}`);
    const allContent = document.querySelectorAll('.timeline-content');
    const verticalLine = document.getElementById(`vl-${contentId}`);
    const horizontalLine = document.getElementById(`hl-${contentId}`);

    // Hide all content except the selected one
    allContent.forEach((item) => {
        if (item !== content) {
            item.classList.remove('active');
            const lineId = item.id.split('-')[1];
            const otherVerticalLine = document.getElementById(`vl-${lineId}`);
            const otherHorizontalLine = document.getElementById(`hl-${lineId}`);
            
            if (window.matchMedia("(max-width: 700px)").matches) {
                otherVerticalLine.style.height = "13rem"; // Adjust for mobile view
                otherHorizontalLine.style.top = "160%";
            } else {
                otherVerticalLine.style.height = "14.5rem"; // Default height for larger screens
                otherHorizontalLine.style.top = "150%";
            }
        }
    });

    // Toggle the visibility of the selected content
    content.classList.toggle('active');

    // Adjust vertical and horizontal lines based on content visibility
    if (content.classList.contains('active')) {
        const contentHeight = content.scrollHeight;
        if (window.matchMedia("(max-width: 700px)").matches) {
            verticalLine.style.height = `${contentHeight + 114}px`; // Adjusted for mobile view
            horizontalLine.style.top = `${contentHeight + 82}px`;
        } else {
            verticalLine.style.height = `${contentHeight + 140}px`; // Default for larger screens
            horizontalLine.style.top = `${contentHeight + 103}px`;
        }
    } else {
        if (window.matchMedia("(max-width: 700px)").matches) {
            verticalLine.style.height = "13rem"; // Reset height for mobile
            horizontalLine.style.top = "160%";
        } else {
            verticalLine.style.height = "14.5rem"; // Default height for larger screens
            horizontalLine.style.top = "150%";
        }
    }
}


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
