// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const currentUser = checkAuthStatus();
    if (!currentUser || currentUser.userType !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Initialize admin dashboard
    initializeAdminDashboard();
    
    // Setup admin actions
    setupAdminActions();
    
    // Setup data tables
    setupDataTables();
    
    // Setup approval workflows
    setupApprovalWorkflows();
});

function initializeAdminDashboard() {
    // Update admin stats
    updateAdminStats();
    
    // Load pending approvals
    loadPendingApprovals();
    
    // Load recent activities
    loadRecentActivities();
    
    // Setup quick actions
    setupQuickActions();
}

function updateAdminStats() {
    // Simulate fetching admin stats (in real app, this would be an API call)
    const stats = {
        totalUsers: 1248,
        activeCooks: 156,
        activeOrders: 3456,
        revenue: 456789
    };
    
    // Update stat cards
    Object.keys(stats).forEach(key => {
        const statCard = document.querySelector(`.admin-stat-card:has(.admin-stat-label:contains("${formatStatLabel(key)}"))`);
        if (statCard) {
            const valueElement = statCard.querySelector('.admin-stat-value');
            if (valueElement) {
                if (key.includes('revenue')) {
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
        totalUsers: 'Total Users',
        activeCooks: 'Active Cooks',
        activeOrders: 'Active Orders',
        revenue: 'Revenue'
    };
    return labels[key] || key;
}

function loadPendingApprovals() {
    const pendingCooks = getPendingCookApprovals();
    displayPendingApprovals(pendingCooks);
}

function getPendingCookApprovals() {
    const cooks = getAllCooks();
    return cooks.filter(cook => cook.status === 'pending');
}

function getAllCooks() {
    const cooks = localStorage.getItem('AkshayFeast_cooks');
    return cooks ? JSON.parse(cooks) : getDefaultCooks();
}

function getDefaultCooks() {
    return [
        {
            id: 'CK001',
            name: "Sharma's Kitchen",
            email: 'sharma.kitchen@email.com',
            phone: '9876543211',
            cuisine: 'north-indian',
            mealType: 'veg',
            serviceArea: 'Koramangala, HSR Layout',
            dailyPrice: 120,
            status: 'approved'
        },
        {
            id: 'CK002',
            name: "Mom's Recipes",
            email: 'moms.recipes@email.com',
            phone: '9876543212',
            cuisine: 'south-indian',
            mealType: 'both',
            serviceArea: 'Indiranagar, Whitefield',
            dailyPrice: 150,
            status: 'approved'
        },
        {
            id: 'CK003',
            name: "Anjali's Kitchen",
            email: 'anjali.kitchen@email.com',
            phone: '9876543210',
            cuisine: 'gujarati',
            mealType: 'veg',
            serviceArea: 'Jayanagar, JP Nagar',
            dailyPrice: 110,
            status: 'pending'
        }
    ];
}

function displayPendingApprovals(pendingCooks) {
    const approvalSection = document.querySelector('.pending-approvals');
    if (!approvalSection) return;
    
    const approvalsHTML = pendingCooks.map(cook => createApprovalCard(cook)).join('');
    
    // Update existing approval cards or add new ones
    const existingCards = approvalSection.querySelectorAll('.approval-card');
    existingCards.forEach((card, index) => {
        if (pendingCooks[index]) {
            card.outerHTML = createApprovalCard(pendingCooks[index]);
        } else {
            card.remove();
        }
    });
    
    // Add new cards if needed
    if (pendingCooks.length > existingCards.length) {
        const containerHTML = approvalSection.innerHTML;
        const newCardsHTML = pendingCooks.slice(existingCards.length).map(cook => createApprovalCard(cook)).join('');
        approvalSection.innerHTML = containerHTML + newCardsHTML;
    }
}

function createApprovalCard(cook) {
    return `
        <div class="approval-card">
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${cook.name}</h4>
                    <p>${cook.email} • ${cook.phone}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-primary btn-small" onclick="approveCook('${cook.id}')">Approve</button>
                    <button class="btn btn-delete btn-small" onclick="rejectCook('${cook.id}')">Reject</button>
                </div>
            </div>
            <div class="approval-details">
                <div class="approval-detail">
                    <div class="approval-detail-label">Cuisine</div>
                    <div class="approval-detail-value">${formatCuisine(cook.cuisine)}</div>
                </div>
                <div class="approval-detail">
                    <div class="approval-detail-label">Meal Type</div>
                    <div class="approval-detail-value">${formatMealType(cook.mealType)}</div>
                </div>
                <div class="approval-detail">
                    <div class="approval-detail-label">Service Area</div>
                    <div class="approval-detail-value">${cook.serviceArea}</div>
                </div>
                <div class="approval-detail">
                    <div class="approval-detail-label">Daily Price</div>
                    <div class="approval-detail-value">₹${cook.dailyPrice}</div>
                </div>
            </div>
        </div>
    `;
}

function loadRecentActivities() {
    const activities = getRecentActivities();
    displayRecentActivities(activities);
}

function getRecentActivities() {
    return [
        {
            icon: '👨‍🍳',
            title: 'New Cook Registration',
            description: 'Anjali\'s Kitchen registered as Gujarati cook',
            time: '2 hours ago'
        },
        {
            icon: '📦',
            title: 'Large Order Placed',
            description: 'Akshay Kumar placed monthly subscription with Sharma\'s Kitchen',
            time: '4 hours ago'
        },
        {
            icon: '⭐',
            title: 'New Review Posted',
            description: 'Priya Sharma rated Mom\'s Recipes 5 stars',
            time: '6 hours ago'
        },
        {
            icon: '💰',
            title: 'Payment Processed',
            description: 'Monthly payouts completed for 45 cooks',
            time: '8 hours ago'
        }
    ];
}

function displayRecentActivities(activities) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const activitiesHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-details">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-desc">${activity.description}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
    
    activityList.innerHTML = activitiesHTML;
}

function setupQuickActions() {
    const quickActionCards = document.querySelectorAll('.quick-action-card');
    
    quickActionCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const action = this.querySelector('.quick-action-title').textContent;
            handleQuickAction(action);
        });
    });
}

