
base_dir = "/mnt/kimi/output/luxury-landing"

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Cursor.init();
    Navigation.init();
    Theme.init();
    Animations.init();
    Tabs.init();
    Portfolio.init();
    Pricing.init();
    Form.init();
    Scroll.init();
});

/**
 * Preloader Module
 */
const Preloader = {
    init() {
        const preloader = document.querySelector('.preloader');
        const body = document.body;
        
        body.classList.add('preload');
        
        // Simulate loading progress
        setTimeout(() => {
            preloader.classList.add('hidden');
            body.classList.remove('preload');
            
            // Trigger initial animations
            Animations.initAOS();
        }, 2500);
    }
};

/**
 * Custom Cursor Module
 */
const Cursor = {
    cursor: null,
    follower: null,
    
    init() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        
        if (!this.cursor || !this.follower) return;
        
        // Check if device has fine pointer (not touch)
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        document.addEventListener('mousemove', (e) => {
            this.moveCursor(e);
        });
        
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .portfolio-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.hover());
            el.addEventListener('mouseleave', () => this.unhover());
        });
    },
    
    moveCursor(e) {
        const { clientX, clientY } = e;
        
        this.cursor.style.left = clientX + 'px';
        this.cursor.style.top = clientY + 'px';
        
        // Follower with slight delay
        setTimeout(() => {
            this.follower.style.left = clientX + 'px';
            this.follower.style.top = clientY + 'px';
        }, 50);
    },
    
    hover() {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.follower.style.background = 'rgba(99, 102, 241, 0.2)';
    },
    
    unhover() {
        this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        this.follower.style.transform = 'translate(-50%, -50%) scale(1)';
        this.follower.style.background = 'rgba(99, 102, 241, 0.1)';
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.navLinks = document.getElementById('navLinks');
        this.navLinksItems = document.querySelectorAll('.nav-link');
        
        this.handleScroll();
        this.handleMobileMenu();
        this.handleActiveLink();
        this.handleSmoothScroll();
    },
    
    handleScroll() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    },
    
    handleMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.mobileToggle.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                this.mobileToggle.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    },
    
    handleActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    },
    
    handleSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

/**
 * Theme Toggle Module
 */
const Theme = {
    init() {
        this.toggle = document.getElementById('themeToggle');
        this.html = document.documentElement;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.html.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.html.setAttribute('data-theme', 'dark');
        }
        
        this.toggle.addEventListener('click', () => this.toggleTheme());
    },
    
    toggleTheme() {
        const currentTheme = this.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        this.html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
};

/**
 * Animations Module
 */
const Animations = {
    init() {
        this.initCounters();
        this.initFeatureHover();
    },
    
    initAOS() {
        // Simple AOS implementation
        const aosElements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        aosElements.forEach(el => observer.observe(el));
    },
    
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    },
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    },
    
    initFeatureHover() {
        const cards = document.querySelectorAll('.feature-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });
    }
};

/**
 * Tabs Module
 */
const Tabs = {
    init() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Remove active class from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active to clicked
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
};

/**
 * Portfolio Filter Module
 */
const Portfolio = {
    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter items
                portfolioItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }
};

/**
 * Pricing Module
 */
const Pricing = {
    init() {
        const toggle = document.getElementById('billingToggle');
        const monthlyPrices = document.querySelectorAll('.amount.monthly');
        const yearlyPrices = document.querySelectorAll('.amount.yearly');
        const labels = document.querySelectorAll('.toggle-label');
        
        if (!toggle) return;
        
        toggle.addEventListener('change', () => {
            const isYearly = toggle.checked;
            
            labels.forEach(label => label.classList.toggle('active'));
            
            monthlyPrices.forEach(price => {
                price.style.display = isYearly ? 'none' : 'inline';
            });
            
            yearlyPrices.forEach(price => {
                price.style.display = isYearly ? 'inline' : 'none';
            });
        });
    }
};

/**
 * Form Module
 */
const Form = {
    init() {
        const form = document.getElementById('contactForm');
        const toast = document.getElementById('toast');
        
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success toast
            toast.classList.add('show');
            
            // Reset form
            form.reset();
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }
};

/**
 * Scroll Module
 */
const Scroll = {
    init() {
        this.backToTop = document.getElementById('backToTop');
        
        this.handleBackToTop();
        this.handleParallax();
    },
    
    handleBackToTop() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.backToTop.classList.add('visible');
            } else {
                this.backToTop.classList.remove('visible');
            }
        });
        
        this.backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    handleParallax() {
        const orbs = document.querySelectorAll('.gradient-orb');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            orbs.forEach((orb, index) => {
                const speed = 0.5 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
};
