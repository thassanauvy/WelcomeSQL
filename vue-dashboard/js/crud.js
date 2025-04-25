const API_BASE = 'http://127.0.0.1:5000';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('addUserBtn')) {
    document.getElementById('addUserBtn').addEventListener('click', addUserFromForm);
  }
  fetchData();
});

async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();
    populateTable(users);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

function populateTable(data) {
  const headerRow = document.getElementById('tableHeader');
  const body = document.getElementById('tableBody');
  headerRow.innerHTML = '';
  body.innerHTML = '';

  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'No data available';
    td.colSpan = 100;
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  const headers = Object.keys(data[0]);
  headers.push('Actions');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.appendChild(th);
  });

  data.forEach(user => {
    const tr = document.createElement('tr');
    headers.forEach(h => {
      if (h === 'Actions') {
        const td = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => {
          const newFirst = prompt('New First Name:', user.firstName);
          const newLast = prompt('New Last Name:', user.lastName);
          const newUsername = prompt('New Username:', user.username || '');
          const newEmail = prompt('New Email:', user.email || '');
          const newPasskey = prompt('New Passkey:', '');

          if (newFirst && newLast) {
            updateUser(user.userID, {
              firstName: newFirst,
              lastName: newLast,
              username: newUsername,
              email: newEmail,
              passkey: newPasskey
            });
          }
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => {
          if (confirm(`Delete user ${user.firstName}?`)) {
            deleteUser(user.userID);
          }
        };

        const viewDetailsBtn = document.createElement('button');
        viewDetailsBtn.textContent = 'View Details';
        viewDetailsBtn.onclick = () => {
          viewUserDetails(user.userID);
        };

        td.appendChild(editBtn);
        td.appendChild(deleteBtn);
        td.appendChild(viewDetailsBtn);
        tr.appendChild(td);
      } else {
        const td = document.createElement('td');
        td.textContent = user[h] || '';
        tr.appendChild(td);
      }
    });
    body.appendChild(tr);
  });
}

async function createUser(userData) {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    alert(json.message || 'User created successfully');
    fetchData();
  } catch (err) {
    console.error('Create error:', err);
    alert('Error creating user: ' + err.message);
  }
}

async function updateUser(userID, userData) {
  try {
    const res = await fetch(`${API_BASE}/users/${userID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    alert(json.message || 'User updated successfully');
    fetchData();
  } catch (err) {
    console.error('Update error:', err);
    alert('Error updating user: ' + err.message);
  }
}

async function deleteUser(userID) {
  try {
    const res = await fetch(`${API_BASE}/users/${userID}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    alert(json.message || 'User deleted successfully');
    fetchData();
  } catch (err) {
    console.error('Delete error:', err);
    alert('Error deleting user: ' + err.message);
  }
}

function addUserFromForm() {
  const userData = {
    userID: parseInt(document.getElementById('userID').value),
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    passkey: document.getElementById('passkey').value
  };
  createUser(userData);
}

async function addUserFull() {
  // Get user ID value for consistency across all objects
  const userID = parseInt(document.getElementById('fullUserID').value);
  
  // Create data object with all three components
  const data = {
    user: {
      userID: userID,
      email: document.getElementById('fullEmail').value,
      username: document.getElementById('fullUsername').value,
      passkey: document.getElementById('fullPasskey').value,
      firstName: document.getElementById('fullFirstName').value,
      lastName: document.getElementById('fullLastName').value
    },
    contact: {
      userID: userID,
      phoneType: document.getElementById('phoneType').value,
      cellular: document.getElementById('cellular').value,
      isPrimary: document.getElementById('contactPrimary').checked ? 1 : 0
    },
    account: {
      userID: userID,
      bankID: parseInt(document.getElementById('bankID').value),
      accountType: document.getElementById('accountType').value,
      balance: parseFloat(document.getElementById('balance').value),
      holding: document.getElementById('holding').value,
      isPrimary: document.getElementById('accountPrimary').checked ? 1 : 0
    }
  };

  try {
    // Send to the add_user_full endpoint
    const response = await fetch(`${API_BASE}/add_user_full`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('User added successfully with contact and account details!');
      // Clear form fields
      document.getElementById('fullUserID').value = '';
      document.getElementById('fullEmail').value = '';
      document.getElementById('fullUsername').value = '';
      document.getElementById('fullPasskey').value = '';
      document.getElementById('fullFirstName').value = '';
      document.getElementById('fullLastName').value = '';
      document.getElementById('phoneType').value = '';
      document.getElementById('cellular').value = '';
      document.getElementById('contactPrimary').checked = false;
      document.getElementById('bankID').value = '';
      document.getElementById('accountType').value = '';
      document.getElementById('balance').value = '';
      document.getElementById('holding').value = '';
      document.getElementById('accountPrimary').checked = false;
      
      // Refresh the data table
      fetchData();
    } else {
      alert('Error: ' + (result.error || 'Failed to add user'));
    }
  } catch (err) {
    console.error('Error adding full user:', err);
    alert('Failed to add user: ' + err.message);
  }
}

async function addBank() {
  // Get the bankID value
  const bankIDInput = document.getElementById('bankID').value;
  
  // Check if the value is empty
  const bankID = bankIDInput ? parseInt(bankIDInput) : null;
  
  const bankData = {
    bankID: bankID,  // Use the parsed integer value or null
    bankName: document.getElementById('bankName').value,
    bankBranch: document.getElementById('bankBranch').value,
    bankCountry: document.getElementById('bankCountry').value
  };

  try {
    const res = await fetch(`${API_BASE}/banks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bankData)
    });
    const json = await res.json();
    
    if (res.ok) {
      alert(`Bank added successfully with ID: ${json.bankID}`);
      // Clear form fields
      document.getElementById('bankID').value = '';
      document.getElementById('bankName').value = '';
      document.getElementById('bankBranch').value = '';
      document.getElementById('bankCountry').value = '';
    } else {
      alert('Error: ' + (json.error || 'Failed to add bank'));
    }
  } catch (err) {
    console.error('Error adding bank:', err);
    alert('Failed to add bank: ' + err.message);
  }
}

async function viewUserDetails(userID) {
  try {
    // Get user's contacts
    const contactsRes = await fetch(`${API_BASE}/contacts/${userID}`);
    const contacts = await contactsRes.json();
    
    // Get user's accounts
    const accountsRes = await fetch(`${API_BASE}/accounts/${userID}`);
    const accounts = await accountsRes.json();
    
    // Build details message
    let detailsMessage = `=== User Details (ID: ${userID}) ===\n\n`;
    
    detailsMessage += "CONTACTS:\n";
    if (contacts.length > 0) {
      contacts.forEach((contact, i) => {
        detailsMessage += `${i+1}. ${contact.phoneType}: ${contact.cellular} ${contact.isPrimary ? '(Primary)' : ''}\n`;
      });
    } else {
      detailsMessage += "No contacts found.\n";
    }
    
    detailsMessage += "\nACCOUNTS:\n";
    if (accounts.length > 0) {
      accounts.forEach((account, i) => {
        detailsMessage += `${i+1}. ${account.accountType}: ${account.balance} ${account.holding} ${account.isPrimary ? '(Primary)' : ''}\n`;
      });
    } else {
      detailsMessage += "No accounts found.\n";
    }
    
    alert(detailsMessage);
  } catch (err) {
    console.error('Error retrieving user details:', err);
    alert('Failed to retrieve user details: ' + err.message);
  }
}



