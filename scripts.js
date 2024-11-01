// Start with an empty orders array
let orders = [];

// Login credentials (in a real application, these would be stored securely on a server)
const validCredentials = {
    username: 'admin',
    password: 'password123'
};

// Dashboard sections
const sections = {
    dashboard: `
        <div class="content-header">
            <h2>Dashboard</h2>
            <button class="new-order-btn" id="new-order-btn">New Order</button>
        </div>
        <div class="quick-stats">
            <div class="stat-card">
                <h3>Total Orders</h3>
                <p class="stat-value" id="total-orders">0</p>
                <p class="stat-change positive">↑ 12% from last month</p>
            </div>
            <div class="stat-card">
                <h3>Revenue</h3>
                <p class="stat-value" id="total-revenue">$0</p>
                <p class="stat-change positive">↑ 8% from last month</p>
            </div>
            <div class="stat-card">
                <h3>Active Customers</h3>
                <p class="stat-value">891</p>
                <p class="stat-change positive">↑ 4% from last month</p>
            </div>
        </div>
        <div class="orders-table">
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="ordersTableBody"></tbody>
            </table>
        </div>
        <div class="chart-container">
            <canvas id="revenueChart"></canvas>
        </div>
    `,
    orders: `
        <div class="content-header">
            <h2>Orders</h2>
        </div>
        <p>This is the Orders section. You can add more content here.</p>
    `,
    customers: `
        <div class="content-header">
            <h2>Customers</h2>
        </div>
        <p>This is the Customers section. You can add more content here.</p>
    `,
    reports: `
        <div class="content-header">
            <h2>Reports</h2>
        </div>
        <p>This is the Reports section. You can add more content here.</p>
    `,
    settings: `
        <div class="content-header">
            <h2>Settings</h2>
        </div>
        <p>This is the Settings section. You can add more content here.</p>
    `
};

// Populate orders table
function populateOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.customer}</td>
            <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            <td>$${order.amount.toFixed(2)}</td>
            <td class="action-buttons">
                <button onclick="viewOrder('${order.id}')">View</button>
                <button onclick="editOrder('${order.id}')">Edit</button>
                <button onclick="deleteOrder('${order.id}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update dashboard stats
function updateDashboardStats() {
    const totalOrdersElement = document.getElementById('total-orders');
    const totalRevenueElement = document.getElementById('total-revenue');

    if (totalOrdersElement && totalRevenueElement) {
        totalOrdersElement.textContent = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        totalRevenueElement.textContent = `$${totalRevenue.toFixed(2)}`;
    }
}

// Toggle sidebar on mobile
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Toggle user dropdown
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// View order function
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`Order Details:\n\nID: ${order.id}\nDate: ${order.date}\nCustomer: ${order.customer}\nStatus: ${order.status}\nAmount: $${order.amount.toFixed(2)}`);
    }
}

// Edit order function
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        showModal('Edit Order', `
            <form id="edit-order-form">
                <div class="form-group">
                    <label for="edit-customer">Customer:</label>
                    <input type="text" id="edit-customer" value="${order.customer}" required>
                </div>
                <div class="form-group">
                    <label for="edit-status">Status:</label>
                    <select id="edit-status">
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-amount">Amount:</label>
                    <input type="number" id="edit-amount" value="${order.amount}" step="0.01" required>
                </div>
                <button type="submit">Save Changes</button>
            </form>
        `);

        document.getElementById('edit-order-form').addEventListener('submit', function(e) {
            e.preventDefault();
            order.customer = document.getElementById('edit-customer').value;
            order.status = document.getElementById('edit-status').value;
            order.amount = parseFloat(document.getElementById('edit-amount').value);
            populateOrdersTable();
            updateDashboardStats();
            closeModal();
        });
    }
}

// Delete order function
function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(order => order.id !== orderId);
        populateOrdersTable();
        updateDashboardStats();
    }
}

// Create revenue chart
function createRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue',
                data: [12000, 19000, 15000, 22000, 18000, 24000],
                borderColor: '#6b46c1',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Show modal
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${title}</h2>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// New order function
function newOrder() {
    showModal('New Order', `
        <form id="new-order-form">
            <div class="form-group">
                <label for="new-customer">Customer:</label>
                <input type="text" id="new-customer" required>
            </div>
            <div class="form-group">
                <label for="new-amount">Amount:</label>
                <input type="number" id="new-amount" step="0.01" required>
            </div>
            <button type="submit">Create Order</button>
        </form>
    `);

    document.getElementById('new-order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newOrder = {
            id: `ORD-2024-${orders.length + 1}`.padStart(11, '0'),
            date: new Date().toISOString().split('T')[0],
            customer: document.getElementById('new-customer').value,
            status: 'Processing',
            amount: parseFloat(document.getElementById('new-amount').value)
        };
        orders.push(newOrder);
        populateOrdersTable();
        updateDashboardStats();
        closeModal();
    });
}

// Load section content
function loadSection(sectionName) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = sections[sectionName];

    if (sectionName === 'dashboard') {
        populateOrdersTable();
        updateDashboardStats();
        createRevenueChart();
    }
}

// Initialize the dashboard
function initDashboard() {
    // Load initial section (dashboard)
    loadSection('dashboard');

    // Event listeners
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('user-menu-toggle').addEventListener('click', toggleUserDropdown);

    // Navigation event listeners
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.sidebar-nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            loadSection(this.dataset.section);
        });
    });

    // New Order button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'new-order-btn') {
            newOrder();
        }
    });

    // Search functionality
    document.getElementById('search-input').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredOrders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            order.status.toLowerCase().includes(searchTerm)
        );
        const tempOrders = [...orders];
        orders = filteredOrders;
        populateOrdersTable();
        orders = tempOrders;
    });

    // Close user dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        if (!userMenu.contains(event.target) && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        }
    });

    // User menu actions
    document.getElementById('profile-link').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Profile page - To be implemented');
    });
    document.getElementById('settings-link').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings page - To be implemented');
    });
    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Notification and message buttons
    document.getElementById('notifications-btn').addEventListener('click', () => {
        alert('Notifications - To be implemented');
    });
    document.getElementById('messages-btn').addEventListener('click', () => {
        alert('Messages - To be implemented');
    });
}

// Login function
function login(username, password) {
    if (username === validCredentials.username && password === validCredentials.password) {
        document.getElementById('login-container').style.display  = 'none';
        document.querySelector('.dashboard').style.display = 'flex';
        initDashboard();
    } else {
        alert('Invalid username or password');
    }
}

// Logout function
function logout() {
    document.getElementById('login-container').style.display = 'flex';
    document.querySelector('.dashboard').style.display = 'none';
    document.getElementById('login-form').reset();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });
});