/**
 * Latest Salon - Functional Logic
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Scroll Progress & Sticky Header Logic
    const header = document.querySelector('.header');
    const progressBar = document.getElementById('scroll-progress');
    
    const handleScroll = () => {
        // Sticky Header
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (window.scrollY / docHeight) * 100;
        if(progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on init

    // 3. Scroll Reveal Animations using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after reveal
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        // Automatically add slight staggering if cards are in the same grid
        if(index > 0 && el.parentElement === fadeElements[index-1].parentElement) {
            let delay = (index % 4) * 0.15;
            el.style.transitionDelay = `${delay}s`;
        }
        observer.observe(el);
    });

    // 4. Custom Liquid Cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (cursor && cursorFollower && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate cursor
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation loop
        const animateFollower = () => {
            // Easing equation for fluid feel
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateFollower);
        };
        animateFollower();

        // Hover expansions for all interactive elements
        const hoverTags = document.querySelectorAll('a, button, select, input');
        hoverTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                cursor.classList.add('hover-active');
                cursorFollower.classList.add('hover-active');
            });
            tag.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover-active');
                cursorFollower.classList.remove('hover-active');
            });
        });
    }

    // 5. Magnetic Call-to-Action Buttons
    const magnets = document.querySelectorAll('.magnetic-btn');
    magnets.forEach(magnet => {
        magnet.addEventListener('mousemove', function(e) {
            const position = magnet.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            magnet.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        magnet.addEventListener('mouseleave', function() {
            magnet.style.transform = `translate(0px, 0px)`;
        });
    });

    // 6. Mouse Glow Effect for Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 5. Smooth Scroll offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerOffset = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
    // 7. Dynamic Pricing Registry
    const bookingForm = document.getElementById('appointment-form');
    const formMessage = document.getElementById('form-message');
    const serviceSelect = document.getElementById('service');
    const priceValue = document.getElementById('price-value');

    const priceMap = {
        'Haircut': 'Starting at $45',
        'Hair Coloring': 'Starting at $120',
        'Hair Styling': 'Starting at $65',
        'Hair Spa': 'Starting at $90'
    };

    if (serviceSelect && priceValue) {
        serviceSelect.addEventListener('change', (e) => {
            const selected = e.target.value;
            priceValue.style.opacity = '0';
            setTimeout(() => {
                priceValue.innerText = priceMap[selected] || 'Select a service...';
                priceValue.style.transition = 'opacity 0.3s';
                priceValue.style.opacity = '1';
            }, 150);
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Gather data from form
            const submitBtn = bookingForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Processing...';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value
            };

            try {
                // If the user opens the file directly without localhost, point to localhost explicitly
                const apiEndpoint = window.location.protocol === 'file:' ? 'http://localhost:3000/api/book' : '/api/book';
                
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success
                    formMessage.className = 'form-message success';
                    formMessage.innerText = result.message || 'Appointment Confirmed!';
                    bookingForm.reset();
                    if(priceValue) priceValue.innerText = 'Select a service...';
                } else {
                    // Application-level error
                    formMessage.className = 'form-message error';
                    formMessage.innerText = result.message || 'Something went wrong. Please try again.';
                }
            } catch (err) {
                // Network/System error
                formMessage.className = 'form-message error';
                formMessage.innerText = 'Cannot connect to server. Please try again later.';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

});
