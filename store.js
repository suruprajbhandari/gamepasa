// Get cart elements
const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
const buyNowButtons = document.querySelectorAll('.buy-btn');

// Load cart items from localStorage or create empty array
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Update cart count when page loads
updateCartCount();

// Add click event to all "Add to Cart" buttons
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get game details from the card
        const gameCard = this.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        const gamePrice = gameCard.querySelector('p').textContent.split(' | ')[0].replace('Rs ', '').replace(',', '');
        const gameImage = gameCard.querySelector('img').src;
        
        // Create new cart item
        const newItem = {
            name: gameName,
            price: parseFloat(gamePrice),
            image: gameImage
        };

        // Check if item already exists in cart
        const existingItem = cartItems.find(item => item.name === gameName);
        if (!existingItem) {
            // Add to cart
            cartItems.push(newItem);
            
            // Save to localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count
            updateCartCount();
            
            // Show success message
            showNotification(gameName + ' added to cart!');
        } else {
            showNotification(gameName + ' is already in your cart!');
        }
    });
});

// Add click event to all "Buy Now" buttons
buyNowButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get game details from the card
        const gameCard = this.closest('.game-card');
        const gameName = gameCard.querySelector('h3').textContent;
        const gamePrice = gameCard.querySelector('p').textContent.split(' | ')[0].replace('Rs ', '').replace(',', '');
        const gameImage = gameCard.querySelector('img').src;
        
        // Create new cart item
        const newItem = {
            name: gameName,
            price: parseFloat(gamePrice),
            image: gameImage
        };

        // Clear cart and add only this item
        cartItems = [newItem];
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update cart count
        updateCartCount();
        
        // Redirect to cart page
        window.location.href = 'cart.html';
    });
});

// Function to update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartItems.length;
    });
}

// Function to show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Listen for storage events to update cart count when it changes
window.addEventListener('storage', (e) => {
    if (e.key === 'cartItems') {
        cartItems = JSON.parse(e.newValue) || [];
        updateCartCount();
    }
});