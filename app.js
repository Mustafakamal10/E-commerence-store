// Shopping Cart Array
let cart = [];

// Products Data
const products = [
    { id: 1, name: "Huddi", price: 15.00, image: "images/huddi.png", sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "T-Shirts", price: 12.00, image: "images/t-shirt.png", sizes: ["S", "M", "L", "XL"] },
    { id: 3, name: "Sneakers", price: 20.00, image: "images/Sneakers.png", sizes: ["7", "8", "9", "10", "11"] },
    { id: 4, name: "Leaf Buds", price: 49.00, image: "images/leaf-buds.png", sizes: ["One Size"] },
    { id: 5, name: "Shoes", price: 20.00, image: "images/shoes.png", sizes: ["7", "8", "9", "10", "11"] },
    { id: 6, name: "Tracksuits", price: 30.00, image: "images/tracksuits.png", sizes: ["S", "M", "L", "XL"] },
    { id: 7, name: "Juicer Blenders", price: 50.00, image: "images/Juicer-Blenders-2IN1.png", sizes: ["One Size"] },
    { id: 8, name: "Pressure Cooker", price: 35.00, image: "images/Pressure-Cooker.png", sizes: ["One Size"] },
    { id: 9, name: "Hotpot", price: 29.00, image: "images/Hotpots.png", sizes: ["One Size"] },
    { id: 10, name: "Dinner Set", price: 99.00, image: "images/dinner-set.jpg", sizes: ["One Size"] },
    { id: 11, name: "Smart Watch", price: 39.00, image: "images/smart-watch.png", sizes: ["One Size"] },
    { id: 12, name: "Men's Blue Jeans", price: 45.00, image: "images/menBlue-Jean.png", sizes: ["28", "30", "32", "34", "36"] }
];

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const links = document.querySelector('.links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            links.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                links.classList.remove('active');
            });
        });
    }

    // Add event listeners to all "Buy Now" and "Add to Cart" buttons
    setupProductButtons();
    
    // Setup cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCartModal);
    }

    // Update cart count on load
    updateCartCount();
}

function setupProductButtons() {
    // Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.card-content .btn:nth-of-type(1)');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = index + 1;
            openProductModal(productId, 'cart');
        });
    });

    // Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.card-content .btn:nth-of-type(2)');
    buyNowButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = index + 1;
            openProductModal(productId, 'buy');
        });
    });
}

