document.addEventListener('DOMContentLoaded', function() {
    const quantityInputs = document.querySelectorAll('.quantity');
    const cartTableBody = document.querySelector('#cartTable tbody');
    const finalTotalPriceElement = document.getElementById('finalTotalPrice');
    const saveFavoritesButton = document.getElementById('fav');
    const addFavButton = document.getElementById('addFav');
    const buyNowButton = document.getElementById('buybtn');

    // Function to update the cart and save to localStorage
    function updateCart() {
        cartTableBody.innerHTML = '';
        let finalTotalPrice = 0;
        let cartData = [];

        quantityInputs.forEach(function(input) {
            const quantity = parseFloat(input.value);
            if (quantity > 0) {
                const box = input.closest('.box');
                const itemName = box.querySelector('.name').textContent;
                const itemPrice = parseFloat(box.querySelector('.price').textContent.replace('Rs.', ''));
                const itemTotal = itemPrice * quantity;

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${itemName}</td>
                    <td>Rs.${itemPrice.toFixed(2)}</td>
                    <td>${quantity}</td>
                    <td>Rs.${itemTotal.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(newRow);

                finalTotalPrice += itemTotal;

                cartData.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity,
                    total: itemTotal
                });
            }
        });

        finalTotalPriceElement.textContent = `Rs.${finalTotalPrice.toFixed(2)}`;
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('finalTotalPrice', finalTotalPrice.toFixed(2));
    }

    // Function to load the cart from localStorage
    function loadCart() {
        const cartData = JSON.parse(localStorage.getItem('cartData'));
        const finalTotalPrice = localStorage.getItem('finalTotalPrice');

        if (cartData && cartData.length > 0) {
            cartData.forEach(function(item) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>Rs.${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>Rs.${item.total.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(newRow);
            });

            finalTotalPriceElement.textContent = `Rs.${finalTotalPrice}`;
        }
    }

    // Function to save the current cart as favorites
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

    // Function to load the favorite cart from localStorage
    function loadFavorites() {
        const favoriteData = JSON.parse(localStorage.getItem('favoriteCartData'));

        if (favoriteData) {
            cartTableBody.innerHTML = '';
            favoriteData.cartData.forEach(function(item) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${item.name}</td>
                    <td>Rs.${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>Rs.${item.total.toFixed(2)}</td>
                `;
                cartTableBody.appendChild(newRow);
            });

            finalTotalPriceElement.textContent = `Rs.${favoriteData.finalTotalPrice}`;
        } else {
            alert('No favorites to load.');
        }
    }

    // Event listeners for updating the cart
    quantityInputs.forEach(function(input) {
        input.addEventListener('change', updateCart);
    });

    // Event listeners for favorite functionality
    if (saveFavoritesButton) {
        saveFavoritesButton.addEventListener("click", saveCartToFavorites);
    }

    if (addFavButton) {
        addFavButton.addEventListener("click", loadFavorites);
    }

    // Redirect to the order page
    if (buyNowButton) {
        buyNowButton.addEventListener('click', function() {
            window.location.href = 'order.html';
        });
    }

    // Load the cart if on the order page
    if (document.querySelector('#orderTable')) {
        loadCart();
    }

    // Confirm order message
    const msgButton = document.getElementById("msg");
    if (msgButton) {
        msgButton.addEventListener("click", function() {
            const currentDate = new Date();
            const deliveryDate = new Date(currentDate);
            deliveryDate.setDate(currentDate.getDate() + 2);
            alert(`Your order has been successfully placed. You will receive your order on ${deliveryDate.toDateString()}.`);
        });
    }
});
