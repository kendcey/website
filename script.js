// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        // Get the target section
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate the position to scroll to, accounting for fixed navbar
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to timeline items when they come into view
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.5s ease-out';
    observer.observe(item);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar'); // Get reference to the navbar

if (hamburger && navLinks && navbar) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active'); // Toggle active class on hamburger
        document.body.classList.toggle('no-scroll'); // Toggle no-scroll class on body
        navbar.classList.toggle('sidebar-open'); // Toggle sidebar-open class on navbar

        // Explicitly set text based on whether the active class is now present
        if (hamburger.classList.contains('active')) {
            hamburger.textContent = 'Exit';
        } else {
            hamburger.textContent = 'Menu';
        }
    });
}

// Set active class for current page in navbar on initial load
const currentPathname = window.location.pathname.replace('/kendceyportfolio', ''); // Handle base path
const currentHash = window.location.hash;

document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPathname = new URL(link.href, window.location.origin).pathname.replace('/kendceyportfolio', ''); // Use origin to get full URL
    const linkHash = new URL(link.href, window.location.origin).hash;

    // Remove active-link from all links on load before applying new one
    link.classList.remove('active-link');

    // Skip activating the "Home" link
    if (link.textContent.trim() === 'Home') {
        return; // Skip this iteration, do not add active-link to Home
    }

    if (linkHash) {
        // Handle internal links like #projects
        // Only activate if the pathname matches AND the hash matches
        if (currentPathname === linkPathname && currentHash === linkHash) {
            link.classList.add('active-link');
        }
    } else {
        // Handle external links or direct page links (e.g., about.html, contact.html)
        // Activate if pathname matches exactly for non-home pages
        if (currentPathname === linkPathname) {
            link.classList.add('active-link');
        }
    }
});

// Close menu when clicking a link & Handle active link on click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        hamburger.textContent = 'Menu'; // Reset hamburger text to 'Menu'
        hamburger.classList.remove('active'); // Remove active class from hamburger
        document.body.classList.remove('no-scroll'); // Remove no-scroll class from body
        navbar.classList.remove('sidebar-open'); // Remove sidebar-open class from navbar

        // Remove active-link from all links
        document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active-link'));
        // Add active-link to the clicked link
        this.classList.add('active-link');
    });
});

// Close menu when clicking outside
if (hamburger && navLinks && navbar) {
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.textContent = 'Menu'; // Reset hamburger text to 'Menu'
            hamburger.classList.remove('active'); // Remove active class from hamburger
            document.body.classList.remove('no-scroll'); // Remove no-scroll class from body
            navbar.classList.remove('sidebar-open'); // Remove sidebar-open class from navbar
        }
    });
}

// Handle contact form submission
const contactForm = document.querySelector('.contact-form');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // Clear any existing messages
        successMessage.classList.remove('show');
        successMessage.textContent = '';
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const replyToInput = contactForm.querySelector('input[name="_replyto"]');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Basic validation
        if (!name || !email || !message || !validateEmail(email)) {
            errorMessage.textContent = 'Please fill in all fields correctly.';
            errorMessage.classList.add('show');

            // Hide message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }, 5000);
            return;
        }

        // Set reply-to email
        if (replyToInput) {
            replyToInput.value = email;
        }

        // Show loading state
        const sendButton = contactForm.querySelector('.send-button');
        const originalButtonText = sendButton.textContent;
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;

        // Create FormData and submit via fetch
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Display success message
                successMessage.textContent = 'Message sent successfully!';
                successMessage.classList.add('show');

                // Clear form fields
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';

                // Reset button
                sendButton.textContent = originalButtonText;
                sendButton.disabled = false;

                // Hide message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                    successMessage.textContent = '';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            // Display error message
            errorMessage.textContent = 'Failed to send message. Please try again or contact directly at kendcey@icloud.com';
            errorMessage.classList.add('show');

            // Reset button
            sendButton.textContent = originalButtonText;
            sendButton.disabled = false;

            // Hide message after 5 seconds
            setTimeout(() => {
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            }, 5000);
        });
    });
}

// Basic email validation function
function validateEmail(email) {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(String(email).toLowerCase());
}

// Removed duplicated sections outside DOMContentLoaded
// Close menu when clicking a link
// document.querySelectorAll('.nav-links a').forEach(link => {
//     link.addEventListener('click', () => {
//         hamburger.classList.remove('active');
//         navLinks.classList.remove('active');
//     });
// });

// Close menu when clicking outside
// document.addEventListener('click', (e) => {
//     if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
//         hamburger.classList.remove('active');
//         navLinks.classList.remove('active');
//     }
// });

// Add active class to clicked nav link (consolidated into existing click listener)

// Particle Effect
const canvas = document.getElementById('particles-js');

