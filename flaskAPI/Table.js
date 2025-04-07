
const UserTable = {
    template: `
      <div class="user-table-container">
        <div v-if="loading" class="text-center my-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <table v-else class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone</th>
              <th>Total Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.userID">
              <td>{{ user.userID }}</td>
              <td>{{ user.firstName }}</td>
              <td>{{ user.lastName || '-' }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>${{ formatCurrency(user.totalBalance) }}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" @click="viewDetails(user.userID)">
                  View
                </button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center">No users found</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Controls -->
        <nav v-if="users.length > 0" aria-label="User table navigation">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    `,
    
    props: {
      initialUsers: {
        type: Array,
        default: () => []
      },
      pageSize: {
        type: Number,
        default: 10
      }
    },
    
    data() {
      return {
        users: [],
        loading: true,
        error: null,
        currentPage: 1,
        totalUsers: 0
      }
    },
    
    computed: {
      totalPages() {
        return Math.ceil(this.totalUsers / this.pageSize);
      }
    },
    
    methods: {
      async fetchUsers() {
        this.loading = true;
        try {
          const response = await fetch('/api/users');
          const data = await response.json();
          
          if (data.status === 'success') {
            this.users = data.data;
            this.totalUsers = data.count;
          } else {
            this.error = data.message || 'Failed to load users';
            console.error('Error fetching users:', this.error);
          }
        } catch (err) {
          this.error = err.message || 'An error occurred while fetching users';
          console.error('API request failed:', err);
        } finally {
          this.loading = false;
        }
      },
      
      viewDetails(userId) {
        this.$emit('user-selected', userId);
      },
      
      formatCurrency(value) {
        return parseFloat(value).toFixed(2);
      },
      
      changePage(page) {
        if (page < 1 || page > this.totalPages) return;
        this.currentPage = page;
      }
    },
    
    mounted() {
      if (this.initialUsers && this.initialUsers.length > 0) {
        this.users = this.initialUsers;
        this.loading = false;
      } else {
        this.fetchUsers();
      }
    }
  };
  
  // For a standalone JavaScript approach (without Vue):
  function createDataTable() {
    const tableContainer = document.getElementById('user-table-container');
    
    if (!tableContainer) {
      console.error('Table container element not found');
      return;
    }
    
    // Show loading indicator
    tableContainer.innerHTML = `
      <div class="text-center my-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    
    // Fetch data from backend
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          renderTable(data.data, tableContainer);
        } else {
          tableContainer.innerHTML = `<div class="alert alert-danger">${data.message || 'Failed to load users'}</div>`;
        }
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        tableContainer.innerHTML = `<div class="alert alert-danger">An error occurred while fetching data</div>`;
      });
  }
  
  function renderTable(users, container) {
    if (!users || users.length === 0) {
      container.innerHTML = '<div class="alert alert-info">No users found</div>';
      return;
    }
    
    // Create table HTML
    const tableHTML = `
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>User ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Total Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.userID}</td>
              <td>${user.firstName}</td>
              <td>${user.lastName || '-'}</td>
              <td>${user.phone || '-'}</td>
              <td>$${parseFloat(user.totalBalance).toFixed(2)}</td>
              <td>
                <button class="btn btn-sm btn-primary me-2" onclick="viewUserDetails(${user.userID})">
                  View
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    
    container.innerHTML = tableHTML;
  }
  
  function viewUserDetails(userId) {
    console.log(`Viewing details for user ID: ${userId}`);
    
    // Show loading indicator in a details container
    const detailsContainer = document.getElementById('user-details-container');
    if (detailsContainer) {
      detailsContainer.innerHTML = `
        <div class="text-center my-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;
      
      // Fetch specific user details
      fetch(`/api/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            const user = data.data;
            detailsContainer.innerHTML = `
              <div class="card">
                <div class="card-header">
                  <h5>User Details</h5>
                </div>
                <div class="card-body">
                  <h3>${user.firstName} ${user.lastName || ''}</h3>
                  <p><strong>User ID:</strong> ${user.userID}</p>
                  <p><strong>Phone:</strong> ${user.phone || 'Not available'}</p>
                  <p><strong>Total Balance:</strong> $${parseFloat(user.totalBalance).toFixed(2)}</p>
                </div>
              </div>
            `;
          } else {
            detailsContainer.innerHTML = `<div class="alert alert-danger">${data.message || 'Failed to load user details'}</div>`;
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          detailsContainer.innerHTML = `<div class="alert alert-danger">An error occurred while fetching user details</div>`;
        });
    }
  }
  