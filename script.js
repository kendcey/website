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

// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

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

        // Show loading state
        const sendButton = contactForm.querySelector('.send-button');
        const originalButtonText = sendButton.textContent;
        sendButton.textContent = 'Sending...';
        sendButton.disabled = true;

        // EmailJS template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'kendcey@icloud.com'
        };

        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
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
            })
            .catch(function(error) {
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

// Scroll-locked image slider within the about-image-square
const aboutImageSquare = document.querySelector('.about-image-square');
const aboutImagesSlider = document.querySelector('.about-images-slider');
const aboutSection = document.getElementById('about');

if (aboutImageSquare && aboutImagesSlider && aboutSection) {
    const imageSlides = document.querySelectorAll('.image-slide');
    const numImages = imageSlides.length;
    let isLocked = false;
    let scrollDelta = 0;
    let currentProgress = 0;
    let targetProgress = 0;
    let isCentering = false;
    let rafId = null;
    let lastScrollTime = 0;
    
    // Responsive scroll sensitivity based on screen size
    function getScrollSensitivity() {
        const isMobile = window.innerWidth <= 768;
        return isMobile ? 1.5 : 1.2; // More sensitive on mobile
    }
    
    function getScrollThreshold() {
        const isMobile = window.innerWidth <= 768;
        return isMobile ? 1200 : 1500; // Lower threshold on mobile
    }
    
    // Responsive center threshold based on screen size
    function getCenterThreshold() {
        const windowHeight = window.innerHeight;
        const isMobile = window.innerWidth <= 768;
        // Use very small threshold for precise centering
        return isMobile ? Math.max(8, windowHeight * 0.015) : Math.max(5, windowHeight * 0.01);
    }
    
    const SMOOTH_FACTOR = 0.15;
    
    function getSlideHeight() {
        return aboutImageSquare.offsetHeight;
    }
    
    function getTotalHeight() {
        const slideHeight = getSlideHeight();
        return slideHeight * numImages + (numImages - 1) - 7; // Subtract 7px to fix bottom spacing
    }
    
    function snapToImage(progress) {
        // Calculate snap points for each image
        const snapPoints = [];
        for (let i = 0; i < numImages; i++) {
            snapPoints.push(i / (numImages - 1));
        }
        
        // Find nearest snap point
        let nearestSnap = progress;
        let minDistance = Infinity;
        
        for (let snapPoint of snapPoints) {
            const distance = Math.abs(progress - snapPoint);
            if (distance < minDistance) {
                minDistance = distance;
                nearestSnap = snapPoint;
            }
        }
        
        // Light snap: only snap if close enough (within 15% of image distance)
        const snapThreshold = 1 / (numImages * 2) * 0.5; // 50% of half the distance between images
        if (minDistance < snapThreshold) {
            // Smoothly interpolate towards snap point
            const snapStrength = 0.5; // Stronger snap strength
            return progress + (nearestSnap - progress) * snapStrength;
        }
        
        return progress;
    }
    
    function updateImageSlider(progress, immediate = false) {
        targetProgress = Math.max(0, Math.min(1, progress));
        
        // Apply light snap effect
        if (!immediate) {
            targetProgress = snapToImage(targetProgress);
        }
        
        if (immediate) {
            currentProgress = targetProgress;
        } else {
            // Smooth interpolation for snappy feel
            currentProgress += (targetProgress - currentProgress) * SMOOTH_FACTOR;
            
            // Stop animation when close enough
            if (Math.abs(targetProgress - currentProgress) < 0.001) {
                currentProgress = targetProgress;
            }
        }
        
        const slideHeight = getSlideHeight();
        const totalHeight = getTotalHeight();
        const maxTranslate = totalHeight - slideHeight;
        const translateY = currentProgress * maxTranslate;
        
        aboutImagesSlider.style.transform = `translateY(-${translateY}px)`;
        
        return {
            isAtStart: currentProgress <= 0.001,
            isAtEnd: currentProgress >= 0.999
        };
    }
    
    function animateSlider() {
        if (isLocked) {
            updateImageSlider(targetProgress);
            rafId = requestAnimationFrame(animateSlider);
        }
    }
    
    function lockScroll() {
        if (!isLocked) {
            isLocked = true;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            const threshold = getScrollThreshold();
            const sensitivity = getScrollSensitivity();
            scrollDelta = currentProgress * threshold / sensitivity;
            rafId = requestAnimationFrame(animateSlider);
        }
    }
    
    function unlockScroll() {
        if (isLocked) {
            isLocked = false;
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }
    }
    
    function checkIfCentered() {
        const imageSquareRect = aboutImageSquare.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const squareHeight = imageSquareRect.height;
        const squareTop = imageSquareRect.top;
        const targetTop = (windowHeight - squareHeight) / 2;
        const threshold = getCenterThreshold();
        const distanceFromCenter = Math.abs(squareTop - targetTop);
        
        // Only return true if very close to center (stricter threshold)
        return distanceFromCenter < threshold;
    }
    
    function handleWheel(e) {
        const now = Date.now();
        const imageSquareRect = aboutImageSquare.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const squareTop = imageSquareRect.top;
        const squareBottom = imageSquareRect.bottom;
        const isInViewport = squareTop < windowHeight && squareBottom > 0;
        
        // If not in viewport and locked, unlock
        if (!isInViewport) {
            if (isLocked) {
                unlockScroll();
            }
            return;
        }
        
        // Throttle wheel events slightly
        if (now - lastScrollTime < 8) {
            return;
        }
        lastScrollTime = now;
        
        const centered = checkIfCentered();
        
        // If centered but not locked, lock it (no auto-centering)
        if (centered && !isLocked) {
            lockScroll();
            const threshold = getScrollThreshold();
            const sensitivity = getScrollSensitivity();
            scrollDelta = currentProgress * threshold / sensitivity;
        }
        
        // If locked, handle image movement
        if (isLocked) {
            e.preventDefault();
            e.stopPropagation();
            
            const delta = e.deltaY || 0;
            const threshold = getScrollThreshold();
            const sensitivity = getScrollSensitivity();
            scrollDelta += delta;
            
            // Calculate target progress
            const newProgress = Math.max(0, Math.min(1, (scrollDelta * sensitivity) / threshold));
            updateImageSlider(newProgress, false);
            
            const state = {
                isAtStart: newProgress <= 0.001,
                isAtEnd: newProgress >= 0.999
            };
            
            // Check if we should unlock
            if (delta > 0 && state.isAtEnd) {
                // Scrolling down and at end
                unlockScroll();
                const extraScroll = Math.max(0, (scrollDelta * sensitivity - threshold) / sensitivity);
                if (extraScroll > 10) {
                    setTimeout(() => {
                        window.scrollBy(0, extraScroll);
                    }, 50);
                }
            } else if (delta < 0 && state.isAtStart) {
                // Scrolling up and at start
                unlockScroll();
                const extraScroll = Math.min(0, scrollDelta * sensitivity / sensitivity);
                if (extraScroll < -10) {
                    setTimeout(() => {
                        window.scrollBy(0, extraScroll);
                    }, 50);
                }
            }
        }
    }
    
    // Handle wheel events
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Handle touch events for mobile
    let touchStartY = 0;
    let touchStartScrollDelta = 0;
    let touchStartTime = 0;
    
    window.addEventListener('touchstart', (e) => {
        const imageSquareRect = aboutImageSquare.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const isInViewport = imageSquareRect.top < windowHeight && imageSquareRect.bottom > 0;
        
        if (isInViewport) {
            const centered = checkIfCentered();
            if (centered && !isLocked) {
                lockScroll();
                const threshold = getScrollThreshold();
                const sensitivity = getScrollSensitivity();
                scrollDelta = currentProgress * threshold / sensitivity;
            }
            
            if (isLocked) {
                touchStartY = e.touches[0].clientY;
                touchStartScrollDelta = scrollDelta;
                touchStartTime = Date.now();
            }
        }
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (isLocked) {
            e.preventDefault();
            const touchCurrentY = e.touches[0].clientY;
            const delta = touchStartY - touchCurrentY;
            const threshold = getScrollThreshold();
            const sensitivity = getScrollSensitivity();
            scrollDelta = touchStartScrollDelta + (delta * 2);
            
            const newProgress = Math.max(0, Math.min(1, (scrollDelta * sensitivity) / threshold));
            updateImageSlider(newProgress, false);
            
            const state = {
                isAtStart: newProgress <= 0.001,
                isAtEnd: newProgress >= 0.999
            };
            
            if (state.isAtEnd || state.isAtStart) {
                unlockScroll();
            }
            
            touchStartY = touchCurrentY;
            touchStartScrollDelta = scrollDelta;
        }
    }, { passive: false });
    
    // Initialize - show first image
    updateImageSlider(0, true);
    
    // Check on scroll to lock when naturally centered
    let scrollCheckTimeout = null;
    let lastScrollDirection = 0;
    window.addEventListener('scroll', () => {
        if (isLocked) return;
        
        // Track scroll direction
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollDeltaY = currentScrollY - (window.lastScrollY || currentScrollY);
        window.lastScrollY = currentScrollY;
        lastScrollDirection = scrollDeltaY;
        
        // Debounce scroll checks
        clearTimeout(scrollCheckTimeout);
        scrollCheckTimeout = setTimeout(() => {
            const imageSquareRect = aboutImageSquare.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const isInViewport = imageSquareRect.top < windowHeight && imageSquareRect.bottom > 0;
            
            if (isInViewport) {
                const centered = checkIfCentered();
                // Only lock if centered AND has been stable (not actively scrolling past)
                if (centered && !isLocked && Math.abs(lastScrollDirection) < 1) {
                    lockScroll();
                    const threshold = getScrollThreshold();
                    const sensitivity = getScrollSensitivity();
                    scrollDelta = currentProgress * threshold / sensitivity;
                }
            }
        }, 100); // Increased debounce for more stability
    }, { passive: true });
    
    window.addEventListener('resize', () => {
        if (isLocked) {
            updateImageSlider(targetProgress, true);
        }
    });
}

