// Filters and Search JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filters
    initializeFilters();
    
    // Setup search functionality
    setupSearch();
    
    // Setup filter applications
    setupFilterActions();
});

function initializeFilters() {
    // Load saved filters from localStorage
    const savedFilters = getSavedFilters();
    if (savedFilters) {
        applyFilters(savedFilters);
    }
    
    // Setup filter change listeners
    const filterElements = document.querySelectorAll('select[id$="Filter"], input[id$="Filter"]');
    filterElements.forEach(element => {
        element.addEventListener('change', debounce(handleFilterChange, 300));
    });
}

function setupSearch() {
    const searchInputs = document.querySelectorAll('input[id$="Search"], input[placeholder*="Search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(handleSearch, 300));
        
        // Add clear button functionality
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                handleSearch.call(this);
            }
        });
    });
}

function setupFilterActions() {
    // Apply filter buttons
    const applyButtons = document.querySelectorAll('button:contains("Apply Filters")');
    applyButtons.forEach(button => {
        button.addEventListener('click', applyCurrentFilters);
    });
    
    // Reset filter buttons
    const resetButtons = document.querySelectorAll('button:contains("Reset")');
    resetButtons.forEach(button => {
        button.addEventListener('click', resetFilters);
    });
}

function handleFilterChange(e) {
    const filterType = e.target.id.replace('Filter', '').toLowerCase();
    const filterValue = e.target.value;
    
    // Update current filters
    const currentFilters = getCurrentFilters();
    currentFilters[filterType] = filterValue;
    
    // Save filters to localStorage
    saveFilters(currentFilters);
    
    // Apply filters immediately for better UX
    applyFilters(currentFilters);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const searchType = e.target.id.replace('Search', '').toLowerCase();
    
    // Perform search based on context
    if (window.location.pathname.includes('browse')) {
        searchCooks(searchTerm);
    } else if (window.location.pathname.includes('orders')) {
        searchOrders(searchTerm);
    } else if (window.location.pathname.includes('users')) {
        searchUsers(searchTerm);
    } else if (window.location.pathname.includes('cooks')) {
        searchCooks(searchTerm);
    }
}

function searchCooks(searchTerm) {
    const cookCards = document.querySelectorAll('.cook-card');
    
    cookCards.forEach(card => {
        const cookName = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const cookCuisine = card.querySelector('p')?.textContent.toLowerCase() || '';
        const cookLocation = card.querySelector('p')?.textContent.toLowerCase() || '';
        
        const isVisible = cookName.includes(searchTerm) || 
                         cookCuisine.includes(searchTerm) || 
                         cookLocation.includes(searchTerm);
        
        card.style.display = isVisible ? 'block' : 'none';
    });
    
    updateSearchResults(searchTerm, cookCards);
}

function searchOrders(searchTerm) {
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        const orderId = card.querySelector('.order-id')?.textContent.toLowerCase() || '';
        const customerName = card.querySelector('.order-detail-value')?.textContent.toLowerCase() || '';
        
        const isVisible = orderId.includes(searchTerm) || 
                         customerName.includes(searchTerm);
        
        card.style.display = isVisible ? 'block' : 'none';
    });
    
    updateSearchResults(searchTerm, orderCards);
}

function searchUsers(searchTerm) {
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(row => {
        const userId = row.cells[0]?.textContent.toLowerCase() || '';
        const userName = row.cells[1]?.textContent.toLowerCase() || '';
        const userEmail = row.cells[2]?.textContent.toLowerCase() || '';
        
        const isVisible = userId.includes(searchTerm) || 
                         userName.includes(searchTerm) || 
                         userEmail.includes(searchTerm);
        
        row.style.display = isVisible ? '' : 'none';
    });
    
    updateSearchResults(searchTerm, tableRows);
}

function applyCurrentFilters() {
    const currentFilters = getCurrentFilters();
    applyFilters(currentFilters);
    showMessage('Filters applied successfully', 'success');
}

function applyFilters(filters) {
    // Apply location filter
    if (filters.location) {
        filterByLocation(filters.location);
    }
    
    // Apply cuisine filter
    if (filters.cuisine) {
        filterByCuisine(filters.cuisine);
    }
    
    // Apply meal type filter
    if (filters.mealtype) {
        filterByMealType(filters.mealtype);
    }
    
    // Apply price range filter
    if (filters.pricerange) {
        filterByPriceRange(filters.pricerange);
    }
    
    // Apply status filter
    if (filters.status) {
        filterByStatus(filters.status);
    }
    
    // Apply date filter
    if (filters.date) {
        filterByDate(filters.date);
    }
    
    // Update results count
    updateResultsCount();
}

function filterByLocation(location) {
    const cookCards = document.querySelectorAll('.cook-card');
    
    cookCards.forEach(card => {
        const locationText = card.querySelector('p')?.textContent || '';
        const isVisible = location === '' || locationText.toLowerCase().includes(location.toLowerCase());
        card.style.display = isVisible ? 'block' : 'none';
    });
}

function filterByCuisine(cuisine) {
    const cookCards = document.querySelectorAll('.cook-card');
    
    cookCards.forEach(card => {
        const cuisineText = card.querySelector('p')?.textContent || '';
        const isVisible = cuisine === '' || cuisineText.toLowerCase().includes(cuisine.toLowerCase().replace('-', ' '));
        card.style.display = isVisible ? 'block' : 'none';
    });
}

