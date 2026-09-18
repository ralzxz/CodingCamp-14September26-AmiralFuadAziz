/**
 * Expense & Budget Visualizer
 * Main Application JavaScript
 * 
 * @author Amiral Fuad Aziz
 * @version 1.0.0
 */

// ===================================
// LOCAL STORAGE KEYS
// ===================================
const STORAGE_KEYS = {
    TRANSACTIONS: 'expenseTracker_transactions',
    CATEGORIES: 'expenseTracker_categories',
    SPENDING_LIMIT: 'expenseTracker_spendingLimit',
    THEME: 'expenseTracker_theme'
};

// ===================================
// UTILITY FUNCTIONS
// ===================================

/**
 * Generate unique ID for new items
 * @returns {string} Unique ID based on timestamp
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save data to Local Storage
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Saved to storage: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error saving to storage (${key}):`, error);
        return false;
    }
}

/**
 * Get data from Local Storage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Retrieved data or default value
 */
function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            console.log(`ℹ️ No data found for: ${key}, using default`);
            return defaultValue;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error(`❌ Error reading from storage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Remove item from Local Storage
 * @param {string} key - Storage key
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed from storage: ${key}`);
        return true;
    } catch (error) {
        console.error(`❌ Error removing from storage (${key}):`, error);
        return false;
    }
}

/**
 * Clear all app data from Local Storage
 */
function clearAllStorage() {
    try {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🧹 All storage cleared');
        return true;
    } catch (error) {
        console.error('❌ Error clearing storage:', error);
        return false;
    }
}

// ===================================
// CATEGORY MANAGEMENT
// ===================================

/**
 * Initialize default categories
 * @returns {Array} Default categories
 */
function getDefaultCategories() {
    return [
        { id: 'food', name: 'Food', icon: '🍔', color: '#ff9800' },
        { id: 'transport', name: 'Transport', icon: '🚗', color: '#4caf50' },
        { id: 'fun', name: 'Fun', icon: '🎮', color: '#9c27b0' }
    ];
}

/**
 * Get all categories from storage
 * @returns {Array} Array of category objects
 */
function getAllCategories() {
    let categories = getFromStorage(STORAGE_KEYS.CATEGORIES);
    
    // If no categories exist, initialize with defaults
    if (!categories || categories.length === 0) {
        categories = getDefaultCategories();
        saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
        console.log('📂 Initialized default categories');
    }
    
    return categories;
}

/**
 * Get single category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null
 */
function getCategoryById(categoryId) {
    const categories = getAllCategories();
    return categories.find(cat => cat.id === categoryId) || null;
}

/**
 * Add new category
 * @param {string} name - Category name
 * @param {string} color - Category color (hex)
 * @param {string} icon - Category icon (emoji)
 * @returns {Object|null} New category object or null if failed
 */
function addCategory(name, color, icon = '📌') {
    try {
        const categories = getAllCategories();
        
        // Check for duplicate names
        const duplicate = categories.find(
            cat => cat.name.toLowerCase() === name.toLowerCase()
        );
        
        if (duplicate) {
            console.warn('⚠️ Category with this name already exists');
            return null;
        }
        
        const newCategory = {
            id: generateId(),
            name: name.trim(),
            icon: icon,
            color: color
        };
        
        categories.push(newCategory);
        saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
        console.log('✅ Category added:', newCategory.name);
        
        return newCategory;
    } catch (error) {
        console.error('❌ Error adding category:', error);
        return null;
    }
}

/**
 * Update existing category
 * @param {string} categoryId - Category ID
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} Success status
 */
function updateCategory(categoryId, updates) {
    try {
        const categories = getAllCategories();
        const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
        
        if (categoryIndex === -1) {
            console.warn('⚠️ Category not found');
            return false;
        }
        
        // Update category
        categories[categoryIndex] = {
            ...categories[categoryIndex],
            ...updates,
            id: categoryId // Ensure ID doesn't change
        };
        
        saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
        console.log('✅ Category updated:', categoryId);
        
        return true;
    } catch (error) {
        console.error('❌ Error updating category:', error);
        return false;
    }
}

