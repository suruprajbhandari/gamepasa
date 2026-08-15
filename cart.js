// Get cart elements
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total');

// Load cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Display cart items when page loads
displayCartItems();

// Function to display cart items
function displayCartItems() {
    // Clear cart container
    cartItemsContainer.innerHTML = '';
    
    // If cart is empty, show message
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    // Calculate total
    let total = 0;

    // Add each item to cart
    cartItems.forEach((item, index) => {
        total += item.price;
        
        // Create cart item element
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Rs ${item.price.toLocaleString('en-IN')}</p>
            </div>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });

    // Update total
    cartTotal.textContent = total.toLocaleString('en-IN');
}

// Handle remove button clicks
cartItemsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-btn')) {
        // Get index of item to remove
        const index = e.target.dataset.index;
        
        // Remove item from cart
        cartItems.splice(index, 1);
        
        // Save updated cart
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Update display
        displayCartItems();
    }
});

// Handle checkout button
document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Proceeding to checkout...');
});