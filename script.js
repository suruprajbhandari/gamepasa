document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
        updateLoginDisplay(loggedInUser);
    }

    // Update cart count across all pages
    updateCartCount();

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Basic validation
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }

            try {
                // Google Sheets API endpoint
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbzFhobee33_veP2JxuSULpmZr6VLgatfnfIY4VqT2kuNtg8QOgKGYWLdVbclQYWFTbGGg/exec';
                const now = new Date();
                
                // Format date and time
                const date = now.toISOString().split('T')[0];
                const time = now.toTimeString().split(' ')[0];
                
                // Prepare data for Google Sheets
                const data = {
                    username: username,
                    date: date,
                    time: time
                };

                console.log('Sending data to Google Sheets:', data);

                // Send data to Google Sheets
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                // Since no-cors mode doesn't return readable response
                // we'll proceed with local login
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');
                
                // Redirect to home page
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error logging in:', error);
                // Proceed with local login even if Google Sheets submission fails
                localStorage.setItem('username', username);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            }
        });
    }

    function updateLoginDisplay(username) {
        // Find all login buttons across the site
        const loginButtons = document.querySelectorAll('.login-btn');
        
        loginButtons.forEach(loginBtn => {
            if (loginBtn) {
                // Create profile container
                const profileContainer = document.createElement('div');
                profileContainer.className = 'username-box';

                // Add profile picture
                const profileImg = document.createElement('img');
                profileImg.src = 'pfpp.png';
                profileImg.alt = 'Profile Picture';

                // Add username
                const usernameSpan = document.createElement('span');
                usernameSpan.textContent = username;

                // Create dropdown menu
                const dropdown = document.createElement('div');
                dropdown.className = 'dropdown';

                // Add logout option
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'dropdown-item';
                logoutLink.textContent = 'Logout';
                logoutLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleLogout();
                });

                // Assemble the profile container
                dropdown.appendChild(logoutLink);
                profileContainer.appendChild(profileImg);
                profileContainer.appendChild(usernameSpan);
                profileContainer.appendChild(dropdown);

                // Replace login button with profile container
                loginBtn.replaceWith(profileContainer);
            }
        });
    }

    function handleLogout() {
        // Clear user session
        localStorage.removeItem('username');
        localStorage.removeItem('isLoggedIn');
        
        // Reload the page to show login button
        window.location.reload();
    }

    // Function to update cart count across all pages
    function updateCartCount() {
        // Get cart items from localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Update all cart count elements
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = cartItems.length;
        });
    }

    // Listen for storage events to update cart count when it changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'cartItems') {
            updateCartCount();
        }
    });

    // Function to toggle theme
    function toggleTheme() {
        const body = document.body;
        const currentTheme = localStorage.getItem('theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        localStorage.setItem('theme', newTheme);
        body.classList.toggle('light-theme');
        
        // Update all theme toggles on the page
        const themeToggles = document.querySelectorAll('input[type="checkbox"].theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.checked = newTheme === 'dark';
        });
    }

    // Apply saved theme on page load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    // Set initial state of all theme toggles and add event listeners
    function initializeThemeToggles() {
        const themeToggles = document.querySelectorAll('input[type="checkbox"].theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.checked = savedTheme === 'dark';
            // Remove any existing event listeners
            toggle.removeEventListener('change', toggleTheme);
            // Add new event listener
            toggle.addEventListener('change', toggleTheme);
        });
    }

    // Initialize theme toggles on page load
    initializeThemeToggles();

    // Update theme toggles when DOM changes (for dynamically added toggles)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                initializeThemeToggles();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Cart functionality
    document.addEventListener('DOMContentLoaded', function() {
        // Update cart count on page load
        updateCartCount();

        // Add click event to all cart icons
        const cartIcons = document.querySelectorAll('.cart-icon');
        cartIcons.forEach(cartIcon => {
            cartIcon.addEventListener('click', function(e) {
                e.preventDefault();
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('isLoggedIn');
                if (!isLoggedIn) {
                    // Redirect to login page if not logged in
                    window.location.href = 'login.html';
                    return;
                }
                // Redirect to cart page if logged in
                window.location.href = 'cart.html';
            });
        });

        // Listen for storage events to update cart count
        window.addEventListener('storage', function(e) {
            if (e.key === 'cartItems') {
                updateCartCount();
            }
        });
    });

    // Handle settings button click for theme toggle
    const settingsButtons = document.querySelectorAll('.settings-btn');
    settingsButtons.forEach(settingsBtn => {
        // Find the dropdown that's a sibling of the settings button
        const dropdown = settingsBtn.nextElementSibling;
        
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsBtn.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
});
