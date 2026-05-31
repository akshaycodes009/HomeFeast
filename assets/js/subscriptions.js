// Subscriptions JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = checkAuthStatus();
    if (!currentUser) return;
    
    // Initialize subscription functionality
    initializeSubscriptions();
    
    // Setup subscription forms
    setupSubscriptionForms();
    
    // Setup plan selection
    setupPlanSelection();
});

function initializeSubscriptions() {
    // Load user's subscriptions
    loadUserSubscriptions();
    
    // Setup subscription actions
    setupSubscriptionActions();
    
    // Setup menu tabs for cook profiles
    setupMenuTabs();
}

function loadUserSubscriptions() {
    const subscriptions = getUserSubscriptions();
    displaySubscriptions(subscriptions);
}

function getUserSubscriptions() {
    const currentUser = getCurrentUser();
    const allSubscriptions = getAllSubscriptions();
    
    return allSubscriptions.filter(sub => sub.userId === currentUser.id);
}

function getAllSubscriptions() {
    const subscriptions = localStorage.getItem('AkshayFeast_subscriptions');
    return subscriptions ? JSON.parse(subscriptions) : getDefaultSubscriptions();
}

function getDefaultSubscriptions() {
    return [
        {
            id: 'SUB001',
            userId: 'USR001',
            cookId: 'CK001',
            cookName: "Sharma's Kitchen",
            plan: 'Weekly Lunch',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            amount: 3360,
            status: 'active',
            mealsDelivered: 18,
            totalMeals: 30
        },
        {
            id: 'SUB002',
            userId: 'USR001',
            cookId: 'CK002',
            cookName: "Mom's Recipes",
            plan: 'Monthly Dinner',
            startDate: '2024-02-01',
            endDate: '2024-03-01',
            amount: 4500,
            status: 'pending',
            mealsDelivered: 0,
            totalMeals: 30
        }
    ];
}

function displaySubscriptions(subscriptions) {
    const activeSection = document.querySelector('.orders-section');
    const pastSection = document.querySelector('.orders-section.hidden');
    
    if (activeSection) {
        displayActiveSubscriptions(subscriptions.filter(sub => sub.status === 'active'), activeSection);
    }
    
    if (pastSection) {
        displayPastSubscriptions(subscriptions.filter(sub => sub.status !== 'active'), pastSection);
    }
}

function displayActiveSubscriptions(subscriptions, container) {
    const ordersHTML = subscriptions.map(sub => createSubscriptionCard(sub)).join('');
    
    // Update or create subscription cards
    const existingCards = container.querySelectorAll('.order-card');
    existingCards.forEach((card, index) => {
        if (subscriptions[index]) {
            card.outerHTML = createSubscriptionCard(subscriptions[index]);
        } else {
            card.remove();
        }
    });
    
    // Add new cards if needed
    if (subscriptions.length > existingCards.length) {
        const containerHTML = container.innerHTML;
        const newCardsHTML = subscriptions.slice(existingCards.length).map(sub => createSubscriptionCard(sub)).join('');
        container.innerHTML = containerHTML + newCardsHTML;
    }
}

function displayPastSubscriptions(subscriptions, container) {
    // Similar to active subscriptions but for past orders
    const ordersHTML = subscriptions.map(sub => createPastOrderCard(sub)).join('');
    
    if (container) {
        container.innerHTML = `
            <h2>Past Orders</h2>
            ${ordersHTML}
        `;
    }
}

