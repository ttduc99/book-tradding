let token = localStorage.getItem('token');

// Auth
document.getElementById('signupBtn').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  token = data.token;
  localStorage.setItem('token', token);
  showApp();
};

document.getElementById('loginBtn').onclick = async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  token = data.token;
  localStorage.setItem('token', token);
  showApp();
};

// Update settings
document.getElementById('updateSettingsBtn').onclick = async () => {
  const fullName = document.getElementById('fullName').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  await fetch('/api/auth/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ fullName, city, state }),
  });
};

// Books
const fetchBooks = async () => {
  const res = await fetch('/api/books');
  const books = await res.json();
  const ul = document.getElementById('books');
  ul.innerHTML = '';
  books.forEach((b) => {
    const li = document.createElement('li');
    li.textContent = `${b.title} by ${b.author} (Owner: ${
      b.owner.fullName || b.owner.username
    })`;
    ul.appendChild(li);
  });
};

document.getElementById('addBookBtn').onclick = async () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  await fetch('/api/books', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ title, author }),
  });
  fetchBooks();
};

function showApp() {
  document.getElementById('auth').style.display = 'none';
  document.getElementById('settings').style.display = 'block';
  document.getElementById('booksSection').style.display = 'block';
  fetchBooks();
}

if (token) showApp();
