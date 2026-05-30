/* ========================================
   Cook Dashboard JavaScript
   ========================================
   This file contains all the functionality for the cook dashboard:
   - Order management (mark delivered, accept, reject)
   - Customer communication (call, message)
   - Subscription request handling
   - User session management and logout
   - Dynamic message notifications
   - Navbar scroll effects
   - User data loading and display
   ======================================== */

// Order Management Functions

// Cook Dashboard functionality
function markDelivered(orderId) {
    if (confirm('Mark this order as delivered?')) {
        console.log('Marking as delivered:', orderId);
        // Implement delivery logic
        showMessage('Order marked as delivered successfully!', 'success');
    }
}

function callCustomer(phoneNumber) {
    if (confirm(`Call customer at ${phoneNumber}?`)) {
        window.open(`tel:${phoneNumber}`);
    }
}

function acceptOrder(orderId) {
    if (confirm('Accept this order?')) {
        console.log('Accepting order:', orderId);
        // Implement accept logic
        showMessage('Order accepted successfully!', 'success');
    }
}

function rejectOrder(orderId) {
    if (confirm('Reject this order? This action cannot be undone.')) {
        console.log('Rejecting order:', orderId);
        // Implement reject logic
        showMessage('Order rejected', 'error');
    }
}

function acceptSubscription(subscriptionId) {
    if (confirm('Accept this subscription request?')) {
        console.log('Accepting subscription:', subscriptionId);
        // Implement accept logic
        showMessage('Subscription accepted successfully!', 'success');
    }
}

function rejectSubscription(subscriptionId) {
    if (confirm('Reject this subscription request? This action cannot be undone.')) {
        console.log('Rejecting subscription:', subscriptionId);
        // Implement reject logic
        showMessage('Subscription rejected', 'error');
    }
}

function messageCustomer(orderId) {
    console.log('Opening message for:', orderId);
    // Implement messaging logic
    showMessage('Messaging feature coming soon!', 'info');
}

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.href = '../login.html';
    }
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.notification');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `notification notification-${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of page container
    const pageContainer = document.querySelector('.page-container');
    if (pageContainer) {
        pageContainer.insertBefore(messageDiv, pageContainer.firstChild);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
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

// Load cook data on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    const nameEl = document.getElementById('cookWelcomeName');
    if (nameEl) {
        nameEl.textContent = currentUser.name || 'Cook';
    }
});


