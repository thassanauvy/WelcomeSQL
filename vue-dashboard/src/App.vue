<template>
    <div class="container mx-auto p-4">
      <header class="bg-blue-600 text-white p-4 rounded-lg shadow-md mb-6">
        <h1 class="text-2xl font-bold">User Management Dashboard</h1>
      </header>
  
      <!-- User Listing Section -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">User List</h2>
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Total Users: {{ users.length }}
          </span>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p class="font-bold">Error</p>
          <p>{{ error }}</p>
        </div>
  
        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User ID
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Balance
                </th>
                <th class="px-6 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.userID" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {{ user.userID }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {{ user.firstName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <span :class="{'text-green-600': user.totalBalance > 0, 'text-red-600': user.totalBalance < 0}">
                    ${{ user.totalBalance.toFixed(2) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <button 
                    @click="selectUser(user.userID)" 
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- User Details Section -->
      <div v-if="selectedUser" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">User Details</h2>
          <button @click="selectedUser = null" class="text-gray-500 hover:text-gray-700">
            <span class="text-2xl">&times;</span>
          </button>
        </div>
  
        <div v-if="loadingUserDetails" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
  
        <div v-else-if="userDetailsError" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p class="font-bold">Error</p>
          <p>{{ userDetailsError }}</p>
        </div>
  
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Full Name</h3>
            <p class="mt-1 text-lg">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">User ID</h3>
            <p class="mt-1 text-lg">{{ selectedUser.userID }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Phone Number</h3>
            <p class="mt-1 text-lg">{{ selectedUser.phone || 'Not Available' }}</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-sm font-medium text-gray-500">Total Balance</h3>
            <p class="mt-1 text-lg" :class="{'text-green-600': selectedUser.totalBalance > 0, 'text-red-600': selectedUser.totalBalance < 0}">
              ${{ selectedUser.totalBalance.toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
    data() {
      return {
        users: [],
        loading: true,
        error: null,
        selectedUser: null,
        loadingUserDetails: false,
        userDetailsError: null
      }
    },
    mounted() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        this.loading = true;
        this.error = null;
        
        try {
          const response = await fetch('http://127.0.0.1:5000/api/users');
          const result = await response.json();
          
          if (result.status === 'success') {
            this.users = result.data;
          } else {
            this.error = result.message || 'Failed to fetch users';
          }
        } catch (err) {
          this.error = 'Failed to connect to the server. Please try again later.';
          console.error('Error fetching users:', err);
        } finally {
          this.loading = false;
        }
      },
      async selectUser(userId) {
        this.loadingUserDetails = true;
        this.userDetailsError = null;
        
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/user/${userId}`);
          const result = await response.json();
          
          if (result.status === 'success') {
            this.selectedUser = result.data;
          } else {
            this.userDetailsError = result.message || 'Failed to fetch user details';
          }
        } catch (err) {
          this.userDetailsError = 'Failed to connect to the server. Please try again later.';
          console.error('Error fetching user details:', err);
        } finally {
          this.loadingUserDetails = false;
        }
      }
    }
  }
  </script>