/**
 * Delete category
 * @param {string} categoryId - Category ID
 * @returns {boolean} Success status
 */
function deleteCategory(categoryId) {
    try {
        const categories = getAllCategories();
        const filteredCategories = categories.filter(cat => cat.id !== categoryId);
        
        if (filteredCategories.length === categories.length) {
            console.warn('⚠️ Category not found');
            return false;
        }
        
        // Check if category is used in transactions
        const transactions = getAllTransactions();
        const isUsed = transactions.some(trans => trans.category === categoryId);
        
        if (isUsed) {
            console.warn('⚠️ Category is used in transactions');
            // For now, we'll still allow deletion
            // In production, you might want to reassign transactions or prevent deletion
        }
        
        saveToStorage(STORAGE_KEYS.CATEGORIES, filteredCategories);
        console.log('🗑️ Category deleted:', categoryId);
        
        return true;
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        return false;
    }
}

// ===================================
// TRANSACTION MANAGEMENT
// ===================================

/**
 * Get all transactions from storage
 * @returns {Array} Array of transaction objects
 */
function getAllTransactions() {
    const transactions = getFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
    
    // Sort by date (newest first)
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get single transaction by ID
 * @param {string} transactionId - Transaction ID
 * @returns {Object|null} Transaction object or null
 */
function getTransactionById(transactionId) {
    const transactions = getAllTransactions();
    return transactions.find(trans => trans.id === transactionId) || null;
}

/**
 * Add new transaction
 * @param {string} name - Item name
 * @param {number} amount - Transaction amount
 * @param {string} categoryId - Category ID
 * @returns {Object|null} New transaction object or null if failed
 */
function addTransaction(name, amount, categoryId) {
    try {
        // Validate inputs
        if (!name || !amount || !categoryId) {
            console.warn('⚠️ Missing required fields');
            return null;
        }
        
        if (amount <= 0) {
            console.warn('⚠️ Amount must be positive');
            return null;
        }
        
        // Verify category exists
        const category = getCategoryById(categoryId);
        if (!category) {
            console.warn('⚠️ Invalid category');
            return null;
        }
        
        const transactions = getAllTransactions();
        
        const newTransaction = {
            id: generateId(),
            name: name.trim(),
            amount: parseFloat(amount),
            category: categoryId,
            date: new Date().toISOString()
        };
        
        transactions.push(newTransaction);
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
        console.log('✅ Transaction added:', newTransaction.name);
        
        return newTransaction;
    } catch (error) {
        console.error('❌ Error adding transaction:', error);
        return null;
    }
}

/**
 * Update existing transaction
 * @param {string} transactionId - Transaction ID
 * @param {Object} updates - Object with fields to update
 * @returns {boolean} Success status
 */
function updateTransaction(transactionId, updates) {
    try {
        const transactions = getAllTransactions();
        const transactionIndex = transactions.findIndex(trans => trans.id === transactionId);
        
        if (transactionIndex === -1) {
            console.warn('⚠️ Transaction not found');
            return false;
        }
        
        // Update transaction
        transactions[transactionIndex] = {
            ...transactions[transactionIndex],
            ...updates,
            id: transactionId // Ensure ID doesn't change
        };
        
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
        console.log('✅ Transaction updated:', transactionId);
        
        return true;
    } catch (error) {
        console.error('❌ Error updating transaction:', error);
        return false;
    }
}

/**
 * Delete transaction
 * @param {string} transactionId - Transaction ID
 * @returns {boolean} Success status
 */
function deleteTransaction(transactionId) {
    try {
        const transactions = getAllTransactions();
        const filteredTransactions = transactions.filter(trans => trans.id !== transactionId);
        
        if (filteredTransactions.length === transactions.length) {
            console.warn('⚠️ Transaction not found');
            return false;
        }
        
        saveToStorage(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
        console.log('🗑️ Transaction deleted:', transactionId);
        
        return true;
    } catch (error) {
        console.error('❌ Error deleting transaction:', error);
        return false;
    }
}

/**
 * Calculate total expenses
 * @returns {number} Total amount
 */
function calculateTotalExpenses() {
    const transactions = getAllTransactions();
    return transactions.reduce((total, trans) => total + trans.amount, 0);
}

/**
 * Get expenses grouped by category
 * @returns {Object} Object with category IDs as keys and totals as values
 */
function getExpensesByCategory() {
    const transactions = getAllTransactions();
    const expensesByCategory = {};
    
    transactions.forEach(trans => {
        if (expensesByCategory[trans.category]) {
            expensesByCategory[trans.category] += trans.amount;
        } else {
            expensesByCategory[trans.category] = trans.amount;
        }
    });
    
    return expensesByCategory;
}

// ===================================
// SPENDING LIMIT MANAGEMENT
// ===================================

/**
 * Get spending limit from storage
 * @returns {number} Spending limit (0 if not set)
 */
function getSpendingLimit() {
    return getFromStorage(STORAGE_KEYS.SPENDING_LIMIT, 0);
}

/**
 * Set spending limit
 * @param {number} limit - New spending limit
 * @returns {boolean} Success status
 */
function setSpendingLimit(limit) {
    try {
        const numLimit = parseFloat(limit);
        
        if (isNaN(numLimit) || numLimit < 0) {
            console.warn('⚠️ Invalid spending limit');
            return false;
        }
        
        saveToStorage(STORAGE_KEYS.SPENDING_LIMIT, numLimit);
        console.log('💰 Spending limit set:', numLimit);
        
        return true;
    } catch (error) {
        console.error('❌ Error setting spending limit:', error);
        return false;
    }
}

/**
 * Check if spending limit is exceeded
 * @returns {boolean} True if limit exceeded
 */
function isSpendingLimitExceeded() {
    const limit = getSpendingLimit();
    
    if (limit === 0) {
        return false; // No limit set
    }
    
    const total = calculateTotalExpenses();
    return total > limit;
}

// ===================================
// THEME MANAGEMENT
// ===================================

/**
 * Get current theme from storage
 * @returns {string} Theme name ('light' or 'dark')
 */
function getCurrentTheme() {
    return getFromStorage(STORAGE_KEYS.THEME, 'light');
}

/**
 * Set theme
 * @param {string} theme - Theme name ('light' or 'dark')
 * @returns {boolean} Success status
 */
function setTheme(theme) {
    try {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn('⚠️ Invalid theme');
            return false;
        }
        
        saveToStorage(STORAGE_KEYS.THEME, theme);
        console.log('🎨 Theme set:', theme);
        
        return true;
    } catch (error) {
        console.error('❌ Error setting theme:', error);
        return false;
    }
}

/**
 * Toggle theme between light and dark
 * @returns {string} New theme name
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    return newTheme;
}

// ===================================
// INITIALIZATION
// ===================================

/**
 * Initialize app data
 * Ensures all required data exists in Local Storage
 */
function initializeAppData() {
    console.log('🚀 Initializing app data...');
    
    // Initialize categories if needed
    const categories = getAllCategories();
    console.log(`📂 Loaded ${categories.length} categories`);
    
    // Initialize transactions
    const transactions = getAllTransactions();
    console.log(`📝 Loaded ${transactions.length} transactions`);
    
    // Load theme
    const theme = getCurrentTheme();
    console.log(`🎨 Current theme: ${theme}`);
    
    // Load spending limit
    const limit = getSpendingLimit();
    console.log(`💰 Spending limit: ${limit === 0 ? 'Not set' : `Rp ${limit.toLocaleString('id-ID')}`}`);
    
    console.log('✅ App data initialized successfully');
}

// ===================================
// UI MANAGEMENT
// ===================================

let expenseChart = null; // Chart.js instance

/**
 * Format number as Indonesian Rupiah
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format input field dengan pemisah ribuan (titik)
 * @param {string} value - Input value
 * @returns {string} Formatted value with thousand separators
 */
function formatNumberInput(value) {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Add thousand separators (dots)
    if (numbers === '') return '';
    
    return parseInt(numbers, 10).toLocaleString('id-ID');
}

/**
 * Parse formatted number input to plain number
 * @param {string} value - Formatted input value
 * @returns {number} Plain number
 */
function parseNumberInput(value) {
    // Remove all dots (thousand separators)
    const numbers = value.replace(/\./g, '');
    return parseInt(numbers, 10) || 0;
}

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if today
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }
    
    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }
    
    // Format as date
    return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
}

