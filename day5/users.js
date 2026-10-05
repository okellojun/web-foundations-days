let storedUsers = [];

const loadUsersBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusP = document.getElementById('status');
const usersListUl = document.getElementById('users-list');


function renderUsers(list) {
  // Clear existing items safely
  usersListUl.innerHTML = '';

  if (list.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No users match your filter.';
    usersListUl.appendChild(emptyItem);
    return;
  }

  list.forEach(user => {
    const li = document.createElement('li');
    
    const nameElem = document.createElement('strong');
    nameElem.textContent = user.name;
    
    const detailsElem = document.createElement('span');
    const email = user.email || 'N/A';
    const city = user.address?.city || 'N/A';
    const companyName = user.company?.name || 'N/A';
    
    detailsElem.textContent = ` — Email: ${email} | City: ${city} | Company: ${companyName}`;

    li.appendChild(nameElem);
    li.appendChild(detailsElem);
    usersListUl.appendChild(li);
  });
}

/**
 * Fetches user data asynchronously from JSONPlaceholder API.
 */
async function loadUsers() {
  loadUsersBtn.disabled = true;
  statusP.textContent = 'Loading users...';
  usersListUl.innerHTML = '';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    storedUsers = data;
    
    statusP.textContent = 'Users loaded successfully!';
    renderUsers(storedUsers);
  } catch (error) {
    statusP.textContent = `Error loading users: ${error.message}`;
    storedUsers = [];
    renderUsers([]);
  } finally {
    loadUsersBtn.disabled = false;
  }
}

// Event Listeners
loadUsersBtn.addEventListener('click', loadUsers);

filterInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase().trim();
  const filteredList = storedUsers.filter(user => 
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filteredList);
});