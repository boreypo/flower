// Shopping cart functionality
let cart = [];

// DOM elements
const cartBtn = document.getElementById("cartBtn");
const cartPage = document.getElementById("cartPage");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCartBtn");
const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const cartItemsContainer = document.getElementById("cartItems");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartDiscount = document.getElementById("cartDiscount");
const cartFinalTotal = document.getElementById("cartFinalTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Toggle cart visibility
function toggleCart() {
  cartPage.classList.toggle("active");
  cartOverlay.classList.toggle("active");
  updateCartDisplay();
}

// Add to cart
function addToCart(productElement) {
  const productId = productElement.getAttribute("data-id");
  const productName = productElement.getAttribute("data-name");
  const productPrice = parseInt(productElement.getAttribute("data-price"));
  const productImage = productElement.getAttribute("data-image");

  // Check if product already in cart
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  // Update cart count
  updateCartCount();

  // Show cart
  toggleCart();

  // Create flying flower effect
  const flower = document.createElement("div");
  flower.innerHTML = '<i class="fas fa-spa text-success"></i>';
  flower.style.position = "fixed";
  flower.style.fontSize = "20px";
  flower.style.zIndex = "9999";

  // Get button position
  const button = productElement.querySelector(".add-to-cart");
  const rect = button.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  flower.style.left = startX + "px";
  flower.style.top = startY + "px";
  document.body.appendChild(flower);

  // Animation to cart icon
  const cartIcon = document.querySelector(".fa-shopping-cart").parentElement;
  const cartRect = cartIcon.getBoundingClientRect();
  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;

  const animation = flower.animate(
    [
      { left: startX + "px", top: startY + "px", opacity: 1 },
      { left: endX + "px", top: endY + "px", opacity: 0 },
    ],
    {
      duration: 800,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    }
  );

  animation.onfinish = () => {
    flower.remove();
    cartCount.classList.add("animate-bounce");
    setTimeout(() => {
      cartCount.classList.remove("animate-bounce");
    }, 1000);
  };
}

// Update cart count display
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
  // Clear current items
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.appendChild(emptyCartMessage);
    cartTotal.textContent = "0 تومان";
    cartDiscount.textContent = "0 تومان";
    cartFinalTotal.textContent = "0 تومان";
    checkoutBtn.disabled = true;
    return;
  }

  emptyCartMessage.remove();
  checkoutBtn.disabled = false;

  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const cartItemElement = document.createElement("div");
    cartItemElement.className =
      "cart-item glass-card p-3 rounded-3 d-flex align-items-center mb-3";
    cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${
      item.name
    }" class="rounded-2 me-3" style="width: 64px; height: 64px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h4 class="fw-medium text-white mb-1">${item.name}</h4>
                        <p class="text-success small">${item.price.toLocaleString()} تومان</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="quantity-btn decrease-quantity border-0 bg-transparent" data-id="${
                          item.id
                        }">
                            <i class="fas fa-minus small"></i>
                        </button>
                        <span class="mx-3 text-white">${item.quantity}</span>
                        <button class="quantity-btn increase-quantity border-0 bg-transparent" data-id="${
                          item.id
                        }">
                            <i class="fas fa-plus small"></i>
                        </button>
                    </div>
                    <button class="remove-item text-danger bg-transparent border-0 ms-3" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Calculate totals
  const discount = subtotal * 0.1; // 10% discount for example
  const finalTotal = subtotal - discount;

  cartTotal.textContent = subtotal.toLocaleString() + " تومان";
  cartDiscount.textContent = discount.toLocaleString() + " تومان";
  cartFinalTotal.textContent = finalTotal.toLocaleString() + " تومان";

  // Add event listeners to quantity buttons
  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-id");
      const item = cart.find((item) => item.id === productId);
      if (item) {
        item.quantity += 1;
        updateCartDisplay();
        updateCartCount();
      }
    });
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-id");
      const item = cart.find((item) => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCartDisplay();
        updateCartCount();
      }
    });
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = e.currentTarget.getAttribute("data-id");
      cart = cart.filter((item) => item.id !== productId);
      updateCartDisplay();
      updateCartCount();
    });
  });
}

// Event listeners
cartBtn.addEventListener("click", toggleCart);
closeCartBtn.addEventListener("click", toggleCart);
continueShoppingBtn.addEventListener("click", toggleCart);
cartOverlay.addEventListener("click", toggleCart);

addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const productElement = e.currentTarget.closest(".col-12");
    addToCart(productElement);
  });
});

checkoutBtn.addEventListener("click", () => {
  alert(
    "پرداخت با موفقیت انجام شد! مبلغ " +
      cartFinalTotal.textContent +
      " از حساب شما کسر شد."
  );
  cart = [];
  updateCartCount();
  updateCartDisplay();
  toggleCart();
});