/**
 * Update total balance display
 */
function updateBalanceDisplay() {
    const total = calculateTotalExpenses();
    const balanceElement = document.getElementById('totalBalance');
    
    if (balanceElement) {
        balanceElement.textContent = formatCurrency(total);
        
        // Check spending limit
        const limit = getSpendingLimit();
        const limitAlert = document.getElementById('limitAlert');
        
        if (limit > 0 && total > limit) {
            balanceElement.classList.add('over-limit');
            if (limitAlert) {
                limitAlert.classList.remove('hidden');
            }
        } else {
            balanceElement.classList.remove('over-limit');
            if (limitAlert) {
                limitAlert.classList.add('hidden');
            }
        }
    }
}

/**
 * Render transactions list
 */
function renderTransactions() {
    const transactions = getAllTransactions();
    const listContainer = document.getElementById('transactionsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!listContainer) return;
    
    // Remove sample items
    const samples = listContainer.querySelectorAll('.sample');
    samples.forEach(sample => sample.remove());
    
    // Show empty state if no transactions
    if (transactions.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // Hide empty state
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // Clear and render transactions
    listContainer.innerHTML = '';
    
    transactions.forEach(transaction => {
        const category = getCategoryById(transaction.category);
        if (!category) return;
        
        const transactionElement = createTransactionElement(transaction, category);
        listContainer.appendChild(transactionElement);
    });
}

/**
 * Create transaction DOM element
 * @param {Object} transaction - Transaction object
 * @param {Object} category - Category object
 * @returns {HTMLElement} Transaction element
 */
function createTransactionElement(transaction, category) {
    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.dataset.id = transaction.id;
    
    div.innerHTML = `
        <div class="transaction-info">
            <div class="transaction-category-badge ${category.id}" style="background-color: ${category.color}20;">
                <span class="category-icon">${category.icon}</span>
            </div>
            <div class="transaction-details">
                <h4 class="transaction-name">${transaction.name}</h4>
                <p class="transaction-date">${formatDate(transaction.date)}</p>
            </div>
        </div>
        <div class="transaction-actions">
            <span class="transaction-amount">${formatCurrency(transaction.amount)}</span>
            <button class="btn-delete" onclick="handleDeleteTransaction('${transaction.id}')" aria-label="Delete transaction">
                <span>🗑️</span>
            </button>
        </div>
    `;
    
    return div;
}

/**
 * Handle transaction form submission
 */
function handleTransactionSubmit(event) {
    event.preventDefault();
    
    const itemName = document.getElementById('itemName').value.trim();
    const amountInput = document.getElementById('amount').value;
    const amount = parseNumberInput(amountInput); // Parse formatted input
    const category = document.getElementById('category').value;
    
    // Validate
    if (!itemName || !amount || !category) {
        alert('Please fill in all fields');
        return;
    }
    
    if (amount <= 0) {
        alert('Amount must be greater than 0');
        return;
    }
    
    // Add transaction
    const transaction = addTransaction(itemName, amount, category);
    
    if (transaction) {
        // Clear form
        document.getElementById('transactionForm').reset();
        
        // Update UI
        renderTransactions();
        updateBalanceDisplay();
        updateChart();
        
        console.log('✅ Transaction added to UI');
    } else {
        alert('Failed to add transaction');
    }
}

/**
 * Handle delete transaction
 */
function handleDeleteTransaction(transactionId) {
    if (confirm('Delete this transaction?')) {
        const success = deleteTransaction(transactionId);
        
        if (success) {
            renderTransactions();
            updateBalanceDisplay();
            updateChart();
            console.log('✅ Transaction deleted from UI');
        }
    }
}

/**
 * Update category dropdown options
 */
function updateCategoryDropdown() {
    const categories = getAllCategories();
    const select = document.getElementById('category');
    
    if (!select) return;
    
    // Keep the first option (placeholder)
    select.innerHTML = '<option value="">Select category</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = `${category.icon} ${category.name}`;
        select.appendChild(option);
    });
}