function handleQuickAction(action) {
    switch(action) {
        case 'Manage Cooks':
            window.location.href = 'cooks.html';
            break;
        case 'Manage Users':
            window.location.href = 'users.html';
            break;
        case 'Monitor Orders':
            window.location.href = 'orders.html';
            break;
        case 'Complaints':
            showMessage('Complaints section coming soon!', 'info');
            break;
        default:
            showMessage('Action not implemented yet', 'warning');
    }
}

function setupAdminActions() {
    // Setup user management actions
    setupUserManagement();
    
    // Setup cook management actions
    setupCookManagement();
    
    // Setup order monitoring actions
    setupOrderMonitoring();
    
    // Setup report generation
    setupReportGeneration();
}

function setupUserManagement() {
    const userTable = document.querySelector('tbody');
    if (userTable) {
        userTable.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-view')) {
                const userId = e.target.closest('tr').cells[0].textContent;
                viewUserDetails(userId);
            } else if (e.target.classList.contains('btn-edit')) {
                const userId = e.target.closest('tr').cells[0].textContent;
                editUser(userId);
            } else if (e.target.classList.contains('btn-delete')) {
                const userId = e.target.closest('tr').cells[0].textContent;
                suspendUser(userId);
            }
        });
    }
}

function setupCookManagement() {
    const cookTable = document.querySelector('tbody');
    if (cookTable && window.location.pathname.includes('cooks')) {
        cookTable.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-view')) {
                const cookId = e.target.closest('tr').cells[0].textContent;
                viewCookDetails(cookId);
            } else if (e.target.classList.contains('btn-edit')) {
                const cookId = e.target.closest('tr').cells[0].textContent;
                editCook(cookId);
            } else if (e.target.classList.contains('btn-delete')) {
                const cookId = e.target.closest('tr').cells[0].textContent;
                suspendCook(cookId);
            }
        });
    }
}

function setupOrderMonitoring() {
    const orderTable = document.querySelector('tbody');
    if (orderTable && window.location.pathname.includes('orders')) {
        orderTable.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-view')) {
                const orderId = e.target.closest('tr').cells[0].textContent;
                viewOrderDetails(orderId);
            } else if (e.target.classList.contains('btn-edit')) {
                const orderId = e.target.closest('tr').cells[0].textContent;
                editOrder(orderId);
            }
        });
    }
}

function setupReportGeneration() {
    const reportButtons = document.querySelectorAll('button:contains("Generate Full Report"), button:contains("Export")');
    
    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            generateReport();
        });
    });
}

function setupDataTables() {
    // Initialize data tables with sorting and pagination
    const tables = document.querySelectorAll('.data-table');
    
    tables.forEach(table => {
        makeTableSortable(table);
        makeTablePaginated(table);
    });
}

function makeTableSortable(table) {
    const headers = table.querySelectorAll('th');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(table, index);
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try to sort as numbers
        const aNum = parseFloat(aValue.replace(/[₹,]/g, ''));
        const bNum = parseFloat(bValue.replace(/[₹,]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return bNum - aNum;
        }
        
        // Sort as strings
        return aValue.localeCompare(bValue);
    });
    
    // Clear and re-append sorted rows
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

