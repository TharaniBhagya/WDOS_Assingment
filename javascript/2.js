document.addEventListener('DOMContentLoaded', function() {
    
    const quantityInputs = document.querySelectorAll('.quantity');
    const cartTableBody = document.querySelector('#cartTable tbody');
    const finalTotalPriceElement = document.getElementById('finalTotalPrice');
    const saveFavoritesButton = document.getElementById('fav');
    const applyFavoritesButton = document.getElementById('addFav');
    const msgButton = document.getElementById("msg");

    // Function to update cart display and local storage
    function updateCart() {
        let cartData = []; // Array to hold cart data
        let finalTotalPrice = 0;

        if (cartTableBody) {
            cartTableBody.innerHTML = ''; // Clear the cart table
        }

        quantityInputs.forEach(function(input) {
            const quantity = parseFloat(input.value);
            if (quantity > 0) {
                const box = input.closest('.box');
                const itemName = box.querySelector('.name').textContent.trim();
                const itemPrice = parseFloat(box.querySelector('.price').textContent.replace('Rs.', ''));
                const itemTotal = itemPrice * quantity;

                // Add item data to cartData array
                cartData.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity,
                    total: itemTotal
                });

                // Update final total price
                finalTotalPrice += itemTotal;

                // Add row to cart table if it exists
                if (cartTableBody) {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${itemName}</td>
                        <td>Rs.${itemPrice.toFixed(2)}</td>
                        <td>${quantity}</td>
                        <td>Rs.${itemTotal.toFixed(2)}</td>
                    `;
                    cartTableBody.appendChild(newRow);
                }
            }
        });

        // Update final total price element
        if (finalTotalPriceElement) {
            finalTotalPriceElement.textContent = `Rs.${finalTotalPrice.toFixed(2)}`;
        }

        // Save data to local storage
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('finalTotalPrice', finalTotalPrice.toFixed(2));
    }

    // Function to load cart data from local storage
    function loadCart() {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
        const finalTotalPrice = localStorage.getItem('finalTotalPrice') || '0.00';

        if (cartTableBody) {
            cartTableBody.innerHTML = ''; // Clear existing rows
        }

        cartData.forEach(function(item) {
            if (cartTableBody) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>Rs.${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>Rs.${item.total.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(newRow);
            }
        });

        // Set final total price
        if (finalTotalPriceElement) {
            finalTotalPriceElement.textContent = `Rs.${finalTotalPrice}`;
        }
    }

    // Function to save cart to favorites
    function saveCartToFavorites() {
        const cartData = JSON.parse(localStorage.getItem('cartData'));
        const finalTotalPrice = localStorage.getItem('finalTotalPrice');

        if (cartData && cartData.length > 0) {
            const favoriteData = {
                cartData: cartData,
                finalTotalPrice: finalTotalPrice
            };

            localStorage.setItem('favoriteCartData', JSON.stringify(favoriteData));
            alert('Cart has been saved to favorites.');
        } else {
            alert('No items in the cart to save.');
        }
    }

    // Function to apply favorites to the cart
    function applyFavorites() {
        const favoriteData = JSON.parse(localStorage.getItem('favoriteCartData'));

        if (favoriteData && favoriteData.cartData.length > 0) {
            localStorage.setItem('cartData', JSON.stringify(favoriteData.cartData));
            localStorage.setItem('finalTotalPrice', favoriteData.finalTotalPrice);
  // Update the quantities of the input fields
  quantityInputs.forEach(function(input) {
    const box = input.closest('.box');
    const itemName = box.querySelector('.name').textContent.trim();

    // Find the matching item in the favorite data
    const favoriteItem = favoriteData.cartData.find(item => item.name === itemName);
        if (favoriteItem) {
            input.value = favoriteItem.quantity;
        } 
        else {
            input.value = 0; // Set quantity to 0 if item is not in favorites
        }
    });

    // Load favorites into the cart display
    loadCart();
    } 
    else {
    alert('No favorite items saved.');
    }
    }


    // Function to show delivery message
    function showDeliveryMessage() {
        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + 2);
        alert(`Your order has been successfully placed. You will receive your order on ${deliveryDate.toDateString()}.`);
        localStorage.removeItem('cartData'); // Clear cart after order placement
        localStorage.removeItem('finalTotalPrice'); // Clear final total price
        loadCart(); // Clear the cart table
    }

    // Event  listeners
    if (quantityInputs.length > 0) {
        quantityInputs.forEach(function(input) {
            input.addEventListener('change', updateCart);
        });
    }

    if (saveFavoritesButton) {
        saveFavoritesButton.addEventListener('click', saveCartToFavorites);
    }

    if (applyFavoritesButton) {
        applyFavoritesButton.addEventListener('click', applyFavorites);
    }

    if (msgButton) {
        msgButton.addEventListener('click', showDeliveryMessage);
    }

    // Load cart on page load
    loadCart();
});