/**
 * Update Chart.js visualization
 */
function updateChart() {
    const canvas = document.getElementById('expenseChart');
    const emptyState = document.getElementById('chartEmptyState');
    
    if (!canvas) return;
    
    const transactions = getAllTransactions();
    
    // Show/hide empty state
    if (transactions.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        canvas.style.display = 'none';
        if (expenseChart) {
            expenseChart.destroy();
            expenseChart = null;
        }
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    canvas.style.display = 'block';
    
    // Get data
    const expensesByCategory = getExpensesByCategory();
    const categories = getAllCategories();
    
    // Prepare chart data
    const labels = [];
    const data = [];
    const colors = [];
    
    categories.forEach(category => {
        const amount = expensesByCategory[category.id];
        if (amount && amount > 0) {
            labels.push(category.name);
            data.push(amount);
            colors.push(category.color);
        }
    });
    
    // Create or update chart
    if (expenseChart) {
        expenseChart.data.labels = labels;
        expenseChart.data.datasets[0].data = data;
        expenseChart.data.datasets[0].backgroundColor = colors;
        expenseChart.update();
    } else {
        const ctx = canvas.getContext('2d');
        expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: getComputedStyle(document.documentElement)
                        .getPropertyValue('--bg-secondary').trim()
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim(),
                            padding: 15,
                            font: {
                                size: 12,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

/**
 * Handle spending limit input
 */
function handleSpendingLimitChange(event) {
    const limitInput = event.target.value;
    const limit = parseNumberInput(limitInput); // Parse formatted input
    
    if (isNaN(limit) || limit < 0) {
        return;
    }
    
    setSpendingLimit(limit);
    updateBalanceDisplay();
}

/**
 * Load spending limit to input
 */
function loadSpendingLimit() {
    const limit = getSpendingLimit();
    const input = document.getElementById('spendingLimit');
    
    if (input && limit > 0) {
        input.value = formatNumberInput(limit.toString());
    }
}

/**
 * Handle theme toggle
 */
function handleThemeToggle() {
    const newTheme = toggleTheme();
    applyTheme(newTheme);
}

/**
 * Apply theme to UI
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    
    // Update chart colors if exists
    if (expenseChart) {
        updateChart();
    }
}

/**
 * Toggle category management section
 */
function toggleCategoryManagement() {
    const section = document.getElementById('categoryManagement');
    if (section) {
        section.classList.toggle('hidden');
        if (!section.classList.contains('hidden')) {
            renderCategoriesList();
        }
    }
}

/**
 * Handle category form submission
 */
function handleCategorySubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const color = document.getElementById('categoryColor').value;
    
    if (!name) {
        alert('Please enter category name');
        return;
    }
    
    // Default icon for new categories
    const icon = '📌';
    
    const category = addCategory(name, color, icon);
    
    if (category) {
        // Clear form
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryColor').value = '#2196f3';
        
        // Update UI
        renderCategoriesList();
        updateCategoryDropdown();
        
        console.log('✅ Category added to UI');
    } else {
        alert('Category with this name already exists');
    }
}

/**
 * Render categories list in management section
 */
function renderCategoriesList() {
    const categories = getAllCategories();
    const container = document.getElementById('categoriesList');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.dataset.id = category.id;
        
        div.innerHTML = `
            <div class="category-item-info">
                <span class="category-color-dot" style="background-color: ${category.color};"></span>
                <span class="category-item-name">${category.icon} ${category.name}</span>
            </div>
            <div class="category-item-actions">
                <button class="btn-edit" onclick="handleEditCategory('${category.id}')" aria-label="Edit category">✏️</button>
                <button class="btn-delete-category" onclick="handleDeleteCategory('${category.id}')" aria-label="Delete category">🗑️</button>
            </div>
        `;
        
        container.appendChild(div);
    });
}

/**
 * Handle edit category
 */
function handleEditCategory(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return;
    
    const newName = prompt('Enter new category name:', category.name);
    
    if (newName && newName.trim() !== '') {
        const success = updateCategory(categoryId, { name: newName.trim() });
        
        if (success) {
            renderCategoriesList();
            updateCategoryDropdown();
            renderTransactions();
            console.log('✅ Category updated in UI');
        }
    }
}

/**
 * Handle delete category
 */
function handleDeleteCategory(categoryId) {
    const category = getCategoryById(categoryId);
    if (!category) return;
    
    // Check if used in transactions
    const transactions = getAllTransactions();
    const isUsed = transactions.some(trans => trans.category === categoryId);
    
    let confirmMessage = `Delete category "${category.name}"?`;
    if (isUsed) {
        confirmMessage += '\n\nWarning: This category is used in some transactions. Those transactions will still exist but may display incorrectly.';
    }
    
    if (confirm(confirmMessage)) {
        const success = deleteCategory(categoryId);
        
        if (success) {
            renderCategoriesList();
            updateCategoryDropdown();
            renderTransactions();
            updateChart();
            console.log('✅ Category deleted from UI');
        }
    }
}

/**
 * Initialize UI
 */
function initializeUI() {
    console.log('🎨 Initializing UI...');
    
    // Apply saved theme
    const theme = getCurrentTheme();
    applyTheme(theme);
    
    // Load spending limit
    loadSpendingLimit();
    
    // Render initial data
    updateCategoryDropdown();
    renderTransactions();
    updateBalanceDisplay();
    updateChart();
    
    // Attach event listeners
    attachEventListeners();
    
    console.log('✅ UI initialized');
}

/**
 * Handle reset all data
 */
function handleResetAllData() {
    const confirmed = confirm(
        '⚠️ PERHATIAN!\n\n' +
        'Apakah Anda yakin ingin menghapus SEMUA data?\n\n' +
        '• Semua transaksi akan terhapus\n' +
        '• Kategori custom akan terhapus\n' +
        '• Spending limit akan di-reset\n\n' +
        'Data tidak dapat dikembalikan!'
    );
    
    if (confirmed) {
        // Clear all storage
        clearAllStorage();
        
        // Reload page to reinitialize
        location.reload();
    }
}

/**
 * Format amount input field dengan pemisah ribuan
 */
function handleAmountInput(event) {
    const input = event.target;
    const cursorPosition = input.selectionStart;
    const oldValue = input.value;
    const oldLength = oldValue.length;
    
    // Format value
    const formatted = formatNumberInput(input.value);
    input.value = formatted;
    
    // Adjust cursor position after formatting
    const newLength = formatted.length;
    const lengthDiff = newLength - oldLength;
    input.selectionStart = input.selectionEnd = cursorPosition + lengthDiff;
}

/**
 * Format spending limit input dengan pemisah ribuan
 */
function handleLimitInput(event) {
    const input = event.target;
    const formatted = formatNumberInput(input.value);
    input.value = formatted;
}

/**
 * Attach all event listeners
 */
function attachEventListeners() {
    // Transaction form
    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleTransactionSubmit);
    }
    
    // Amount input - format dengan pemisah ribuan
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', handleAmountInput);
    }
    
    // Spending limit input
    const limitInput = document.getElementById('spendingLimit');
    if (limitInput) {
        limitInput.addEventListener('input', handleLimitInput);
        limitInput.addEventListener('change', handleSpendingLimitChange);
        limitInput.addEventListener('blur', handleSpendingLimitChange);
    }
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', handleThemeToggle);
    }
    
    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetAllData);
    }
    
    // Category management
    const manageCategoriesBtn = document.getElementById('manageCategoriesBtn');
    if (manageCategoriesBtn) {
        manageCategoriesBtn.addEventListener('click', toggleCategoryManagement);
    }
    
    const closeCategoryManagement = document.getElementById('closeCategoryManagement');
    if (closeCategoryManagement) {
        closeCategoryManagement.addEventListener('click', toggleCategoryManagement);
    }
    
    // Category form
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategorySubmit);
    }
    
    console.log('✅ Event listeners attached');
}

// ===================================
// DOM READY
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 DOM loaded - Initializing Expense Tracker...');
    
    // Initialize app data
    initializeAppData();
    
    // Initialize UI
    initializeUI();
    
    console.log('🎉 Expense Tracker fully initialized!');
    console.log('💡 Try adding your first transaction!');
});
