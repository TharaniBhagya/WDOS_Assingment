document.addEventListener('DOMContentLoaded', function() {
    
    const quantityInputs = document.querySelectorAll('.quantity');
    const cartTableBody = document.querySelector('#cartTable tbody');
    const finalTotalPriceElement = document.getElementById('finalTotalPrice');
    const saveFavoritesButton = document.getElementById('fav');
    const applyFavoritesButton = document.getElementById('addFav');
    const payNowButton = document.getElementById("msg");
    const checkoutForm = document.getElementById('checkoutForm');
    
    // update cart display and local storage
    //  store the cart in the local storage to retrieve and display in the order page
    function updateCart() {
        let cartData = []; 
        let finalTotalPrice = 0;

        if (cartTableBody) {
            cartTableBody.innerHTML = ''; 
        }

        quantityInputs.forEach(function(input) {
            const quantity = parseFloat(input.value);
            if (quantity > 0) {
                const box = input.closest('.box');
                const itemName = box.querySelector('.name').textContent.trim();
                const itemPrice = parseFloat(box.querySelector('.price').textContent.replace('Rs.', ''));
                const itemTotal = itemPrice * quantity;

                
                cartData.push({
                    name: itemName,
                    price: itemPrice,
                    quantity: quantity,
                    total: itemTotal
                });

                
                finalTotalPrice += itemTotal;

             
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

      
        if (finalTotalPriceElement) {
            finalTotalPriceElement.textContent = `Rs.${finalTotalPrice.toFixed(2)}`;
        }

        
        localStorage.setItem('cartData', JSON.stringify(cartData));
        localStorage.setItem('finalTotalPrice', finalTotalPrice.toFixed(2));
    }

    // load cart - retrieve data from local storage
    function loadCart() {
        const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
        const finalTotalPrice = localStorage.getItem('finalTotalPrice') || '0.00';

        if (cartTableBody) {
            cartTableBody.innerHTML = '';
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

        
        if (finalTotalPriceElement) {
            finalTotalPriceElement.textContent = `Rs.${finalTotalPrice}`;
        }
    }

    //save cart to favorites
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

    // apply favorites to the cart
    function applyFavorites() {
        const favoriteData = JSON.parse(localStorage.getItem('favoriteCartData'));

        if (favoriteData && favoriteData.cartData.length > 0) {
            localStorage.setItem('cartData', JSON.stringify(favoriteData.cartData));
            localStorage.setItem('finalTotalPrice', favoriteData.finalTotalPrice);
 
  quantityInputs.forEach(function(input) {
    const box = input.closest('.box');
    const itemName = box.querySelector('.name').textContent.trim();

   
    const favoriteItem = favoriteData.cartData.find(item => item.name === itemName);
        if (favoriteItem) {
            input.value = favoriteItem.quantity;
        } 
        else {
            input.value = 0;
        }
    });

    
    loadCart();
    } 
    else {
    alert('No favorite items saved.');
    }
    }


   // pay now 
   function handlePayment(event) {
    event.preventDefault();

    if (checkoutForm.checkValidity()) {
        alert('Your payment has been successfully processed.');
    } else {
        checkoutForm.reportValidity();
    }
}

// Add event listeners 

//quantity input
quantityInputs.forEach(function(input) {
    input.addEventListener('change', updateCart);
});

//fav button
if (saveFavoritesButton) {
    saveFavoritesButton.addEventListener('click', saveCartToFavorites);
}

// apply fav
if (applyFavoritesButton) {
    applyFavoritesButton.addEventListener('click', applyFavorites);
}

// pay now
if (payNowButton) {
    payNowButton.addEventListener('click', handlePayment);
}

// Load cart data on page load
loadCart();
});