function openProductModal(productId, action) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create modal HTML
    const modalHTML = `
        <div class="modal active" id="productModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${product.image}" alt="${product.name}" class="modal-product-img">
                <h2>${product.name}</h2>
                <div class="price">$${product.price.toFixed(2)}</div>
                <p>Select your preferences below:</p>
                
                <div class="size-selector">
                    <h4>Select Size:</h4>
                    <div class="size-options">
                        ${product.sizes.map(size => `
                            <div class="size-option" data-size="${size}">${size}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="quantity-selector">
                    <h4>Quantity:</h4>
                    <div class="quantity-controls">
                        <button class="quantity-btn" id="decreaseQty">-</button>
                        <span class="quantity-display" id="quantityDisplay">1</span>
                        <button class="quantity-btn" id="increaseQty">+</button>
                    </div>
                </div>

                <div class="modal-actions">
                    ${action === 'buy' 
                        ? '<button class="btn" id="confirmBuy">Proceed to Checkout</button>' 
                        : '<button class="btn" id="confirmAddToCart">Add to Cart</button>'}
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('productModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get modal elements
    const modal = document.getElementById('productModal');
    const closeBtn = modal.querySelector('.close-modal');
    const sizeOptions = modal.querySelectorAll('.size-option');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityDisplay = document.getElementById('quantityDisplay');

    let selectedSize = product.sizes[0]; // Default to first size
    let quantity = 1;

    // Select first size by default
    sizeOptions[0].classList.add('selected');

    // Size selection
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedSize = this.dataset.size;
        });
    });

    // Quantity controls
    decreaseBtn.addEventListener('click', function() {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });

    increaseBtn.addEventListener('click', function() {
        if (quantity < 10) {
            quantity++;
            quantityDisplay.textContent = quantity;
        }
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Confirm action
    if (action === 'buy') {
        const confirmBtn = document.getElementById('confirmBuy');
        confirmBtn.addEventListener('click', function() {
            proceedToCheckout(product, selectedSize, quantity);
        });
    } else {
        const confirmBtn = document.getElementById('confirmAddToCart');
        confirmBtn.addEventListener('click', function() {
            addToCart(product, selectedSize, quantity);
            modal.remove();
        });
    }
}

function addToCart(product, size, quantity) {
    // Check if product with same size already exists in cart
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }

    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function openCartModal() {
    const cartHTML = `
        <div class="modal active" id="cartModal">
            <div class="modal-content cart-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Shopping Cart</h2>
                ${cart.length > 0 ? `
                    <div class="cart-items">
                        ${cart.map((item, index) => `
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                                <div class="cart-item-details">
                                    <h4>${item.name}</h4>
                                    <p>Size: ${item.size}</p>
                                    <p>Quantity: ${item.quantity}</p>
                                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <span class="remove-item" data-index="${index}">
                                    <i class="fa-solid fa-trash"></i>
                                </span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-total">
                        <h3>Total: <span>$${calculateTotal().toFixed(2)}</span></h3>
                    </div>
                    <div class="modal-actions">
                        <button class="btn" id="checkoutAllBtn">Checkout All Items</button>
                    </div>
                ` : `
                    <div class="empty-cart">
                        <i class="fa-solid fa-cart-shopping" style="font-size: 60px; color: rgb(200, 200, 200);"></i>
                        <p style="margin-top: 20px;">Your cart is empty</p>
                    </div>
                `}
            </div>
        </div>
    `;

    const existingModal = document.getElementById('cartModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', cartHTML);

    const modal = document.getElementById('cartModal');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Remove item functionality
    const removeButtons = modal.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCartCount();
            modal.remove();
            openCartModal();
        });
    });

    // Checkout all items
    const checkoutBtn = document.getElementById('checkoutAllBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            modal.remove();
            showCheckoutModal();
        });
    }
}

function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function proceedToCheckout(product, size, quantity) {
    // Close product modal
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.remove();
    }

    // Create temporary cart for this purchase
    const tempCart = [{
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: size,
        quantity: quantity
    }];

    showCheckoutModal(tempCart);
}

function showCheckoutModal(itemsToCheckout = null) {
    const items = itemsToCheckout || cart;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const checkoutHTML = `
        <div class="modal active" id="checkoutModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Checkout</h2>
                
                <div class="cart-items" style="margin-bottom: 20px;">
                    ${items.map(item => `
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                            <div class="cart-item-details">
                                <h4>${item.name}</h4>
                                <p>Size: ${item.size} | Qty: ${item.quantity}</p>
                                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="cart-total">
                    <h3>Total Amount: <span>$${total.toFixed(2)}</span></h3>
                </div>

                <div class="form-group" style="margin-top: 20px;">
                    <input type="text" id="customerName" placeholder="Full Name" required>
                </div>
                <div class="form-group">
                    <input type="email" id="customerEmail" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <input type="tel" id="customerPhone" placeholder="Phone Number" required>
                </div>
                <div class="form-group">
                    <textarea id="customerAddress" rows="3" placeholder="Shipping Address" required></textarea>
                </div>

                <div class="modal-actions">
                    <button class="btn" id="completeOrderBtn">Complete Order</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('checkoutModal');
    if (existingModal) {
        existingModal.remove();
    }

    document.body.insertAdjacentHTML('beforeend', checkoutHTML);

    const modal = document.getElementById('checkoutModal');
    const closeBtn = modal.querySelector('.close-modal');
    const completeBtn = document.getElementById('completeOrderBtn');

    closeBtn.addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    completeBtn.addEventListener('click', function() {
        const name = document.getElementById('customerName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;

        if (!name || !email || !phone || !address) {
            alert('Please fill in all fields');
            return;
        }

        // If checking out from cart, clear the cart
        if (!itemsToCheckout) {
            cart = [];
            updateCartCount();
        }

        modal.remove();
        showSuccessModal(total);
    });
}

function showSuccessModal(total) {
    const successHTML = `
        <div class="modal active" id="successModal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <h2>Order Successful!</h2>
                    <p>Thank you for your purchase of <strong>$${total.toFixed(2)}</strong></p>
                    <p>Your order has been confirmed and will be delivered soon.</p>
                    <p>A confirmation email has been sent to your email address.</p>
                    <div class="modal-actions">
                        <button class="btn" id="continueShoppingBtn">Continue Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', successHTML);

    const modal = document.getElementById('successModal');
    const closeBtn = modal.querySelector('.close-modal');
    const continueBtn = document.getElementById('continueShoppingBtn');

    closeBtn.addEventListener('click', function() {
        modal.remove();
    });

    continueBtn.addEventListener('click', function() {
        modal.remove();
    });

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background-color: rgb(0, 200, 0);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);