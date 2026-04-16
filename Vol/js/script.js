let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Add to Cart */
function addToCart(btn) {
    let product = btn.parentElement;

    let name = product.getAttribute("data-name");
    let price = parseInt(product.getAttribute("data-price"));

    cart.push({name, price});
    saveCart();
    updateCart();
}

/* Update Cart */
function updateCart() {
    let items = document.getElementById("cart-items");
    let total = 0;
    items.innerHTML = "";

    cart.forEach((item, i) => {
        total += item.price;

        items.innerHTML += `
        <li>
            ${item.name} - ₹${item.price}
            <button onclick="removeItem(${i})">X</button>
        </li>`;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("cart-count").innerText = cart.length;
}

/* Remove Item */
function removeItem(i){
    cart.splice(i,1);
    saveCart();
    updateCart();
}

/* Save Cart */
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* Search Fix (IMPORTANT) */
document.getElementById("search").addEventListener("keyup", function(){
    let value = this.value.toLowerCase();
    let products = document.querySelectorAll(".product");

    products.forEach(p => {
        let name = p.getAttribute("data-name").toLowerCase();

        if(name.includes(value)){
            p.style.display = "";   // FIX: grid maintain
        } else {
            p.style.display = "none";
        }
    });
});

/* Init */
updateCart();