/**
 * GlobeTrotter — Authentication Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // Elements
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const tabIndicator = document.getElementById('tabIndicator');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const toastContainer = document.getElementById('toastContainer');

    // Tab Switching Logic
    function switchTab(tab) {
        if (tab === 'login') {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            tabIndicator.style.transform = 'translateX(0)';
            
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            // Move indicator to the right side
            tabIndicator.style.transform = 'translateX(100%)';
            
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
    }

    tabLogin.addEventListener('click', () => switchTab('login'));
    tabSignup.addEventListener('click', () => switchTab('signup'));

    // Password Visibility Toggle
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.currentTarget.previousElementSibling;
            const icon = e.currentTarget.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            if (window.lucide) lucide.createIcons();
        });
    });

    // Toast Notification System (reused from app.js)
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="toast-icon" style="width:18px; height:18px;"></i>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Dummy Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        showToast('Logging in...');
        
        // Simulate API call and redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    });

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        showToast(`Account created for ${name}! Redirecting...`);
        
        // Simulate API call and redirect
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);
    });

    // Social Login Buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const provider = e.currentTarget.textContent.trim();
            showToast(`Connecting to ${provider}...`);
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        });
    });
});
