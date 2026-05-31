// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = checkAuthStatus();
    if (!currentUser) return;
    
    // Initialize dashboard
    initializeDashboard();
    
    // Setup tab switching
    setupTabSwitching();
    
    // Setup sidebar navigation
    setupSidebar();
    
    // Setup modals
    setupModals();
});

function initializeDashboard() {
    // Update user name in dashboard
    const userNameElements = document.querySelectorAll('.dashboard-title');
    userNameElements.forEach(element => {
        if (element.textContent.includes('Welcome')) {
            const userName = getCurrentUser().name;
            element.textContent = element.textContent.replace(/Welcome back, .*!/, `Welcome back, ${userName}!`);
        }
    });
    
    // Update stats with real data
    updateDashboardStats();
    
    // Setup form submissions
    setupForms();
}

function updateDashboardStats() {
    const currentUser = getCurrentUser();
    
    if (currentUser.userType === 'user') {
        // Update user-specific stats
        updateUserStats();
    } else if (currentUser.userType === 'cook') {
        // Update cook-specific stats
        updateCookStats();
    } else if (currentUser.userType === 'admin') {
        // Update admin-specific stats
        updateAdminStats();
    }
}

function updateUserStats() {
    // Simulate user stats (in real app, fetch from API)
    const stats = {
        activeSubscriptions: 3,
        totalOrders: 24,
        monthlySpending: 2880,
        averageRating: 4.8
    };
    
    updateStatCards(stats);
}

function updateCookStats() {
    // Simulate cook stats (in real app, fetch from API)
    const stats = {
        activeCustomers: 28,
        mealsThisMonth: 156,
        monthlyEarnings: 18720,
        averageRating: 4.8
    };
    
    updateStatCards(stats);
}

function updateAdminStats() {
    // Simulate admin stats (in real app, fetch from API)
    const stats = {
        totalUsers: 1248,
        activeCooks: 156,
        activeOrders: 3456,
        revenue: 456789
    };
    
    updateStatCards(stats);
}

function updateStatCards(stats) {
    Object.keys(stats).forEach(key => {
        const statCard = document.querySelector(`.stat-card:has(.stat-label:contains("${formatStatLabel(key)}"))`);
        if (statCard) {
            const valueElement = statCard.querySelector('.stat-value');
            if (valueElement) {
                if (key.includes('earnings') || key.includes('spending') || key.includes('revenue')) {
                    valueElement.textContent = `₹${stats[key].toLocaleString()}`;
                } else {
                    valueElement.textContent = stats[key].toLocaleString();
                }
            }
        }
    });
}

function formatStatLabel(key) {
    const labels = {
        activeSubscriptions: 'Active Subscriptions',
        totalOrders: 'Total Orders',
        monthlySpending: 'Monthly Spending',
        averageRating: 'Average Rating',
        activeCustomers: 'Active Customers',
        mealsThisMonth: 'Meals This Month',
        monthlyEarnings: 'Monthly Earnings',
        totalUsers: 'Total Users',
        activeCooks: 'Active Cooks',
        activeOrders: 'Active Orders',
        revenue: 'Revenue'
    };
    return labels[key] || key;
}

function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.textContent.trim().split(' ')[0].toLowerCase();
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.querySelector(`.${targetTab}-section, .${targetTab}-orders`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        });
    });
}

function setupSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

function setupModals() {
    // Setup add item modal for cook menu
    const addBtn = document.querySelector('button[onclick="showAddItemForm()"]');
    const modal = document.getElementById('addItemModal');
    
    if (addBtn && modal) {
        window.showAddItemForm = function() {
            modal.style.display = 'block';
        };
        
        window.hideAddItemForm = function() {
            modal.style.display = 'none';
        };
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideAddItemForm();
            }
        });
    }
}

function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Handle different form types
            if (form.id === 'addItemForm') {
                handleAddMenuItem(data);
            } else if (form.id === 'menuSettingsForm') {
                handleMenuSettings(data);
            } else {
                // Generic form handling
                showMessage('Form submitted successfully!', 'success');
                form.reset();
            }
        });
    });
}

function handleAddMenuItem(data) {
    // Simulate adding menu item (in real app, this would be an API call)
    const menuItem = {
        id: 'ITEM' + Date.now(),
        name: data.itemName,
        description: data.itemDescription,
        category: data.itemCategory,
        availableDays: getSelectedDays(),
        addedDate: new Date().toISOString()
    };
    
    // Add to local storage (in real app, send to server)
    const menuItems = getMenuItemsFromStorage();
    menuItems.push(menuItem);
    localStorage.setItem('AkshayFeast_menu_items', JSON.stringify(menuItems));
    
    showMessage('Menu item added successfully!', 'success');
    hideAddItemForm();
    
    // Refresh menu display
    if (typeof refreshMenuDisplay === 'function') {
        refreshMenuDisplay();
    }
}

function handleMenuSettings(data) {
    // Simulate saving menu settings (in real app, this would be an API call)
    const currentUser = getCurrentUser();
    const settings = {
        cuisineType: data.cuisineType,
        mealType: data.mealType,
        dailyPrice: data.dailyPrice,
        weeklyPrice: data.weeklyPrice,
        updatedDate: new Date().toISOString()
    };
    
    // Save to local storage
    localStorage.setItem(`AkshayFeast_settings_${currentUser.id}`, JSON.stringify(settings));
    
    showMessage('Menu settings saved successfully!', 'success');
}

function getSelectedDays() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.parentElement.textContent.trim());
}

function getMenuItemsFromStorage() {
    const items = localStorage.getItem('AkshayFeast_menu_items');
    return items ? JSON.parse(items) : [];
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
    
    // Insert at the top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Utility functions
function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // Redirect to login if not authenticated
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard') || currentPage.includes('browse') || currentPage.includes('orders') || currentPage.includes('menu') || currentPage.includes('earnings')) {
            window.location.href = '../login.html';
        }
        return null;
    }
    return currentUser;
}

// Order management functions
function updateOrderStatus(orderId, newStatus) {
    // Simulate updating order status (in real app, this would be an API call)
    showMessage(`Order ${orderId} marked as ${newStatus}`, 'success');
    
    // Refresh order display
    setTimeout(() => {
        location.reload();
    }, 1500);
}

function acceptOrder(orderId) {
    updateOrderStatus(orderId, 'confirmed');
}

function rejectOrder(orderId) {
    if (confirm('Are you sure you want to reject this order?')) {
        updateOrderStatus(orderId, 'rejected');
    }
}

function markAsDelivered(orderId) {
    updateOrderStatus(orderId, 'delivered');
}

// Subscription management functions
function pauseSubscription(subscriptionId) {
    if (confirm('Are you sure you want to pause this subscription?')) {
        showMessage('Subscription paused successfully', 'success');
    }
}

function renewSubscription(subscriptionId) {
    showMessage('Subscription renewed successfully', 'success');
}

function cancelSubscription(subscriptionId) {
    if (confirm('Are you sure you want to cancel this subscription?')) {
        showMessage('Subscription cancelled successfully', 'success');
    }
}

// Export functions for global use
window.updateOrderStatus = updateOrderStatus;
window.acceptOrder = acceptOrder;
window.rejectOrder = rejectOrder;
window.markAsDelivered = markAsDelivered;
window.pauseSubscription = pauseSubscription;
window.renewSubscription = renewSubscription;
window.cancelSubscription = cancelSubscription;