function filterByMealType(mealType) {
    const cookCards = document.querySelectorAll('.cook-card');
    
    cookCards.forEach(card => {
        const mealTypeText = card.querySelector('p')?.textContent || '';
        const isVisible = mealType === '' || 
                         mealTypeText.toLowerCase().includes('vegetarian') && mealType === 'veg' ||
                         mealTypeText.toLowerCase().includes('non-vegetarian') && mealType === 'non-veg' ||
                         mealTypeText.toLowerCase().includes('both') && mealType === 'both';
        card.style.display = isVisible ? 'block' : 'none';
    });
}

function filterByPriceRange(priceRange) {
    const cookCards = document.querySelectorAll('.cook-card');
    
    cookCards.forEach(card => {
        const priceText = card.querySelector('.cook-price')?.textContent || '';
        const price = parseInt(priceText.replace(/[₹,]/g, ''));
        
        let isVisible = true;
        if (priceRange === '0-100') {
            isVisible = price <= 100;
        } else if (priceRange === '100-150') {
            isVisible = price > 100 && price <= 150;
        } else if (priceRange === '150-200') {
            isVisible = price > 150 && price <= 200;
        } else if (priceRange === '200+') {
            isVisible = price > 200;
        }
        
        card.style.display = isVisible ? 'block' : 'none';
    });
}

function filterByStatus(status) {
    const statusBadges = document.querySelectorAll('.status-badge');
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach((row, index) => {
        const badge = statusBadges[index];
        const isVisible = status === '' || badge?.classList.contains(`status-${status}`);
        row.style.display = isVisible ? '' : 'none';
    });
}

function filterByDate(date) {
    // This would typically involve comparing dates
    // For demo purposes, we'll just show all
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
}

function resetFilters() {
    // Clear all filter inputs
    const filterInputs = document.querySelectorAll('select[id$="Filter"], input[id$="Filter"]');
    filterInputs.forEach(input => {
        input.value = '';
    });
    
    // Clear search inputs
    const searchInputs = document.querySelectorAll('input[id$="Search"]');
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // Show all items
    const allItems = document.querySelectorAll('.cook-card, .order-card, tbody tr');
    allItems.forEach(item => {
        item.style.display = '';
    });
    
    // Clear saved filters
    localStorage.removeItem('AkshayFeast_filters');
    
    // Update results count
    updateResultsCount();
    
    showMessage('Filters reset successfully', 'success');
}

function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.cook-card:not([style*="display: none"])');
    const totalCards = document.querySelectorAll('.cook-card');
    
    const resultsHeader = document.querySelector('.results-header h2');
    if (resultsHeader) {
        resultsHeader.textContent = `${visibleCards.length} Cooks Found`;
    }
}

function updateSearchResults(searchTerm, items) {
    const visibleItems = Array.from(items).filter(item => 
        item.style.display !== 'none'
    );
    
    const resultsHeader = document.querySelector('.results-header h2');
    if (resultsHeader) {
        if (searchTerm) {
            resultsHeader.textContent = `${visibleItems.length} Results for "${searchTerm}"`;
        } else {
            resultsHeader.textContent = `${items.length} Cooks Found`;
        }
    }
}

// Utility functions
function getCurrentFilters() {
    const filters = {};
    
    // Get all filter values
    const filterElements = document.querySelectorAll('select[id$="Filter"], input[id$="Filter"]');
    filterElements.forEach(element => {
        const filterType = element.id.replace('Filter', '').toLowerCase();
        filters[filterType] = element.value;
    });
    
    return filters;
}

function getSavedFilters() {
    const saved = localStorage.getItem('AkshayFeast_filters');
    return saved ? JSON.parse(saved) : null;
}

function saveFilters(filters) {
    localStorage.setItem('AkshayFeast_filters', JSON.stringify(filters));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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
    const mainContent = document.querySelector('.main-content, .dashboard-container');
    if (mainContent) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
    }
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Sorting functionality
function setupSorting() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
}

function handleSort(e) {
    const sortBy = e.target.value;
    const cookCards = Array.from(document.querySelectorAll('.cook-card'));
    
    cookCards.sort((a, b) => {
        switch(sortBy) {
            case 'rating':
                const ratingA = parseFloat(a.querySelector('.cook-rating')?.textContent.match(/[\d.]+/)?.[0] || 0);
                const ratingB = parseFloat(b.querySelector('.cook-rating')?.textContent.match(/[\d.]+/)?.[0] || 0);
                return ratingB - ratingA;
                
            case 'price-low':
                const priceA = parseInt(a.querySelector('.cook-price')?.textContent.replace(/[₹,]/g, '') || 0);
                const priceB = parseInt(b.querySelector('.cook-price')?.textContent.replace(/[₹,]/g, '') || 0);
                return priceA - priceB;
                
            case 'price-high':
                const priceHighA = parseInt(a.querySelector('.cook-price')?.textContent.replace(/[₹,]/g, '') || 0);
                const priceHighB = parseInt(b.querySelector('.cook-price')?.textContent.replace(/[₹,]/g, '') || 0);
                return priceHighB - priceHighA;
                
            case 'distance':
                // For demo purposes, we'll sort by the first number found in location
                const distA = parseInt(a.querySelector('p')?.textContent.match(/[\d.]+/)?.[0] || 999);
                const distB = parseInt(b.querySelector('p')?.textContent.match(/[\d.]+/)?.[0] || 999);
                return distA - distB;
                
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    const container = document.querySelector('.cooks-grid');
    if (container) {
        cookCards.forEach(card => container.appendChild(card));
    }
}

// Initialize sorting when DOM is ready
document.addEventListener('DOMContentLoaded', setupSorting);