function makeTablePaginated(table) {
    // Simple pagination implementation
    const rows = table.querySelectorAll('tbody tr');
    const rowsPerPage = 10;
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        rows.forEach((row, index) => {
            row.style.display = index >= start && index < end ? '' : 'none';
        });
    }
    
    // Show first page
    showPage(1);
}

function setupApprovalWorkflows() {
    // Setup approval/rejection buttons
    const approveButtons = document.querySelectorAll('button:contains("Approve")');
    const rejectButtons = document.querySelectorAll('button:contains("Reject")');
    
    approveButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cookId = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (cookId) {
                approveCook(cookId);
            }
        });
    });
    
    rejectButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cookId = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (cookId) {
                rejectCook(cookId);
            }
        });
    });
}

// Admin action functions
function approveCook(cookId) {
    const cooks = getAllCooks();
    const cook = cooks.find(c => c.id === cookId);
    
    if (cook) {
        cook.status = 'approved';
        cook.approvalDate = new Date().toISOString();
        
        localStorage.setItem('AkshayFeast_cooks', JSON.stringify(cooks));
        
        showMessage(`Cook "${cook.name}" approved successfully!`, 'success');
        
        // Refresh the page
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

function rejectCook(cookId) {
    if (confirm('Are you sure you want to reject this cook application?')) {
        const cooks = getAllCooks();
        const cook = cooks.find(c => c.id === cookId);
        
        if (cook) {
            cook.status = 'rejected';
            cook.rejectionDate = new Date().toISOString();
            
            localStorage.setItem('AkshayFeast_cooks', JSON.stringify(cooks));
            
            showMessage(`Cook "${cook.name}" rejected successfully!`, 'success');
            
            // Refresh the page
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    }
}

function viewUserDetails(userId) {
    showMessage(`Viewing details for user ${userId}`, 'info');
}

function editUser(userId) {
    showMessage(`Editing user ${userId}`, 'info');
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend this user?')) {
        showMessage(`User ${userId} suspended successfully!`, 'success');
    }
}

function viewCookDetails(cookId) {
    showMessage(`Viewing details for cook ${cookId}`, 'info');
}

function editCook(cookId) {
    showMessage(`Editing cook ${cookId}`, 'info');
}

function suspendCook(cookId) {
    if (confirm('Are you sure you want to suspend this cook?')) {
        showMessage(`Cook ${cookId} suspended successfully!`, 'success');
    }
}

function viewOrderDetails(orderId) {
    showMessage(`Viewing details for order ${orderId}`, 'info');
}

function editOrder(orderId) {
    showMessage(`Editing order ${orderId}`, 'info');
}

function generateReport() {
    showMessage('Generating report... This may take a moment.', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showMessage('Report generated successfully! Download will start shortly.', 'success');
        
        // In a real app, this would trigger a file download
        const reportData = generateReportData();
        downloadReport(reportData);
    }, 2000);
}

function generateReportData() {
    return {
        generatedDate: new Date().toISOString(),
        totalUsers: 1248,
        totalCooks: 156,
        totalOrders: 3456,
        totalRevenue: 456789,
        // Add more report data as needed
    };
}

function downloadReport(data) {
    // Create a simple CSV report
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `AkshayFeast_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    window.URL.revokeObjectURL(url);
}

function convertToCSV(data) {
    const headers = Object.keys(data);
    const csvHeaders = headers.join(',');
    const csvValues = headers.map(header => data[header]).join(',');
    
    return `${csvHeaders}\n${csvValues}`;
}

// Utility functions
function formatCuisine(cuisine) {
    const cuisines = {
        'north-indian': 'North Indian',
        'south-indian': 'South Indian',
        'maharashtrian': 'Maharashtrian',
        'punjabi': 'Punjabi',
        'gujarati': 'Gujarati',
        'chinese': 'Chinese',
        'continental': 'Continental'
    };
    return cuisines[cuisine] || cuisine;
}

function formatMealType(mealType) {
    const types = {
        'veg': 'Vegetarian',
        'non-veg': 'Non-Vegetarian',
        'both': 'Both'
    };
    return types[mealType] || mealType;
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
window.approveCook = approveCook;
window.rejectCook = rejectCook;
window.viewUserDetails = viewUserDetails;
window.editUser = editUser;
window.suspendUser = suspendUser;
window.viewCookDetails = viewCookDetails;
window.editCook = editCook;
window.suspendCook = suspendCook;
window.viewOrderDetails = viewOrderDetails;
window.editOrder = editOrder;


