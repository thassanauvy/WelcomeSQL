<template>
    <div class="container mx-auto p-6 bg-gray-50 min-h-screen">
      <header class="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6 rounded-lg shadow-lg mb-8">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold">User Management Dashboard</h1>
          <div class="hidden md:block">
            <button @click="fetchUsers" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition duration-200">
              Refresh Data
            </button>
          </div>
        </div>
      </header>
  
      <!-- User Listing Section -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">User List</h2>
          <div class="flex space-x-4 w-full md:w-auto">
            <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
              Total Users: {{ users.length }}
            </span>
            <button @click="fetchUsers" class="md:hidden bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
              Refresh
            </button>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-6 rounded-r-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-lg font-medium">Error Encountered</p>
              <p class="text-sm mt-1">{{ error }}</p>
            </div>
          </div>
        </div>
  
        <!-- Data Table -->
        <div v-else>
          <div v-if="users.length === 0" class="text-center py-12 text-gray-500">
            No users found in the system.
          </div>
          <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full bg-white">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User ID
                  </th>
                  <th class="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Balance
                  </th>
                  <th class="px-6 py-4 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in users" :key="user.userID" class="hover:bg-gray-50 transition duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">#{{ user.userID }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.firstName }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="inline-flex px-3 py-1 text-sm font-medium rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': user.totalBalance > 0,
                        'bg-red-100 text-red-800': user.totalBalance < 0,
                        'bg-gray-100 text-gray-800': user.totalBalance === 0
                      }"
                    >
                      ${{ user.totalBalance.toFixed(2) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button 
                      @click="selectUser(user.userID)" 
                      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200 flex items-center"
                    >
                      <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- User Details Section -->
      <div v-if="selectedUser" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold text-gray-800">User Profile</h2>
          <button @click="selectedUser = null" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition duration-200">
            <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div v-if="loadingUserDetails" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
  
        <div v-else-if="userDetailsError" class="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-r-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-lg font-medium">Error Encountered</p>
              <p class="text-sm mt-1">{{ userDetailsError }}</p>
            </div>
          </div>
        </div>
  
        <div v-else>
          <div class="flex items-center justify-center mb-6">
            <div class="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
              {{ selectedUser.firstName.charAt(0) }}{{ selectedUser.lastName ? selectedUser.lastName.charAt(0) : '' }}
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
              <p class="text-lg font-semibold">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-1">User ID</h3>
              <p class="text-lg font-semibold">#{{ selectedUser.userID }}</p>
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
              <p class="text-lg font-semibold">{{ selectedUser.phone || 'Not Available' }}</p>
            </div>
            <div class="bg-gray-50 p-5 rounded-lg shadow-sm">
              <h3 class="text-sm font-medium text-gray-500 mb-1">Total Balance</h3>
              <p class="text-lg font-semibold" 
                 :class="{
                   'text-green-600': selectedUser.totalBalance > 0,
                   'text-red-600': selectedUser.totalBalance < 0,
                   'text-gray-600': selectedUser.totalBalance === 0
                 }">
                ${{ selectedUser.totalBalance.toFixed(2) }}
              </p>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md mr-4 transition duration-200">
              Edit User
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200">
              View Transactions
            </button>
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