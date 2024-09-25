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
        const patterns = ['honeycomb','circle','spiral','grid','random','star','staggered','ring','flower','wave','clover'];
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
                case 'honeycomb': arrangeInHoneycomb(); break; //Perfect
                case 'circle': arrangeInCircle(); break; //Perfect
                case 'spiral': arrangeInSpiral(); break; // Perfect
                case 'grid': arrangeInGrid(); break; //Perfect
                case 'random': arrangeIconsInJar(); break;
                case 'star': arrangeInStar(); break; //Perfect
                case 'staggered': arrangeInTrianglePattern(); break; //Perfecrt
                case 'ring': arrangeIconsInRing(); break; // Perfect
                case 'flower': arrangeInFlower(); break; //Perfect
                case 'wave': arrangeInWave(); break; // perfect
                case 'clover': arrangeInClover(); break; // perfect
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
            const maxRadius = radius * 0.9; // Set maximum radius the honeycomb can reach, slightly within the main circle
            const iconSize = icons[0].offsetWidth; // Ensure correct icon size
            let layer = 0;
            let iconsToPlace = icons.length;
            let offsetIndex = 0; // Start placing icons from the first icon
        
            // Calculate the spacing based on the icon size and the desired space between them
            const baseSpacing = iconSize * 1.2; // Adjust base spacing multiplier as needed
        
            // Function to determine maximum icons per layer
            const maxIconsPerLayer = (layer) => (layer === 0 ? 1 : 6 * layer);
        
            while (iconsToPlace > 0) {
                const iconsInThisLayer = Math.min(maxIconsPerLayer(layer), iconsToPlace);
        
                // Calculate the radius for this layer, ensuring it doesn't exceed maxRadius
                const layerRadius = layer * (baseSpacing * Math.sqrt(3) / 2);
        
                // Stop if the layer exceeds the defined circle's radius
                if (layerRadius + iconSize / 2 > maxRadius) break;
        
                for (let i = 0; i < iconsInThisLayer; i++) {
                    // Calculate the angle for this icon in the current layer
                    const angle = (i / iconsInThisLayer) * (2 * Math.PI);
        
                    // Calculate (x, y) positions relative to the center
                    const hexX = centerX + layerRadius * Math.cos(angle) - iconSize / 2;
                    const hexY = centerY + layerRadius * Math.sin(angle) - iconSize / 2;
        
                    if (offsetIndex < icons.length) {
                        const icon = icons[offsetIndex++];
                        icon.style.position = 'absolute';
                        icon.style.left = `${hexX}px`;
                        icon.style.top = `${hexY}px`;
                    }
                }
        
                // Update counters for the next layer
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
            const maxRadius = radius * 0.9; // Maximum allowable radius slightly inside the circle
            const iconSize = icons[0].offsetWidth; // Assuming all icons have the same size
            const spacing = iconSize * 0.2; // Set spacing as a percentage of icon size
        
            const numCols = Math.floor((2 * maxRadius) / (iconSize + spacing));
            const numRows = Math.ceil(icons.length / numCols);
        
            const offsetX = centerX - (numCols * (iconSize + spacing)) / 2 + spacing / 2;
            const offsetY = centerY - (numRows * (iconSize + spacing)) / 2 + spacing / 2;
        
            icons.forEach((icon, index) => {
                const col = index % numCols;
                const row = Math.floor(index / numCols);
        
                // Calculate the position of the icon
                let gridX = offsetX + col * (iconSize + spacing);
                let gridY = offsetY + row * (iconSize + spacing);
        
                // Check if the icon is still inside the circle boundary
                const distanceFromCenter = Math.sqrt(Math.pow(gridX + iconSize / 2 - centerX, 2) + Math.pow(gridY + iconSize / 2 - centerY, 2));
                if (distanceFromCenter + iconSize / 2 <= maxRadius) {
                    // If within circle, place the icon
                    icon.style.position = 'absolute';
                    icon.style.left = `${gridX}px`;
                    icon.style.top = `${gridY}px`;
                } 
            });
        }
        
        
        function arrangeIconsInJar() {
            const circleRect = circle.getBoundingClientRect();
            const radius = circleRect.width / 2; // Get the radius of the circle
            const centerX = circleRect.width / 2; // Center X of the circle
            const centerY = circleRect.height / 2; // Center Y of the circle
        
            const spacing = 10; // Adjust spacing between icons
            const iconHeight = icons[0].offsetHeight; // Height of each icon
            const iconWidth = icons[0].offsetWidth; // Width of each icon
            const maxIconsPerRow = Math.floor((radius * 2) / (iconWidth + spacing)); // Maximum icons that fit in a row
            const maxRows = Math.floor((radius * 2) / (iconHeight + spacing)); // Maximum rows based on icon height
            const totalHeight = maxRows * (iconHeight + spacing); // Total height needed for all icons
            const startY = centerY - (totalHeight / 2); // Starting Y position to center the icons vertically
        
            // Clear previous positions and hide icons initially
            icons.forEach(icon => {
                icon.style.position = 'absolute';
                icon.style.opacity = '0'; // Hide initially
            });
        
            // Loop through each icon and place it
            icons.forEach((icon, index) => {
                const row = Math.floor(index / maxIconsPerRow); // Determine the current row based on index
                const col = index % maxIconsPerRow; // Determine the current column based on index
        
                // Calculate the icon's X and Y positions
                const iconX = centerX - (maxIconsPerRow * (iconWidth + spacing)) / 2 + (col * (iconWidth + spacing)); // Centering horizontally
                const iconY = startY + (row * (iconHeight + spacing)); // Set Y position
        
                // Set the icon's position
                icon.style.left = `${iconX}px`; // Set X position
                icon.style.top = `${iconY}px`; // Set Y position
        
                // Show icon with a fade-in effect
                setTimeout(() => {
                    icon.style.opacity = '1'; // Show icon
                    icon.style.transition = 'opacity 0.5s ease'; // Fade-in transition
                }, index * 50); // Delay for each icon to appear sequentially
            });
        }
        
        
        function arrangeInStar() {
            const spikes = 5;
            const step = (2 * Math.PI) / spikes;
            const spacing = 2; // Adjust this value to increase/decrease space between icons
        
            icons.forEach((icon, index) => {
                const angle = step * index;
                const starRadius = radius * (index % 2 === 0 ? 0.5 : 0.25) + (spacing * index); // Adjusted radius with spacing
                const starX = centerX + starRadius * Math.cos(angle) - icon.offsetWidth / 2;
                const starY = centerY + starRadius * Math.sin(angle) - icon.offsetHeight / 2;
                icon.style.left = `${starX}px`;
                icon.style.top = `${starY}px`;
            });
        }
        
        
        function arrangeInTrianglePattern() {
            const iconSize = icons[0].offsetWidth; // Assuming all icons have the same size
            const spacing = iconSize * 1.3; // Adjust spacing between icons
        
            icons.forEach((icon, index) => {
                // Calculate which row this icon is in
                const row = Math.floor((Math.sqrt(1 + 8 * index) - 1) / 2);
                const col = index - (row * (row + 1)) / 2; // Number of icons in the current row
        
                // Calculate x and y positions for each icon
                const xOffset = (row * spacing)/2; // Offset to center the triangle
                const staggerX = centerX-20 + (col * spacing) - xOffset; // Center the icons horizontally
                const staggerY = (row * spacing); // Position them vertically downwards
        
                // Position the icon
                // icon.style.position = 'absolute'; // Ensure absolute positioning
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
