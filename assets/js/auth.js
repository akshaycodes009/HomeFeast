// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
        
        // Show/hide fields based on user type
        const userType = document.getElementById('userType');
        if (userType) {
            userType.addEventListener('change', toggleRegistrationFields);
        }
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate login (in real app, this would be an API call)
    const users = getUsersFromStorage();
    const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
    
    if (user) {
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect based on user type
        setTimeout(() => {
            switch(userType) {
                case 'user':
                    window.location.href = 'user/dashboard.html';
                    break;
                case 'cook':
                    window.location.href = 'cook/dashboard.html';
                    break;
                case 'admin':
                    window.location.href = 'admin/dashboard.html';
                    break;
                default:
                    window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        showMessage('Invalid email, password, or user type', 'error');
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData);
    
    // Basic validation
    if (!userData.name || !userData.email || !userData.phone || !userData.password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    if (!isValidEmail(userData.email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Phone validation
    if (!isValidPhone(userData.phone)) {
        showMessage('Please enter a valid phone number', 'error');
        return;
    }
    
    // Password confirmation
    if (userData.password !== userData.confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Check if user already exists
    const users = getUsersFromStorage();
    if (users.find(u => u.email === userData.email)) {
        showMessage('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        userType: userData.userType,
        registrationDate: new Date().toISOString(),
        status: userData.userType === 'cook' ? 'pending' : 'active'
    };
    
    // Add cook-specific fields if applicable
    if (userData.userType === 'cook') {
        newUser.address = userData.address;
        newUser.cuisine = userData.cuisine;
        newUser.mealType = userData.mealType;
    }
    
    // Add user-specific fields if applicable
    if (userData.userType === 'user') {
        newUser.deliveryAddress = userData.deliveryAddress;
    }
    
    // Save user to storage
    users.push(newUser);
    localStorage.setItem('AkshayFeast_users', JSON.stringify(users));
    
    showMessage('Registration successful! Please login.', 'success');
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function toggleRegistrationFields() {
    const userType = document.getElementById('userType').value;
    const cookFields = document.getElementById('cookFields');
    const userFields = document.getElementById('userFields');
    
    // Hide all fields first
    if (cookFields) cookFields.style.display = 'none';
    if (userFields) userFields.style.display = 'none';
    
    // Show relevant fields
    if (userType === 'cook' && cookFields) {
        cookFields.style.display = 'block';
    } else if (userType === 'user' && userFields) {
        userFields.style.display = 'block';
    }
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function getUsersFromStorage() {
    const users = localStorage.getItem('AkshayFeast_users');
    return users ? JSON.parse(users) : getDefaultUsers();
}

function getDefaultUsers() {
    return [
        {
            id: 'USR001',
            name: 'Akshay Kumar',
            email: 'rahul@example.com',
            phone: '9876543210',
            password: 'password123',
            userType: 'user',
            registrationDate: '2024-01-15T10:00:00Z',
            status: 'active',
            deliveryAddress: 'Koramangala, Bangalore'
        },
        {
            id: 'CK001',
            name: 'Mrs. Sharma',
            email: 'sharma@example.com',
            phone: '9876543211',
            password: 'password123',
            userType: 'cook',
            registrationDate: '2024-01-10T10:00:00Z',
            status: 'approved',
            address: 'Koramangala, Bangalore',
            cuisine: 'north-indian',
            mealType: 'veg'
        },
        {
            id: 'ADM001',
            name: 'Admin',
            email: 'admin@AkshayFeast.com',
            phone: '9876543212',
            password: 'admin123',
            userType: 'admin',
            registrationDate: '2024-01-01T10:00:00Z',
            status: 'active'
        }
    ];
}

function generateUserId() {
    return 'USR' + Date.now().toString(36).toUpperCase();
}

function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `auth-message notification notification-${type}`;
    messageDiv.textContent = message;
    
    // Insert after the form
    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
    }
    
    // Remove message after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Check if user is logged in
function checkAuthStatus() {
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        // Redirect to login if not authenticated
        const currentPage = window.location.pathname;
        if (currentPage.includes('dashboard') || currentPage.includes('browse') || currentPage.includes('orders')) {
            window.location.href = '../login.html';
        }
        return null;
    }
    return JSON.parse(currentUser);
}

// Logout function
function logout() {
    sessionStorage.removeItem('currentUser');
    showMessage('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Add logout button functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('a[href="#"]');
    if (logoutBtn && logoutBtn.textContent.includes('Logout')) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});


