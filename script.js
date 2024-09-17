

let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');
 
window.onscroll = () => {
    sections.forEach(sec=>{
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height){
            navLinks.forEach(links =>{
                links.classList.remove('active');
                document.querySelector('header nav a [href*=' +id+ ']').classList.add('active')
            })
        }
    })
}

menuIcon.onclick = ()=>{
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// Phys Simulation


document.addEventListener('DOMContentLoaded', function () {
    const icons = document.querySelectorAll('.logo');
    const circle = document.querySelector('.circle');
    const hov = document.querySelector('.hov');
    const circleRect = circle.getBoundingClientRect();
    const hovRect = hov.getBoundingClientRect();
    const radius = circleRect.width / 2;
    const centerX = circleRect.width / 2;
    const centerY = circleRect.height / 2;

    // Initialize positions for each icon
    icons.forEach((icon, index) => {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radius;
        const initialX = centerX + distance * Math.cos(angle) - icon.offsetWidth / 2;
        const initialY = centerY + distance * Math.sin(angle) - icon.offsetHeight / 2;

        // Set initial position
        icon.style.left = `${initialX}px`;
        icon.style.top = `${initialY}px`;
        icon.style.opacity = 1; // Fully visible inside the circle
        icon.style.transform = 'scale(1)'; // Start with larger size

        // Simulate falling effect
        setTimeout(() => {
            icon.style.transition = 'all 1s ease-out';
            icon.style.opacity = 1;
            icon.style.transform = 'scale(1)';

            // Ensure icons settle at the bottom of the circle
            const settledX = centerX - icon.offsetWidth / 2;
            const settledY = circleRect.height/2  - icon.offsetHeight;
            icon.style.left = `${settledX}px`;
            icon.style.top = `${settledY}px`;

            // Add slight random movement after settling
            setTimeout(() => {
                icon.style.transition = 'top 0.8s ease-in-out, left 0.8s ease-in-out';
                icon.style.left = `${Math.random()*(circleRect.width - icon.clientWidth)}px`;
                // icon.style.top = `${Math.random()*(circleRect.height - icon.clientWidth)}px`;
    
            }, 2000);
        }, index * 100); // Staggered start


        
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

            // Constrain the icon within the circle
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



    });

    // Function to arrange icons in a circular pattern around the circle
    function arrangeIconsInRing() {
        const angleStep = (2 * Math.PI) / icons.length; // Calculate the angle between each icon

        icons.forEach((icon, index) => {
            const angle = index * angleStep; // Calculate the angle for the current icon
            const iconX = centerX + (radius + 30) * Math.cos(angle) - icon.offsetWidth / 2; // X position
            const iconY = centerY + (radius + 30) * Math.sin(angle) - icon.offsetHeight /2; // Y position

            // Apply the calculated positions to the icon
            icon.style.position = 'absolute';
            icon.style.left = `${iconX}px`;
            icon.style.top = `${iconY}px`;
            icon.style.transition = 'all 0.8s ease'; // Smooth transition
            const rotateDegree = angle * (180 / Math.PI) + 90; // Convert to degrees and adjust for upright position
            icon.style.transform = `rotate(${rotateDegree}deg) scale(1.1)`;
        });
        
        // Apply rotation and visibility effects
        icons.forEach(icon => {
            icon.style.opacity = 0; // Hide all initially
        });

        setTimeout(() => {
            icons.forEach(icon => {
                icon.style.opacity = 1; // Fade in icons
            });


        }, 400); // Delay for smooth appearance
    }
    

    // Update icon visibility during rotation
    function updateIconVisibility() {
        const centerY = window.innerHeight / 2; // Assuming the center of the circle is at the middle of the viewport
        icons.forEach(icon => {
            const iconRect = icon.getBoundingClientRect();
            const iconCenterY = iconRect.top + iconRect.height;



            if (iconCenterY <= centerY) {
                // The icon is in the upper half of the circle
                icon.style.opacity = 1; // Fully visible
            } else {
                // The icon is in the lower half of the circle
                icon.style.opacity = 0; // Partially hidden
                
            }
        });
    }

    // Call the update function continuously or on each rotation step
    setInterval(updateIconVisibility, 16); // Approximately 60fps

    // Attach an event listener to update visibility during animation
    circle.addEventListener('animationiteration', updateIconVisibility);

    // Event listener for clicking on the circle to arrange icons in a ring
    circle.addEventListener('click', () => {
        arrangeIconsInRing();
        // Add rotation animation
        circle.classList.add('rotate-icons');
        setInterval(scaleIconOverHov, 16); // Approximately 60fps
    });
      

});





