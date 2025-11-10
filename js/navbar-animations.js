// Enhanced animation helper functions
const animations = {
    fadeIn: (element, duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => {
        if (!element) return;
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
        element.style.transform = 'translateY(-10px)';
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    },

    fadeOut: (element, duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => {
        if (!element) return;
        element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    },

    slideDown: (element, duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => {
        if (!element) return;
        element.style.height = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        element.style.opacity = '0';
        element.style.transition = `height ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
        const height = element.scrollHeight;
        requestAnimationFrame(() => {
            element.style.height = height + 'px';
            element.style.opacity = '1';
        });
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
                resolve();
            }, duration);
        });
    },

    slideUp: (element, duration = 300, easing = 'cubic-bezier(0.4, 0, 0.2, 1)') => {
        if (!element) return;
        element.style.height = element.scrollHeight + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `height ${duration}ms ${easing}, opacity ${duration}ms ${easing}`;
        requestAnimationFrame(() => {
            element.style.height = '0';
            element.style.opacity = '0';
        });
        return new Promise(resolve => {
            setTimeout(() => {
                element.style.display = 'none';
                resolve();
            }, duration);
        });
    },

    pulse: (element, duration = 300) => {
        if (!element) return;
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `pulse ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    },

    shake: (element, duration = 300) => {
        if (!element) return;
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        element.style.animation = `shake ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    }
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }

    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);

// Enhanced Navbar animation handlers
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const dropdowns = document.querySelectorAll('.dropdownClick');
    const cartSlide = document.querySelector('.cart_slide');
    const wishlistSlide = document.querySelector('.wishlist_slide');
    
    // Enhanced smooth scroll handler with throttling
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll > 30) {
                    if (!nav.classList.contains('sticky')) {
                        nav.classList.add('sticky');
                        nav.style.animation = 'fadeInDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    }
                    
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        nav.style.transform = 'translateY(-100%)';
                    } else {
                        nav.style.transform = 'translateY(0)';
                    }
                } else {
                    nav.classList.remove('sticky');
                    nav.style.animation = 'none';
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Enhanced dropdown animations
    dropdowns.forEach(dropdown => {
        const dropdownBox = dropdown.querySelector('.dropdownBox');
        const items = dropdownBox?.querySelectorAll('li');
        
        dropdown.addEventListener('mouseenter', () => {
            if (!dropdownBox) return;
            animations.fadeIn(dropdownBox, 300);
            items?.forEach((item, index) => {
                item.style.animation = `fadeInDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards ${index * 0.1}s`;
            });
        });

        dropdown.addEventListener('mouseleave', () => {
            if (!dropdownBox) return;
            animations.fadeOut(dropdownBox, 300);
            items?.forEach(item => {
                item.style.animation = 'none';
            });
        });
    });

    // Enhanced cart/wishlist animations
    const setupSlideAnimation = (button, slide, otherSlide, otherButton) => {
        if (!button || !slide) return;

        button.addEventListener('click', async (e) => {
            e.stopPropagation();
            
            if (otherSlide?.classList.contains('active')) {
                otherSlide.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                otherButton?.classList.remove('active');
                await new Promise(r => setTimeout(r, 300));
                otherSlide.classList.remove('active');
            }

            if (slide.classList.contains('active')) {
                slide.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                button.classList.remove('active');
                await new Promise(r => setTimeout(r, 300));
                slide.classList.remove('active');
            } else {
                slide.classList.add('active');
                button.classList.add('active');
                slide.style.animation = 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    };

    setupSlideAnimation(
        document.querySelector('.cart_Bx'),
        cartSlide,
        wishlistSlide,
        document.querySelector('.wishlist_Bx')
    );

    setupSlideAnimation(
        document.querySelector('.wishlist_Bx'),
        wishlistSlide,
        cartSlide,
        document.querySelector('.cart_Bx')
    );

    // Enhanced mobile menu animations
    const burgerBtn = document.querySelector('.burgerBar');
    const navBx = document.querySelector('.navBx');
    const navLinks = document.querySelectorAll('.navlink');

    if (burgerBtn && navBx) {
        burgerBtn.addEventListener('click', async () => {
            burgerBtn.style.transform = 'rotate(180deg)';
            
            if (navBx.classList.contains('active')) {
                await animations.slideUp(navBx);
                navBx.classList.remove('active');
                burgerBtn.style.transform = 'rotate(0)';
            } else {
                navBx.classList.add('active');
                await animations.slideDown(navBx);
                navLinks.forEach((link, index) => {
                    link.style.animation = `fadeInDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards ${index * 0.1}s`;
                });
            }
        });
    }

    // Close slides when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cart_slide') && 
            !e.target.closest('.cart_Bx') && 
            !e.target.closest('.wishlist_slide') && 
            !e.target.closest('.wishlist_Bx')) {
            
            if (cartSlide?.classList.contains('active')) {
                cartSlide.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                document.querySelector('.cart_Bx')?.classList.remove('active');
                setTimeout(() => cartSlide.classList.remove('active'), 300);
            }
            
            if (wishlistSlide?.classList.contains('active')) {
                wishlistSlide.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                document.querySelector('.wishlist_Bx')?.classList.remove('active');
                setTimeout(() => wishlistSlide.classList.remove('active'), 300);
            }
        }
    });
});

// Export animations and utility functions
window.navAnimations = {
    ...animations,
    updateCartBadge: async (count) => {
        const badge = document.querySelector('.cartNum');
        if (badge) {
            badge.textContent = count;
            animations.pulse(badge);
        }
    },
    updateWishlistBadge: async (count) => {
        const badge = document.querySelector('.wishlistNum');
        if (badge) {
            badge.textContent = count;
            animations.pulse(badge);
        }
    }
};