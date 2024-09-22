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

        Object.assign(icon.style, {
            left: `${initialPosition.x}px`,
            top: `${initialPosition.y}px`,
            opacity: 0,
            transition: 'all 2.5s ease'
        });

        setTimeout(() => {
            icon.style.opacity = 1;
            const settledPosition = {
                x: centerX - icon.offsetWidth / 2,
                y: centerY - icon.offsetHeight / 2
            };
            Object.assign(icon.style, {
                transform: 'scale(0.95)',
                left: `${settledPosition.x}px`,
                top: `${settledPosition.y}px`
            });

            setTimeout(() => arrangeIconsInDynamicPattern(), 5000 + index * 100);
        }, index * 120);
    });

    function arrangeIconsInDynamicPattern() {
        const patterns = ['honeycomb', 'circle', 'spiral', 'grid', 'random', 'star', 'staggered', 'ring', 'flower', 'wave', 'clover'];
        const chosenPattern = patterns[Math.floor(Math.random() * patterns.length)];

        icons.forEach(icon => {
            Object.assign(icon.style, {
                transition: 'transform 1s ease, opacity 1s ease',
                transform: 'scale(0.6)',
                opacity: '0.2'
            });
        });

        setTimeout(() => {
            switch (chosenPattern) {
                case 'honeycomb': arrangeInHoneycomb(); break;
                case 'circle': arrangeInCircle(); break;
                case 'spiral': arrangeInSpiral(); break;
                case 'grid': arrangeInGrid(); break;
                case 'random': arrangeRandomly(); break;
                case 'star': arrangeInStar(); break;
                case 'staggered': arrangeInStaggeredPattern(); break;
                case 'ring': arrangeIconsInRing(); break;
                case 'flower': arrangeInFlower(); break;
                case 'wave': arrangeInWave(); break;
                case 'clover': arrangeInClover(); break;
            }

            icons.forEach((icon, index) => {
                setTimeout(() => {
                    Object.assign(icon.style, {
                        transition: 'transform 0.8s ease, top 1s ease, left 1s ease, opacity 1s ease',
                        opacity: 1,
                        transform: `scale(1) rotate(${index * 10}deg)`
                    });
                }, index * 80);
            });
        }, 600);
        function arrangeInHoneycomb() {
            let layer = 0;
            let iconsToPlace = icons.length;
            const maxIconsPerLayer = (layer) => 6 * layer || 1;

            while (iconsToPlace > 0) {
                const iconsInThisLayer = Math.min(maxIconsPerLayer(layer), iconsToPlace);
                for (let i = 0; i < iconsInThisLayer; i++) {
                    const angle = (i / iconsInThisLayer) * (2 * Math.PI);
                    const layerRadius = layer * spacing;
                    const hexX = centerX + layerRadius * Math.cos(angle) - iconSize / 2;
                    const hexY = centerY + layerRadius * Math.sin(angle) - iconSize / 2;

                    if (offsetIndex < icons.length) {
                        const icon = icons[offsetIndex++];
                        icon.style.left = `${hexX}px`;
                        icon.style.top = `${hexY}px`;
                    }
                }
                iconsToPlace -= iconsInThisLayer;
                layer++;
            }
        }

        function arrangeInCircle() {
            const angleStep = (2 * Math.PI) / icons.length;
            icons.forEach((icon, index) => {
                const angle = index * angleStep;
                const iconX = centerX + (radius * 0.8) * Math.cos(angle) - icon.offsetWidth / 2;
                const iconY = centerY + (radius * 0.8) * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${iconX}px`;
                icon.style.top = `${iconY}px`;
            });
        }
        
        function arrangeInSpiral() {
            icons.forEach((icon, index) => {
                const angle = index * 0.4;
                const spiralRadius = Math.min(radius * 0.8, index * (icon.offsetWidth / 3));
                const spiralX = centerX + spiralRadius * Math.cos(angle) - icon.offsetWidth / 2;
                const spiralY = centerY + spiralRadius * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${spiralX}px`;
                icon.style.top = `${spiralY}px`;
            });
        }
        
        function arrangeInGrid() {
            const cols = Math.ceil(Math.sqrt(icons.length));
            const spacing = 10; // Space between icons
            icons.forEach((icon, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;
                const gridX = centerX + (col - cols / 2) * (icon.offsetWidth + spacing);
                const gridY = centerY + (row - cols / 2) * (icon.offsetHeight + spacing);
                icon.style.left = `${gridX}px`;
                icon.style.top = `${gridY}px`;
            });
        }
        
        function arrangeRandomly() {
            icons.forEach(icon => {
                const angle = Math.random() * 2 * Math.PI;
                const randomRadius = Math.random() * (radius * 0.8);
                const randomX = centerX + randomRadius * Math.cos(angle) - icon.offsetWidth / 2;
                const randomY = centerY + randomRadius * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${randomX}px`;
                icon.style.top = `${randomY}px`;
            });
        }
        
        function arrangeInStar() {
            const spikes = 5;
            const step = (2 * Math.PI) / spikes;
            icons.forEach((icon, index) => {
                const angle = step * index;
                const starRadius = radius * (index % 2 === 0 ? 0.5 : 0.25); // Adjusted radius
                const starX = centerX + starRadius * Math.cos(angle) - icon.offsetWidth / 2;
                const starY = centerY + starRadius * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${starX}px`;
                icon.style.top = `${starY}px`;
            });
        }
        
        function arrangeInStaggeredPattern() {
            const maxIconsPerRow = 5;
            const iconSize = icons[0].offsetWidth;
            const spacingX = iconSize * 1.5;
            const spacingY = iconSize * 1.2;
        
            icons.forEach((icon, index) => {
                const row = Math.floor(index / maxIconsPerRow);
                const col = index % maxIconsPerRow;
        
                let staggerX = centerX + (col - (maxIconsPerRow - 1) / 2) * spacingX;
                let staggerY = centerY + (row - (icons.length / maxIconsPerRow - 1) / 2) * spacingY;
        
                const distanceFromCenter = Math.sqrt((staggerX - centerX) ** 2 + (staggerY - centerY) ** 2);
                if (distanceFromCenter + iconSize / 2 > radius) {
                    const angle = Math.atan2(staggerY - centerY, staggerX - centerX);
                    staggerX = centerX + (radius - iconSize / 2) * Math.cos(angle);
                    staggerY = centerY + (radius - iconSize / 2) * Math.sin(angle);
                }
        
                icon.style.left = `${staggerX}px`;
                icon.style.top = `${staggerY}px`;
            });
        }
        
        function arrangeInFlower() {
            const petals = 6;
            const petalRadius = radius / 2; // Adjusted radius for flower pattern
            icons.forEach((icon, index) => {
                const angle = (index % petals) * (2 * Math.PI / petals);
                const offset = Math.floor(index / petals) * (icon.offsetHeight / 2);
                const flowerX = centerX + (petalRadius + offset) * Math.cos(angle) - icon.offsetWidth / 2;
                const flowerY = centerY + (petalRadius + offset) * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${flowerX}px`;
                icon.style.top = `${flowerY}px`;
            });
        }
        
        function arrangeInWave() {
            const waveAmplitude = radius / 4;
            const waveFrequency = (2 * Math.PI) / icons.length;
            icons.forEach((icon, index) => {
                const x = centerX + (index - icons.length / 2) * (icon.offsetWidth * 1.2);
                const y = centerY + waveAmplitude * Math.sin(index * waveFrequency);
                const clampedY = Math.min(y, centerY + radius - icon.offsetHeight / 2);
                icon.style.left = `${x}px`;
                icon.style.top = `${clampedY}px`;
            });
        }
        
        function arrangeInClover() {
            const leaves = 4;
            const leafRadius = radius / 1.5; // Adjusted radius for clover pattern
            icons.forEach((icon, index) => {
                const angle = (index % leaves) * (2 * Math.PI / leaves);
                const offset = Math.floor(index / leaves) * (icon.offsetHeight / 2);
                const cloverX = centerX + (leafRadius + offset) * Math.cos(angle) - icon.offsetWidth / 2;
                const cloverY = centerY + (leafRadius + offset) * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${cloverX}px`;
                icon.style.top = `${cloverY}px`;
            });
        }
        
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

    // Draggable icons
    icons.forEach(icon => {
        const startDrag = event => {
            event.preventDefault();
            const isTouch = event.type === 'touchstart';
            const startX = isTouch ? event.touches[0].clientX : event.clientX;
            const startY = isTouch ? event.touches[0].clientY : event.clientY;
            const offsetX = startX - icon.getBoundingClientRect().left;
            const offsetY = startY - icon.getBoundingClientRect().top;

            const onDrag = moveEvent => {
                const clientX = isTouch ? moveEvent.touches[0].clientX : moveEvent.clientX;
                const clientY = isTouch ? moveEvent.touches[0].clientY : moveEvent.clientY;

                let x = clientX - circle.getBoundingClientRect().left - offsetX;
                let y = clientY - circle.getBoundingClientRect().top - offsetY;

                const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                if (distanceFromCenter + icon.clientWidth / 2 > radius) {
                    const angle = Math.atan2(y - centerY, x - centerX);
                    x = centerX + (radius - icon.clientWidth / 2) * Math.cos(angle) - icon.clientWidth / 2;
                    y = centerY + (radius - icon.clientHeight / 2) * Math.sin(angle) - icon.clientHeight / 2;
                }

                Object.assign(icon.style, { left: `${x}px`, top: `${y}px` });
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

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});
