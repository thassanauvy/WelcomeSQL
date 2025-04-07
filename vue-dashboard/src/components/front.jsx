import React, { useState, useEffect } from 'react';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users');
      const result = await response.json();
      
      if (result.status === 'success') {
        setUsers(result.data);
      } else {
        setError(result.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (userId) => {
    setLoadingUserDetails(true);
    setUserDetailsError(null);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/user/${userId}`);
      const result = await response.json();
      
      if (result.status === 'success') {
        setSelectedUser(result.data);
      } else {
        setUserDetailsError(result.message || 'Failed to fetch user details');
      }
    } catch (err) {
      setUserDetailsError('Failed to connect to the server. Please try again later.');
      console.error('Error fetching user details:', err);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  // Mock data for visualization
  const mockUsers = [
    { userID: 'U12345', firstName: 'John', lastName: 'Smith', totalBalance: 2450.75, phone: '+1 (555) 123-4567' },
    { userID: 'U12346', firstName: 'Sarah', lastName: 'Johnson', totalBalance: -120.30, phone: '+1 (555) 234-5678' },
    { userID: 'U12347', firstName: 'Michael', lastName: 'Brown', totalBalance: 3580.25, phone: '+1 (555) 345-6789' }
  ];

  // Use mock data for visualization
  const displayUsers = users.length > 0 ? users : mockUsers;
  const displaySelectedUser = selectedUser || (mockUsers[0] && { ...mockUsers[0] });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6 rounded-t-lg shadow-sm mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">User Management Dashboard</h1>
              <p className="text-gray-500 mt-1">Monitor and manage your user accounts</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md font-medium">
              {displayUsers.length} Active Users
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* User Listing Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">User Directory</h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 mb-4">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {displayUsers.map((user) => (
                      <tr key={user.userID} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.userID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.firstName} {user.lastName || ''}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${user.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${Math.abs(user.totalBalance).toFixed(2)}
                            {user.totalBalance < 0 && ' CR'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => selectUser(user.userID)}
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Details Panel */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:w-1/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">User Profile</h2>
              {selectedUser && (
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              )}
            </div>

            {/* Loading State */}
            {loadingUserDetails && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {userDetailsError && (
              <div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4">
                <p className="font-medium">Error</p>
                <p>{userDetailsError}</p>
              </div>
            )}

            {/* User Details or Select User Prompt */}
            {!loadingUserDetails && !userDetailsError && (
              <>
                {displaySelectedUser ? (
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {displaySelectedUser.firstName} {displaySelectedUser.lastName}
                      </h3>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        ID: {displaySelectedUser.userID}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Contact Information</h4>
                        <p className="mt-1 text-gray-900">{displaySelectedUser.phone || 'Not Available'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Account Balance</h4>
                        <p className={`mt-1 text-lg font-semibold ${displaySelectedUser.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${Math.abs(displaySelectedUser.totalBalance).toFixed(2)}
                          {displaySelectedUser.totalBalance < 0 && ' CR'}
                        </p>
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full transition-colors"
                        >
                          Edit User Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <p>Select a user to view their profile details</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;