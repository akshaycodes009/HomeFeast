/* ========================================
   Enhanced Login Page JavaScript
   ========================================
   This file contains all the functionality for the login page:
   - Custom login form handling with remember me validation
   - Email and password validation
   - User authentication and session management
   - Loading states and error handling
   - Dynamic user redirection based on role
   ======================================== */

// Override the default auth.js login handler to include remember me validation
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Remove existing event listener if any
        loginForm.removeEventListener('submit', handleLogin);
        
        // Add our custom handler
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rememberCheckbox = document.getElementById('remember');
            const errorMessage = document.getElementById('loginError');
            
            // Check if remember me is checked
            if (!rememberCheckbox.checked) {
                errorMessage.style.display = 'block';
                
                // Hide error after 3 seconds
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
                
                return false;
            }
            
            // Hide error if it was shown
            errorMessage.style.display = 'none';
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const userType = document.getElementById('userType').value;
            
            // Basic validation
            if (!email || !password) {
                errorMessage.textContent = 'Please fill in all fields';
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                    errorMessage.textContent = 'Please check "Remember me" to continue with login';
                }, 3000);
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                errorMessage.textContent = 'Please enter a valid email address';
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                    errorMessage.textContent = 'Please check "Remember me" to continue with login';
                }, 3000);
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            // Simulate login process with actual user validation
            setTimeout(() => {
                const users = getUsersFromStorage();
                const user = users.find(u => u.email === email && u.password === password && u.userType === userType);
                
                if (user) {
                    // Store current user in session
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Show success message
                    submitBtn.textContent = 'Login Successful!';
                    submitBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                    
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
                    }, 1000);
                } else {
                    // Show error
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    errorMessage.textContent = 'Invalid email, password, or user type';
                    errorMessage.style.display = 'block';
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                        errorMessage.textContent = 'Please check "Remember me" to continue with login';
                    }, 3000);
                }
            }, 1500);
        });
    }
});

// Helper function for email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to get users from storage (from auth.js)
function getUsersFromStorage() {
    const storedUsers = localStorage.getItem('AkshayFeast_users');
    if (storedUsers) {
        return JSON.parse(storedUsers);
    }
    
    // Use default users if no stored users
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

// Hide error when checkbox is checked
document.addEventListener('DOMContentLoaded', function() {
    const rememberCheckbox = document.getElementById('remember');
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (this.checked) {
                const errorMessage = document.getElementById('loginError');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
            }
        });
    }
});


