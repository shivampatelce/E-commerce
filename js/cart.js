/** 
Name: Shivam Patel
Student Number: 8994760 
*/

const url = "../util/data.json";
let PRODUCT_DATA = [];
let cartItemsDetails = [];
let isAdditionalDiscountApplied = false;

// fetch data from json file
const fetchData = async () => {
  try {
    // Make a GET request to the JSON file
    const response = await fetch(url);

    // Check if the response status is 200
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Display wishlist
const displayWishlist = () => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistDetails = [];

  PRODUCT_DATA.forEach((category) => {
    category.products.forEach((product) => {
      if (wishlist.includes(product.title)) {
        wishlistDetails.push(product);
      }
    });
  });

  // Set wishlist html
  $("#wishlist-container").html("");
  if (wishlistDetails.length) {
    wishlistDetails.forEach(
      ({ img, title, description, isInStock, price, rating }) => {
        const card = $(`<div class="card">
                <div class="image">
                  <img
                    src="${img}"
                    height="240px"
                    width="300px"
                    alt="${title}"
                  />
                </div>
                <div class="details">
                  <div class="title">
                    ${title}
                  </div>
                  <div id="star-rating"></div>
                  <div class="price">$${price}</div>
                </div>
              </div>
        `);

        // Display rating view
        for (let i = 0; i < 5; i++) {
          if (i < rating) {
            card
              .find("#star-rating")
              .append('<span class="star filled">&#9733;</span>');
          } else {
            card
              .find("#star-rating")
              .append('<span class="star">&#9733;</span>');
          }
        }

        $("#wishlist-container").append(card);
      }
    );
    $("#empty-wishlist-msg").addClass("hide");
  } else {
    $("#empty-wishlist-msg").removeClass("hide");
  }
};

// Set cart list card
const displayCart = () => {
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemTitles = cartItems.map(({ title }) => title);
  cartItemsDetails = [];

  PRODUCT_DATA.forEach((category) => {
    category.products.forEach((product) => {
      if (cartItemTitles.includes(product.title)) {
        const itemCount = cartItems.find(
          (item) => item.title === product.title
        ).quantity;
        cartItemsDetails.push({ ...product, itemCount });
      }
    });
  });

  $("#shopping-list-container").html("");
  if (cartItemsDetails.length) {
    cartItemsDetails.forEach(
      ({ img, title, price, rating, itemCount, isInStock }) => {
        const card = $(`<div class="card">
              <div class="image">
                <img
                  src="${img}"
                  height="240px"
                  width="300px"
                  alt="${title}"
                />
              </div>
              <div class="details">
                <div class="title">
                  ${title}
                </div>
                <div class="item-counter">
                  ${
                    itemCount > 1
                      ? `<button class="decrement-btn">-</button>`
                      : `<button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>`
                  }
                  <input type="text" class="item-count" value="${itemCount}" readonly>
                  <button class="increment-btn">+</button>
                </div>
                <div id="star-rating"></div>
                <div class="price">$${price}</div>
                ${
                  isInStock
                    ? `<span id="inStock">In stock</span>`
                    : `<span id="outOfStock">Out of stock</span>`
                }
              </div>
            </div>
      `);

        // Display rating view
        for (let i = 0; i < 5; i++) {
          if (i < rating) {
            card
              .find("#star-rating")
              .append('<span class="star filled">&#9733;</span>');
          } else {
            card
              .find("#star-rating")
              .append('<span class="star">&#9733;</span>');
          }
        }

        // Add click event listener for cart item increment button
        card.find(".increment-btn").on("click", () => {
          const currentValue = parseInt(card.find(".item-count").val());
          card.find(".item-count").val(currentValue + 1);
          cartItems = cartItems.map((item) =>
            item.title === title
              ? { ...item, quantity: currentValue + 1 }
              : item
          );
          localStorage.setItem("cart", JSON.stringify(cartItems));
          cartItemsDetails = cartItemsDetails.map((item) =>
            item.title === title
              ? { ...item, itemCount: currentValue + 1 }
              : item
          );
          displayCart();
          calculateOrderSummary();
        });

        // Add click event listener for cart item decrement button
        card.find(".decrement-btn").on("click", () => {
          const currentValue = parseInt(card.find(".item-count").val());

          if (currentValue > 1) {
            card.find(".item-count").val(currentValue - 1);
            cartItems = cartItems.map((item) =>
              item.title === title
                ? { ...item, quantity: currentValue - 1 }
                : item
            );
            localStorage.setItem("cart", JSON.stringify(cartItems));
            cartItemsDetails = cartItemsDetails.map((item) =>
              item.title === title
                ? { ...item, itemCount: currentValue - 1 }
                : item
            );
            displayCart();
            draggableWishlistItem();
            draggableCartItem();
            calculateOrderSummary();
            setCartBadgeCount();
          }
        });

        // Add click event listener for delete item
        card.find(".delete-btn").on("click", () => {
          cartItems = cartItems.filter((item) => item.title !== title);
          localStorage.setItem("cart", JSON.stringify(cartItems));
          cartItemsDetails = cartItemsDetails.filter(
            (item) => item.title !== title
          );
          displayCart();
          draggableWishlistItem();
          draggableCartItem();
          calculateOrderSummary();
          setCartBadgeCount();
        });

        $("#shopping-list-container").append(card);
      }
    );

    $("#empty-cart-msg").addClass("hide");
    $(".order-summary").removeClass("hide");

    if (JSON.parse(localStorage.getItem("hasCoupon")) || false) {
      $(".discount-container").removeClass("hide");
      $(".play-quiz-button-container").addClass("hide");
    } else {
      $(".play-quiz-button-container").removeClass("hide");
    }
  } else {
    $("#empty-cart-msg").removeClass("hide");
    $(".order-summary").addClass("hide");
    $(".discount-container").addClass("hide");
    $(".play-quiz-button-container").addClass("hide");
  }
};

// Handle moving item from wish list to shopping list
const moveItemFromWishlistToShoppingList = ($item) => {
  let title = "";
  $item.each((item, itemDom) => {
    title = $(itemDom).find(".title").text().trim();
  });

  // Set wishlist item on wishlist item move to cart
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const itemIndex = wishlist.indexOf(title);
  if (itemIndex > -1) {
    wishlist.splice(itemIndex, 1);
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // Set cart list item on wishlist item move to cart
  let cartList = JSON.parse(localStorage.getItem("cart")) || [];
  let quantity = parseInt(
    cartList.find((item) => item.title === title) &&
      cartList.find((item) => item.title === title).quantity
  );
  if (!!quantity) {
    cartList = cartList.map((item) => {
      return item.title === title ? { ...item, quantity: quantity + 1 } : item;
    });
  } else {
    const cartItem = { title, quantity: 1 };
    cartList.push(cartItem);
  }
  localStorage.setItem("cart", JSON.stringify(cartList));

  displayCart();
  displayWishlist();
  draggableWishlistItem();
  draggableCartItem();
  calculateOrderSummary();
  setCartBadgeCount();
};

// Handle moving item from cart to wishlist
const moveItemCartToWishlist = ($item) => {
  let title = "";
  $item.each((item, itemDom) => {
    title = $(itemDom).find(".title").text().trim();
  });

  // Set cart list item on cart item move to wishlist
  let cartList = JSON.parse(localStorage.getItem("cart")) || [];
  cartList = cartList.filter((cartItem) => cartItem.title !== title);
  localStorage.setItem("cart", JSON.stringify(cartList));

  // Set wishlist item on cart item move to wishlist
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.push(title);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  displayCart();
  displayWishlist();
  draggableWishlistItem();
  draggableCartItem();
  calculateOrderSummary();
  setCartBadgeCount();
};

// Allow wishlist item to be a draggable
const draggableWishlistItem = () => {
  const $addToShoppingList = $("#add-to-shopping-list");
  const $wishlistContainer = $("#wishlist-container");

  // Let the wishlist item be draggable
  $(".card", $wishlistContainer).draggable({
    revert: "invalid",
    containment: "document",
    helper: "clone",
    cursor: "move",
  });

  // Let the shopping list be droppable, accepting the wishlist items
  $addToShoppingList.droppable({
    accept: "#wishlist-container > .card",
    classes: {
      "ui-droppable-active": "ui-state-highlight",
    },
    drop: function (event, ui) {
      moveItemFromWishlistToShoppingList(ui.draggable);
    },
  });
};

// Allow cart item to be a draggable
const draggableCartItem = () => {
  const $addToCart = $("#add-to-cart");
  const $shoppingListContainer = $("#shopping-list-container");

  //   Let the cart item be draggable
  $(".card", $shoppingListContainer).draggable({
    revert: "invalid",
    containment: "document",
    helper: "clone",
    cursor: "move",
  });

  // Let the cart list be droppable, accepting the cart items
  $addToCart.droppable({
    accept: "#shopping-list-container > .card",
    classes: {
      "ui-droppable-active": "ui-state-highlight",
    },
    drop: function (event, ui) {
      moveItemCartToWishlist(ui.draggable);
    },
  });
};

// Calculate and display order summary
const calculateOrderSummary = () => {
  let productSubTotal = 0;
  let totalDiscount = 0;
  let total = 0;
  let taxAmount = 0;
  let totalItems = 0;
  let outOfStockItems = 0;
  let additionalDiscount = 0;
  const deliveryCharges = 50;

  cartItemsDetails.forEach((item) => {
    for (let i = 0; i < item.itemCount; i++) {
      if (item.isInStock) {
        productSubTotal += item.price;
        totalDiscount += item.discount;
        totalItems += 1;
      } else {
        outOfStockItems += 1;
      }
    }
  });

  if (outOfStockItems) {
    $("#out-of-stock-warning").text(
      `${outOfStockItems} item(s) from your cart is out of stock.`
    );
  } else {
    $("#out-of-stock-warning").text("");
  }

  total = productSubTotal - totalDiscount;

  if (productSubTotal < 100) {
    total = total + deliveryCharges;
  }

  taxAmount = calculateTax(total, 15).toFixed(2);

  total = total + parseFloat(taxAmount);

  if (isAdditionalDiscountApplied) {
    $("#additional-discount-summary-field").removeClass("hide");
    additionalDiscount = discountAmount(total).toFixed(2);
    $("#additional-discount").text(`-${additionalDiscount}`);
    total = total - additionalDiscount;
  }

  // Display values of order summary
  $("#product-subtotal").text(`$${productSubTotal}`);
  $("#total-discount").text(`-$${totalDiscount}`);
  $("#shipping-charge").text(
    `${productSubTotal >= 100 ? "Free" : `$${deliveryCharges}`}`
  );
  $("#total-items").text(totalItems);
  $("#tax-amount").text(`$${taxAmount}`);
  $("#total").text(`$${total}`);
};

// Calculate discount amount for order summary
const discountAmount = (price) => {
  const discountAmount = price * 0.05;
  return discountAmount;
};

// Calculate tax amount for order summary
const calculateTax = (price, taxRate) => {
  const taxAmount = price * (taxRate / 100);
  return taxAmount;
};

const setCartBadgeCount = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart") || []);
  $(".cart-badge").text(cartItems.length);
};

$(async () => {
  await fetchData().then((res) => {
    PRODUCT_DATA = res;
  });

  displayCart();
  displayWishlist();
  draggableWishlistItem();
  draggableCartItem();
  calculateOrderSummary();
  setCartBadgeCount();

  // Handle click on discount apply button
  $(".apply-button").on("click", () => {
    isAdditionalDiscountApplied = true;
    $(".discount-container").html("");
    $(".discount-container").html(`
      <div>The coupon has been successfully applied!</div>
      `);
    calculateOrderSummary();
  });

  // Redirect to quiz page on click Play quiz button
  $(".play-quiz-button-container").on("click", () => {
    window.location.href = "../pages/quiz.html";
  });

  // Search button click
  $("#searchBtn").on("click", () => {
    const searchedData = $("#searchBar").val().trim();
    if (searchedData) {
      window.location.href = `product-list.html?categoryName=${searchedData}&isSearchedCategory=${true}`;
    }
  });
});
