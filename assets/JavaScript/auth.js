document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // Check if user exists
      const user = users.find(user => user.email === email && user.password === password);

      if (user) {
        alert('Login successful!');
        window.location.href = 'index.html'; // Redirect to the main page after login
      } else {
        alert('Invalid email or password');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;

      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];

      // Check if user already exists
      if (users.find(user => user.email === email)) {
        alert('User already exists. Please login.');
        return;
      }

      // Add new user to users array
      users.push({ name, email, password });

      // Save users back to localStorage
      localStorage.setItem('users', JSON.stringify(users));

      alert('Signup successful! Please login.');
      window.location.href = 'login.html'; // Redirect to login page after successful signup
    });
  }
});