function createSubscriptionCard(subscription) {
    const progressPercentage = Math.round((subscription.mealsDelivered / subscription.totalMeals) * 100);
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">#${subscription.id}</div>
                <div class="order-status status-${subscription.status === 'active' ? 'confirmed' : 'pending'}">${subscription.status === 'active' ? 'Active' : 'Pending'}</div>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <div class="order-detail-label">Cook</div>
                    <div class="order-detail-value">${subscription.cookName}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Plan</div>
                    <div class="order-detail-value">${subscription.plan}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Duration</div>
                    <div class="order-detail-value">${formatDate(subscription.startDate)} - ${formatDate(subscription.endDate)}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Total Paid</div>
                    <div class="order-detail-value">₹${subscription.amount.toLocaleString()}</div>
                </div>
            </div>
            ${subscription.status === 'active' ? `
                <div class="order-progress">
                    <div class="progress-info">
                        <span>${subscription.mealsDelivered} of ${subscription.totalMeals} days completed</span>
                        <span>${progressPercentage}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
            ` : ''}
            <div class="order-actions">
                ${subscription.status === 'active' ? `
                    <button class="btn btn-secondary btn-small" onclick="pauseSubscription('${subscription.id}')">Pause Subscription</button>
                    <button class="btn btn-secondary btn-small" onclick="contactCook('${subscription.cookId}')">Contact Cook</button>
                    <button class="btn btn-primary btn-small" onclick="renewSubscription('${subscription.id}')">Renew</button>
                ` : subscription.status === 'pending' ? `
                    <button class="btn btn-delete btn-small" onclick="cancelSubscription('${subscription.id}')">Cancel Request</button>
                ` : `
                    <button class="btn btn-primary btn-small" onclick="reorderSubscription('${subscription.id}')">Reorder</button>
                    <button class="btn btn-secondary btn-small" onclick="leaveReview('${subscription.id}')">Leave Review</button>
                `}
            </div>
        </div>
    `;
}

function createPastOrderCard(subscription) {
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">#${subscription.id}</div>
                <div class="order-status status-inactive">Completed</div>
            </div>
            <div class="order-details">
                <div class="order-detail">
                    <div class="order-detail-label">Cook</div>
                    <div class="order-detail-value">${subscription.cookName}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Plan</div>
                    <div class="order-detail-value">${subscription.plan}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Period</div>
                    <div class="order-detail-value">${formatDate(subscription.startDate)} - ${formatDate(subscription.endDate)}</div>
                </div>
                <div class="order-detail">
                    <div class="order-detail-label">Total Paid</div>
                    <div class="order-detail-value">₹${subscription.amount.toLocaleString()}</div>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn btn-primary btn-small" onclick="reorderSubscription('${subscription.id}')">Reorder</button>
                <button class="btn btn-secondary btn-small" onclick="leaveReview('${subscription.id}')">Leave Review</button>
            </div>
        </div>
    `;
}

function setupSubscriptionForms() {
    const subscribeButtons = document.querySelectorAll('button:contains("Subscribe"), button:contains("Subscribe Now")');
    
    subscribeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showSubscriptionModal();
        });
    });
}

function setupPlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        const chooseButton = card.querySelector('button:contains("Choose Plan")');
        if (chooseButton) {
            chooseButton.addEventListener('click', function() {
                selectPlan(card);
            });
        }
    });
}

function setupMenuTabs() {
    const tabButtons = document.querySelectorAll('.menu-tabs .tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all menu grids
            menuGrids.forEach(grid => grid.style.display = 'none');
            
            // Show corresponding menu grid
            if (menuGrids[index]) {
                menuGrids[index].style.display = 'grid';
            }
        });
    });
}

function showSubscriptionModal() {
    // Create and show subscription modal
    const modal = createSubscriptionModal();
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.display = 'block';
    }, 100);
}

function createSubscriptionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Choose Subscription Plan</h3>
                <button class="modal-close" onclick="closeSubscriptionModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="subscription-plans">
                    <div class="plan-card" data-plan="daily">
                        <h4>Daily Plan</h4>
                        <div class="plan-price">₹120/day</div>
                        <ul>
                            <li>One meal per day</li>
                            <li>Cancel anytime</li>
                        </ul>
                        <button class="btn btn-primary btn-small" onclick="selectSubscriptionPlan('daily')">Select</button>
                    </div>
                    <div class="plan-card featured" data-plan="weekly">
                        <h4>Weekly Plan</h4>
                        <div class="plan-price">₹840/week</div>
                        <div class="plan-savings">Save ₹60</div>
                        <ul>
                            <li>7 meals</li>
                            <li>Priority support</li>
                        </ul>
                        <button class="btn btn-primary btn-small" onclick="selectSubscriptionPlan('weekly')">Select</button>
                    </div>
                    <div class="plan-card" data-plan="monthly">
                        <h4>Monthly Plan</h4>
                        <div class="plan-price">₹3,600/month</div>
                        <div class="plan-savings">Save ₹300</div>
                        <ul>
                            <li>30 meals</li>
                            <li>Free delivery</li>
                        </ul>
                        <button class="btn btn-primary btn-small" onclick="selectSubscriptionPlan('monthly')">Select</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 10px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e1e5e9;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .modal-body {
                padding: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

function selectSubscriptionPlan(planType) {
    const currentUser = getCurrentUser();
    const cookId = getCurrentCookId(); // This would be determined from the current page
    
    // Create new subscription
    const subscription = {
        id: 'SUB' + Date.now(),
        userId: currentUser.id,
        cookId: cookId,
        cookName: getCurrentCookName(),
        plan: getPlanDisplayName(planType),
        startDate: getStartDate(planType),
        endDate: getEndDate(planType),
        amount: getPlanAmount(planType),
        status: 'pending',
        mealsDelivered: 0,
        totalMeals: getTotalMeals(planType)
    };
    
    // Save subscription
    const subscriptions = getAllSubscriptions();
    subscriptions.push(subscription);
    localStorage.setItem('AkshayFeast_subscriptions', JSON.stringify(subscriptions));
    
    // Close modal and show success message
    closeSubscriptionModal();
    showMessage('Subscription request sent successfully! Wait for cook approval.', 'success');
    
    // Refresh subscriptions display
    setTimeout(() => {
        loadUserSubscriptions();
    }, 1000);
}

function closeSubscriptionModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Subscription action functions
function pauseSubscription(subscriptionId) {
    if (confirm('Are you sure you want to pause this subscription?')) {
        updateSubscriptionStatus(subscriptionId, 'paused');
        showMessage('Subscription paused successfully', 'success');
    }
}

function renewSubscription(subscriptionId) {
    updateSubscriptionStatus(subscriptionId, 'active');
    showMessage('Subscription renewed successfully', 'success');
}

function cancelSubscription(subscriptionId) {
    if (confirm('Are you sure you want to cancel this subscription?')) {
        updateSubscriptionStatus(subscriptionId, 'cancelled');
        showMessage('Subscription cancelled successfully', 'success');
    }
}

function reorderSubscription(subscriptionId) {
    const subscription = getSubscriptionById(subscriptionId);
    if (subscription) {
        // Create new subscription based on old one
        const newSubscription = {
            ...subscription,
            id: 'SUB' + Date.now(),
            startDate: new Date().toISOString().split('T')[0],
            endDate: getEndDateForPlan(subscription.plan),
            status: 'pending',
            mealsDelivered: 0
        };
        
        const subscriptions = getAllSubscriptions();
        subscriptions.push(newSubscription);
        localStorage.setItem('AkshayFeast_subscriptions', JSON.stringify(subscriptions));
        
        showMessage('Reorder request sent successfully!', 'success');
    }
}

function leaveReview(subscriptionId) {
    showMessage('Review feature coming soon!', 'info');
}

function contactCook(cookId) {
    showMessage('Contact feature coming soon!', 'info');
}

// Utility functions
function updateSubscriptionStatus(subscriptionId, status) {
    const subscriptions = getAllSubscriptions();
    const subscription = subscriptions.find(sub => sub.id === subscriptionId);
    
    if (subscription) {
        subscription.status = status;
        localStorage.setItem('AkshayFeast_subscriptions', JSON.stringify(subscriptions));
        loadUserSubscriptions();
    }
}

function getSubscriptionById(subscriptionId) {
    const subscriptions = getAllSubscriptions();
    return subscriptions.find(sub => sub.id === subscriptionId);
}

function getCurrentCookId() {
    // This would be determined from the current page context
    return 'CK001'; // Default for demo
}

function getCurrentCookName() {
    // This would be determined from the current page context
    return "Sharma's Kitchen"; // Default for demo
}

function getPlanDisplayName(planType) {
    const plans = {
        daily: 'Daily Meal',
        weekly: 'Weekly Meal',
        monthly: 'Monthly Meal'
    };
    return plans[planType] || planType;
}

function getStartDate(planType) {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getEndDate(planType) {
    const startDate = new Date();
    let endDate;
    
    switch(planType) {
        case 'daily':
            endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'weekly':
            endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
            break;
        default:
            endDate = startDate;
    }
    
    return endDate.toISOString().split('T')[0];
}

function getEndDateForPlan(planName) {
    const startDate = new Date();
    let endDate;
    
    if (planName.includes('Daily')) {
        endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (planName.includes('Weekly')) {
        endDate = new Date(startDate.getTime() + 4 * 7 * 24 * 60 * 60 * 1000);
    } else if (planName.includes('Monthly')) {
        endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
    } else {
        endDate = startDate;
    }
    
    return endDate.toISOString().split('T')[0];
}

function getPlanAmount(planType) {
    const amounts = {
        daily: 120,
        weekly: 840,
        monthly: 3600
    };
    return amounts[planType] || 0;
}

function getTotalMeals(planType) {
    const meals = {
        daily: 1,
        weekly: 7,
        monthly: 30
    };
    return meals[planType] || 0;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getCurrentUser() {
    const currentUser = sessionStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '../login.html';
        return null;
    }
    return currentUser;
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

// Export functions for global use
window.pauseSubscription = pauseSubscription;
window.renewSubscription = renewSubscription;
window.cancelSubscription = cancelSubscription;
window.reorderSubscription = reorderSubscription;
window.leaveReview = leaveReview;
window.contactCook = contactCook;
window.selectSubscriptionPlan = selectSubscriptionPlan;
window.closeSubscriptionModal = closeSubscriptionModal;


