/* ========================================
   User Orders Page JavaScript
   ========================================
   This file contains all the functionality for the user orders page:
   - User session management and authentication
   - Logout functionality with confirmation
   - Navbar scroll effects
   - User data loading and validation
   - Order history management
   ======================================== */

// User Authentication and Session Management

// Logout function
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session storage
        sessionStorage.clear();
        localStorage.clear();
        
        // Redirect to login page
        window.location.href = '../login.html';
    }
}

// Add navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Load user data on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = '../login.html';
        return;
    }

    // You can add more user-specific functionality here
    console.log('Current user:', currentUser.name);
});