if (canvas) {
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 150;

    function Particle(x, y) {
        this.x = x;
        this.y = y
        this.size = Math.random() * 2 + 0.5; // Smaller particles
        this.speedX = Math.random() * 0.8 - 0.4; // Increased speed
        this.speedY = Math.random() * 0.8 - 0.4; // Increased speed
        
        // Define a set of slightly darker, subtle colors for particles
        const colors = [
            'rgba(220, 20, 60, ', // Medium grey
            'rgba(216, 129, 67, ', // Medium blue-grey
            'rgba(220, 20, 60, ', // Medium beige
            'rgba(216, 129, 67, '  // Medium greenish-grey
        ];
        // Randomly select a base color and append a slightly higher random alpha value for more opacity
        this.color = colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.4 + 0.3) + ')'; // Alpha from 0.3 to 0.7
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap particles around the screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    };

    Particle.prototype.draw = function() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    };

    function initParticles() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    // Initialize and animate on load
    window.addEventListener('load', () => {
        initParticles();
        animateParticles();
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        initParticles();
    });
}

// Image Carousel functionality
const carouselImages = document.querySelectorAll('.carousel-container img');
let currentImageIndex = 0;

function showNextImage() {
    // Remove active class from current image
    carouselImages[currentImageIndex].classList.remove('active');
    
    // Move to next image
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    
    // Add active class to new current image
    carouselImages[currentImageIndex].classList.add('active');
}

// Show first image initially
if (carouselImages.length > 0) {
    carouselImages[0].classList.add('active');
    // Start the carousel
    setInterval(showNextImage, 2500); // Change image every 3 seconds
}

// Back to top button functionality
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Image reveal animation
const verticalLinesContainer = document.getElementById('verticalLines');
const aboutContent = document.querySelector('.about-content');
const revealedImage = document.getElementById('revealedImage');

if (verticalLinesContainer && aboutContent && revealedImage) {
    let ticking = false;
    let initialBorderBottom = null;
    let initialAboutLeft = null;
    let initialAboutRight = null;
    let initialScrollY = null;
    
    function updateImageReveal() {
        const scrollY = window.scrollY || window.pageYOffset;
        const aboutRect = aboutContent.getBoundingClientRect();
        const container = aboutContent.closest('.container');
        
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Store initial scroll position on first run
        if (initialScrollY === null) {
            initialScrollY = scrollY;
            initialBorderBottom = aboutRect.bottom + scrollY;
        }
        
        // Get the border bottom position (where the top horizontal line is)
        const borderBottomY = aboutRect.bottom;
        
        // Calculate when to start animation (when border is in viewport)
        // Start growing when border is at viewport center or above
        const viewportCenter = windowHeight * 0.5;
        const distanceFromCenter = viewportCenter - borderBottomY;
        
        // Calculate image height based on scroll
        // Image grows downward as you scroll down past the border
        const maxHeight = 600;
        let imageHeight = 0;
        
        if (borderBottomY < viewportCenter) {
            // Border has passed viewport center, start growing
            const growthDistance = Math.abs(distanceFromCenter);
            imageHeight = Math.min(maxHeight, growthDistance);
        }
        
        // Calculate the width (same as about-content width, minus 2px to account for border)
        const imageWidth = (aboutRect.right - aboutRect.left) - 2;
        const leftPosition = aboutRect.left - containerRect.left;
        
        // Position container to start exactly at the border-bottom of about-content
        // The border is 1px, so we position the container right at the border edge
        const containerTop = aboutRect.bottom - containerRect.top;
        verticalLinesContainer.style.top = `${containerTop}px`;
        
        // Set container height to match image height (plus 1px for bottom border)
        verticalLinesContainer.style.height = imageHeight > 0 ? `${imageHeight + 1}px` : '0px';
        
        // Position and size the revealed image
        // Make sure image top is flush with the horizontal line (top: 0 in container)
        if (imageHeight > 0) {
            revealedImage.style.opacity = '1';
            revealedImage.style.left = `${leftPosition}px`;
            revealedImage.style.width = `${imageWidth}px`;
            revealedImage.style.height = `${imageHeight}px`;
            revealedImage.style.top = '0px';
            revealedImage.style.marginTop = '0px';
        } else {
            revealedImage.style.opacity = '0';
            revealedImage.style.height = '0px';
            revealedImage.style.top = '0px';
        }
        
        // Translate the container down as you scroll to keep it together
        const currentBorderBottom = aboutRect.bottom + scrollY;
        const scrollDistanceFromInitial = currentBorderBottom - initialBorderBottom;
        
        // Translate down to keep image aligned with border
        if (imageHeight > 0) {
            verticalLinesContainer.style.transform = `translateY(${scrollDistanceFromInitial}px)`;
        } else {
            verticalLinesContainer.style.transform = 'translateY(0)';
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateImageReveal);
            ticking = true;
        }
    }
    
    // Initial update
    updateImageReveal();
    
    // Update on scroll
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Update on resize
    window.addEventListener('resize', () => {
        initialBorderBottom = null;
        initialAboutLeft = null;
        initialAboutRight = null;
        initialScrollY = null;
        requestTick();
    });
}